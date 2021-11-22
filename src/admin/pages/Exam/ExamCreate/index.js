import React from 'react';
import PropTypes from 'prop-types';
import DashboardLayout from '../../../layout/DashboardLayout';
import {Component} from 'react';
import testAPI from '../../../../apis/tests';
import Text from '../../../../components/DesignComponent/Text';
import ModifyListModal from './component/ModifyListModal';
import './style.scss';
class ExamCreate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalOpen: false,
			subject: [],
			DB_problem: [], // added problem in database (problem_id and problem_name)
			new_problem: [], // new problem
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

  async componentDidMount() {
  	// console.log(this.props.user.userData.data.id);
  	// const _subject = await testAPI.getSubjectList({ user_id: this.props.user.userData.data.id });  //
  	const _subject = await testAPI.getSubjectList({user_id: 2}); //
  	let {data} = _subject;
  	// console.log(_subject);
  	// console.log(this.props.user.id);
  	this.setState({
  		subject: data,
  	});

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
  			let obj = new Object();
  			obj.problem_id = this.state.DB_problem[i].problem_id;
  			DBArray.push(obj);
  		}
  		const problemArray = this.state.new_problem.concat(DBArray);

  		console.log(this.props.user);
  		let params = {
  			'testName': document.getElementById('name-text').value,
  			'testContent': document.getElementById('textarea').value,
  			'start': document.getElementsByClassName('data-calander')[0].value,
  			'end': document.getElementsByClassName('data-calander')[1].value,
  			'is_exam': 0,

			//add or cancel the admin_id
  			// 'admin_id': this.props.user.userData.data.id,
  			'subject_id': document.getElementsByClassName('select')[0].value,
  			'problems': problemArray,
  		};
  		const response = await testAPI.createTest(params);
  		if (response.result == true) {
  			alert('시험을 생성하였습니다.');
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
  			<div className="CreateTestPage__Container">
  				<div id="CreateTestLayoutBody">
  					<div className="testDate">
  						<Text id="data-label">시험 일자</Text>
  						<input type='datetime-local' className="data-calander" onChange="calanderChange"></input>
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
  									(<option value={problem.problemName}>+ {problem.problemName}</option>),
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

export default ExamCreate;

