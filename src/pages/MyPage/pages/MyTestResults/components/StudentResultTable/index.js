import React, { Component, useState, useEffect } from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';
import './style.scss';
import testAPI from '../../../../../../apis/tests'
import moment  from 'moment';
function StudentResultTable(props) {

	const handleResultExam = (exam) => {
		// props.history.push(`/detailedresult?test_id=${test_id}`);
		const { join_time, final_submit_time, final_submit } = exam;
		if (join_time && final_submit_time && final_submit) {
			setViewExam(exam)
			setDetailExam(!detailExam);
		} else {
			alert('시험 참여했거나, 최종 제출만 한 시험을 결과를 확인할 수 있습니다.');
		}
	}
	const { filteredResults } = props;
	const [detailExam, setDetailExam] = useState(false);
	const [viewExam, setViewExam] = useState(null);
	return (
		<div className="tableContent">
			<table className="table table-contribution">
				<thead>
					<tr>
						<th width="5%">번호</th>
						<th width="35%">시험 명</th>
						<th width="30%">응시일</th>
						<th width="15%">최종 제출</th>
						<th width="10%">제출 확인</th>
					</tr>
				</thead>
				<tbody>
					{
						filteredResults.map((item, index) => {
							return (
								<tr key={index}>
									<th>{index + 1}</th>
									<th>{item.test_name}</th>
									<th>{item.join_time}</th>
									<th>{item.final_submit_time}</th>
									<th onClick={() => handleResultExam(item)}>보기</th>
								</tr>
							);
						})
					}
				</tbody>
			</table>
			{detailExam &&
				<ExamDetail viewExam={viewExam} closed={() => setDetailExam(false)} />
			}
		</div>
	);
}
const ExamDetail = ({ viewExam, closed }) => {
	const [loading, setLoading] = useState(true);
	const [examInfo, setExamInfo] = useState(null);
	const [problemList, setProblemlist] = useState([]);
	const [listSubmit, setListSubmit] = useState([]);
 	const [userSubmitInfo, setUserSubmitInfo] = useState(null);
	useEffect(() => {
		const fetchData = async () => {
			const { test_id } = viewExam;
			let params = {
				test_id,
			}
			const response = await testAPI.getTestInfo(params)
			const { data } = response;
			const res = await testAPI.getTestProblems(params)
			let problemList = [];
			const { data: problemsData } = res;
			for (let index = 0; index < problemsData.length; index++) {
				const { problem_id } = problemsData[index]
				let params = { problem_id }
				const resProblem = await testAPI.getTestProblemData(params)
				const { data : problemData } = resProblem;
				problemList.push(problemData[0]);
				
			}

			const resSubmit = await testAPI.getProblemSubmit(params)
			setListSubmit(resSubmit.data);
			setProblemlist(problemList)
			setExamInfo(data);
			setLoading(false);
		}
		fetchData();
	}, [viewExam])

	const getInfo = (problemId) => {
		let filterValue = listSubmit.filter((submit) => submit.problem_id === problemId)
		if(filterValue.length !== 0){
			console.log(filterValue)
			let { timestamp } = filterValue[0]
			return timestamp
		}else {
			return "미제출";
		}
	}
	const getInfoCode = (problemId) => {
		let filterValue = listSubmit.filter((submit) => submit.problem_id === problemId)
		if(filterValue.length !== 0){
			let { code } = filterValue[0]
			return code
		}else {
			return "미제출";
		}
	}
	return (
		<div className="my-exam-detail">
			<div className="my-exam-container">
				<p className="close" onClick={() => closed()}>X</p>
				<h2 style={{ textAlign: 'center' }}>시험 정보</h2>
				{
					loading ?
						<div style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</div> :
						<>
							<div className="col">
								<div>시험 이름 :</div>
								<div>{examInfo.name}</div>
							</div>
							<div className="col">
								<div>시험 기간 :</div>
								<div style={{ fontSize: '14px' }}>
									<p>신청 마감일: {examInfo.register_end}</p>
									<p>신청 시작일: {examInfo.start}</p>
									<p>신청 종료일: {examInfo.end}</p>
								</div>
							</div>
							<div className="col">
								<div>시험 설명 :</div>
								<div dangerouslySetInnerHTML={{ __html: examInfo.content }} ></div>
							</div>
							<div className="col">
								<div>시험 문제 :</div>
								<div>
									{
										problemList.length !== 0 &&
										problemList.map((problem) => 
											<div style={{marginBottom: '20px', borderBottom: '5px solid #ccc'}}>
												<div>
													문제 이름: {problem.name}
												</div>
												<div>
													문제 설명: <p dangerouslySetInnerHTML={{ __html: problem.content }} ></p>
												</div>
												<div>
												<label>테스트 케이스</label>
												<table>
													<table>
														<thead>
															<tr>
																<th>입력 예제</th>
																<th>출력 예제</th>
															</tr>
														</thead>
														<tbody>
															{
																problem.testcases.length !== 0 && 
																problem.testcases.map(test => 
																	<tr>
																		<td>{test.input_exp}</td>
																		<td>{test.output_exp}</td>
																	</tr>)
															}
														</tbody>
													</table>
												</table>
												</div>
												<div>
													제츨 정보: 
													<p>제출 시간 : {getInfo(problem.id)}</p>
													<p>제출 코드 : </p>
													<pre className="prettyprint">
														<code className = "language" dangerouslySetInnerHTML={{
															__html: getInfoCode(problem.id),
														}}>
													</code>
												</pre>
												</div>
											</div>	
										)
									}
									
								</div>
							</div>
						</>
				}
			</div>
		</div>
	)
}

export default withRouter(StudentResultTable);

