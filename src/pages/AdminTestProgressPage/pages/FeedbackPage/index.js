import React from 'react';
import FeedbackTable from '../../components/FeedbackTable';

function FeedbackPage(props) {
	return (<div>
		<FeedbackTable test_id={props.test_id}/>
	</div>);
}

export default FeedbackPage;
