import axios from 'axios'
const baseUrl = '/views'
const viewsListUrl = '/api/views/list'


const views = async userObject => {
	const resp = await axios.post(baseUrl, userObject)
	return resp.data
}

const viewsHistory = async userObject => {
	const resp = await axios.post(viewsListUrl, userObject)
	return resp.data
}

export default { views, viewsHistory }