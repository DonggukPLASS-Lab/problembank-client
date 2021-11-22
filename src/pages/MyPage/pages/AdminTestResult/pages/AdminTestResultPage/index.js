import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useAsync } from 'react-async';
import './style.scss';
import AdminResultTable from '../../components/AdminResultTable';
import testAPI from '../../../../../../apis/tests';
import Text from '../../../../../../components/DesignComponent/Text';
import Button from '@material-ui/core/Button';
import { IoIosArrowBack } from "react-icons/io";
import Popup from '../../../../../Test/components/TestDisplay/Popup';
import { ListItemAvatar, TableCell, TableRow } from '@material-ui/core';
import TestDisplay from '../../../../../Test/components/TestDisplay';


function AdminTestResultPage(props) {

	let history = useHistory();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedTestId, setSelectedTestId] = useState(undefined);
	const [totalList, setTotalList] = useState([]);
	const [refresh, setReFresh] = useState(true);


	const togglePopup = () => {
		setIsOpen(!isOpen);
	};
	const handleChangeSelect = useCallback(
		(event) => {
			setSelectedTestId(event.target.value);
		},
		[selectedTestId],
	);
	const handleDeleteExam = async (testId) => {
		try {
			if (window.confirm('시험 삭제하시겠습니까? 시험을 삭제하면 시험과 관련된 모든 정보를 다 삭제하게 됩니다.')) {
				const params = {
					test_id: testId,
				};
				const response = await testAPI.cancelReg(params);
				if (response.result === true) {
					// window.location.reload();
					// alert("시험이 삭제되었습니다.");
					setReFresh(!refresh)
				}
			} else {
				return '';
			}
		} catch (error) {
			alert("서버 오류입니다. 잠시 후 다시 시도해주세요. 3");
		}
	};
	useEffect(() => {
		const fetchData = async () => {
			const response = await testAPI.getAdminTestList();
			const { data } = response;
			setTotalList(data)
		}
		fetchData()
	}, [refresh])

	return (
		<div id="content">
			<div id="content-header">
				<div>
					<h2>시험 조회</h2>
				</div>
			</div>
			{
				totalList.length !== 0 ?
					<div id="content-table">
						<table className="table table-contribution">
							<thead>
								<tr>
									<th width="3%">번호</th>
									<th width="40%">시험명</th>
									<th colSpan={2}>시험 작업</th>
									{/* <th width="5%">채점</th> */}
									{/* <th width="5%">평균</th> */}
									{/* <th width="5%">Score</th> */}
								</tr>
							</thead>
							<tbody> {selectedTestId && <AdminResultTable test_id={selectedTestId} ></AdminResultTable>}
								{
									totalList.length !== 0 && totalList.map((test, idx) =>
										<RowTest
											test={test} key={idx} id={idx}
											refresh={refresh}
											setRefresh={() => { setReFresh(!refresh) }}
											handleDeleteExam={handleDeleteExam}
											handleEditExam={(testId) => props.history.push(`/mypage/mytest/editest?id=${testId}`)}
										/>
									)
								}
							</tbody>
						</table>
					</div> :
					<div style={{ textAlign: 'center', borderTop: '1px solid #ccc', paddingTop: '10px' }}> 등록된 문제가 없습니다.</div>


			}
		</div>
	);
}
const RowTest = ({ test, id, setRefresh, handleDeleteExam, handleEditExam }) => {
	let titleColScore = test.avg_score ? '채점 완료' : '채점';

	const handleScoreTest = async () => {
		if (titleColScore === '채점 완료') {

			alert("선택한 시험을 채점을 완료되었습니다.")
			return;
		}
		let params = {
			testId: test.id
		}
		const response = await testAPI.scoreTest(params);
		const { data } = response;
		const { sum_correct, sum_wrong } = data;
		if (!sum_correct && !sum_wrong) {
			alert('해당 시험에서 제출한 학생이 없습니다.')
		} else {
			setRefresh()
		}

	}

	const DisplayContent = ({ content, testid }) => {
		const [isOpenContent, setIsOpenContent] = useState(false);
		return (

			<p onClick={() => setIsOpenContent(!isOpenContent)}>
				{content}
				{isOpenContent && (
					<PopupScoreResult testid={testid} handleClose={() => setIsOpenContent(false)} />
				)}
			</p>
		)
	}

	return (

		<tr>
			<th width="5%">{id + 1}</th>
			<td width="55%"><DisplayContent content={test.name} testid={test.id} /></td>
			<th width="10%" onClick={() => handleEditExam(test.id)}><i className="fa fa-pencil-square-o" />{" "}수정</th>
			<th width="10%" onClick={() => handleDeleteExam(test.id)}><i className="fa fa-trash-o" />{" "}삭제</th>
		</tr>
	)
}

// const [rows] = await db.query(sql.tests.selectTestUsersByTestId, [testId])
//         for (let i = 0; i < rows.length; i++) {
//             const { author_id } = rows[i]
//             const [name] = await db.query(sql.tests.selectUserNameById, [author_id])
//             rows[i]["author_name"] = name[0].username;
// 		}

const PopupScoreResult = (props) => {
	const { handleClose, testid, id, list, content } = props;
	const [loading, setLoading] = useState(false);
	const [userList, setUserList] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				let params = {
					test_id: testid,
				}
				const responseListUser = await testAPI.getUserByTestId(params)
				const { data, message, result } = responseListUser;
				if (result) {
					setUserList(data);
					setLoading(true);
				}
			} catch (error) {
				alert("서버 통신 실패합니다.")
			}

		}
		fetchData();
	}, [testid, id, content])

	if (!loading) {
		return (
			<div className="popup-box">
				<div className="box">
					<span className="close-icon" onClick={handleClose}>x</span>
					<div style={{ textAlign: 'center' }}>Loading...</div>
				</div>
			</div>
		);
	}
	return (
		<div className="popup-box">
			<div className="box">
				<h2>시험 결과</h2>
				<span className="close-icon" onClick={handleClose}>x</span>
				<table class="table">
					<thead>
						<tr>
							<th width={"10%"}>No. </th>
							<th width={"40%"}>유저 아이디</th>
							<th width={"40%"}>학생 점수</th>
						</tr>
					</thead>
					<tbody>
						{
							userList.length !== 0 && userList.map((user, index) => (
								<tr>
									<td scope="row" align="center">{index + 1}</td>
									<td align="center">{user.username}</td>
									<td align="center">{user.correct}</td>
								</tr>
							))
						}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default AdminTestResultPage;
