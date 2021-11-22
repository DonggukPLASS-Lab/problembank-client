import React from 'react';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';
import ManageTestPage from './pages/ManageTestPage';

function ManageTest({user}) {
	const match = useRouteMatch();
	return (
		<Route exact path = {`${match.url}/`} render={(props) => <ManageTestPage user={user} {...props}/>} />
	);
}

export default ManageTest;

