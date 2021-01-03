import { useHistory } from 'react-router-dom'

const handleLogout = (wsClient, user_id) => {
	const history = useHistory()

	localStorage.clear()
	wsClient.current.send(JSON.stringify(({
		type: 'close',
		from: user_id
	})))
	history.push('/login')
}

export default { handleLogout }