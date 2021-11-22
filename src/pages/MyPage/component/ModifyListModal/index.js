import React, {Component} from 'react';
import './style.scss';
import {getProblemData} from '../../../../_actions/problemAction';
import problemsBank from '../../../../apis/problemsBank';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

class ModifyListModal extends Component {
	constructor(props) {
		super(props);
		this.state={
			keyword: '',
			problems: [], // total problem
			resultProblem: [], // searched problem
			isSavedProblem: false,
		};
	};

	async componentDidMount() {
		const request = await problemsBank.getProblemAllData();
		this.setState({problems: request.data});
		this.setState({resultProblem: request.data});
		// console.log(this.state.problems);
	};

	searchProblem = () => { // operate when click search button
	  const searchValue = document.getElementById('search-box').value;
	  const filterProblems = this.state.problems.filter(
	      (element) => element.id === Number(searchValue) ||
			element.name.match(new RegExp(searchValue, 'i')),
	  );
	  this.setState({keyword: searchValue});
	  this.setState({resultProblem: filterProblems});
	};

	addDBProblem = () => {
	  let selectedArray = document.getElementById('problem-list-select');
	  let i; let j;

	  let valueArray = new Array();
	  let idx = 0;
	  for (i = 0; i < selectedArray.length; i++) { // check selected problem
	    if (selectedArray.options[i].selected == true) {
	      valueArray[idx] = selectedArray.options[i].value;
	      idx++;
	    }
	  }

	  let tempArray = this.props.DB_problem;
	  for (i = 0; i < idx; i++) { // add selected problem
	    let obj = new Object();
	    obj.problem_id = valueArray[i];

	    var index;
	    for (j = 0; j < this.state.resultProblem.length; j++) {
	      if (this.state.resultProblem[j].id == obj.problem_id) {
	        index = j;
	        break;
	      }
	    }

	    obj.problem_name = this.state.problems[index].name;
	    tempArray.push(obj);
	  }

	  // console.log(tempArray);
	  this.props.editProblemArray(0, tempArray);
	};

	addNewProblem = () => {
	  if (
	    document.getElementById('problem-name').value == '' ||
			document.getElementById('problem-detail').value == '' ||
			document.getElementById('input-detail').value == '' ||
			document.getElementById('output-detail').value == '' ||
			document.getElementsByClassName('testcase')[0].value == '' ||
			document.getElementsByClassName('testcase')[1].value == '' ||
			document.getElementsByClassName('testcase')[2].value == '' ||
			document.getElementsByClassName('testcase')[3].value == '' ||
			document.getElementsByClassName('testcase')[4].value == '' ||
			document.getElementsByClassName('testcase')[5].value == '' ||
			document.getElementsByClassName('testcase')[6].value == '' ||
			document.getElementsByClassName('testcase')[7].value == '' ||
			document.getElementsByClassName('testcase')[8].value == '' ||
			document.getElementsByClassName('testcase')[9].value == '' ||
			document.getElementsByClassName('testcase')[10].value == '' ||
			document.getElementsByClassName('testcase')[11].value == '' ||
			document.getElementsByClassName('testcase')[12].value == '' ||
			document.getElementsByClassName('testcase')[13].value == '' ||
			document.getElementsByClassName('testcase')[14].value == '' ||
			document.getElementsByClassName('testcase')[15].value == '' ||
			document.getElementsByClassName('testcase')[16].value == '' ||
			document.getElementsByClassName('testcase')[17].value == '' ||
			document.getElementsByClassName('testcase')[18].value == '' ||
			document.getElementsByClassName('testcase')[19].value == ''
	  ) {
	    alert('빈 칸을 모두 채워주세요');
	  }
	  else {
			try {
				let obj = new Object();
				obj.problemName = document.getElementById('problem-name').value;
				obj.problemContent = document.getElementById('problem-detail').value;
				obj.input = document.getElementById('input-detail').value;
				obj.output = document.getElementById('output-detail').value;
	
				obj.testcase = [];
				let i;
				for (i = 0; i < 10; i++) {
					let testcaseObj = new Object();
					testcaseObj.input_exp = document.getElementsByClassName('testcase')[i].value;
					testcaseObj.output_exp = document.getElementsByClassName('testcase')[i + 10].value;
					obj.testcase.push(testcaseObj);
				}
	
				let tempArray = this.props.new_problem;
				tempArray.push(obj);
				// console.log(tempArray);
				this.props.editProblemArray(1, tempArray);

				this.setState({
					isSavedProblem: true,
				})
			} catch (error) {
				console.log('문제 추가 실패합니다.')
			}
	  }
	};

	removeProblem = () => {
	  let currentArray = document.getElementById('added-problem');
	  let i; let j;

	  let DBProblemNum = 0;
	  for (DBProblemNum; DBProblemNum < currentArray.length && currentArray.options[DBProblemNum].label[0] != '+'; DBProblemNum++);

	  let DBvalueArray = new Array();
	  let DBidx = 0;

	  for (i = 0; i < DBProblemNum; i++) { // check selected problem
	    if (currentArray.options[i].selected == true) {
	      DBvalueArray[DBidx] = currentArray.options[i].value;
	      DBidx++;
	    }
	  }

	  let tempDBArray = this.props.DB_problem;
	  for (i = 0; i < DBidx; i++) {
	    var length = tempDBArray.length;
	    for (j = 0; j < length; j++) {
	      if (tempDBArray[j].problem_id == DBvalueArray[i]) {
	        tempDBArray.splice(j, 1);
	        length--;
	      }
	    }
	  }

	  // console.log(tempDBArray);
	  this.props.editProblemArray(0, tempDBArray);

	  let newvalueArray = new Array();
	  let newidx = 0;

	  for (i = DBProblemNum; i < currentArray.length; i++) { // check selected problem
	    if (currentArray.options[i].selected == true) {
	      newvalueArray[newidx] = currentArray.options[i].value;
	      newidx++;
	    }
	  }

	  let tempNewArray = this.props.new_problem;
	  for (i = 0; i < newidx; i++) {
	    var length = tempNewArray.length;
	    for (j = 0; j < length; j++) {
	      if (tempNewArray[j].problemName == newvalueArray[i]) {
	        tempNewArray.splice(j, 1);
	        length--;
	      }
	    }
	  }

	  // console.log(tempNewArray);
	  this.props.editProblemArray(1, tempNewArray);
	};

	render() {
	  const {isOpen, open, close, DB_problem, new_problem} = this.props;

	  return (
	    <>
	      { isOpen ? (
					<div id="out">
					  <div>
					    <div id="modalWindow">
								<span id="close" onClick={close} style={{cursor:"pointer"}}>
									&times;
					      </span>
					      <div id="modifyList">
					        <div id="problem-list-block">
					          <div id="problem-search-box">
					            <div id="search-bar">
					              <input
					                type="text"
					                id="search-box"
					                onChange={this.searchProblem}
					                placeholder="문제 제목, 번호로 검색"
					              />
					            </div>
					            <select multiple id="problem-list-select">
					              {
					                this.state.resultProblem.map((resultProblem) =>
					                  ( <option value={resultProblem.id}>{resultProblem.id}. {resultProblem.name}</option> ),
					                )
					              }
	        								</select>
					            <div id="add-problem-button-div">
					              <button onClick={this.addDBProblem}>+</button>
												&nbsp;&nbsp;&nbsp;
					              <button onClick={this.removeProblem}>-</button>
					            </div>
					          </div>
					          <div id="test-problem-list">
					            <div className="text">
					              <p>추가된 문제</p>
					            </div>
					            <select multiple id="added-problem">
					              {
					                DB_problem.map((DB_problem) =>
					                  ( <option value={DB_problem.problem_id}>{DB_problem.problem_name}</option> ),
					                )
					              }
					              {
					                new_problem.map((new_problem) =>
					                  ( <option value={new_problem.problemName}>+ {new_problem.problemName}</option> ),
					                )
					              }
					            </select>
					          </div>
					        </div>
					        <div id="middle-line"></div>
					        <div id="new-problem">
					          <div className="form">
								<p>문제 제목</p>
					            <input
					              type="text"
					              placeholder="문제 제목을 입력해주세요."
					              id="problem-name"
					            />
					          </div>
					          <div className="form">
					            <p>문제 정의</p>
					            <textarea 
					              type="text"
					              placeholder="문제 정의를 입력해주세요."
					              id="problem-detail"
					            />
					          </div>
					          <div className="form">
					            <p>입력</p>
					            <input
					              type="text"
					              placeholder="입력 조건을 입력해주세요."
					              id="input-detail"
					            />
					          </div>
					          <div className="form">
					            <p>출력</p>
					            <input
					              type="text"
					              placeholder="출력 조건을 입력해주세요."
					              id="output-detail"
					            />
									      	</div>
					          <div id="testcase-div">
					            <div id="input-case">
					              <p>입력 예제</p>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					            </div>
					            <div id="output-case">
					              <p>출력 예제</p>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					              <input type="text" className="testcase"/>
					            </div>
					          </div>
					          <div id="addProblemButton">
										<Button className="" variant="outlined" color="primary" onClick={this.addNewProblem} >문제 추가</Button>
					          </div>
					        </div>
					      </div>
								<div style={{textAlign: 'center'}}>
									<Button className="" style={{padding: '10px 30px'}} variant="contained" color="primary" onClick={() => {
											if(DB_problem.length === 0 && new_problem.length === 0){
												alert('문제추가 아직 안 했으니, 문제추가 부터 해주세요.');
											}else{
												close();
											}
										}}>저장</Button>
								</div>
							</div>
					</div>
					</div>
				) : null}
	    </>
	  );
	}
}

export default ModifyListModal;
