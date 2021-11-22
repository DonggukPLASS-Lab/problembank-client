import React, {useState} from 'react';
import './style.scss';
import MyPageLayout from '../../../../../../layouts/MyPageLayout';
import StudentResultTable from '../../components/StudentResultTable';
import {useDispatch} from 'react-redux';
import {getUserResult} from '../../../../../../_actions/testAction';

function StudentTestResultPage(props) {
	const {user} = props;

	const [keyword, setKeyword] = useState();
	const [start, setStart] = useState(null);
	const [end, setEnd] = useState(null);
	const [results, setResults] = useState([]);
	const [filteredResults, setFilteredResults] = useState([]);

	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(getUserResult(user.id))
			.then((response) => {
				const {data} = response.payload;
				console.log(data)
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
	console.log(filteredResults)
	return (
		<div id="content">
			<div id="content-header">
					<h2>시험 결과 조회</h2>
				{/* <div id="testDate">
					<text>시험 일자</text>
					<input type="date" className="data-calander__search" onChange={changeStartDate}></input>
					<text>&nbsp;~&nbsp;</text>
					<input type="date" className="data-calander__search" onChange={changeEndDate}></input>
				</div>
				<div id="testName">
					<text>시험명</text>
					<input id="select" type="text" onChange={changeKeyword}></input>
				</div>
				<button onClick={handleFilter}>조회</button> */}
			</div>
			<div id="content-table">
				<StudentResultTable filteredResults={filteredResults} user = {props.user.userData} ></StudentResultTable>
			</div>
		</div>
	);
}

export default StudentTestResultPage;
