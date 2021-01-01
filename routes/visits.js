const router = require('express').Router()
const db = require('../utils/db')
const jwt = require('jsonwebtoken')
const tokenSecret = require('../utils/config').TOKEN_SECRET

router.get('/', (req, resp) => {
	const user = jwt.verify(req.token, tokenSecret)

	if (!user)
		return resp.status(401).json({ error: 'token missing or invalid' })

	let query = 'SELECT date, from_user_id, to_user_id, username\
	FROM visits, users '

	query = req.query.to === 'true'
		? query.concat('WHERE to_user_id = $1 AND from_user_id = user_id ORDER BY date DESC')
		: query.concat('WHERE from_user_id = $1 AND to_user_id = user_id ORDER BY date DESC')
	
	db.query(query, [user.user_id], (err, res) => {
		if (res)
			resp.status(200).send(res.rows)
		else
			resp.status(500).send(err)
	})

})

router.post('/', (req, resp) => {
	const user = jwt.verify(req.token, tokenSecret)

	if (!user)
		return resp.status(401).json({ error: 'token missing or invalid' })

	db.query('INSERT INTO visits (from_user_id, to_user_id) VALUES ($1, $2)',
	[user.user_id, req.body.to_user_id], (err, res) => {
		if (res)
			resp.status(204).end()
		else {
			if (err.code === "23505")
				db.query('UPDATE visits SET date = CURRENT_TIMESTAMP \
				WHERE from_user_id = $1 AND to_user_id = $2',
				[user.user_id, req.body.to_user_id], (err, res) => {
					if (res)
						resp.status(204).end()
					else
						resp.status(500).send(err)
				})
			else
				resp.status(500).send(err)
		}
	})
})

module.exports = router