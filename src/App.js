import React, {Suspense} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './assets/styles/grid.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Auth from './hocs/Authentication';

import NotFound from './components/404NotFound';
import Loading from './components/Loading/Loading';

const MainPage = React.lazy(() => import('./pages/MainPage'));
const ProblemsByCategories = React.lazy(() => import('./pages/ProblemsByCategories'));
const CodingProblems = React.lazy(() => import('./pages/CodingProblems'));
const MyProblems = React.lazy(() => import('./pages/MyProblems'));
const Multiplechoice = React.lazy(() => import('./pages/MultipleChoice'));
const ShortansProblems = React.lazy(() => import('./pages/ShortansProblems'));

const AdminPage = React.lazy(() => import('./admin/pages'));
const Notice = React.lazy(() => import('./pages/Notice'));

const AnswerCheck = React.lazy(() => import('./pages/AnswerCheck'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));


const DetailedResult = React.lazy(() => import('./pages/TestResult'));
const Test = React.lazy(() => import('./pages/Test'));

const MyPage = React.lazy(() => import('./pages/MyPage'));
// check user Id && paswword for authentication
function App() {
	const getHeadOrBody = () =>{
		return document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0];
	};


	// Inject if not
	getHeadOrBody().appendChild(
		Object.assign(
			document.createElement('script'),
			{
				type: 'text/javascript',
				async: true,
				src: 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js',
			},
		),
	);
	return (
		<Suspense fallback = {<Loading type={'bars'} color={'black'} />}>
			<BrowserRouter>
				<Switch>
					<Route exact path = "/" component = {Auth(MainPage, true)}/>
					<Route path = "/problemsbank" component = {Auth(ProblemsByCategories, true)}/>
					<Route path = "/codeproblems" component = {Auth(CodingProblems, true)}/>
					<Route path = "/mylist" component = {Auth(MyProblems, true)}/>
					<Route path = "/multiplechoice" component = {Auth(Multiplechoice, true)}/>
					<Route path = "/shortans" component = {Auth(ShortansProblems, true)}/>
					<Route path = "/mylist" component = {Auth(MyProblems, true)}/>

					<Route path = "/notice" component = {Auth(Notice, true)}/>
					
					{/* admin page */}
					<Route path = "/admin" component = {Auth(AdminPage, true)}/>
					<Route path = "/answercheck" component = {Auth(AnswerCheck, true)}/>

					{/* 경진대화 페이지 */}
					<Route path = "/test" component = {Auth(Test, true)}/>
					<Route path = "/detailedresult" component = {Auth(DetailedResult, true)}/>

					{/* 자기 경진대화 페이지 */}
					<Route path = "/mypage/mytest" component = {Auth(MyPage, true)}/>
					<Route component = {NotFound} />


				</Switch>
			</BrowserRouter>
		</Suspense>
	);
}

export default App;