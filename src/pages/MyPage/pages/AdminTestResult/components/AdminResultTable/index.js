import React, {useState, useCallback, useEffect} from 'react';
import {useAsync} from 'react-async';
import {withRouter} from 'react-router-dom';
import './style.scss';
import styled from 'styled-components';
import testAPI from '../../../../../../apis/tests';
import {Pie, Doughnut} from 'react-chartjs-2';


async function getResultAdmin({test_id}) {
	const response = await testAPI.getResultAdmin({test_id});
	if (response.result === true) {
		return response.data;
	}
	throw new Error(response.data);
}

function AdminResultTable(props) {
	const {test_id} = props;

	const {data, error} = useAsync({
		promiseFn: getResultAdmin,
		test_id: test_id,
		watch: test_id,
	});

	const [statePie, setStatePie]= useState({});
	const [stateTest, setStateTest]= useState({});

	useEffect(() => {
		const fetchData= async()=>{
			const res= await testAPI.getResultAdmin({test_id});
			const {data} = res;
			const {test} = data;
	
			let testProblem ={
				labels:['맞는 문제', '틀린 문제'],
				datasets:[
					{
						label: 'Rainfall',
						backgroundColor: [
							'#1FA67A',
							'#6800B4',
						],
						hoverBackgroundColor: [
							'#1FA000',
							'#35014F',
						],
						//Not bringing the exact date 
						// data: [test.isCorrectTest, test.noCorrectTest],
					},
				],
			};
			setStatePie(testProblem);
		};
		fetchData();
	}, [])

	// const Wrapper = styled.div
	if (error) return error.message;
	if (data) {return (
		// <div className="tableContent">
		// 	<table className="table table-contribution">
		// 		<thead>
		// 			<tr>
		// 				<th width="5%">번호</th>
		// 				<th width="35%">학생 이름</th>
		// 				<th width="20%">맞은 문제 수</th>
		// 				<th width="20%">틀린 문제 수</th>
		// 				<th width="20%">답안 확인</th>
		// 			</tr>
		// 		</thead>
		// 		<tbody>
		// 			{
		// 				data.map((item, index) => {
		// 					return (
		// 						<tr key={index}>
		// 							<td style={{textAlign: 'center'}}>{index + 1}</td>
		// 							<td style={{textAlign: 'center'}}>{item.user_name}</td>
		// 							<td style={{textAlign: 'center'}}>{item.correct}</td>
		// 							<td style={{textAlign: 'center'}}>{item.wrong}</td>
		// 							<td style={{textAlign: 'center'}}>
		// 								{
		// 									item.applied == 1 ? (
		// 										<button onClick={() => props.history.push(`/detailedresult?test_id=${test_id}&u_id=${item.user_id}`)}>열람</button>
		// 									) : (
		// 										<button2>열람</button2>
		// 									)

		// 								}</td>
		// 						</tr>
		// 					);
		// 				})
		// 			}
		// 		</tbody>
		// 	</table>
		// 	<Wrapper>
		// 	<div className="chart">
		// 		<Pie data={statePie} options={{title:{display:true, text: "Test Results", fontSize: 15}, 	legend: {
		// 					display: true,
		// 					position: 'left',
		// 				},}}></Pie>
		// 	</div>
		// 	</Wrapper>

		// </div>
		""
		
		
	);}
	
	return '로딩중...';
}
const Wrapper = styled.div`
    .chart{
        border-bottom: 5px solid #ccc;
        justify-content: space-between;
        display: flex;
        padding: 5px;
        /* border: none; */
    }
    .progress__content{
        padding: 10px 20px;
        background: #F5F5F5;
        display: flex;
        justify-content: space-between;
    }
`;

export default withRouter(AdminResultTable);

