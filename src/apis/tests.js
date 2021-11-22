import axiosClient from './axios';
import axiosClientServer from './axiosScoreServer';

//API 선언
const testAPI = {
	getAllTestData: (params) => {
		const url = '/tests/alltestdata';
		return axiosClient.get(url, {params});
	},
	getAllTestDataNormalUser: (params) => {
		const url = '/tests/alltestdata-normal-user';
		return axiosClient.get(url, {params});
	},

	getAdminTestList: (params) => {
		const url = '/tests/admintestlist';
		return axiosClient.get(url, {params});
	},

	getTestInfo: (params) => {
		const url = '/tests/testinfo';
		return axiosClient.get(url, {params});
	},

	getTestFullInfo: (params) => {
		const url = '/tests/test-fullinfo';
		return axiosClient.get(url, {params});
	},

	getCheckEnableJoin: (params) => {
		const url = '/tests/checktest-enable-join';
		return axiosClient.get(url, {params});
	},
	
	joinExam: (params) => {
		const url = '/tests/join-exam';
		return axiosClient.get(url, {params});
	},

	getTestProblems: (params) => {
		const url = '/tests/testproblems';
		return axiosClient.get(url, {params});
	},

	getTestTimes: (params) => {
		const url = '/tests/testtimes';
		return axiosClient.get(url, {params});
	},

	getTestProblemData: (params) => {
		const url = '/tests/testproblemdata';
		return axiosClient.get(url, {params});
	},
	markAllUserMakeByTest: (params) => {
		const url = '/projects/mark-all-user-submit';
		return axiosClientServer.post(url, params);
	},
	markWithuUser: (params) => {
		const url = '/projects/submit-compile-bank-problem';
		return axiosClientServer.post(url, params);
	},
	getTestFeedback: (params) => {
		const url = '/tests/testfeedback';
		return axiosClient.get(url, {params});
	},
	insertTestFeedback: (params) => {
		const url = '/tests/insert-feedback';
		return axiosClient.post(url, params);
	},

	getSubjectList: (params) => {
		const url = '/tests/adminsubjects';
		return axiosClient.get(url, {params});
	},

	getResultAdmin: (params) => {
		const url = '/tests/adminresult';
		return axiosClient.get(url, {params});
	},
	getUserByTestId: (params) => {
		const url = '/tests/user-by-test';
		return axiosClient.get(url, {params});
	},
	getResultUser: (params) => {
		const url = '/tests/userresult';
		return axiosClient.get(url, {params});
	},

	//get answer
	getUserAnswers: (params) => {
		const url = '/tests/useranswer';
		return axiosClient.get(url, {params});
	},

	//score test
	scoreTest: (params) => {
		const url = '/tests/score-test';
		return axiosClient.get(url, {params});
	},

	getUserTests: (params) => {
		const url = '/tests/usertests';
		return axiosClient.get(url, {params});
	},

	createTest: (params) => {
		const url = '/tests/createtest';
		return axiosClient.post(url, params);
	},

	updateTest: (params) => {
		const url = '/tests/updatetest';
		return axiosClient.post(url, params);
	},
	checkJoinWithTestId: (params) => {
		const url = '/tests/check-join';
		return axiosClient.get(url, {params});
	},
	updateProblem: (params) => {
		const url = '/tests/updateproblem';
		return axiosClient.post(url, params);
	},

	regTest: (params) => {
		const url = '/tests/regtest';
		return axiosClient.post(url, params);
	},

	cancelReg: (params) => {
		const url = '/tests/cancelreg';
		return axiosClient.post(url, params);
	},
	cancelRegisteForStudent: (params) => {
		const url = '/tests/cancelreg-student';
		return axiosClient.post(url, params);
	},

	testRun: (params) => {
		const url = '/projects/run-bank-problem';
		return axiosClientServer.post(url, params);
	},

	getProblemSubmit : (params) => {
		const url = '/tests/list-submit';
		return axiosClient.get(url, {params});
	},
	
	getProblemSubmitUser : (params) => {
		const url = '/tests/list-submit-user';
		return axiosClient.get(url, {params});
	},
	submit: (params) => {
		const url = '/projects/submit-bank-problem';
		return axiosClientServer.post(url, params);
	},
	
	submitFinal: (params) => {
		const url = '/tests/submit-final';
		return axiosClient.post(url, params);
	},

	reportError: (params) => {
		const url = '/tests/reporterror';
		return axiosClient.post(url, params);
	},
};

export default testAPI;
