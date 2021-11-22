import React, {useEffect, useRef, useState} from 'react';
import './style.scss';
import {ControlledEditor} from '@monaco-editor/react';
import SampleCode from '../../../../constansts/SampleCode';
import {useDispatch, useSelector} from 'react-redux';
import queryString from 'query-string';
import {getPostData} from '../../../../_actions/postAction';
import AdminPostAPI from '../../../../apis/admin/post';
import projectsAPI from '../../../../apis/projects';
import posts from '../../../../apis/posts';
import WrapperLoading from '../../../../components/WrapperLoading';
import Loading from '../../../../components/Loading/Loading';
import DetailPostLayout from '../../../../layouts/DetailPostLayout';
import io from 'socket.io-client';
let moment = require('moment');
function DetailProblem(props) {
	const [posts, setProblems] = useState([]);
	const [post, setProblem] = useState({});
	const {postsAllData} = useSelector((state) => state.problem);

	const [language, setLanguage] = useState('c');
	const [contentEditor, setContentEditor] = useState(SampleCode['c']);
	const [submit, setSubmit] = useState(false);
	const [theme, setTheme] = useState('white');

	const [postStatus, setProblemStatus] = useState(null);
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(true);

	const {id} = queryString.parse(props.location.search);
	const user = useSelector((state) => state.user);
	const {userData} = user;

	useEffect(() => {
		if (!id) {
			props.history.push('/');
		}

		if (postsAllData) {
			const {data} = postsAllData;
			const [post] = data.filter((element) => Number(element.id) === Number(id));
			if (post) {
				setProblem(post);
				setProblems(data);
				setLoading(false);
			}
		} else {
			dispatch(getPostData()).then((response) => {
				const {data} = response.payload;
				const [post] = data.filter((element) => Number(element.id) === Number(id));
				if (post) {
					setProblem(post);
					setProblems(data);
					setLoading(false);
				}
			});
		}

		(async () => {
			const {userData} = user;
			const {data} = userData;

			let params = {
				userId: data.id,
				postId: id,
			};

			//const response = await posts.getStatusPost(params);
			//setProblemStatus(response.data[0]);
		})();
	}, [id]);

	const handleCopyURL = () => {
		let dummy = document.createElement('input');
		let text = window.location.href;
		document.body.appendChild(dummy);
		dummy.value = text;
		dummy.select();
		document.execCommand('copy');
		document.body.removeChild(dummy);
		alert('링크가 복사 되었습니다.');
	};

	const handleDelete = async () => {
		try {
			let post = {
				id
			};
			const response = await AdminPostAPI.deletePost(post);
			const {result, message, data} = response;
			if (result) {
				alert(message);
			} else {
				alert(message);
			}
		} catch (error) {
			console.log(`Delete post error ${error}`);
		}
		props.history.push('/notice')
	}

	let indexOf = 0;
	posts.map((p, idx) => {
		if (p.id === post.id) {
			indexOf = idx;
		}
	});
	return (
		<DetailPostLayout>

			<div className="problem__detail">
				<div className="problem__detail--content">
					<div className="wrapper__content">
						{
							loading ? <WrapperLoading type={'bars'} color={'black'} /> :
								<>
									<h3>{post.id}. {post.title}</h3>
									<ul className="tab__header--task" >
										<li style={{cursor: 'pointer'}} onClick={() => handleCopyURL()}><i className="fa fa-share-square-o"></i> Share</li>
										<li>Created: {moment(post.created).format('YYYY-MM-DD')}</li>
										{/* <li>Processor: {processor}/5</li> */}
										{
											postStatus ?
												<li className={`btn-status ${postStatus.status ? 'success' : ''}`}><button>{postStatus.status ? '맞음' : '실패'}</button></li> :
												''
										}
										{/* <li>Language: {post.language}</li> */}
									</ul>
									<div className="problem__infor">
										<div className="problem__infor--desc">
											<p>문제</p>
											{/* <span>{post.content}</span> */}
											<span><pre className="prettyprint" dangerouslySetInnerHTML={{__html: post.content}}></pre></span>
										</div>
									</div>
								</>
						}
					</div>
					<div className="tab__footer">
						<div className="review__listpost">
							<span onClick={() => props.history.push('/notice')}><i className="fa fa-list"></i>&nbsp;목록</span>
						</div>
						{
							userData && userData.roleId === 1 &&
						<div className="review__listpost">
							<span onClick={() => handleDelete()}><i className="fa fa-list"></i>&nbsp;삭제</span>
						</div>
						}
					</div>
				</div>
			</div>
		</DetailPostLayout>
	);
}


export default DetailProblem;
