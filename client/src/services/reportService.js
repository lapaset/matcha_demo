import axios from 'axios'
import auth from '../utils/auth'
const baseUrl = '/api/report'

const report = async user_id => {
	const resp = await axios.post(baseUrl, { to_user_id: user_id }, auth.config())
	return resp.data
}

export default { report }