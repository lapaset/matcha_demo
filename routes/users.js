const usersRouter = require('express').Router()
const db = require('../utils/db')
const bcrypt = require('bcryptjs')
const email = require('../utils/email')
const jwt = require('jsonwebtoken')
const tokenSecret = require('../utils/config').TOKEN_SECRET

usersRouter.get('/', (req, resp) => {

	const user = jwt.verify(req.token, tokenSecret)

	if (!user)
		return resp.status(401).json({ error: 'token missing or invalid' })

	let query = 'SELECT username, user_id, AGE(birthdate) as age, tags,\
	gender, orientation, fame, longitude, latitude,\
	earth_distance(ll_to_earth($1, $2),\
	ll_to_earth(longitude, latitude)) as distance FROM users\
	WHERE NOT EXISTS (SELECT 1 FROM blocked\
	WHERE (from_user_id = $3 AND to_user_id = users.user_id) OR\
	(from_user_id = users.user_id AND to_user_id = $3))\
	AND user_id != $3'

	const parameters = [user.longitude, user.latitude, user.user_id]

	if (req.query.orientation) {
		parameters.push(`%${req.query.orientation}%`)
		query = query.concat(` AND CAST(orientation AS text) LIKE $${parameters.length}`)
	}

	if (req.query.gender) {

		query = query.concat(' AND (')

		req.query.gender
			.split('')
			.forEach((g, i) => {
				parameters.push(g === 'f'
					? 'female'
					: g === 'm'
						? 'male'
						: 'other')

				query = query.concat(` ${i === 0
					? ''
					: ' OR'} gender=$${parameters.length}`)

			})
		query = query.concat(') ORDER BY distance ASC')
	}

	db.query(query, parameters, (err, res) => {
		if (err)
			resp.status(500).send(err)

		else
			resp.status(200).send(res.rows)
	})
})

usersRouter.get('/:id', (req, resp) => {

	const user = jwt.verify(req.token, tokenSecret)

	if (!user)
		return resp.status(401).json({ error: 'token missing or invalid' })

	let query = 'SELECT user_id, first_name, last_name, username, gender,\
	orientation, bio, tags, AGE(birthdate) as age, longitude, latitude, fame,\
	online, last_online, id, profile_pic, photo_str'

	if (user.user_id === Number(req.params.id))
		query = query.concat(', email, verified, token, password')

	query = query.concat(' FROM users \
	LEFT OUTER JOIN photos USING (user_id) \
	WHERE users.user_id = $1')

	db.query(query, [req.params.id], (err, res) => {
		if (res && res.rows[0])
			resp.status(200).send(res.rows)
		else if (res)
			resp.status(404).send({ error: 'User not found' })
		else
			resp.status(500).send({ error: err.detail })
	})
})

usersRouter.post('/', async (req, resp) => {

	const { firstName, lastName, username, email, token, birthdate } = req.body

	const hashedPassword = await bcrypt.hash(req.body.password, 10)

	db.query('INSERT INTO users (first_name, last_name, username, email, password, token, birthdate) \
		VALUES ($1, $2, $3, $4, $5, $6, $7)',
		[firstName, lastName, username, email, hashedPassword, token, birthdate],
		(err, res) => {
			if (res) {
				email.sendEmail(email, 'Verify your matcha account', `Please click the following link to verify your email
				/verify?token=${token}`)
				resp.status(201).send(res.rows[0])
			}

			else if (err.detail && err.detail.startsWith('Key (email)'))
				resp.status(409).send({ error: 'email already exists' })

			else if (err.detail && err.detail.startsWith('Key (username)'))
				resp.status(409).send({ error: 'username already exists' })

			else
				resp.status(500).send(err)
		})

})

usersRouter.patch('/:id', async (req, resp) => {
	const user = jwt.verify(req.token, tokenSecret)

	if (!user || user.user_id !== Number(req.params.id))
		return resp.status(401).json({ error: 'token missing or invalid' })

	const { firstName, lastName, ...body } = req.body

	if (firstName)
		body.first_name = firstName

	if (lastName)
		body.last_name = lastName

	let query = 'UPDATE users SET '
	const parameters = []

	if (req.body.password) {
		body.password = await bcrypt.hash(req.body.password, 10)
	}

	Object.keys(body).forEach((k, i) => {
		query = query.concat(`${k} = $${i + 1}, `)
		parameters.push(body[k])
	})

	query = query.slice(0, -2).concat(` WHERE user_id = $${parameters.length + 1}
		RETURNING `)

	Object.keys(body).forEach(k => {
		query = query.concat(`${k}, `)
	})

	query = query.slice(0, -2)

	db.query(query, [...parameters, user.user_id], (err, res) => {

		if (res && res.rows[0])
			resp.status(200).send(res.rows[0])

		else if (res)
			resp.status(500).send({ error: 'User not found' })

		else if (err.detail && err.detail.startsWith('Key (email)'))
			resp.status(409).send({ error: 'email already exists' })

		else
			resp.status(500).send(err)
	})
})

usersRouter.delete('/:id', (req, resp) => {
	const user = jwt.verify(req.token, tokenSecret)

	if (!user || user.user_id !== Number(req.params.id))
		return resp.status(401).json({ error: 'token missing or invalid' })

	db.query('DELETE FROM users WHERE user_id = $1', [req.params.id], (err, res) => {
		if (res)
			resp.status(204).end()
		else
			resp.status(500).send(err)
	})
})

module.exports = usersRouter