import React, { useEffect, useState } from 'react'
import { useFilter } from '../../../hooks/index'
import ListOfUsers from '../ListOfUsers'
import SortForm from './SortForm'
import FilterForm from './FilterForm'

const UserSearch = ({ user, showUser, users }) => {

	const [resultsToShow, setResultsToShow] = useState([])
	const [requiredTags, setRequiredTags] = useState(localStorage.getItem('matchaRequiredTags') || [])

	const maxDistance = useFilter('matchaMaxDistance', 100, 'number')
	const minAge = useFilter('matchaMinAge', 20, 'number')
	const maxAge = useFilter('matchaMaxAge', 120, 'number')
	const minFame = useFilter('matchaMinFame', 50, 'number')

	useEffect(() => {
		setResultsToShow(users)
	}, [users])

	const handleTagsChange = e => setRequiredTags(e ? e.map(t => t.value) : [])

	const requiredTagFound = tags => tags && requiredTags.length > 0
		? requiredTags.every(t => tags.split('#').includes(t))
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
	const filterFormProps = ({ user, requiredTags, handleTagsChange, maxDistance, minFame, minAge, maxAge })

	return <>
		<SortForm {...sortFormProps} />

		<FilterForm {...filterFormProps} />

		<ListOfUsers users={filterResults()} handleClick={showUser} />
	</>

}

export default UserSearch