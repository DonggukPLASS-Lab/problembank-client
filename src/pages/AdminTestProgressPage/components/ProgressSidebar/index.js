import React, {useEffect} from 'react';
import './style.scss';
import {useHistory, useLocation} from 'react-router-dom';

function ProgressSidebar(props) {
	const history = useHistory();
	const location = useLocation();
	const test_id = props.test_id;

	function handleFeedbackClick() {
		history.push(`/test/adminprogress?test_id=${test_id}`);
	}

	function handleProblemEditClick() {
    	history.push(`/test/adminprogress/problemedit?test_id=${test_id}`);
	}
	return (
		<div className="Sidebar">
	    <ul className="Sidebar-list">
	        <li>
	            <div id="Sidebar1">
	                <button className={`buttonStyle accordion ${location.pathname === '/test/adminprogress' && 'active'}`} onClick={handleFeedbackClick}>피드백 목록</button>
	            </div>
	        </li>
	        {/* <li>
	            <div id="Sidebar2">
	                <button className={`buttonStyle accordion ${location.pathname === '/test/adminprogress/problemedit' && 'active'}`} onClick={handleProblemEditClick}>문제 수정</button>
	            </div>
	        </li> */}
	    </ul>
		</div>
	);
}

export default ProgressSidebar;
