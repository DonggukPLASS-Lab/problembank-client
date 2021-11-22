import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import CreateTestPage from './pages/CreateTestPage';

function CreateTest( {user}) {
	const match = useRouteMatch();
	// console.log(match.url);
	// console.log(user);

	return (
		<Switch>
			<Route exact path = {`${match.url}`} render={(props) => <CreateTestPage user={user} {...props}/>}/>
		</Switch>


	);
}

export default CreateTest;

