import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {useAsync} from 'react-async';
import testAPI from '../../../../apis/tests';
import './style.scss';

async function getTestProblemsList({test_id}) {
	const response = await testAPI.getTestProblems({test_id});
	if (response.result === true) {
		return response.data;
	}
	throw new Error(response.data);
}

async function getTestProblemData({problem_id}) {
	const response = await testAPI.getTestProblemData({problem_id});
	if (response.result === true) {
		return response.data[0];
	}
	throw new Error(response.data[0]);
}

async function updateProblem({problemId, editData}) {
	const data = {
		problem_id: problemId,
		problemName: editData.name,
		problemContent: editData.content,
		input: editData.input,
		output: editData.output,
		testcases: editData.testcases,
	};

	const response = await testAPI.updateProblem(data);
	if (response.result === true) {
		alert('문제 수정이 완료되었습니다.');
		return;
	}
	throw new Error(response.message);
}

function ProblemEditPage({test_id}) {
	const {data, error} = useAsync({promiseFn: getTestProblemsList, test_id});
	const [selectedProblemId, setSelectedProblemId] = useState(undefined);

	useEffect(() => {
		if (data) {
			setSelectedProblemId(data[0].problem_id);
		}
	}, [data]);

	const handleChangeSelect = useCallback(
		(event) => {
			setSelectedProblemId(event.target.value);
		},
		[selectedProblemId],
	);

	if (error) return error.message;
	if (data) {return (
		<div className="progress__container">
			<div id="select-area">
				<select className="select_problem" id="select_problem" name="type" onChange={handleChangeSelect}>
					{
						data.map((item, index) => (
							<option key={index} label={item.name} value={item.problem_id}/>
						))
					}
				</select>
			</div>
			{selectedProblemId && <ProblemInputArea problemId={selectedProblemId} /> }
		</div>
	);}
	return '로딩중...';
}


function ProblemInputArea({problemId}) {
	const {data, error} = useAsync({
		promiseFn: getTestProblemData,
		problem_id: problemId,
		watch: problemId,
	});
	const [editData, setEditData] = useState(undefined);

	useEffect(() => {
		setEditData(data);
	}, [data]);


	const handleChangeData = useCallback(
		(event) => {
			const {name, value} = event.target;
			if (name.includes('testcases')) {
				const testCaseIndex = parseInt(name.split('-')[1], 10);
				const testCaseExpType = name.split('-')[2];

				setEditData({
					...editData,
					testcases: editData.testcases.map((testCase, index) => {
						if (index === testCaseIndex) {
							return {...testCase, [testCaseExpType]: value};
						}
						return testCase;
					}),
				});
			} else {
				setEditData({
					...editData,
					[name]: value,
				});
			}
		},
		[editData],
	);

	const handleSubmit = useCallback(
		(event) => {
			updateProblem({problemId, editData});
		},
		[problemId, editData],
	);

	if (error) return error.message;
	if (editData) {return (
		
		<div id="input-area">
			<p>문제 제목</p>
			<input
				id="problem-name"
				name="name"
				type="text"
				placeholder="문제 제목"
				onChange={handleChangeData}
				value={editData.name}
			/>
			<p>문제 정의</p>
			<input
				id="problem-define"
				name="content"
				type="text"
				placeholder="문제 정의"
				onChange={handleChangeData}
				value={editData.content}
			/>

			<p>입력</p>
			<input
				id="problem-input"
				name="input"
				type="text"
				placeholder="입력 조건"
				onChange={handleChangeData}
				value={editData.input}
				width={200}
			/>

			<p>출력</p>
			<input
				id="problem-output"
				name="output"
				type="text"
				placeholder="출력 조건"
				onChange={handleChangeData}
				value={editData.output}
			/>
			<div id="example-data">
				<div id="input-data">
					<p>입력 예제</p>
					{
						editData.testcases.map((item, index) => {
							return (
								<input
									name={`testcases-${index}-input_exp`}
									type="text"
									placeholder="입력 테스트케이스"
									value={item.input_exp}
									onChange={handleChangeData}
								/>
							);
						})
					}
				</div>
				<div id="output-data">
					<p>출력 예제</p>
					{
						editData.testcases.map((item, index) => {
							return (
								<input
									name={`testcases-${index}-output_exp`}
									type="text"
									placeholder="출력 테스트케이스"
									value={item.output_exp}
									onChange={handleChangeData}
								/>
							);
						})
					}
				</div>
			</div>
			<button onClick={handleSubmit}>수정</button>
		</div>
	);}

	return '로딩중...';
}

export default ProblemEditPage;
