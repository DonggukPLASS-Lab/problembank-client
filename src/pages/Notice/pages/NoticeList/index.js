import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { getPostData } from '../../../../_actions/postAction';
import { useDispatch, useSelector } from 'react-redux';
import { FaBorderNone, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PostDisplayTable from '../../components/PostDisplayTable';
import Loading from '../../../../components/Loading/Loading';
import WrapperLoading from '../../../../components/WrapperLoading';
import TotalPostsLayout from '../../../../layouts/TotalProblemsLayout';
import Select from 'react-select';
import Search from '../../../../components/Search';

function TotalPostsPage(props) {
	const [posts, setPosts] = useState([]);
	const [resultPosts, setResultPosts] = useState([]);
	const [countDisplayPost, setCountDisplayPost] = useState(15);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);

	React.useEffect(() => {
		dispatch(getPostData()).then((response) => {
			const { data } = response.payload;
			setPosts(data);
			const slicePosts = data.slice(0, Number(countDisplayPost));
			setResultPosts(slicePosts);
			setLoading(false);
		});
	}, []);

	const handleChangeDisplayPro = (e) => {
		setLoading(true);
		const countValue = e.target.value;
		setCountDisplayPost(Number(countValue));

		const slicePosts = posts.slice(0, Number(countValue));
		setResultPosts(slicePosts);

		setTimeout(function () {
			setLoading(false);
		}, 500);
	};

	const blockFotter = resultPosts.length === 0 ? { display: 'none' } : { display: 'block' };

	const handleSetResultPost = (data) => {
		setLoading(true);
		const slicePosts = data.slice(0, Number(countDisplayPost));
		setResultPosts(slicePosts);
		setTimeout(function () {
			setLoading(false);
		}, 500);
	};
	
	const handlePrevPost = () => {
		let prevPage = currentPage - 1;
		const slicePosts = posts.slice(prevPage * countDisplayPost, currentPage * countDisplayPost);
		setCurrentPage(prevPage);
		setResultPosts(slicePosts);
	};
	
	const handleNextPost = () => {
		let nextPage = currentPage + 1;
		const slicePosts = posts.slice(nextPage * countDisplayPost, (nextPage * countDisplayPost) + countDisplayPost);
		setCurrentPage(nextPage);
		setResultPosts(slicePosts);
	};

	let idx;
	const handleNumberPage = (idx) => {
		const slicePosts = posts.slice(idx * countDisplayPost, (idx * countDisplayPost) + countDisplayPost);
		setResultPosts(slicePosts);
		setCurrentPage(idx);
	};
	const [currentPage, setCurrentPage] = useState(0);

	const calCountPage = () => {
		let totalPage = posts.length / countDisplayPost;
		let result = new Array();
		for (let i = 0; i < totalPage; i++) {
			result.push(<span onClick={() => handleNumberPage(i)} style={currentPage === i ? { fontSize: '20px' } : {}}> {i + 1} </span>);
		}
		return result;
	};

	return (
		<TotalPostsLayout>
			<div className="totalposts__page">
				<div className="container">
					<Search
						posts={posts}
						setResultPost={(data) => handleSetResultPost(data)
						}
					/>
					<div className="wrapper__posts">
						{
							loading ?
								<WrapperLoading type={'bars'} color={'black'} /> :
								resultPosts.length !== 0 &&
								<PostDisplayTable
									posts={resultPosts}
								/>
						}
						{
							!loading &&
							<div className="row-selector" style={blockFotter}>
								<select className="form-control" onChange={handleChangeDisplayPro} value={countDisplayPost}>
									<option value="15">15</option>
									<option value="30" selected="">30</option>
									<option value="50">50</option>
									<option value="100">100</option>
								</select>
								<span className="sort-caret">
									게시글수
								</span>
								<div>
									<button onClick={() => handlePrevPost()} disabled={currentPage === 0}> {'<<'} </button>
									{
										calCountPage()
									}
									<button onClick={() => handleNextPost()} disabled={(posts.length / countDisplayPost) !== 1 ? currentPage >= ((posts.length / countDisplayPost) - 1) : true}> {'>>'} </button>
								</div>
							</div>
						}
					</div>
				</div>
			</div>
		</TotalPostsLayout>
	);
}

export default TotalPostsPage;

