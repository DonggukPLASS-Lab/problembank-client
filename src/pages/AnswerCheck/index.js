import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import AnswerCheckPage from './AnswerCheckPage';

function AnswerCheck({user}) {
	const match = useRouteMatch();
	// console.log(match.url);

	return (
		<Switch>
			<Route path = {`${match.url}`} render={(props) => <AnswerCheckPage user={user} {...props} /> } />
		</Switch>);
}

export default AnswerCheck;

