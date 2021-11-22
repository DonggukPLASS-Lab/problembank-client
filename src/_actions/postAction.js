import postAPI from '../apis/posts';
import {
	GET_POSTS_DATA,
	GET_POSTS_INFOR,
} from './types.js';

export async function getPostData() {
	const request = postAPI.getPostAllData();
	return {
		type: GET_POSTS_DATA,
		payload: request,
	};
}

export async function getPostInformation() {
	const request = postAPI.getPostInformation();
	return {
		type: GET_POSTS_INFOR,
		payload: request,
	};
}
