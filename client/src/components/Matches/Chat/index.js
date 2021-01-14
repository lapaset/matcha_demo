import React, { useState, useRef } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { Card, Modal } from 'react-bootstrap'

const Chat = ({ user, match, handleClose, wsClient }) => {

	const [input, setInput] = useState('')
	const messagesEndRef = useRef()
	const inputField = useRef()

	const sendMessage = (from, fromUn, to, msg) => {

		if (wsClient.current.readyState > 1) {
			console.log('Could not send message, websocket state', wsClient.current.readyState)
			return
		}

		wsClient.current.send(JSON.stringify({
			type: 'message',
			from,
			user: fromUn,
			to,
			msg
		}))
	}

	const scrollToEnd = () => {
		if (messagesEndRef.current)
			messagesEndRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' })
	}

	const handleSubmit = e => {
		e.preventDefault()

		if (!input)
			return
		sendMessage(user.user_id, user.username, match.user_id, input)
		setInput('')
		scrollToEnd()
	}

	const handleEnterModal = () => {
		inputField.current.focus()
		scrollToEnd()
	}

	return match
		? <>
			<Modal show={true} onHide={handleClose} onEntered={handleEnterModal}>
				<Modal.Header closeButton>
					<Modal.Title>{match.username}</Modal.Title>
				</Modal.Header>

				<Modal.Body className="messageContainer"
					style={{ height: '60vh', overflowY: 'auto', paddingBottom: '5vh' }}>

					{match.messages.map(m =>
						<Card key={m.id} className="w-75 mt-2 text-left"
							style={{ marginLeft: user.user_id === m.sender ? '25%' : '0' }}>
							<Card.Body>{m.msg}</Card.Body>
						</Card>
					)}

					<div ref={messagesEndRef}></div>

				</Modal.Body>

				<Modal.Footer>
					<Form onSubmit={handleSubmit} className="w-100">
						<InputGroup >
							<Form.Control
								ref={inputField}
								placeholder={`write a message as ${user.username} and send`}
								value={input}
								onChange={e => setInput(e.target.value)}
							/>
							<InputGroup.Append>
								<button className="btn btn-primary" type="submit">send</button>
							</InputGroup.Append>
						</InputGroup>
					</Form>
				</Modal.Footer>
			</Modal>
		</>
		: null
}

export default Chat