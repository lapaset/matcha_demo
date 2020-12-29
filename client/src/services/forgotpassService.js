import axios from 'axios'
const baseUrl = '/api/reset'

const resetUrl = '/api/reset/new-password'

const forgotPass = async email => {
	const resp = await axios.post(baseUrl, email)
	return resp.data
}

const resetPass = async newpass => {
	const resp = await axios.post(resetUrl, newpass)
	return resp.data
}

export default { forgotPass, resetPass }