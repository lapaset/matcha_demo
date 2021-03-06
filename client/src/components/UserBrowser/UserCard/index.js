import React, { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import Photos from './Photos'
import ActionButtons from './ActionButtons'
import UserInformation from './UserInformation'
import MatchModal from './MatchModal'
import CardHeader from './CardHeader'
import ConfirmationModal from './ConfirmationModal'
import likeService from '../../../services/likeService'
import reportService from '../../../services/reportService'
import blockService from '../../../services/blockService'
import visitService from '../../../services/visitService'
import userService from '../../../services/userService'
import socket from '../../../socket'

const UserCard = ({ user_id, loggedUser, wsClient, hideUser, matches, setMatches, isMatch }) => {

	const [liked, setLiked] = useState(false)
	const [matchModal, setMatchModal] = useState(null)
	const [confirmationModal, setConfirmationModal] = useState(null)
	const [userToShow, setUserToShow] = useState(null)

	//get user if not blocked
	useEffect(() => {
		blockService
			.getBlockedId(user_id)
			.then(res => {
				if (res.length > 0)
					hideUser()
				else {
					userService
					.getUser(user_id)
					.then(res => {
						setUserToShow(res)
					})
					.catch(() => {
						hideUser()
					})
				}
			})
			.catch(e => {
				console.log('Database error', e)
			})
	}, [user_id, hideUser])

	//send notification and save visit
	useEffect(() => {
		if (userToShow && userToShow.user_id !== loggedUser.user_id) {

			socket.sendNotification(wsClient, {
				user_id: userToShow.user_id,
				from_id: loggedUser.user_id,
				notification: `${loggedUser.username} viewed your profile`
			})

			visitService
				.addVisit({ to_user_id: userToShow.user_id })
				.catch(e => {
					console.log('Database error', e)
				})
		}

	}, [userToShow, loggedUser, wsClient])

	//get like
	useEffect(() => {
		if (userToShow)
			likeService
				.getLike(user_id)
				.then(res => {
					if (res.length > 0)
						setLiked(true)
				})
				.catch(e => {
					console.log('Database error', e)
				})
	}, [userToShow, user_id])


	const sendNotification = notification => {
		socket.sendNotification(wsClient, {
			user_id: user_id,
			from_id: loggedUser.user_id,
			notification
		})
	}

	const likeHandler = event => {

		event.preventDefault()

		likeService.toggleLike(userToShow.user_id)
			.then(res => {
				if (res.value === 1 && res.status === 'match') {
					sendNotification(`New match with ${loggedUser.username}`)
					setMatchModal(userToShow.username)
					setMatches(matches.concat({
						user_id: userToShow.user_id,
						username: userToShow.username,
						match: 1,
						messages: []
					}))
				}

				else if (res.value === 1 && res.status === 'like')
					sendNotification(`${loggedUser.username} likes you`)

				else if (res.value === 0 && res.status === 'unmatch') {
					sendNotification(`No longer match with ${loggedUser.username}`)
					setMatches(matches.filter(m => m.user_id !== userToShow.user_id))
				}

				setLiked(res.value)
			})
			.catch(e => {
				console.log('Database error', e)
			})

	}

	const reportHandler = () => {
		reportService.report(user_id)
			.then(() => setConfirmationModal(null))
			.catch(e => {
				console.log('Database error', e)
			})
	}

	const blockHandler = () => {

		if (isMatch)
			sendNotification(`No longer match with ${loggedUser.username}`)

		blockService.block(user_id)
			.then(() => {
				hideUser()
			})
			.catch(e => {
				console.log('Database error', e)
			})
	}

	const actionButtonProps = {
		liked, likeHandler, reportHandler, blockHandler, setConfirmationModal,
		hasPhoto: loggedUser.photos && loggedUser.photos.length > 0,
		username: userToShow ? userToShow.username : ''
	}

	return userToShow
		? <>
			<Card className="w-100 m-auto">
				<CardHeader fame={userToShow.fame} hideUser={hideUser} />
				<Photos photos={userToShow.photos} />
				<UserInformation user={userToShow} isMatch={isMatch} />
				<ActionButtons {...actionButtonProps} />
			</Card>
			<MatchModal modal={matchModal} setModal={setMatchModal} />
			<ConfirmationModal modal={confirmationModal} setModal={setConfirmationModal} />
		</>
		: null
}

export default UserCard
