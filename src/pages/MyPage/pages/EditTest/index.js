import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './style.scss';
import testAPI from '../../../../apis/tests';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import moment from "moment";
import CKEditor from 'ckeditor4-react';
import queryString from 'query-string';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loading from '../../../../components/Loading/Loading';
import WrapperLoading from '../../../../components/WrapperLoading';

function EditTest(props) {
	
	const [loading, setLoading] = useState(true);
	const [examName, setExamName] = useState("");
	const [examDesc, setExamDesc] = useState("시험 설명 입력해주세요.");
	const [registeDate, setRegisteDate] = useState(new Date());
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	
	const [listProblems, setListProblems] = useState([])
	const [editProblem, setEditProblem] = useState(null);
	const [inputProblemForm, setInputProblemForm] = useState(false);
	const [task, setTask] = useState('add');
	
	const {id} = queryString.parse(props.location.search);
	useEffect(() => {
		const fetchDate = async () => {
			let params = {
				test_id : id
			}
			try {
				const response = await testAPI.getTestFullInfo(params)
				const { message, result} = response;
				if(result)
				{
					const { data } = response;
					const { name, content, start, end, register_end, problems, test_group } = data;
					setExamName(name);
					setExamDesc(content)
					setRegisteDate(new Date(register_end))
					setStartDate(new Date(start))
					setEndDate(new Date(end))
					setListProblems(problems)
					setLoading(false);
				}else{}
				const responseProblem = await testAPI.getTestProblems(params)
			} catch (error) {
				alert('시험 데이트 호출 시 오류를 발생합니다.')
				setLoading(true)
			}
		}
		fetchDate();
	},[id])

	const handleAddProblem = (data) => {
		setListProblems([...listProblems, data])
	}
	const handleRemoveProblem = (idx) => {
		if(window.confirm("문제를 삭제하시겠습니까?")){
			let listProblemsTemp = listProblems;
			listProblemsTemp[idx] = null;
			let newProblemList = listProblemsTemp.filter(item => item !== null)
			setListProblems(newProblemList)
		}
	}
	const handleEditExam = async () => {
		if(listProblems.length === 0){
			alert('경진대화 등록 시 최소 문제를 하나 등록해야 합니다.')
			return;
		}

		//날짜 체크해야함
		if(!examName || 
		!examDesc)
		{
			alert('입력값을 확인해주세요');
			return;
		}
		try {
			let registeDateTemp = moment(registeDate).format('YYYY-MM-DD HH:mm:ss');
			let startDateTemp = moment(startDate).format('YYYY-MM-DD HH:mm:ss');
			let endDateTemp = moment(endDate).format('YYYY-MM-DD HH:mm:ss');
			
			const currentTime = new Date(moment().format('YYYY-MM-DD HH:mm:ss')).getTime(); 
			let registeDateTempConvert = new Date(registeDateTemp).getTime();
			let startDateTempConvert = new Date(startDateTemp).getTime();
			let endDateTempConvert = new Date(endDateTemp).getTime();

			let params = {
				examName, examDesc, registeDate : registeDateTemp, startDate : startDateTemp, endDate : endDateTemp, listProblems, testId: id
			}
			if(currentTime < registeDateTempConvert && registeDateTempConvert < startDateTempConvert && startDateTempConvert < endDateTempConvert){
				const response = await testAPI.updateTest(params);
						if (response.result === true) {
						alert('시험을 수정하였습니다.');
						setExamName("")
						setExamDesc("")
						setRegisteDate(new Date())
						setStartDate(new Date())
						setEndDate(new Date())
						setListProblems([])
					}
			}else{
				alert('부적절한 시간을 설정하셨습니다. 현재시간, 신청마감일, 시작일, 종료일간 전후 관계를 확인해 주세요.')
			}
		} catch (error) {
			console.log(error)				
		}
	}
	if(loading){
		return (
			<div style={{ width: '100%' }}>
				<div className="test-info-container">
					<WrapperLoading type={'bars'} color={'black'} />
				</div>
			</div>
		)
	}
	const handleEditProblem = (idx) => {
		setTask('edit')
		const problem = listProblems[idx];
		setEditProblem({idx, problem});
		setInputProblemForm(true);
	}
	const handleEditProblemContainer = ( problem) => {
		const { idx } = editProblem;
		let listProblemsTemp = listProblems;
		listProblemsTemp[idx] = problem;
		setListProblems(listProblemsTemp)
		setInputProblemForm(false);
	}

	return (
		<div style={{ width: '100%' }}>
			<div className="test-info-container">
				<div id="content-header">
					<div>
						<h2>시험 수정</h2>
					</div>
				</div>
				<p style={{ marginBottom: '20px' }}>
					<i className="fa fa-pencil-square-o"></i> 시험 정보 입력
				</p>
				<div className="test-info">
					<div className="test-info__title">
						{/* <Loading  type={'bars'} color={'black'}/> */}
						시험 정보 <span style={{ color: 'red' }}>*</span>
					</div>
					<div className="test-info__content">
						{/* //시험명 */}
						<div className="test-info__content--name">
							<div>
								<label>시험명</label>
								<input
									type="input"
									id="name"
									value={examName}
									onChange={(e) => setExamName(e.target.value)}
								/>
							</div>
						</div>
						{/* // 시험날짜 */}

						<div className="test-info__content--date">
							<div>
								{/* <label>시험 날짜</label> */}
								<div className="date-container">
									<div>
										<span>마감일</span> 
										<DatePicker onChange={(date) => setRegisteDate(date)}  selected={registeDate} timeInputLabel="시간:" dateFormat="MM/dd/yyyy h:mm aa" showTimeInput />
									</div>
									<div>
										<span id="data-label">시작일</span>
										<DatePicker onChange={(date) => setStartDate(date)}  selected={startDate} timeInputLabel="시간:" dateFormat="MM/dd/yyyy h:mm aa" showTimeInput  />
									</div>
									<div>
										<span>종료일</span>
										<DatePicker onChange={(date) => setEndDate(date)}  selected={endDate} timeInputLabel="시간:" dateFormat="MM/dd/yyyy h:mm aa" showTimeInput />
									</div>
								</div>
							</div>
						</div>
						{/* 시험 설명 */}
						<div className="test-info__content--decs">
							<div>
									<label>시험 내용</label>
							</div>
							<CKEditor
								id="problem-desc"
								name="content"
								data={examDesc}
								config={{placeholder: "Placeholder text..."}} 
								onChange={(e) => setExamDesc(e.editor.getData())}
							/>
							<p style={{fontSize: '11px', color:'#ccc', fontStyle: 'italic', marginTop: '5px'}}>시험 응시 학생이 시험명을 클릭해서 시험에 대한 설명 내용을 확인 할 수 있습니다.</p>
						</div>
						<div>
						</div>
					</div>
				</div>
			</div>
				<div className="test-problem-row">
					<div className="test-problem-title">
							<p style={{ marginBottom: '20px' }}>
								<i className="fa fa-pencil-square-o"></i> 문제 정보
							</p>
					</div>
					<div className="test-problem-list">
						{
							listProblems.length !== 0 && 
							<div style={{marginBottom: '20px'}}>
								{
									<table>
										<thead>
											<tr>
												<th width={"10%"}>문제 번호</th>
												<th width={"50%"}>문제 이름</th>
												<th width={"40%"} colSpan={2}>작업</th>
											</tr>
										</thead>
											<tbody>
												{
														listProblems.map((problem, idx) => 
														<tr>
															<td>{idx + 1}</td>
															<td>{problem.name}</td>
															<th onClick={() => handleEditProblem(idx)}><i className="fa fa-pencil-square-o"/>{" "}수정</th>
															<th onClick={() => handleRemoveProblem(idx)}><i className="fa fa-trash-o"/>{" "}삭제</th>
														</tr>
														)
												}
										</tbody>
								</table>
								}
							</div>
						}
							<div>
								<Button variant="contained" color="success" onClick={() => {
									setTask('add');
									setInputProblemForm(!inputProblemForm)
									}}>문제 추가 <span style={{marginLeft: '10px'}}>{inputProblemForm ? <i className= "fa fa-angle-up" /> : <i className= "fa fa-angle-down" />}</span></Button>
							</div>
					</div>	
				</div>
				{
					inputProblemForm ?
					<ProblemContainer  
					handleEditProblem = {handleEditProblemContainer}
					handleAddProblem = {handleAddProblem} 
					task={task} 
					editProblem={editProblem} /> :
					""
				}
			<div className="test-create-btn">
				<Button variant="contained" color="primary" size="large" onClick={() => handleEditExam()}>시험 수정</Button>
			</div>
		</div>

	);
	// }
}
function ProblemContainer({handleAddProblem, handleEditProblem, task, editProblem }){
	
	const [name, setName] = useState('');
	const [content, setContent] = useState('');
	const [input, setInputExample] = useState('');
	const [output, setOutputExample] = useState('');
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		handleAddTestCase();
		setTimeout(() => {
			setLoading(false);
		}, 500);
	}, []);

	useEffect(() => {
		if(task === 'edit'){
			const {problem} = editProblem;
			let { name, content, input, output, testcases} = problem;
			if(testcases === undefined){
				testcases = problem.testCases;
			}
			setName(name);
			setContent(content);
			setInputExample(input);
			setOutputExample(output);
			setTestCases(testcases);
		}
	}, [task, editProblem]);

	const [testCases, setTestCases] = useState([
		{ input_example: '', output_example: '' },
	]);

	const handleTestCases = (idx, type, data) => {
		const _testCases = Object.assign([], testCases);
		_testCases[idx][type] = data;
		setTestCases(_testCases);
	};

	const handleAddTestCase = () => {
		const _testCases = Object.assign([], testCases);
		for (let i = 0; i < 9; i++) {
			_testCases.push({ input_example: '', output_example: '' });
		}
		setTestCases(_testCases);
	};

	const handleSubmitProblem = () =>{
		if (
			!name ||
      !content ||
      !input ||
      !output ||
      !testCases
		) {
			alert('입력값을 확인해주세요');
			return;
		}
		for (let i=0; i < testCases.length; i++) {
			if (!testCases[i].input_example || !testCases[i].output_example) {
				alert('테스트 케이스의 '+ (i+1) + '번째 입력값을 확인해주세요');
				return;
			}
		}

		if(testCases.length !== 10) {
			alert("테스트 케이스가 10개 입력해야 합니다.")
			return;
		}
		let data = { name, content, input, output, testcases : testCases }
		handleAddProblem(data)
		setName('');
		setContent('');
		setInputExample('');
		setOutputExample('');
		const _testCases = [];
		for (let i = 0; i < 10; i++) {
			_testCases.push({ input_example: '', output_example: '' });
		}
		setTestCases(_testCases);
	}

	const handlClickEditProblem = () => {
		if (
			!name ||
      !content ||
      !input ||
      !output ||
      !testCases
		) {
			alert('입력값을 확인해주세요');
			return;
		}
		
		for (let i=0; i < testCases.length; i++) {
			if (!testCases[i].input_example || !testCases[i].output_example) {
				alert('테스트 케이스의 '+ (i+1) + '번째 입력값을 확인해주세요');
				return;
			}
		}

		if(testCases.length !== 10) {
			alert("테스트 케이스가 10개 입력해야 합니다.")
			return;
		}
		let data = { name, content, input, output, testcases : testCases }
		handleEditProblem(data)
	}
	return (
		<div className="test-problem-container"  style={{margin: '10px 0'}}>
				<div style={{margin: '10px 0'}}>
					<h2>문제 정보 일력</h2>
				</div>
				<div className="problem-info">
					<div className="problem-info__title">
						문제 정보<span style={{ color: 'red' }}>*</span>
					</div>
					<div className="problem-info__content">
						<div className="problem-info__content--name">
							<div>
								<label>제목</label>
								<input
									type="input"
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
						</div>
						<div className="problem-info__content--decs">
							<div>
								<label>설명</label>
							</div>
							<CKEditor
								id="problem-desc"
								name="content"
								data={content}
								onChange={(e) => setContent(e.editor.getData())}
							/>
						</div>
					</div>
				</div>
				<div className="problem-info">
					<div className="problem-info__title">
						입력 정보<span style={{ color: 'red' }}>*</span>
					</div>
					<div className="problem-info__content--ioexample">
						<div>
							<label>입력 예제</label>
							<input
								type="input"
								placeholder="100이하의 정수"
								value={input}
								onChange={(e) => setInputExample(e.target.value)}
							/>
						</div>
						<div>
							<label>출력 예제</label>
							<input
								type="input"
								placeholder="최대값"
								value={output}
								onChange={(e) => setOutputExample(e.target.value)}
							/>
						</div>
					</div>
				</div>
				<div className="problem-info">
					<div className="problem-info__title">
						테스트 케이스 정보<span style={{ color: 'red' }}>*</span>
					</div>
					<div className="problem-info__content--testcase">
						<div className="list-testcase">
							<p>※테스트 케이스 정보를 입력해주세요.</p>
							<p style={{ fontSize: '11px', color: 'red' }}>첫번째부터 다섯번쨰의 입력과 출력 예제는 제공되는 테스트 케이스이고 나머지 입력/출력 예제들은 히든 테스트 케이스입니다.</p>
							<br /> <br />
						</div>

						<div className="list-testcase">
							<TestCasesInputs
								testCases={testCases}
								handleTestCases={handleTestCases}
							/>
						</div>
					</div>
				</div>
				<div className="problem-info__btn--insert">
					<button onClick={() => {
						if(task === 'edit'){
							handlClickEditProblem()
						}else{
							handleSubmitProblem()
						}
					}}>문제 {task === 'edit' ? '수정' : '등록'}</button>
				</div>
			</div>
	)
}
function TestCasesInputs({
	testCases,
	handleTestCases,
}) {
	return (
		<>
			{testCases.map(({ input_example, output_example }, idx) => {
				return (
					<>
						<div className="wrapper-input">
							<div>
								<label>입력 예제 {idx + 1}</label>
								<textarea
									type="input"
									value={input_example}
									onChange={(e) =>
										handleTestCases(idx, 'input_example', e.target.value)
									}
									name="input_example"
								/>
							</div>
							<div>
								<label>출력 예제 {idx + 1}</label>
								<textarea
									type="input"
									value={output_example}
									onChange={(e) =>
										handleTestCases(idx, 'output_example', e.target.value)
									}
									name="output_example"
								/>
							</div>
						</div>
					</>
				);
			})}
		</>
	);
}


export default EditTest;
