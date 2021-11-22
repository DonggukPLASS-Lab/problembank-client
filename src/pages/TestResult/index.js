import React from 'react';
import {Route, useRouteMatch} from 'react-router-dom';
import DetailedResultPage from './pages/DetailedResultPage';
import TestLayout from './../../layouts/TestLayout';

import './style.scss';
import queryString from 'query-string';

function DetailedResult(props) {
	const {user_id} = queryString.parse(props.location.search);

	const match = useRouteMatch();
	return (
		<TestLayout>
			<div className="container-mypage">
				<Route exact path = {`${match.url}`} render={(props) => <DetailedResultPage user_id={user_id} {...props}/>} />
			</div>
		</TestLayout>
	);
}

export default DetailedResult;

