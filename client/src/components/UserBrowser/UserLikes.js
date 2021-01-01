import React, { useState, useEffect } from 'react'
import likeService from '../../services/likeService'
import ListOfUsers from './ListOfUsers'

const UserLikes = ({ users, showUser }) => {

	const [resultsToShow, setResultsToShow] = useState([])

	useEffect(() => {
		likeService.getLikesToUser()
			.then(res => {
				setResultsToShow(users.filter(u => res.some(l => l.user_id === u.user_id)))
			})
			.catch(e => {
				console.log('Database error', e)
			})
	}, [users, setResultsToShow])

	return <>
	<div>Users that like you</div>
	<ListOfUsers users={resultsToShow} handleClick={showUser} />
	</>

}

export default UserLikes