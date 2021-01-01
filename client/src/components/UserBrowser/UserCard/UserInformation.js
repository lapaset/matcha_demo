import React from 'react'
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap'
import TimeAgo from 'react-timeago'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'

const UserInformation = ({ user, isMatch }) => <>

	<Card.Body>
		<Card.Title>{user.username}</Card.Title>
		<Card.Text>{user.firstName} {user.lastName}, {user.age}</Card.Text>
		{isMatch(user.user_id) && <Card.Text><span className="p-1 border border-info rounded text-info">Match</span></Card.Text>}

		{
			user.bio
				.split('\n')
				.map(p =>
					<Card.Text key={p}>{p}</Card.Text>
				)}

	</Card.Body>

	<ListGroup className="list-group-flush">
		<ListGroupItem>{user.gender} looking for {user.orientation
			.map((o, i) => i === user.orientation.length - 1
				? o
				: i === user.orientation.length - 2
					? `${o} and `
					: `${o}, `
			)}
		</ListGroupItem>

		{user.tags && <ListGroupItem>
			{user.tags.split('#')
				.map((t, i) => i > 1
					? ` #${t}`
					: i === 1 ? `#${t}` : null
				)}
		</ListGroupItem>}

		<ListGroupItem>
			{
				user.online
					? <><FontAwesomeIcon icon={faCircle} color='green' size='xs' /> online</>
					: <>last online <TimeAgo date={user.last_online} live={false} /></>
			}

		</ListGroupItem>
	</ListGroup>
</>

export default UserInformation