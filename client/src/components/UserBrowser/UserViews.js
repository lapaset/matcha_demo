import React, { useState, useEffect } from 'react'
import visitService from '../../services/visitService'
import ListOfUsers from './ListOfUsers'

const UserViews = ({ users, showUser }) => {

	const [resultsToShow, setResultsToShow] = useState([])

	useEffect(() => {

		visitService.visitHistory(true)
			.then(res => {
				setResultsToShow(users.filter(u => res.some(l => l.user_id === u.user_id)))
			})
			.catch(e => {
				console.log('Database error', e)
			})
	}, [users, setResultsToShow])

	return <>
		<div>Users that viewed you</div>
		<ListOfUsers users={resultsToShow} handleClick={showUser} />
	</>

}

export default UserViews