import React, { useState, useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import TimeAgo from 'react-timeago'
import visitService from '../../../services/visitService'

const VisitHistory = ({ user }) => {

	const [visitHistory, setVisitHistory] = useState([])

	useEffect(() => {

		visitService
			.visitHistory(false)
			.then(res => {
				setVisitHistory(res)
			})
			.catch(e => {
				console.log('Database error', e)
			})

	}, [user.username])


	return visitHistory && visitHistory.length > 0
		? <ListGroup className='text-left'>
			{visitHistory.map(u => <ListGroup.Item action key={u.username}>
				<Link to={`browse/?user_id=${u.to_user_id}`}>{u.username}</Link> <TimeAgo date={u.date} live={false} />
			</ListGroup.Item>
			)}
		</ListGroup>
		: <div className="text-info">Your visit history is empty</div>
}

export default VisitHistory