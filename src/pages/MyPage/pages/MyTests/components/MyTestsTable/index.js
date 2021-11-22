import React, {Component, useState} from 'react';
import {Link, withRouter} from 'react-router-dom';
// import { useHistory } from "react-router-dom";
import Popup from '../../../../../Test/components/TestDisplay/Popup';
import './style.scss';
import testAPI from '../../../../../../apis/tests';
import moment from 'moment';
moment.locale("ko");

class MyTestsTable extends Component {
	constructor(props){
		super(props);
	
	this.goBack=  this.goBack.bind(this);
	}
	goBack(){
		this.props.history.goBack();
	}
	//입장기록이 했으면 참여 안됨
	handleJoinTest = async (testId) => {
			let params = {
				testId
			}
			const response = await testAPI.joinExam(params);
			const { result } = response;
			if(result){
				this.props.history.push(`/test/view?index=0&test_id=${testId}`)
			}
	}
	checkTestJoin = (testId) => {
		let resultCheck = false;
		const fetchData = async () => {
			let params = {
				testId
			}
			const response = await testAPI.checkJoinWithTestId(params);
			const { result, message} = response;
			if(result && message === 'no-join'){
				resultCheck = false;
			}else{
				resultCheck = true;
			}
		}			
		fetchData();
		return resultCheck;
	}
	DisplayContent = ({content}) => {
		const [isOpenContent, setIsOpenContent] = useState(false);
		return (
		<td onClick={() => setIsOpenContent(!isOpenContent)}>
			{content}
			{isOpenContent && (
				<Popup content={content} handleClose={() => setIsOpenContent(false)} />
			)}
		</td>
		)
	}
	handleTimestamp = (timestamp) => {
		const ltArray = timestamp.split(' ');
		ltArray[1] === 'AM' ? ltArray[1] = '오전' : ltArray[1] = '오후';
		return ltArray[1] + '\n' + ltArray[0];
	};
	render() {

		return (
			<div>
	    <div className="tableContent">

				<table className="table table-contribution">
					<thead>
						<tr>
							<th width = "3%">번호</th>
							<th width = "30%">시험명</th>
							{/* <th width = "10%">시험 내용</th> */}
							<th width = "10%">시험 시작일</th>
							<th width ="10%">시험 종료일</th>
							<th width = "5%">시험 응시</th>
							<th width = "5%">시험 취소</th>
						</tr>
					</thead>
					<tbody>
						{
							this.props.testLists.map((item, index) => {
								// let checkJoin = this.checkTestJoin(item.test_id);
								let checkFinalSubmit = false;
								const { final_submit_time} = item
								if(final_submit_time){
									checkFinalSubmit = true
								}else{
									checkFinalSubmit = false;
								}

								const startDate = moment(item.start).format('MM/DD/YYYY HH:mm:ss');
								const endDate = moment(item.end).format('MM/DD/YYYY HH:mm:ss');
								const currentTime = moment().locale('ko').format('MM/DD/YYYY HH:mm:ss');


								let currentTimeConvert = new Date(currentTime).getTime(); 
								let startDateTempConvert = new Date(startDate).getTime();
								let endDateTempConvert = new Date(endDate).getTime();

								// const startDateTime = `${moment(item.start).format('MM/DD/YYYY')} ${this.handleTimestamp(moment(item.start).utc().format('LT'))}`; 
								// const endDateTime = `${moment(item.end).format('MM/DD/YYYY')} ${this.handleTimestamp(moment(item.end).utc().format('LT'))}`; 
								return (
									<tr key = {index}>
										<th>{index+1}</th>
										<td>{item.test_name}</td>
										{/* 시험을 등록할때 등록한 시간과 종료시간을 같이 DB에 저장하고, 시험목록을 조회할때 DB에서 등록한 시간과 종료 시간을 같이 꺼내와서 클라이언트쪽에 출력*/}
										<th>{startDate}</th>
                		<th>{endDate}</th>
										<th style={checkFinalSubmit ? {background: 'blue'} : {background: 'green'}}> 
											<input disabled={checkFinalSubmit ? true : false} type="button" value={checkFinalSubmit ? '제출 완료' : '입장'} onClick={
												() =>{
													if(currentTimeConvert < startDateTempConvert){
														alert(`시험 시작 시간이 ${startDate} 입니다. 이 후에 입장 가능합니다.`);
													}else if(currentTimeConvert >= endDateTempConvert){
														alert(`시험 이미 종료 되었습니다. 입장 불 가능합니다.`);
													}else if(checkFinalSubmit){
															alert(`해당 시험을 답변을 이미 제출하였으니, 입장 불가능합니다.`)
													}else{
														this.handleJoinTest(item.test_id)
													}
												}}/>
										</th>
										<th style={{background: 'red'}}>
											<input type="button" value={item.is_exam || item.is_applied ? '취소 불가능' : '취소'} onClick={() => this.props.handleClick(item.test_id)} />
										</th>
									</tr>
								);
							})
						}
					</tbody>
				</table>
			</div>
			</div>
		);
		
	}
}
export default withRouter(MyTestsTable);
