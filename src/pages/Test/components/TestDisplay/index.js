import React, { PureComponent, useState, useEffect } from "react";
import Text from "../../../../components/DesignComponent/Text";
import Heading from "../../../../components/DesignComponent/Heading";
import Button from "../../../../components/DesignComponent/Button";
import InlineList from "../../../../components/DesignComponent/InlineList";
import "./style.scss";
import { withRouter } from "react-router-dom";
import moment from "moment";
import problems from "./problems";
import { useHistory, useLocation } from "react-router-dom";
import {useSelector} from 'react-redux';
import Popup from "./Popup";
import styled from "styled-components";
import testsAPI from "../../../../apis/tests";
// import Warper from './Warper';
// import Popup from 'reactjs-popup';


moment.locale('ko');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');
function TestDisplay(props) {
  const {
    setReload,
    totalList
  } = props;
  const user = useSelector((state) => state.user);
  const history = useHistory()
  const { userData } = user;
  const { roleId } = userData;
  if(user === null) return;
  //Teacher
  if( roleId === 1){
    return <DisplayTableForTeacher totalList = {totalList}  history={history} setReload={setReload}/>
  }else {
    return <DisplayTableForStudent totalList = {totalList} history={history} setReload={setReload}/>
  }
}

const handleTimestamp = (timestamp) => {
  const ltArray = timestamp.split(' ');
  ltArray[1] === 'AM' ? ltArray[1] = '오전' : ltArray[1] = '오후';
  return ltArray[1] + '\n' + ltArray[0];
};

const DisplayTableForStudent = ({totalList, history, setReload}) => {
  const [examList, setExamList] = useState([]);  
  useEffect(() => {
    setExamList(totalList)
  }, [totalList])

  if(totalList.length === 0) return "";

  const handleRegist = async (testId) => {
    try {
      if(testId === null) return;
      const params = {
        test_id: testId,
      };
      const response = await testsAPI.regTest(params);
      const { result, message } = response;
      if (result &&  message === '시험 신청 성공함') { 
        alert("시험 신청 완료되었습니다. 마이 페이지에서 확인하세요.");
        const response = await testsAPI.getAllTestDataNormalUser();
        const result = response.data;
        setExamList(result);
      }else{
        alert("시험 신청 실패합니다.");
      }
    } catch (error) {
      alert("서버 오류입니다. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
  <div>
    <div style={{textAlign:'right'}}>
      <p style={{fontSize: '14px', fontStyle: 'italic', color: '#ccc' }}>시험명 클릭 시험 내용을 자세하게 확인할 수 있습니다.</p>
    </div>
    <table className="table table-contribution" style={{cursor: 'none'}}>
      <thead>
        <tr>
        <th width="3%">번호</th>
          <th width="40%">제목</th>
          <th width="10%">신청 마감일</th>
          <th width="10%">시험 시작</th>
          <th width="10%">시험 종료</th>
          <th width="10%">신청 여부</th>
        </tr>
      </thead>
      <tbody>
          {
            examList.map((item, idx )=> {  
              const { examState, in_entry } = item;
              let titleResultButton = '';

              let styled = {
                color: 'white',
              }
              if(in_entry){
                titleResultButton = '신청 완료';
                styled.background = '#017370';
              }else if(examState.label === 'progressing' || examState.label ==='future'){
                titleResultButton = '신청 마감';
                styled.background = 'blue';
              }else if (examState.label === 'end'){
                titleResultButton = '시험 종료';
                styled.background = 'red';
              }else if(examState.label === 'apply'){
                titleResultButton = '신청 가능';
                styled.background = 'green';
              }

              return (
              <tr key={idx}>
                <th>{idx + 1}</th>
                <DisplayContent content={item.name} viewContent={item.content} />
                <th>{item.register_end}</th>
                <th>{item.start}</th>
                <th>{item.end}</th>
                <th style={styled}>
                  <input type="button" value={titleResultButton} onClick={() => { 
                    if(in_entry){
                      alert("이미 신청한 시험 입니다. 마이 페이지에서 확인하세요.");
                    }
                    else if(examState.label === 'end' || examState.label === 'progressing' || examState.label === 'future')
                    {
                      alert('시험 신청일이 지났습니다.')
                    }else {
                      handleRegist(item.id)
                    }}}/>
                </th>
              </tr>
              )
            }
              )
          }
      </tbody>
    </table>
  </div>
  )
}
const DisplayContent = ({content, viewContent}) => {
  const [isOpenContent, setIsOpenContent] = useState(false);
  return (
  <td onClick={() => setIsOpenContent(!isOpenContent)} className="exam-info">
      <span dangerouslySetInnerHTML={{__html: content }}/>
      {isOpenContent && (
          <Popup content={viewContent} handleClose={() => setIsOpenContent(false)} />
        )}
  </td>
  )
}

const DisplayTableForTeacher = ({totalList, history, setReload}) => {
  const feedbackRoute = (testId) => {
    let path = `/test/adminprogress?test_id=${testId}`;
    history.push(path);
  };
  if(totalList.length === 0) return "";
  return (
  <div>
    <div style={{textAlign:'right'}}>
      <p style={{fontSize: '14px', fontStyle: 'italic', color: '#ccc' }}>시험명 클릭 시험 내용을 자세하게 확인할 수 있습니다.</p>
    </div>
    <table className="table table-contribution">
      <thead>
        <tr>
          <th width="3%">번호</th>
          <th width="40%">제목</th>
          <th width="10%">신청 마감일</th>
          <th width="10%">시험 시작</th>
          <th width="10%">시험 종료</th>
          <th width="10%">시험 상태</th>
        </tr>
      </thead>
      <tbody>
          {
            totalList.map((item, idx )=> {
              const { examState } = item;
              let styled = {
                color: 'white',
              }
              styled.background = examState.label === 'progressing' ? 'blue' : examState.label === 'end' ? 'red' : 'green';
              return (
              <tr key={idx}>
                <th>{idx + 1}</th>
                <DisplayContent content={item.name} viewContent={item.content} />
                <th>{item.register_end}</th>
                <th>{item.start}</th>
                <th>{item.end}</th>
                <th style={styled}>{examState.title}</th>
              </tr>
              )
            }
              )
          }
      </tbody>
    </table>
  </div>
  )
}

export default withRouter(TestDisplay);
