import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAward } from '@fortawesome/free-solid-svg-icons'
import { ListGroup } from 'react-bootstrap'
import dbFunctions from '../../../utils/dbFunctions'

const Tags = ({ tags }) => 
	<div className='text-muted d-inline-block text-truncate w-100'>
		{
			dbFunctions.userTagsFromDb(tags).map(t => 
				<span key={t.value} className='tag'>{t.value}</span> 
			)
		}
	</div>

const ListOfUsers = ({ users, handleClick }) => {

	return (
		users && users.length > 0
			? <ListGroup className="text-left mt-3" variant="flush">
				{users.map(u =>
					<ListGroup.Item action
						className='d-flex justify-content-between p-3'
						key={u.user_id}
						style={{ cursor: 'pointer' }}
						onClick={() => handleClick(u)} >

						<div className='w-75'>
							{u.username}, {u.age.years}<br />
							<Tags tags={u.tags} />
						</div>
						<div className='text-right'>
							{parseInt(u.distance)} km<br />
							<FontAwesomeIcon icon={faAward} /> {u.fame}
						</div>
					</ListGroup.Item>
				)}
			</ListGroup>
			: <div className="text-info mt-3">
				Could not find any matching users<br />
				please try different filters
			</div>
	)
}
export default ListOfUsers