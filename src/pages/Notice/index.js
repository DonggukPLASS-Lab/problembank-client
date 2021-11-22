import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import NoticeList from './pages/NoticeList';
import Post from './pages/Post';
function TotalProblems(props) {
	const match = useRouteMatch();
	return (
		<Switch>
			<Route exact path = {`${match.url}`} component = {NoticeList} />
			<Route exact path = {`${match.url}/view`} component = {Post} />
		</Switch>
	);
}

export default TotalProblems;

