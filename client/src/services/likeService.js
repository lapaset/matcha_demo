import axios from 'axios'
import auth from '../utils/auth'
const baseUrl = '/api/likes'

const getLikes = async () => {
	const resp = await axios.get(`${baseUrl}`, auth.config())
	return resp.data
}

const getLikesToUser = async () => {
	const resp = await axios.get(`${baseUrl}?to=true`, auth.config())
	return resp.data
}

const getLike = async to_user_id => {
	const resp = await axios.get(`${baseUrl}?to_user_id=${to_user_id}`, auth.config())
	return resp.data
}

const getMatches = async () => {
	const resp = await axios.get(`${baseUrl}?match=1`, auth.config())
	return resp.data
}

const toggleLike = async user_id => {
	const resp = await axios.post(baseUrl, { to_user_id: user_id }, auth.config())
	return resp.data
}

export default { getLikes, getLikesToUser, getLike, getMatches, toggleLike }