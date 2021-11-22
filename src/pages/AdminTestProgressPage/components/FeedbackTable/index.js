import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import "./style.scss";
import testAPI from "../../../../apis/tests";
import Button from "../../../../components/DesignComponent/Button";
import { useHistory } from "react-router-dom";
// import { options } from "../../../../../../problembank-server/routes/tests";
const moment = require("moment");

class FeedbackTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "", // 작성한 내용임
      feedbacks: [], // feekbac 리스트
      select: null, // 선택한 학생
      listUser: [] // 유저 리스트
    };
  }

  handleChangeText(event) {
    event.preventDefault();
    this.setState({
      value: event.target.value,
    });
  }
 
  async handleSubmitText(event) {
    event.preventDefault();
    const { value, select, listUser } = this.state;
    const selectValue = listUser.find((user) => user.username === select)
    const params = {
      content: value,
      userId: selectValue.user_id, 
      testId: selectValue.test_id
    }
    const response = await testAPI.insertTestFeedback(params);
    const { result, data} = response;
    if(result){
      this.setState({ feedbacks: data})
    }
  }

  componentDidMount() {
    const fetchData = async () => {
      try {
        const responseListUser = await testAPI.getUserByTestId({
          test_id: this.props.test_id,
        })
        const { result, data} = responseListUser;

        
        if(result){
          this.setState({ 
            listUser: data,
            select: data[0].username
          })
        }
        const responseListFeedback = await testAPI.getTestFeedback({
          test_id: this.props.test_id,
        });
        const { result: resultFeedback, data: dataFeedback } = responseListFeedback;
        if(resultFeedback){
          this.setState({ feedbacks: dataFeedback})
        }
      } catch (error) {
        alert("API를 호출 시 오류 발생합니다.")
      }
    }
    fetchData()
  }
  
  render() {
    const { listUser, feedbacks } = this.state;
    return (
      <div>
      <div onClick={() => this.props.history.goBack()}>
			<i class="fa fa-arrow-left"></i>
      </div>
        <table className="table table-contribution">
          <thead>
            <tr>
              <th width="5%">번호</th>
              <th width="70%">내용</th>
              <th width="10%">작성자</th>
              <th width="15%">작성일</th>
            </tr>
          </thead>
          <tbody>
            { 
            feedbacks.length !== 0 && feedbacks.map((item, index) => {
              return (
                <tr key={index}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td>{item.content}</td>
                  <td style={{ textAlign: "center" }}>{item.author_name}</td>
                  <td>{moment(item.created).format("YYYY-MM-DD")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {this.state.feedbacks.length == 0 ? (
          <p className="empty-feedbacks">도착한 피드백이 없습니다.</p>
        ) : null}
        <div className="feedbackBox">
          <h3>피드백 작성</h3>

          <div className="selectStudent">
            <label>작성자 선택하시오 </label>
            <select
              value={this.state.select}
              onChange={ (e) => this.setState({ select: e.target.value })}
            >
              {listUser.length !== 0 && listUser.map((option) => 
                  <option value={option.username} key={option}>
                    {option.username}
                  </option>
             )}
            </select>
          </div>

          <div className="writeFeedback">
            <textarea
              id="Feedback"
              value={this.state.value}
              name="Feedback"
              rows="10 "
              cols="100"
              onChange={(e) => this.handleChangeText(e)}
              placeholder="피드백 입력하세요."
            />
          </div>

          <div className="sendFeedback">
            <Button contest onPress={(event) => this.handleSubmitText(event)}>전송</Button>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(FeedbackTable);
