import React, {Component} from 'react';
import { useState , useEffect} from 'react';
import './style.scss';
import ManageTestLayout from '../../../../../../layouts/ManageTestLayout';
import testAPI from '../../../../../../apis/tests';
import Text from '../../../../../../components/DesignComponent/Text';
import ModifyListModal from '../../../../component/ModifyListModal';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import WrapperLoading from '../../../../../../components/WrapperLoading';
import {ControlledEditor} from '@monaco-editor/react';


function ManageTest(props) {
	const [loading, setLoading] = useState(true);
	const [testList, setTestList] = useState([]);
	const [describeTest, setDescribeTest] = useState(null);
	
	useEffect(() => {
		const fetchData = async () => {
			try {
				const responseTest = await testAPI.getAllTestDataNormalUser()
				const {	result, data } = responseTest;
				setTestList(data);
				setLoading(false)	
				console.log(responseTest)
			} catch (error) {

			}
		}
		fetchData()
	}, [])

	if(loading) {
		return <div style={{width: '100%'}}>
			<WrapperLoading type={'bars'} color={'black'} />
			</div>
	}
	return (
		<div className="test-manage">
			<div className="test-manage__testlist">
				<h2>시험 전체 리스트</h2>
				<TableShowTestList 
				testList = {testList} 
				handleSelectTest = {(test) => setDescribeTest(test)}
				/>
			</div>
			<div className="test-manage__desc">
				{
					describeTest && 
					<>
					<h2>시험 상세 보기</h2>
					<DescribeTest test = {describeTest} />
					</>
				}
			</div>
		</div>
	)
}

const TableShowTestList = ({testList, handleSelectTest}) => {
	return (
		<table>
		<thead>
			<tr>
				<th>No</th>
				<th>이름</th>
				<th>생성자 Id</th>
				<th>신청 마감</th>
				<th>시작 시간</th>
				<th>종료 시간</th>
				<th>상세</th>
			</tr>
		</thead>
		<tbody>
			{
				testList.map((test,index) => {
						return (
							<tr>
								<td>{index + 1}</td>
								<td>{test.name}</td>
								<td>{test.admin_id}</td>
								<td>{test.register_end}</td>
								<td>{test.start}</td>
								<td>{test.end}</td>
								<td onClick={() => handleSelectTest(test)}>보기</td>
							</tr>
						)
					})
				}
		</tbody>
	</table>
	)
}

const DescribeTest = ({ test} ) => {

	const [loading, setLoading] = useState(false);
	const [problems, setProblems] = useState([]);
	const [listUser, setListUser] = useState([]);

	useEffect(() => {

		const fetchData = async () => {
			try {
				let params = {
					test_id : test.id
				}
				const responseTest = await testAPI.getTestFullInfo(params)
				const { data, result } = responseTest;
				if(result) {
					const { problems } = data;
					setProblems(problems)
				}
				const responseUserTest = await testAPI.getUserByTestId(params)
				const { data: userData, result: userResult} = responseUserTest
				if(userResult){
					setListUser(userData);
				}
			} catch (error) {
				setLoading(true)
				console.log(error)				
			}
		}
		fetchData()
	}, [test])



	if(loading) {
		return <div style={{width: '100%'}}>
			<WrapperLoading type={'bars'} color={'black'} />
			</div>
	}
	return (
		<div className="test-manage__desc-item">
			<div>
				<h3>시험 정보</h3>
				<table>
				<thead>
					<tr>
						<th>이름</th>
						<th>생성자 Id</th>
						<th>신청 마감</th>
						<th>시작 시간</th>
						<th>종료 시간</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{test.name}</td>
						<td>{test.admin_id}</td>
						<td>{test.register_end}</td>
						<td>{test.start}</td>
						<td>{test.end}</td>
					</tr>
				</tbody>
			</table>
			</div>
			<div>
				<h3>시험 내용</h3>
				<p dangerouslySetInnerHTML={{ __html: test.content }} ></p>
			</div>
			<div>
				<h3>시험 문제</h3>
				{
					problems.length !== 0 ?
					<table>
					<thead>
						<tr>
							<th width="5%">No</th>
							<th width="5%">문제 Id</th>
							<th width="25%">이름</th>
							<th width="25%">입력</th>
							<th width="25%">출력</th>
							<th width="10%">테스트 케이스</th>
						</tr>
					</thead>
					<tbody>
						{
							problems.length !== 0 &&
							problems.map((problem, index) => 
								<TableProblem problem={problem} index = {index} />
							)
						}
					</tbody>
				</table> : <p>해당 시험 등록된 문제가 없습니다</p>
				}
			</div>
			<div>
				<ListUserContainer test = {test}  problems = {problems} listUser={listUser} />
			</div>
		</div>
	)
}
const TableProblem = ({index, problem}) => {
	const [viewTest, setViewTest] = useState(null)
	const handleClickViewTest = (problem) => {
		if(viewTest === null){
			setViewTest(problem)
		}else{
			setViewTest(null)
		}
	}
	return (
		<>
			<tr>
				<th>{index + 1}</th>
				<th>{problem.id}</th>
				<th>{problem.name}</th>
				<th>{problem.input}</th>
				<th>{problem.output}</th>
				<th onClick={() => handleClickViewTest(problem)}>보기</th>
			</tr>
			{
				viewTest && 
				<tr>
					<td colSpan="5" style={{padding: '10px'}}>
						<p>해당 문제 입출력 테이스 케이스</p>
						<table>
						<thead>
							<tr>
								<th>입력 예제</th>
								<th>출력 예제</th>
							</tr>
						</thead>
						<tbody>
							{
									viewTest.testcases.length !== 0 && 
									viewTest.testcases.map((testcase, idx) => 
									<tr>
										<td>{testcase.input_example}</td>
										<td>{testcase.output_example}</td>
									</tr>
									)
							}
						</tbody>
					</table>
					</td>
				</tr>
			}
	</>
	)
}

const ListUserContainer = ({listUser : propsListUser, test, problems}) => {
	const [listUser, setListUser] = useState([]);
	const [loadingMark, setLoadingMark] = useState(false);

	useEffect(() => {
		const { id } = test;
		let markAllResult = localStorage.getItem(`mark-all-result-${id}`)
		if(markAllResult && propsListUser.length !== 0){
			markAllResult = JSON.parse(markAllResult)
			const { id } = test;
			const { testId } = markAllResult;
			if(id === testId){
				const { submitCompileResult } = markAllResult;
				let listUserTemp = propsListUser
				for (let i = 0; i < submitCompileResult.length; i++) {
					const submitInfo = submitCompileResult[i];
					listUserTemp[i]['markInfo'] = submitInfo;
				}
				setListUser(listUserTemp)
			}else{
				setListUser(propsListUser)
			}
		}else{
			setListUser(propsListUser)
		}
	}, [propsListUser])


	const handleAllScore = async () => {
		try {
			setLoadingMark(true)
			const params = {
				testId : test.id,
				adminId: test.admin_id
			}
			const response = await testAPI.markAllUserMakeByTest(params)
			const { message, data, result } = response;
			if(result){
				const { id } = test;
				localStorage.setItem(`mark-all-result-${id}`, JSON.stringify(data))
				const { submitCompileResult } = data;
				let listUserTemp = listUser
				for (let i = 0; i < submitCompileResult.length; i++) {
					const submitInfo = submitCompileResult[i];
					listUserTemp[i]['markInfo'] = submitInfo;
				}
				setListUser(listUserTemp)
				setLoadingMark(false)
			}else{
				setLoadingMark(false)
				alert("서버에서 재첨 오류를 발생했습니다. 관리자 문의하세요.")
			}
		} catch (error) {
			alert('서버 통신 실패하여 채점 오류 발생합니다.')
			setLoadingMark(false)
		}
	}
	return (
		<div className="test-manage__desc-userlist">
			<h3>시험 참가자</h3>
				<div style={{marginBottom: '20px', textAlign: 'right'}}>
					<button onClick={() => handleAllScore()}> 전체 채점</button>
				</div>
				{
					listUser.length !== 0 &&
					<div className="test-manage__desc-userlist-table">
						<table>
								<thead>
									<tr>
										<th width="5%">No</th>
										<th width="5%">참여자 Id</th>
										<th width="25%">참여 시간</th>
										<th width="25%">제출 여부</th>
										<th width="20%">채점 결과</th>
										<th width="10%">제출 상세 보기</th>
									</tr>
								</thead>
								<tbody>
								{
									listUser.length !== 0 &&
									listUser.map((user, index) => 
										<TableUser testId = {test.id} user={user} index = {index} problems={problems} />
									)
								}
							</tbody>
						</table>
						{
							loadingMark && 
							<div className="mark-loading">
								<p>
									참가자가 제출이 많을 수록 채점 시간이 많이 소요됩니다.
									<div>
									<WrapperLoading type={'bars'} color={'white'} />
									</div>
									<button>전체 채점 취소</button>
								</p>
							</div>
						}
					</div>
				}
		</div>
	)
}

const TableUser = ({testId, user, index, problems}) => {
	const [viewUser, setViewUser] = useState(false)
	const handleClickViewUser = async (user) => {
		if(!viewUser){
			//해당 유저의 해당 시험에서 제출한거 가지고 옴
			const params = {
				test_id : testId,
				user_id : user.user_id,
			}
			const response = await testAPI.getProblemSubmitUser(params)
			const { data, result } = response;
			if(result){
				const { markInfo } = user;
				if(markInfo){
					const { submitResult  } = markInfo
					let dataTemp = data.map((data, index) => {
						let resultData = data;
						resultData['compile'] = submitResult[index]
						return resultData;
					})		
					setViewUser(dataTemp);
				}else{
					setViewUser(data)
				}
			}
		}else{
			setViewUser(null)
		}
	}
	const [theme, setTheme] = useState('white');
	const displaySubmitForUser = (submitResult) => {
		let result = ``;
		result = problems.map((problem, index) => {
			let submitCode = submitResult.filter((submit) => submit.problem_id === problem.id)
			if(submitCode.length === 0) {
				return (
				<>
					<tr>
						<th>{problem.id}</th>
						<td>미제출</td>
					</tr>
					<tr><td colSpan="2" style={{background: 'blue'}}></td></tr>
				</>
				)
			}
			const {  compile } = submitCode[0];
			const { language } = submitCode[0];
			return (
				<>
				<tr>
					<th>{problem.id}</th>
					<td>
						<ControlledEditor
						width="100%"
						height="500px"
						theme={theme}
						language={language}
						value={submitCode[0].code}
						loading={<WrapperLoading />}
					/>
					{/* // <pre className="prettyprint">
					// 		<code className = "language" dangerouslySetInnerHTML={{
					// 			__html: submitCode[0].code,
					// 		}}>
					// 	</code>
					// </pre> */}
					</td>
				</tr>
				<tr>
					<th>
							실행 결과
					</th>
						{
							compile ? 
							<td>
								<p>테스트 길이 {compile.testCasesLength}</p>
								<p>전체 테스트 통과 : {compile.isCorrect ? '통과' : '미통과'}</p>
								{
									<table>
									<thead>
										<tr>
											<th width="5%">No.</th>
											<th width="40%">등록한 테스트</th>
											<th width="40%" >컴파일 결과</th>
											<th width="10%" >Ret.</th>
										</tr>
									</thead>
									<tbody>
										{
											compile.testCasesResult.map((testcase,index) => {
												const { error } = testcase;
												let result = '';
												if(error){
													result = 
													<tr>
														<td>{index + 1}</td>
														<td colSpan="3">
															{error.slice(0, 200)}
														</td>
													</tr>
												}else{
													result = 
														<tr>
															<td>{testcase.index + 1}</td>
															{/* <td><pre className="print-readata" style={{background: '#ccc', width: 'max-content'}} >{`(${testcase.status.realData.length})`} = {testcase.status.realData}</pre></td>
															<td><pre className="print-compile" style={{background: '#ccc', width: 'max-content'}}>{`(${testcase.status.compileResult.length})`} = {testcase.status.compileResult}</pre></td> */}
															<td><textarea  className="print-readata" value={testcase.status.realData}  /></td>
															<td><textarea  className="print-compile" value={testcase.status.compileResult}/></td>
															<th style={testcase.status.compare ? {color: 'blue'} : {color: 'red'}}>{String(testcase.status.compare)}</th>
														</tr>

												}
												return result
											})
										}
									</tbody>
								</table>
								} 
							</td> :
							<td>
								<p>미 채점</p>
							</td> 
						}
				</tr>
				<tr><td colSpan="2" style={{background: 'blue'}}></td></tr>
			</>
			)
		})
		return result
	}
	const getMarkResult = (user) => {
		if(!user) return '미확인'

		const { final_submit, markInfo } = user;
		
		//재첨 완료
		if(markInfo){
			const { statusProblem } = markInfo;
			const { correctProblemCount , totalSubmit } = statusProblem;
			return `${correctProblemCount} \\ ${totalSubmit}`;
		}else{
			return '미채점'
		}

	}
	const handleMarkWithUser = async() => {
		try {
			const params = {
				testId : testId,
				userId : user.user_id,
			}
			const response = await testAPI.markWithuUser(params)
			const { result, data, message} = response;
			// if(result){
				// console.log(viewUser)
				const { submitCompileResult } = data;
				let viewUserTemp = viewUser;
				for(let i = 0; i < viewUserTemp.length; i++){
					const { problem_id } = viewUserTemp[i]
					let submitInfo = submitCompileResult.filter(submit => submit.problemId === problem_id)
					viewUserTemp[i]['compile'] = submitInfo[0];
				}
				setViewUser([]);
				setViewUser(viewUserTemp);
			// }else{
			// 	alert('서버에서 채점을 실패합니다.')
			// }
		} catch (error) {
			console.log(error)
			alert('서버 통신 실패합니다.')
		}
	}
	return (
		<>
			<tr>
				<th>{index + 1}</th>
				<th>{user.user_id}</th>
				<th>{user.join_time ? user.join_time : '미참여'}</th>
				<th>{user.final_submit_time ? user.final_submit_time : '미제출'}</th>
				<th>{getMarkResult(user)}</th>
				<th onClick={() => handleClickViewUser(user)}>보기</th>
			</tr>
			{
				viewUser && 
				<tr>
					<td colSpan="7" style={{padding: '10px', maxWidth: '1120px', overflow: 'auto'}}>
						<div style={{display: 'flex', alignItems:'flex-end', justifyContent: 'space-between'}}>
						<p>제출 정보</p>
						<button onClick={() => handleMarkWithUser()}>단일 채점</button>
						</div>
						<table>
						<thead>
							<tr>
								<th width="15%">문제</th>
								<th width="85%">출력 코드</th>
							</tr>
						</thead>
						<tbody>
							{
								displaySubmitForUser(viewUser)
							}
						</tbody>
					</table>
					</td>
				</tr>
			}
	</>
	)
}
export default ManageTest

