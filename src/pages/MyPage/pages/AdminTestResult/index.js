import React from 'react';
import {Route, useRouteMatch} from 'react-router-dom';
import AdminTestResultPage from './pages/AdminTestResultPage';

function AdminTestResult({user}) {
	const match = useRouteMatch();
	// console.log(match.url);
	return (
		<Route exact path = {`${match.url}`} render={(props) => <AdminTestResultPage user={user} {...props}/>} />
	);
}

export default AdminTestResult;

