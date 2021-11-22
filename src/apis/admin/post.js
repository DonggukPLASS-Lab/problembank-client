import axiosClient from './axios';

const AdminPostAPI = {
	insertPost: (params) => {
		const url = 'admin/posts/insertpost';
		return axiosClient.post(url, params);
	},

	deletePost: (params) => {
		const url = 'admin/posts/deletepost';
		return axiosClient.post(url, params);
	}
};

export default AdminPostAPI;