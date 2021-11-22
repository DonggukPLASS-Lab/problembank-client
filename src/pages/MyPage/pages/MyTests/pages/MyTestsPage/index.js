import React, {useCallback, useState} from 'react';
import './style.scss';

import { useHistory } from "react-router-dom";
import MyTestsTable from '../../components/MyTestsTable';
import MyPageLayout from '../../../../../../layouts/MyPageLayout';
import {getUserTest} from '../../../../../../_actions/testAction';
import {useDispatch} from 'react-redux';
import testAPI from '../../../../../../apis/tests';
import { useAsync } from 'react-async';
async function getAdminTestList({admin_id}) {
	const response = await testAPI.getAdminTestList({admin_id});
	if (response.result === true) {
		// console.log(response);
		return response.data;
	}
	throw new Error(response.data);
}
function MyTestsPage(props) {
	const {user} = props;
	const [selectedTestId, setSelectedTestId] = useState(undefined);
	// const {data, error} = useAsync({promiseFn: getAdminTestList, admin_id: user.userData.data.id });

	const [data, setData] = useState([]);
	const [keyword, setKeyword] = useState();
	const [start, setStart] = useState(null);
	const [end, setEnd] = useState(null);
	const [tests, setTests] = useState([]);
	const [filteredTests, setfilteredTests] = useState([]);

	const dispatch = useDispatch();
	const history= useHistory();
	

	React.useEffect(() => {
		dispatch(getUserTest(user.id))
			.then((response) => {
				const {data} = response.payload;
				console.log(data);
				setTests(data);
				setfilteredTests(data);
			});
	}, []);

	const handleClick = async (test_id) => {
		try {
			if(window.confirm("해당 시험 취소하시겠습니다.")){
				const response = await testAPI.cancelRegisteForStudent({user_id: user.id, test_id: test_id});
				if (response.result === true) {
					alert('신청을 취소했습니다.');
					window.location.reload();
					return response.data[0];
				}else{
					return;
				}
			}
		} catch (error) {
			alert('시험 삭제 오류를 발생합니다.')
		}

		dispatch(getUserTest(user.id))
			.then((response) => {
				const {data} = response.payload;
				setTests(data);
				setfilteredTests(data.filter((element) => ((element.date >= start || start === null) && (element.date.substring(0, element.date.indexOf('T')) <= end || end === null) &&element.test_name.match(new RegExp(keyword, 'i')))),);
			});
	};


	return (
		<div id="content">
				<div id="content-header">
						<h2>시험 조회</h2>
				</div>
					<div id="content-table">
						<MyTestsTable handleClick={handleClick} testLists={filteredTests} {...props} ></MyTestsTable>
	        </div>
	    </div>
	);
}

export default MyTestsPage;
