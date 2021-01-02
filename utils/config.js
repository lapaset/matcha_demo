/* eslint-disable no-undef */
require('dotenv').config()

const env = process.env

module.exports = {
	PORT: env.PORT,
	PG_USER: env.PG_USER,
	PG_HOST: env.PG_HOST,
	PG_DB: env.PG_DB,
	PG_PW: env.PG_PW,
	PG_PORT: env.PG_PORT,
	TOKEN_SECRET: env.TOKEN_SECRET,
	EMAIL: env.EMAIL,
	EMAIL_PW: env.EMAIL_PW
}