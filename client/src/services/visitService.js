import axios from 'axios'
import auth from '../utils/auth'
const baseUrl = '/api/visits'

const addVisit = async userObject => {
	const resp = await axios.post(baseUrl, userObject, auth.config())
	return resp.data
}

const visitHistory = async to => {
	const resp = await axios.get(`${baseUrl}?to=${to}`, auth.config())
	return resp.data
}

export default { addVisit, visitHistory }