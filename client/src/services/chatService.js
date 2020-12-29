import axios from 'axios'
import auth from '../utils/auth'

const baseUrl = '/api/chat'

const getChatHistory = async () => {
	const resp = await axios.get(`${baseUrl}`, auth.config())
	return resp.data
}

export default { getChatHistory }