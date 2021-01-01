import React, { useEffect, useState } from 'react'
import { useFilter } from '../../../hooks/index'
import ListOfUsers from '../ListOfUsers'
import SortForm from './SortForm'
import FilterForm from './FilterForm'

const UserSearch = ({ user, showUser, users }) => {

	const [resultsToShow, setResultsToShow] = useState([])

	const maxDistance = useFilter('matchaMaxDistance', 100, 'number')
	const minAge = useFilter('matchaMinAge', 20, 'number')
	const maxAge = useFilter('matchaMaxAge', 120, 'number')
	const minFame = useFilter('matchaMinFame', 50, 'number')
	const requiredTag = useFilter('matchaRequiredTag', '', 'text')


	useEffect(() => {
		console.log('set results at user search')
		setResultsToShow(users)
	}, [users])


	const requiredTagFound = tags => tags && requiredTag.value
		? tags.split('#').includes(requiredTag.value)
		: true

	const matchesFilters = r =>
		r.distance <= maxDistance.value &&
		r.age.years >= minAge.value &&
		r.age.years <= maxAge.value &&
		r.fame >= minFame.value &&
		requiredTagFound(r.tags)

	const filterResults = () => resultsToShow

		? resultsToShow
			.filter(r => matchesFilters(r))
		: []


	const sortFormProps = ({ user, resultsToShow, setResultsToShow })
	const filterFormProps = ({ user, requiredTag, maxDistance, minFame, minAge, maxAge })

	return <>
		<SortForm {...sortFormProps} />

		<FilterForm {...filterFormProps} />

		<ListOfUsers users={filterResults()} handleClick={showUser} />
	</>

}

export default UserSearch