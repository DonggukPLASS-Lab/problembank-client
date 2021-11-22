import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import './style.scss';
import queryString from 'query-string';

const moment = require('moment');

class TestResultTable extends Component {


    handleClick = (problem_id) => {
			let { u_id } = queryString.parse(this.props.location.search)
    	this.props.history.push(`/answercheck?test_id=${this.props.test_id}&problem_id=${problem_id}&u_id=${u_id}`);
    }

    render() {
    	return (
    		<div className="tableContent">
    			<table className="table table-contribution">
    				<thead>
    					<tr>
    						<th width="5%">번호</th>
    						<th width="35%">문제</th>
    						<th width="15%">정오답</th>
    						<th width="10%">답안 확인</th>
    					</tr>
    				</thead>
    				<tbody>
    					{
    						this.props.results.map((item, index) => {
    							return (

    								<tr key={index}>
    									<td style={{textAlign: 'center'}}>{index + 1}</td>
    									<td style={{textAlign: 'center'}}>{item.problem_name}</td>
    									<td style={{textAlign: 'center'}}>
    										{
    											item.is_correct ? 'O' : 'X'
    										}
    									</td>
    									<td style={{textAlign: 'center'}}>
    										<button onClick={() => this.handleClick(item.problem_id)}>열람</button>
    									</td>
    								</tr>
    							);
    						})
    					}
    				</tbody>
    			</table>
    		</div>
    	);
    }
}

export default withRouter(TestResultTable);

