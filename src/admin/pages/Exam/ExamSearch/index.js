import React from 'react';
import PropTypes from 'prop-types';
import DashboardLayout from '../../../layout/DashboardLayout';
import {useState} from 'react';
import {useDispatch} from 'react-redux';

import {getUserResult} from '../../../../_actions/testAction';
import StudentResultTable from './StudentResultTable';
function ExamSearch(props) {
	const {user} = props;

	const [keyword, setKeyword] = useState();
	const [start, setStart] = useState(null);
	const [end, setEnd] = useState(null);
	const [results, setResults] = useState([]);
	const [filteredResults, setFilteredResults] = useState([]);

	const dispatch = useDispatch();

	// !수정 필요함
	React.useEffect(() => {
		dispatch(getUserResult(2))
			.then((response) => {
				const {data} = response.payload;
				// console.log(data)
				setResults(data);
				setFilteredResults(data);
			});
	}, []);

	const changeStartDate = (e) => {
		setStart(e.target.value);
	};
	const changeEndDate = (e) => {
		setEnd(e.target.value);
	};
	const changeKeyword = (e) => {
		setKeyword(e.target.value);
	};
	const handleFilter = (e) => {
		const filteredResults = results.filter((element) => (
			(element.date >= start || start === null) &&
			(element.date.substring(0, element.date.indexOf('T')) <= end || end === null) &&
			element.test_name.match(new RegExp(keyword, 'i'))
		));
		setFilteredResults(filteredResults);
	};

	return (
		<DashboardLayout>
			<div id="content">
				<div id="content-header">
					<div id="testDate">
						<text>시험 일자</text>
						<input type="date" className="data-calander" onChange={changeStartDate}></input>
						<text>&nbsp;~&nbsp;</text>
						<input type="date" className="data-calander" onChange={changeEndDate}></input>
					</div>
					<div id="testName">
						<text>시험명</text>
						<input id="select" type="text" onChange={changeKeyword}></input>
					</div>
					<button onClick={handleFilter}>조회</button>
				</div>
				<div id="content-table">
					<StudentResultTable filteredResults={filteredResults} {...props} ></StudentResultTable>
				</div>
			</div>
		</DashboardLayout>
	);
}

ExamSearch.propTypes = {

};

export default ExamSearch;

