import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply, faUser } from '@fortawesome/free-solid-svg-icons'
import Chat from './Chat'

const LatestMsgPreview = ({ messages, user_id }) => {
	let latestReceived = null
	let i = messages.length - 1

	for ( ; i >= 0; i-- ) {
		if (messages[i].receiver === user_id) {
			latestReceived = messages[i].msg
			break;
		}
	}

	const replyIcon = () => i === messages.length - 1
		? ''
		: <FontAwesomeIcon icon={faReply} color='grey' className='mr-1' />
	
	return messages.length > 0 && i !== -1
	? <span className='msg-preview d-inline-block text-truncate text-muted'>
		{replyIcon()} {latestReceived}
	</span>
	: ''
}

const Matches = ({ user, matches, chatToShow, setChatToShow, wsClient }) => {



	return matches && matches.length !== 0
		? <>
			<ListGroup className='text-left text-primary' variant='flush'>
				{matches.map(m =>
					<ListGroup.Item action key={m.username}
						className='d-flex justify-content-between'>
						<div className='w-75 cursor-pointer align-self-center' onClick={() => setChatToShow(m)}>
							{m.username}<br/>
							<LatestMsgPreview messages={m.messages} user_id={user.user_id} />
						</div>
						<Link to={`browse?user_id=${m.user_id}`} className='p-3 align-self-center chat-profile-link'>
							<FontAwesomeIcon icon={faUser} />	
						</Link> 
					</ListGroup.Item>)
				}
			</ListGroup>

			<Chat user={user} match={chatToShow} wsClient={wsClient}
				handleClose={() => setChatToShow(null)} />
		</>
		: <div>Get some matches to chat</div>

}

export default Matches