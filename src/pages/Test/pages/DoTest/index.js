import React, {useEffect, useRef, useState} from 'react';
import './style.scss';
import {ControlledEditor} from '@monaco-editor/react';
import SampleCode from '../../../../constansts/SampleCode';
import {useDispatch, useSelector} from 'react-redux';
import queryString from 'query-string';
import testsAPI from '../../../../apis/tests';
import WrapperLoading from '../../../../components/WrapperLoading';
import Loading from '../../../../components/Loading/Loading';
import DetailProblemLayout from '../../../../layouts/DetailProblemLayout';
import {Consumer as ModalConsumer} from '../../../../components/Modal/createModalProvider';
import {REPORT_ERROR_MODAL} from '../../../../components/Modal/ModalProviderWithKey';

import Timer from '../../../../assets/images/timer.png';
import Button from '../../../../components/DesignComponent/Button';
import Dropup from '../../../../components/DesignComponent/Dropup';
import Toast from '../../../../components/DesignComponent/Toast';
import {debounce} from '../../components/Debounce';
import {Redirect, useHistory} from 'react-router-dom';
import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Popup  from '../../components/TestDisplay/Popup';
import Alert from '../../../../components/AlertSelect'
import { withRouter } from "react-router";
import CountingTime from '../../../../components/CountingTime/'

import io from 'socket.io-client';

let moment = require('moment'); // ?
const debounceRunner = debounce((action)=> action(), 4000);
function DoTest(props) {
	const history = useHistory();
	const [problems, setProblems] = useState();
	const [problem, setProblem] = useState({testcases: []});

	const [language, setLanguage] = useState('c');
	const [contentEditor, setContentEditor] = useState(SampleCode['c']);
	const [sourceCodes, setSourceCodes] = useState(); // 소스 코드 담기용 (problems: [{sourceCode, problem_id, language},...]) 형태
	const [submit, setSubmit] = useState(false);
	const [theme, setTheme] = useState('white');
	const [timer, setTimer] = useState(); // 시험 시칸 체크용
	const [startTimer, setStartTimer] = useState(); // 시험 시작 시간 체크용
	const [timeData, setTimeData] = useState({end: '', start: ''});

	const [time, setTime] = useState('before test'); // 시간 텍스트용
	const [showToast, setShowToast] = useState(false);
	const [message, setMessage] = useState('');

	const [loading, setLoading] = useState(true);
	const [errorState, setErrorState] = useState(false);
	const [errorMessage, setErrorMessage] = useState('에러 발생');

	const {test_id, index} = queryString.parse(props.location.search); // index는 0부터 문제 개수-1 까지
	const [prevIndex, setPrevIndex] = useState();
	const user = useSelector((state) => state.user);
	const [isOpenContent, setIsOpenContent] = useState(true);

	const [test, setTest] = useState(null);
	const [viewProblemPop, setViewProblemPop] = useState(false);

	//제출 버튼 
	const [modal, setModal]= useState(false);
	const togglePopup =()=> setModal(!modal);

	useEffect(() => {
		const fetchCheckTest =  async () => {
			let params = {
				test_id 
			}
			const response = await testsAPI.checkEnableJoinTest(params)
		}
	},[])

	useEffect(() => {
		if (!problems) {
			setTestList();
		} else if ((!problem.id || prevIndex !=index)&& !errorState) { // 문제 설정이 되어있지 않거나 문제의 인덱스가 변했을 때만
			// setPrevIndex(index);
			setTestProblem(problems[index].problem_id);
		}
	}, [index, problems, timeData, submit]);

	const handleEditorChange = (env, value) => {
		setContentEditor(value);
		handelSourceCodeChange(index, value);
	};

	const handelSourceCodeChange = (nextIndex, currentValue=false) => {
		// {problem_id: data.problem_id, language: "c", sourceCode: SampleCode["c"] }
		if (nextIndex == Number(index)) { // handleEditorChange에 의해서 코드가 변경될 때 마다 즉시 반영
			const changeCodes = sourceCodes.map((value, cIndex)=>{
				if (cIndex==nextIndex) { // 현제 문제에 대하여
					return {
						problem_id: value.problem_id,
						language: language,
						sourceCode: currentValue||contentEditor,
					};
				} else return value; // 그 이외의 문제에 대하여
			});
			setSourceCodes(changeCodes);
		} else { // 이전, 다음 또는 목록에 의한 버튼을 눌렀을 때 해당 문제로 언어와 소스코드 변경
			const changeCodes = sourceCodes.map((value, cIndex)=>{
				if (cIndex==nextIndex) { // 현제 문제에 대하여
					setLanguage(value.language);
					setContentEditor(value.sourceCode);
					return value;
				} else return value; // 그 이외의 문제에 대하여
			});
			setSourceCodes(changeCodes);
		}
	};
	const resetEditor = () => {
		setContentEditor(SampleCode[language]);
	};

	// // test content editor & problem
	// const onTest = async () => {
	// 	try {
	// 		setSubmit(true);
	// 		const problemId = problems[index].problem_id;
	// 		const {userData} = user;
	// 		const {data} = userData;
	// 		const params = {
	// 			sourceCode: contentEditor,
	// 			language,
	// 			problemId: Number(problemId),
	// 			userId: data.id,
	// 		};
	// 		const response = await testsAPI.testRun(params);
	// 		const { result: resResult, data : resData, message } = response
	// 		if(resResult && message === 'compile-successful') {
	// 			alert(`체점 결과 ${resData.correctCount} / ${resData.count}`);
	// 		}else if(!resResult && message === 'compile-fail'){
	// 			alert('문제 컴파일 시 오류를 발생합니다. 코드를 확인해주세요.');
	// 		}else{
	// 			alert('서버 응답 오류 발생합니다.')
	// 		}
	// 		setSubmit(false);

	// 	} catch (error) {
	// 		setSubmit(false);
	// 		alert('서버 오류입니다. 잠시 후 다시 시도해주세요.');
	// 		return 1;
	// 	}
	// };

	const onSubmit = async () => {
		Alert({
			title: '문제 제출',
			content: `문제를 제출했으면 수정 불가능합니다.`,
			btnAccept: '제출',
			btnReject: '거절',
			handleClickAccept: async () => {
				try {
					setSubmit(true);
					let params = {
						testId: test_id,
						problem: sourceCodes[index],
					};
					const response = await testsAPI.submit(params);
					const { result, message} = response;

					if(result && message  === 'submit-successful'){
						alert('재출 완료하였습니다.')
					}else if(!result && message === 're-submit'){
						alert('이미 제출하 였습니다.')
					}else{
						alert('제출 시 오류를 발행해서 제출 실패합니다.')
					}
					setSubmit(false);
				} catch (error) {
					setSubmit(false);
					alert('서버 오류입니다. 잠시 후 다시 시도해주세요.');
					console.log(error);
				}
			},
			handleClickReject: () => {},
		});
	};

	const handleSubmitFinal = async () => {
		Alert({
			title: '최종 제출',
			content: `최종 제출 하게 되면 답변을 다시 제출 못하고 퇴장합니다. 제출하시겠습니까?`,
			btnAccept: '제출',
			btnReject: '거절',
			handleClickAccept: async () => {
				try {
					let params = {
						testId: test_id,
						problemsCount: problems.length
					}
					const response = await testsAPI.submitFinal(params);
					const { result  } = response;
					if(result){
						props.history.push('/mypage/mytest')
					}
					console.log(response)
				} catch (error) {
					alert('서버 오류입니다. 잠시 후 다시 시도해주세요.');
					console.log(error);
				}
			},
			handleClickReject: () => {},
		});
	}

	// 추가적으로 시간 데이터까지 가져오기
	const setTestList = async () => {
		try {
			const params = {
				test_id: test_id,
			};
			//! 체크할 필요함
			const res = await testsAPI.getTestInfo(params);
			setTest(res.data)
			// 해당 시험을 테스트 출력함
			const response = await testsAPI.getTestProblems(params);
		
			if ( response.data.length === 0 ) {
				setErrorMessage('해당 테스트에 문제가 존재하지 않습니다.');
				setErrorState(true);
			}
			const result = response.data.map((data)=>{
				return {problem_id: data.problem_id, name: data.name};
			});
			result.sort(function(a, b) {return Number(a.problem_id)-Number(b.problem_id);});

			setProblems(result); // 배열 형태
			const codes = response.data.map((data)=>{
				return {problem_id: data.problem_id, language: 'c', sourceCode: SampleCode['c']};
			});
			codes.sort(function(a, b) {return Number(a.problem_id)-Number(b.problem_id);}); // 문제 아이디 별로 정렬
			setSourceCodes(codes);
		} catch (error) {
			alert('서버 오류입니다. 잠시 후 다시 시도해주세요.');
			console.log(error);
		}
	};

	const setTestProblem = async (id) => {
		try {
			const params = {
				problem_id: id,
			};
			const response = await testsAPI.getTestProblemData(params);
			setProblem(response.data[0]); // 객체 형태
			if (loading != false) {
				setLoading(false);
			}
		} catch (error) {
			alert('서버 오류입니다. 잠시 후 다시 시도해주세요.');
			console.log(error);
		}
	};

	const handleExamOut = async () => {
		Alert({
			title: '시험 퇴장',
			content: `시험 퇴장 시 답변을 제출했는지 확인해주세요.`,
			btnAccept: '퇴장',
			btnReject: '거절',
			handleClickAccept: async () => {
				props.history.push('/');
			},
			handleClickReject: () => {},
		});
	}
	const handleEndTime = async (time) => {
		const { start, end} = test
		let starTime = moment(start).format('YYYY-MM-DD h:mm:ss a')
		let endTime = moment(end).format('YYYY-MM-DD h:mm:ss a')
		if((time >= endTime)){
			alert('시험 종료되었습니다.')
			props.history.push('/');
		}else{}
	}
	if (errorState) {
		alert('error : ' + errorMessage);
		return <Redirect to={{pathname: '/test'}}/>;
	}

	if (loading) {
		return <Loading type={'bars'} color={'black'} />;
	}
	
	return (
		<DetailProblemLayout>
			<div className="problem__detail__test">
				<div className="problem__detail__test--content">
					<div className="tab__header">
						{/* <ul className="tab__header--content">
							<li>
								<img src={Timer} alt="timer"/>
								<p>{time}</p>
							</li>
						</ul> */}
						<div className="tab__header--outexam" onClick={() => handleExamOut()}>
							<i className="fa fa-sign-out" style={{transform: 'rotate(180deg)', marginRight: '5px'}} />시험 퇴장
						</div>
						<div className="tab__header--examinfo">
							<div style={{marginRight: '50px'}}>
								<p>시험명: {test && test.name}</p>
								<p>총 문제 수: {problems.length} </p>
							</div>
							<div className="tab__header--examinfo__time">
								<p className="exam-time">시험 시간 : {moment(test.start).format('YYYY-MM-DD h:mm:ss a')} ~ { moment(test.end).format('YYYY-MM-DD h:mm:ss a')}</p>
								<p className="current-time">현재 시간 : <CountingTime alertEndTime = {handleEndTime} /></p>
							</div>
						</div>
					</div>
					<div className="wrapper__content">
						<h3>{problem.id}. {problem.name}</h3>
						<div className="problem__infor">
							<div className="problem__infor--desc">
								<p className="problem__infor--title">문제</p>
								<span>
									<pre className="prettyprint" dangerouslySetInnerHTML={{__html: problem.content}}></pre>
								</span>
							</div>
							<div className="problem__infor--input">
								<p className="problem__infor--title">입력</p>
								<span>{problem.input}</span>
							</div>
							<div className="problem__infor--output">
								<p className="problem__infor--title">출력</p>
								<span>{problem.output}</span>
							</div>
							<div className="problem__infor--example">
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
															problem.testcases.map((testcase, idx) => 
															<tr>
																<td>{testcase.input_exp}</td>
																<td>{testcase.output_exp}</td>
															</tr>
															)
													}
												</tbody>
											</table>
								{/* <div className="problem__infor--inputexp">
									<p className="problem__infor--title">입력 예제</p>
									{
										problem.testcases.length !== 0 &&
                                            problem.testcases.map((testcase, idx) => <div><span className="exp">{testcase.input_exp}</span></div>)
									}
								</div>
								<div className="problem__infor--outputexp">
									<p className="problem__infor--title">출력 예제</p>
									{
										problem.testcases.length !== 0 &&
                                            problem.testcases.map((testcase, idx) => <div> <span className="exp">{testcase.output_exp}</span></div>)
									}
								</div>*/}
							</div> 
						</div>
					</div>
					<div className="tab__footer__dropup">
						{/* <div className="review__listproblem">
							<div className="review__listproblem--pop">
									<button onClick={() => setViewProblemPop(!viewProblemPop)}><i className="fa fa-th-list"/></button>
									<div>
									{
										problems.length !==0 && 
										problems.map((value, index)=>
										<button onClick={() => {handelSourceCodeChange(index); props.history.push(`/test/view?index=${Number(index)}&test_id=${test_id}`);}}>
											{problems[index].name}</button>)
									}
									</div>
							</div>
						</div> */}
						<div className="tab_footer__info">
							<p><span>안내:</span> 해당 문제 입력예제를 입력 들어가서 테스트하고 </p>
							<p><span>제출:</span> 각 문제를 실행하나고서 제출을 꼭 해야 인증됩니다. </p>
						</div>
						<div className="pre-next-problem">
							{
								problems.length !== 0 ?
									<>
										<button onClick={() => {handelSourceCodeChange(Number(index)- 1); props.history.push(`/test/view?index=${Number(index)- 1}&test_id=${test_id}`);}}
											disabled={index==0} >이전</button>&nbsp;
										<span>{Number(index)+1}/{problems.length}</span>&nbsp;
										<button primary onClick={() => {handelSourceCodeChange(Number(index)+ 1); props.history.push(`/test/view?index=${Number(index)+ 1}&test_id=${test_id}`);}}
											disabled={index == (problems.length-1)}>다음</button>
									</> :
									''

							}
						</div>
					</div>

				</div>
				<div className="problem__detail__test--vseditor">
					<div className="tab__header--editor">
						<ul>
							<li>
								<span>언어 </span>
								<select name="" id="" className="language" value = {language} onChange={(e) => {setLanguage(e.target.value); setContentEditor(SampleCode[e.target.value]);}}>
									<option value="c">C</option>
									<option value="cpp">C++</option>
									<option value="java">Java</option>
									<option value="python">Python</option>
								</select>
							</li>
						</ul>
					</div>
					<div className="wrapper__editor">
						{
							submit ?
								<div className="wrapper__editor--submit">
									<WrapperLoading />
								</div> : ''
						}
						<ControlledEditor
							width="100%"
							height="100%"
							theme={theme}
							language={language}
							value={contentEditor}
							onChange={handleEditorChange}
							loading={<WrapperLoading />}

						/>
					</div>
					<div className="tab__footer">
						<div className="tab__footer-info">
							<p><span>제출:</span> 작성된 코드를 제출합니다. 한 번 제출된 코드는 수정할 수 없습니다.</p>
							<p><span>최종 제출:</span> 최종 제출 버튼을 누르면 시험이 종료되며, 제출된 결과를 확인 할 수 있습니다.</p>
						</div>
						<div className="tab__footer-btn-group">
							<div className="tab__footer-btn-group-run">
								<Button distance test disabled={problem.is_submit} onPress={() => onSubmit()}>제출</Button>
							</div> 
							<div className="tab__footer-btn-group-submit" >
								<button onClick={() => handleSubmitFinal()} disabled={problem.is_test_finalsubmit} style={problem.is_test_finalsubmit === 1 ?  {opacity: '0.5'} : {}}>최종 제출</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			{showToast &&
            <Toast message={message} warning/>}
			
		</DetailProblemLayout>
		
	);
}


export default withRouter(DoTest);