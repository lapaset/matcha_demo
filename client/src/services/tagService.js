import axios from 'axios'
const baseUrl = '/api/tags'

const getTags = async () => {
	const resp = await axios.get(baseUrl)
	return resp.data
}

const addTag = async tagObject => {
	const resp = await axios.post(baseUrl, tagObject)
	return resp.data
}

export default { getTags, addTag }