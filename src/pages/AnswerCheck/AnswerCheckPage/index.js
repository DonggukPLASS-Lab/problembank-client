import React, {useEffect, useRef, useState} from 'react';
import {ControlledEditor} from '@monaco-editor/react';
import SampleCode from '../../../constansts/SampleCode';
import queryString from 'query-string';

import testsAPI from '../../../apis/tests';
import WrapperLoading from '../../../components/WrapperLoading';
import DetailProblemLayout from '../../../layouts/DetailProblemLayout';

import './style.scss';

function AnswerCheckPage(props) {
	const [problem, setProblem] = useState({testcases: []});

	const [language, setLanguage] = useState('c');
	const [contentEditor, setContentEditor] = useState();
	const [theme, setTheme] = useState('white');

	const {test_id, problem_id, u_id} = queryString.parse(props.location.search);

	useEffect(() => {
		getProblem();
		getAnswer();
	}, []);

	const getProblem = async () => {
		const response = await testsAPI.getTestProblemData({problem_id: problem_id});
		setProblem(response.data[0]);
		// console.log(response.data)
	};

	const getAnswer = async () => {
		const response = await testsAPI.getUserAnswers({test_id: test_id, u_id: u_id});
		const filter = response.data.filter((element) => (element.problem_id == problem_id));
		setContentEditor(filter[0].answer);
	};


	return (
		<DetailProblemLayout>
			<div className="problem__detail__test">
				<div className="problem__detail__test--content">
					<div className="tab__header">
						<ul className="tab__header--content">
							<li>
							</li>

						</ul>
					</div>
					<div className="wrapper__content">
						<h3>{problem.id}. {problem.name}</h3>
						<div className="problem__infor">
							<div className="problem__infor--desc">
								<p>문제 정의</p>
								<span>{problem.content}</span>
							</div>
							<div className="problem__infor--input">
								<p>입력</p>
								<span>{problem.input}</span>
							</div>
							<div className="problem__infor--output">
								<p>출력</p>
								<span>{problem.output}</span>
							</div>
							<div className="problem__infor--example">

							</div>
						</div>
					</div>
					<div className="tab__footer__dropup">
						<div className="review__listproblem">
						</div>
						<div className="pre-next-problem">
						</div>
					</div>

				</div>
				<div className="problem__detail__test--vseditor">
					<div className="tab__header--editor">
						<ul>
							<li>
								<span>언어 </span>
								<select name="" id="" className="language" value={language} onChange={(e) => {
									setLanguage(e.target.value);
									setContentEditor(SampleCode[e.target.value]);
								}}>
									<option value="c">C</option>
									<option value="cpp">C++</option>
									<option value="java">Java</option>
									<option value="python">Python</option>
									<option value="r">R</option>
								</select>
							</li>
							<li>
								<span> </span>
								<select name="" id="" className="language" value={theme}
									onChange={(e) => setTheme(e.target.value)}>
									<option value="white">White</option>
									<option value="dark">Dark</option>
								</select>
							</li>
						</ul>
					</div>
					<div className="wrapper__editor">
						<ControlledEditor
							width="100%"
							height="100%"
							theme={theme}
							language={language}
							value={contentEditor}
							loading={<WrapperLoading/>}
						/>
					</div>
					<div className="tab__footer">
					</div>
				</div>
			</div>
		</DetailProblemLayout>
	);
}


export default AnswerCheckPage;

