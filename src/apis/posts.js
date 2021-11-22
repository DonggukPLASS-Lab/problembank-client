import axiosClient from './axios';
import axiosScoreServer from './axiosScoreServer';

const postsBank = {
	getCategory: (params) => {
		const url = '/posts/getcategory';
		return axiosClient.get(url, {params});
	},
	getPostsBankByCategoryID: (params) => {
		const url = '/posts/category';
		return axiosClient.get(url, {params});
	},
	getPostAllData: (params) => {
		const url = '/posts/postsdata';
		return axiosClient.get(url);
	},
	getPostInformation: (params) => {
		const url = '/posts/getpostsinfor';
		return axiosClient.get(url);
	},
	PostToMyList: (params) => {
		const url = '/posts/posttomylist';
		return axiosClient.post(url, params);
	},
	getPostFromMyList: (params) => {
		const url = '/posts/getmyposts';
		return axiosClient.get(url);
	},
	getMultiPosts: (params) => {
		const url = '/posts/getlistmultiposts';
		return axiosClient.get(url);
	},
	getShortansPosts: (params) => {
		const url = '/posts/shortans';
		return axiosClient.get(url);
	},
	deleteMyPost: (params) => {
		const url = '/posts/delete-mypost';
		return axiosClient.get(url, {params});
	},
	getMyProcessor: (params) => {
		const url = '/posts/post-processor';
		return axiosClient.get(url, {params});
	},
	getStatusPost: (params) => {
		const url = '/posts/status-post';
		return axiosClient.get(url, {params});
	},
	getStatusPost: (params) => {
		const url = '/posts/status-posts';
		return axiosClient.get(url, {params});
	},
	getStatusMultiPost: (params) => {
		const url = '/posts/status-multipost';
		return axiosClient.get(url, {params});
	},
	submitShortans: (params) => {
		const url = '/posts/submit-shortans';
		return axiosClient.post(url, params);
	},
	getStatusShortansPost: (params) => {
		const url = '/posts/status-shortans';
		return axiosClient.get(url, {params});
	},
	compilePost: (params) => {
		const url = '/projects/compile-post';
		return axiosScoreServer.post(url, params);
	}
};

export default postsBank;
