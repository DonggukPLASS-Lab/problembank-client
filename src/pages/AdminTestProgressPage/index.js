import React, {useEffect, useState} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {useAsync} from 'react-async';
import FeedbackPage from './pages/FeedbackPage';
import timer_img from '../../assets/images/timer_512.png';
import ProgressSidebar from './components/ProgressSidebar';
import './style.scss';
import ProblemEditPage from './pages/ProblemEditPage';
import queryString from 'query-string';
import testAPI from '../../apis/tests';
import moment from 'moment';
import TestLayout from '../../layouts/TestLayout';


function AdminTestProgressPage(props) {
	const match = useRouteMatch();
	const {test_id} = queryString.parse(props.location.search); // index는 0부터 문제 개수-1 까지
	const [remainingTime, setRemainingTime] = useState(undefined);
	const [data, setData] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				let params = { test_id }
				const response = await testAPI.getTestInfo(params);
				const { result, data} = response;
				if(result === true){
					setData(response.data)
					const currentDate = moment();	
					const endDate = moment(data.end);
					setRemainingTime(moment.duration(endDate.diff(currentDate)));
				}
			} catch (error) {
					alert('해당 시험 출력 오류를 발생합니다.')				
			}
		}
		fetchData();
	},[])


	// if (data && remainingTime) {
	// 	const timeout = setInterval(() => setRemainingTime(moment.duration(moment(data.end).diff(moment()))), 1000);
	// }

	if (data && remainingTime) {
		return (
			<TestLayout>
				<div className="admin-test-progress-page">
					<p className="test-title">{data.name}</p>
					<div>
						<img className="img-timer" width="15" src={timer_img} />

						{/* <text className="test-timer">{remainingTime.days()*24 + remainingTime.hours()}:{remainingTime.minutes()}:{remainingTime.seconds()}</text> */}
						<text className="test-date">{moment(data.start).format('YYYY-MM-DD HH:mm:ss')} ~ {moment(data.end).format('YYYY-MM-DD HH:mm:ss')}</text>
					</div>
					<div className="admin-test-board">
						<ProgressSidebar test_id={test_id}/>
						<div className="admin-test-board-content">
							<Switch>
								<Route exact path = {`${match.url}`} render={(props) => <FeedbackPage test_id={test_id} {...props} />}/>
								<Route exact path = {`${match.url}/problemedit`} render={(props) => <ProblemEditPage test_id={test_id} {...props} />} />
							</Switch>
						</div>
					</div>
				</div>
			</TestLayout>
	);}
	return '로딩중...';
}

export default AdminTestProgressPage;
