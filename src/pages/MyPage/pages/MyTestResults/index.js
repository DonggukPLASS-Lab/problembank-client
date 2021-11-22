import React from 'react';
import {Route, useRouteMatch} from 'react-router-dom';
import StudentTestResultPage from './pages/StudentTestResultPage';

function MyTestResults({user}) {
	const match = useRouteMatch();
	// console.log(match.url);
	return (
		<Route exact path = {`${match.url}`} render={(props) => <StudentTestResultPage user={user} {...props}/>} />
	);
}

export default MyTestResults;

