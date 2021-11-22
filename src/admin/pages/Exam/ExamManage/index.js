import React, {Component} from 'react';
import './style.scss';
import ManageTestLayout from '../../../../layouts/ManageTestLayout';
import testAPI from '../../../../apis/tests';
import Text from '../../../../components/DesignComponent/Text';
import ModifyListModal from '../ExamCreate/component/ModifyListModal';
import DashboardLayout from '../../../layout/DashboardLayout';
class ManageTestPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalOpen: false,
			subject: [],
			testArray: [],
			test: [],
			DB_problem: [], // problem_id and problem_name
			new_problem: [], // new problem for exam
		};
	};

  openModal = () => {
  	this.setState({isModalOpen: true});
  };

  closeModal = () => {
  	this.setState({isModalOpen: false});
  };

  // if option == 0, edit DB_problem
  // else if option == 1, edit new_problem
  editProblemArray = (option, list) => {
  	if (option == 0) {
  		this.setState({DB_problem: list});
  	}
  	else if (option == 1) {
  		this.setState({new_problem: list});
  	}
  };

  selectTest = async () => {
  	const e = document.getElementById('name-select');
  	if (e.options.length) {
  		let testId = e.value;
  		const {data} = await testAPI.getTestInfo({test_id: testId});
  		console.log(data);
  		document.getElementsByClassName('data-calander')[0].value = data.start.slice(0, -1); ;
  		document.getElementsByClassName('data-calander')[1].value = data.end.slice(0, -1); ;
  		document.getElementById('name-text').value = data.name;
  		document.getElementById('textarea').value = data.content;

  		console.log('test id');
  		console.log(testId);
  		const _problemArray = await testAPI.getTestProblems({test_id: testId});
  		console.log('test api log');
  		console.log(testId);
  		console.log(_problemArray);
  		let problemArray = new Array();
  		for (let i = 0; i < _problemArray.data.length; i++) {
  			let obj = new Object();
  			obj.problem_id = _problemArray.data[i].problem_id;
  			obj.problem_name = _problemArray.data[i].name;
  			problemArray.push(obj);
  		}
  		this.setState({
  			DB_problem: problemArray,
  		});
  	}
  }

  // !수정할 필함
  async componentDidMount() {
  	// const _subject = await testAPI.getSubjectList({ user_id: this.props.user.userData.data.id });
  	const _subject = await testAPI.getSubjectList({user_id: 2});
  	this.setState({
  		subject: _subject.data,
  	});

  	// const _testArray = await testAPI.getAdminTestList({ admin_id: this.props.user.userData.data.id });
  	const _testArray = await testAPI.getAdminTestList({admin_id: 2});
  	this.setState({
  		testArray: _testArray.data,
  	});
  	console.log('Manage test log');
  	console.log(this.props);
  	// console.log(this.props.user.userData.data.id);
  	console.log(_testArray);

  	this.selectTest();

  	for (let i = 0; i < 2; i++) // input calander setting
  	{document.getElementsByClassName('data-calander')[i].value = new Date().toISOString().slice(0, 16);}

  	document.getElementsByClassName('data-calander')[1].min = document.getElementsByClassName('data-calander')[0].value;
  	document.getElementsByClassName('data-calander')[0].onchange = function() {
  		document.getElementsByClassName('data-calander')[1].min = document.getElementsByClassName('data-calander')[0].value;
  	};
  };

  saveTest = async () => {
  	if (document.getElementById('name-text').value === '')
  	{alert('시험명을 입력해주세요');}
  	else {
  		let DBArray = new Array();
  		for (let i = 0; i < this.state.DB_problem.length; i++) {
  			const _problem = await testAPI.getTestProblemData({problem_id: this.state.DB_problem[i].problem_id});
  			DBArray.push(_problem);
  		}
  		const problemArray = DBArray.concat(this.state.new_problem);
  		let params = {
  			'test_id': document.getElementById('name-select').value,
  			'testName': document.getElementById('name-text').value,
  			'testContent': document.getElementById('textarea').value,
  			'start': document.getElementsByClassName('data-calander')[0].value,
  			'end': document.getElementsByClassName('data-calander')[1].value,
  			'is_exam': 0,
  			'admin_id': this.props.user.userData.data.id,
  			'subject_id': document.getElementsByClassName('select')[0].value,
  			'problems': problemArray,
  		};

  		console.log(params);
  		const response = await testAPI.updateTest(params);
  		if (response.result == true) {
  			alert('시험을 수정하였습니다.');
  		}

  		/* for debug
      alert(params.testName);
      alert(params.testContent);
      alert(params.is_exam);
      alert(params.start);
      alert(params.end);
      alert(params.admin_id);
      alert(params.subject_id);
      alert(params.problems);
      */
  	}
  };

  render() {
  	return (
  		<DashboardLayout>
  			<div className="ManageTestPage__Container">
  				<div className="ManageTestPage">
  					<div className="testName1">
  						<Text id="name-label">시험명</Text>
  						<select id="name-select" onChange={this.selectTest}>
  							{
  								this.state.testArray.map((testArray) =>
  									(<option value={testArray.id} label={testArray.name} />),
  								)
  							}
  						</select>
  					</div>
  					<div className="testDate">
  						<Text id="data-label">시험 일자</Text>
  						<input type='datetime-local' className="data-calander"></input>
  						<Text>~</Text>
  						<input type='datetime-local' className="data-calander"></input>
  					</div>

  					<div className="testName2">
  						<Text id="name-label">시험명</Text>
  						<input type="text" id="name-text" />
  					</div>

  					<div className="className">
  						<Text>과목명</Text>
  						<select className="select">
  							{
  								this.state.subject.map((subject) =>
  									(<option value={subject.id} label={subject.fullname} />),
  								)
  							}
  						</select>
  					</div>

  					<div className="testContent">
  						<Text>시험 내용</Text>
  						<input type="textarea" id="textarea" />
  					</div>

  					<div className="selectProblem">
  						<Text>문제 선택</Text>
  						<select multiple="multiple" id="select">
  							{
  								this.state.DB_problem.map((problem) =>
  									(<option value={problem.problem_id}>{problem.problem_name}</option>),
  								)
  							}
  							{
  								this.state.new_problem.map((problem) =>
  									(<option value={problem.probleNmame}>+ {problem.problemName}</option>),
  								)
  							}
  						</select>
  						<button className="button" onClick={this.openModal}>목록 수정</button>
  						<ModifyListModal
  							isOpen={this.state.isModalOpen}
  							open={this.openModal}
  							close={this.closeModal}
  							DB_problem={this.state.DB_problem}
  							new_problem={this.state.new_problem}
  							editProblemArray={this.editProblemArray}
  						/>
  					</div>
  					<div className="save">
  						<button className="button" onClick={this.saveTest}>저장</button>
  					</div>
  				</div>
  			</div>
  		</DashboardLayout>
  	);
  }
}

export default ManageTestPage;
