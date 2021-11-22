import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import DashboardLayout from '../../../layout/DashboardLayout';
import CKEditor from 'ckeditor4-react';
import {Component} from 'react';
import './style.scss';
import {getCategories} from '../../../_actions/problemAction';
import AdminPostAPI from '../../../../apis/admin/post';
import {useDispatch} from 'react-redux';
import DisplayCategories from '../../../components/DisplayCategories';
import WrapperLoading from '../../../../components/WrapperLoading';

function CreateNotice(props) {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(true);

	const dispatch = useDispatch();

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 500);
	}, []);

	const handleSubmitPost = async () => {
		// name, language, category, tags, usage
		if (
			!title ||
      		!content
		) {
			alert('입력값을 확인해주세요');
			return;
		}

		try {
			let post = {
				title,
				content,
			};
			const response = await AdminPostAPI.insertPost(post);
			const {result, message, data} = response;
			if (result) {
				alert(message);
				setTitle('');
			} else {
				alert(message);
			}
		} catch (error) {
			console.log(`Add notice error ${error}`);
		}
	};


	if (loading) {
		return (
			<DashboardLayout>
				<WrapperLoading type={'bars'} color={'black'} />
			</DashboardLayout>
		);
	}
	return (
		<DashboardLayout>
			<p style={{marginBottom: '20px'}}>
				<i className="fa fa-pencil-square-o"></i> 공지사항 등록
			</p>
			<div className="problem-info">
				<div className="problem-info__title">
				</div>
				<div className="problem-info__content">
					<div className="problem-info__content--name">
						<div>
							<label>제목</label>
							<input
								type="input"
								id="name"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>
					</div>
					<div className="problem-info__content--decs">
						<div>
							<label>내용</label>
						</div>
						<CKEditor
							id="problem-desc"
							name="content"
							onChange={(e) => setContent(e.editor.getData())}
						/>
					</div>
				</div>
			</div>

			<div className="problem-info__btn--insert">
				<button onClick={() => handleSubmitPost()}>공지사항 등록하기</button>
			</div>
		</DashboardLayout>
	);
}

export default CreateNotice;
