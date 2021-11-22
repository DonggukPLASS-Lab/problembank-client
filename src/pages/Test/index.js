import React from 'react';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';
import TestPage from './pages/TestPage';
import DoTest from './pages/DoTest';
import NotFound from '../../components/404NotFound';
import AdminTestProgress from '../AdminTestProgressPage/';

function Test({user}) {
	const match = useRouteMatch();
	return (
		<Switch>
			{/* 문제 리스트 - 일반유저
        - 유저별로 출력하는 페이지 다름
        - 관리자인경우에는 클릭하면 시험상세 페이지를 출력함
        */}
			<Route exact path = {`${match.url}`} render={(props) => <TestPage {...props} /> } />


			{/* 문제 풀리 페이지 - 일반유저 */}
			<Route exact path = {`${match.url}/view`} render={(props) => <DoTest {...props} /> } />

			{/* 문제를 풀리는 과정 확인 페이지 */}
			<Route path = {`${match.url}/adminprogress`} render={(props) => <AdminTestProgress {...props} /> } />
		</Switch>);
}

export default Test;

