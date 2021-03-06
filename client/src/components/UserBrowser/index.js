import React, { useState, useEffect } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { Switch, Route, useRouteMatch, NavLink, useHistory } from 'react-router-dom'
import UserCard from './UserCard'
import UserSearch from './UserSearch'
import UserLikes from './UserLikes'
import UserViews from './UserViews'
import userService from '../../services/userService'


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

				const usersFromDb = matches
					? res.filter(u => !matches.some(m => m.user_id === u.user_id))
					: res

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

	const showUser = user => history.push(`/browse?user_id=${user.user_id}`)

	const userCardProps = {
		user_id: userToShow, loggedUser: user, wsClient, hideUser,
		matches, setMatches, isMatch
	}

	const userSearchProps = { user, showUser, users }

	const userLikesProps = { showUser, users }

	const userViewsProps = { showUser, users }

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
						<UserViews {...userViewsProps} />
					</Route>
				</Switch>
			</>
		: null
}

export default UserBrowser