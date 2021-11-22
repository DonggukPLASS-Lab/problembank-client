import React, {useState} from 'react';
import MyPageLayout from '../../../../layouts/MyPageLayout';
import TestResultTable from '../../components/TestResultTable';
import {useDispatch} from 'react-redux';
import {getUserAnswer, getUserResult} from '../../../../_actions/testAction';
import queryString from 'query-string';
import MyTestsTable from '../../../MyPage/pages/MyTests/components/MyTestsTable';
import './style.scss';

function DetailedResultPage(props) {
	const {test_id, u_id} = queryString.parse(props.location.search);
	const {user} = props;

	// console.log(test_id)

	const [results, setResults] = useState([]);

	const dispatch = useDispatch();

	React.useEffect(() => {
		let params =  {
			test_id,u_id 
		} 
		dispatch(getUserAnswer(params))
			.then((response) => {
				const {data} = response.payload;
				console.log(data)
				setResults(data);
			});
	}, []);

	return (
		<div id="content">
			<div id="content-table">
				<TestResultTable results={results} test_id={test_id} {...props} ></TestResultTable>
			</div>
		</div>
	);
}

export default DetailedResultPage;
