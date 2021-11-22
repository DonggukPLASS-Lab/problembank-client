import React from 'react';
import {Redirect, Route, useRouteMatch, Switch, withRouter } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import MyTestResults from './pages/MyTestResults';
import MyTests from './pages/MyTests';
import ManageTest from './pages/ManageTest';
import AdminTestResult from './pages/AdminTestResult';
import CreateTest from './pages/CreateTest';
import TestLayout from './../../layouts/TestLayout';
import StudentTestResultPage from './pages/MyTestResults/pages/StudentTestResultPage';
import EditTest from './pages/EditTest';
import './style.scss';
function MyPage({user} ) {
	const match = useRouteMatch();
	//! 일단유저인지 관라지유저인지 체크할 필요함
	return (
		<TestLayout>
			<div className="container-mypage">
				<Sidebar user = {user}/>
				<Switch>
					{/* 경진대화 조회 페이지
                - amdmin라면 UI가 달라짐
                */}
					{/* 관리자 */}
					{(user.userData.roleId === 1) ?
						<Route exact path={`${match.path}`}>
							<Redirect to={`${match.url}/adminresults`}/>
						</Route> :
					<Route exact path={`${match.path}`}>
							<Redirect to={`${match.url}/studentsearch`}/>
					</Route>
						// <Route exact path = {`${match.url}`} render={(props) => <MyTestResults user={user} {...props}/>} />
					}

					{/* 자기 경진대회 페이지 */}
					<Route exact path = {`${match.url}/studentsearch`} render={(props) => <MyTests user={user} {...props}/>} />

					<Route exact path = {`${match.url}/apply`} render={(props) => <MyTests user={user} {...props}/>} />
					{/* Amin쪽에서 조회 */}
					<Route exact path = {`${match.url}/adminresults`} render={(props) => <AdminTestResult user={user} {...props}/>} />
					<Route exact path = {`${match.url}/studentresults`} render={(props) => <StudentTestResultPage user={user} {...props}/>} />

					{/* 문제를 수정 또는 관리 페이지 */}
					<Route exact path = {`${match.url}/manage`} render={(props) => <ManageTest user={user} {...props}/>} />

					{/* 문제등록 페이지 */}
					<Route exact path = {`${match.url}/create`} render={(props) => <CreateTest user={user} {...props}/>} />
					<Route exact path = {`${match.url}/editest`} render={(props) => <EditTest user={user} {...props}/>} />
				</Switch>
			</div>
		</TestLayout>
	);
}

export default withRouter(MyPage);
