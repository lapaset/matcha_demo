const config = require('./config')
const { Client } = require('pg')
const isProduction = process.env.NODE_ENV === 'production'
const connectionString = isProduction
	? process.env.DATABASE_URL
	: `postgresql://${config.PG_USER}:${config.PG_PW}@${config.PG_HOST}:${config.PG_PORT}/${config.PG_DB}`

module.exports = {
	query: (text, params, callback) => {

		const client = new Client({
			connectionString,
			ssl: isProduction 
				? { rejectUnauthorized: false }
				: false
		})

		client.connect()

		return client.query(text, params, (err, res) => {

			console.log('is this what crashes? text', text, 'callback', callback)
			if (res)
				console.log('postgres query', { text, rows: res.rowCount })
			callback(err, res)
			client.end()
		})
	},
}