import React, { useState, useEffect } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { Switch, Route, useRouteMatch, NavLink, useHistory } from 'react-router-dom'
import UserCard from './UserCard'
import UserSearch from './UserSearch'
import userService from '../../services/userService'
import likeService from '../../services/likeService'
import ListOfUsers from './ListOfUsers'

const UserLikes = ({ users, showUser }) => {

	const [resultsToShow, setResultsToShow] = useState([])

	useEffect(() => {
		likeService.getLikesToUser()
			.then(res => {
				setResultsToShow(users.filter(u => res.some(l => l.user_id === u.user_id)))
			})
	}, [users, setResultsToShow])

	return <>
	<h2>Users that like you</h2>
	<ListOfUsers users={resultsToShow} handleClick={showUser} />
	</>

}

const UserBrowser = ({ user, wsClient, showUserAtLoad, matches, setMatches }) => {
	const [users, setUsers] = useState([])
	const [userToShow, setUserToShow] = useState(showUserAtLoad)
	const { path, url } = useRouteMatch()
	const history = useHistory()

	useEffect(() => {
		setUserToShow(showUserAtLoad)
	}, [showUserAtLoad])

	useEffect(() => {

		userService
			.getByGenderOrientation(user.orientation, user.gender)
			.then(res => {

				const calculateDistance = (lat1, lon1, lat2, lon2) => {

					const R = 6371e3 // metres
					const φ1 = lat1 * Math.PI / 180 // φ, λ in radians
					const φ2 = lat2 * Math.PI / 180
					const Δφ = (lat2 - lat1) * Math.PI / 180
					const Δλ = (lon2 - lon1) * Math.PI / 180

					const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
						Math.cos(φ1) * Math.cos(φ2) *
						Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
					const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

					return R * c / 1000 //in kilometres
				}

				let usersFromDb = matches
					? res.filter(u => !matches.some(m => m.user_id === u.user_id))
					: res

				
				usersFromDb = usersFromDb.map(u => ({
					...u,
					distance: calculateDistance(user.latitude, user.longitude, u.latitude, u.longitude)
				}))

				setUsers(usersFromDb)
			})
			.catch(e => {
				console.log('Database error', e)
			})
	}, [user.gender, user.orientation, user.latitude, user.longitude, matches])


	const activeLinkStyle = {
		fontWeight: 'bold'
	}

	const isMatch = user_id => matches && matches.length > 0
		? matches.find(m => m.user_id === user_id) !== undefined
		: false

	const hideUser = () => {
		isMatch(userToShow) ? history.push('/matches') : history.push('/browse')
		setUserToShow(null)
	}

	const showUser = user => setUserToShow(user.user_id)

	const userCardProps = {
		user_id: userToShow, loggedUser: user, wsClient, hideUser,
		matches, setMatches, isMatch
	}

	const userSearchProps = {
		user, showUser, users
	}

	const userLikesProps = {
		showUser, users
	}

	console.log('users', users, 'matches', matches)
	return matches

		? userToShow

			? <UserCard {...userCardProps} />

			: <>
				<ButtonGroup className="mb-5">
					<Button variant="outline-light"><NavLink exact to={`${url}`} activeStyle={activeLinkStyle}>All</NavLink></Button>

					<Button variant="outline-light"><NavLink to={`${url}/likes`} activeStyle={activeLinkStyle}>Likes</NavLink></Button>

					<Button variant="outline-light"><NavLink to={`${url}/views`} activeStyle={activeLinkStyle}>Views</NavLink></Button>
				</ButtonGroup>
				<Switch>
					<Route exact path={path} render={() => userToShow
						? null
						: <UserSearch {...userSearchProps} />} />
					<Route path={`${path}/likes`}>
						<UserLikes {...userLikesProps} />
					</Route>
					<Route path={`${path}/views`}>
						<div>Show users that viewed you</div>
					</Route>
				</Switch>
			</>
		: null
}

export default UserBrowser