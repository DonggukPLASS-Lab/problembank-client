import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import MyTestsPage from './pages/MyTestsPage';

function MyTests({user}) {
	const match = useRouteMatch();
	return (
		<Route exact path = {`${match.url}`} render={(props) => <MyTestsPage user={user} {...props}/>} />
	);
}

export default MyTests;

