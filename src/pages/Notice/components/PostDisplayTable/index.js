import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import './style.scss';
let moment = require('moment');

function ProblemDisplayTable(props) {
	const {posts} = props;
	console.log(posts);
	return (
		<table className="table table-contribution">
			<thead>
				<tr>
					<th width = "5%">번호</th>
					<th width = "45%">제목</th>
					<th width = "10%">조회수</th>
					<th width = "10%">작성일</th>
				</tr>
			</thead>
			<tbody>
				{
					posts.map((item, index) => {
						return (
							<tr key = {index} onClick={() => props.history.push(`/notice/view?id=${item.id}`)}>
								<th>{item.id}</th>
								<td>{item.title}</td>
								<th>{item.view}</th>
								<th>{moment(item.created).format('YYYY-MM-DD')}</th>
							</tr>
							
						);
					})
				}
			</tbody>
		</table>
	);
}
export default withRouter(ProblemDisplayTable);

