const nodemailer = require('nodemailer')
const config = require('./config')

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: config.EMAIL,
		pass: config.EMAIL_PW
	}
})

const sendEmail = (to, subject, text) => {

	const mailOptions = {
		from: config.EMAIL,
		to,
		subject,
		text
	}

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error)
		} else {
			console.log('Email sent: ' + info.response)
		}
	})
}

module.exports = { sendEmail }
