<h1 align="center" style="display: block; font-size: 2.5em; font-weight: bold; margin-block-start: 1em; margin-block-end: 1em;">
<a name="logo" href="#">
  <img align="center" src="./docs/imgs/main-page.png" alt="PLASS ProblemBank Home" style="width:80%;height:80%;filter:drop-shadow(10px 10px 3px black);"/></a>
  <br><br><strong> 문제은행 클라이언트</strong>
</h1>

![Latest release](https://img.shields.io/github/v/release/DonggukPLASS-Lab/problembank-client?style=for-the-badge)

---
## 소개[![](./docs/imgs/pin.svg)](#introduction)
**문제은행 클라이언트**라는 프로젝트는 동국대학교 PLASS 연구실 연구원들이 개발하는 프로젝트입니다.

---

## 목차[![](./docs/imgs/pin.svg)](#table-of-contents)
1. [개발 환경](#dev-env)
2. [실행 방법](#install)
3. [기능 명세서](#feature)
3. [개발 멤버](#member)

---

## 개발 환경[![](./docs/imgs/pin.svg)](#dev-env)
- [Node.js](https://nodejs.org/)
- [React.js](https://reactjs.org/)

## 설치[![](./docs/imgs/pin.svg)](#install)
```bash

# Clone this repository
git clone `` 

# Go into the repository
cd problembank-client 

# Install dependencies
npm start

# .env create env file
vim .env 
REACT_APP_SERVER_API=http://localhost:3003
REACT_APP_SERVER_SCORE_API=http://localhost:5111
REACT_APP_CODE_SERVER=http://localhost

# Run the app
$ npm start
```
> 💡 정상적으로 올리는지 확인: `open https://localhost:3003` 명령어를 사용하여 웹브라우저로 접속함 <br>
> 💡 Docker 빌드: `docker build . -t problemblem-client:1.1` 또는 `./build-docker.sh 1.1`

---

## 기능 명세서[![](./docs/imgs/pin.svg)](#feature)

#### 로그인 페이지에서 접속
유저가 Shastra를 통해서 로그인해서 메인 페이지 좌측 네비게이션 바에서 **문제은행** 버튼을 클릭하면 해당 유저의 토큰을 전달하고 문제은행 페이지에서 토큰을 받아서 유저정보를 다시 호출한다.
만약에 전달하는 토큰이 일치하지 않으면 해당 페이지에 접속이 불가하다.

#### 프로그래밍 문제
각 언어가 가지는 프로그래밍 문법과 심화 과정을 문제를 통하여, C++나 Java 등의 객체지향 언어와 절차적 언어 C와 머신러닝 및 AI 교육용 및 개발용으로 주목받고 있는 Python 총 4가지의 언어를 통해 프로그래밍 문제를 학습할 수 있음

<div align="center">
  <img align="center" src="./docs/imgs/programmings.png" alt="Programming problems" style="width:90%;height:90%;filter: drop-shadow(10px 10px 3px black);"/>
</div>
</br>
문제 풀이를 원하는 문제를 클릭하여, 해당 문제 페이지로 이동한다. 이 페이지에서 해당 문제를 여러 정보를 확인 할 수 있으며, 문제 풀이가 완료되면 답안을 제출 할 수 있다.
</br>
<div align="center">
  <img align="center" src="./docs/imgs/programings-sol.png" alt="Programming problems" style="width:90%;height:90%;filter: drop-shadow(10px 10px 3px black);"/>
</div>
</br>

#### 객관식 문제
프로그래밍 기본 개념을 학습하기 위해서 다양한 유형의 객관식 문제들을 제공합니다.
</br>
</br>
<div align="center">
  <img align="center" src="./docs/imgs/multi-programming.png" alt="Multi Programming problems" style="width:90%;height:90%;filter: drop-shadow(10px 10px 3px black);"/>
</div>
</br>
</br>
문제 풀이를 원하는 문제를 클릭하여, 해당 문제 페이지로 이동한다. 이 페이지에서 해당 문제를 여러 정보를 확인 할 수 있으며, 답안을 제출 시 결과를 바로 확인할 수 있다.
</br>
</br>
<div align="center">
  <img align="center" src="./docs/imgs/multi-programming-ans.png" alt="Multi Programming problems answer" style="width:90%;height:90%;filter: drop-shadow(10px 10px 3px black);"/>
</div>
</br>
</br>

#### 단답형 문제
프로그래밍 기본 개념을 학습하기 위해서 다양한 유형의 단답형 문제들을 제공합니다.
</br>
</br>
<div align="center">
  <img align="center" src="./docs/imgs/shortans-programming.png" alt="Shortans Programming problems" style="width:90%;height:90%;filter: drop-shadow(10px 10px 3px black);"/>
</div>
</br>
</br>
문제 풀이를 원하는 문제를 클릭하여, 해당 문제 페이지로 이동한다. 이 페이지에서 해당 문제를 여러 정보를 확인 할 수 있으며, 답안을 제출 시 결과를 바로 확인할 수 있다.
</br>
</br>
<div align="center">
  <img align="center" src="./docs/imgs/shortans-programming-ans.png" alt="Shortans Programming problems answer" style="width:90%;height:90%;filter: drop-shadow(10px 10px 3px black);"/>
</div>
</br>
</br>

#### 카테고리별 문제
카테고리별 문제는 총 5가지의 카테고리별로 구성되어 있으며, 기초 프로그래밍 C언어 문제와 심화 프로그래밍 C++ 언어 문제, 객체지향 프로그래밍 Java 언어 기준의 문제와 자료구조, 알고리즘별로 카테고리를 구분하여 사용자가 원하는 문제 유형 카테고리를 선택하여, 문제 풀이가 가능하다.
</br>
</br>
<div align="center">
  <img align="center" src="./docs/imgs/category.png" alt="Shortans Programming problems" style="width:90%;height:90%;filter: drop-shadow(10px 10px 3px black);"/>
</div>
</br>
</br>
학습하기 원하는 카테고리를 클릭하면 해당 카테고리로 분류 되어있는 객관식/단답형/프로그래밍 문제를 출력합니다.
</br>
</br>
<div align="center">
  <img align="center" src="./docs/imgs/sub-category.png" alt="Shortans Programming problems answer" style="width:90%;height:90%;filter: drop-shadow(10px 10px 3px black);"/>
</div>
</br>
</br>

#### 시험/대회
관리자가 등록한 시험/대회를 확인 하는 페이지이며 각 시험/대회의 진행 상태를 확인할 수 있으며, 학생들은 신청 및 입장을 할 수 있습니다.
</br>
</br>
<div align="center">
  <img align="center" src="./docs/imgs/exam.png" alt="Exam" style="width:90%;height:90%;filter: drop-shadow(10px 10px 3px black);"/>
</div>
</br>
</br>

#### 마이페이지(경진대회)
학생들이 신청한 시험 및 대회를 조회하는 페이지 입니다.
</br>
</br>
<div align="center">
  <img align="center" src="./docs/imgs/exam-2.png" alt="Exam 2" style="width:90%;height:90%;filter: drop-shadow(10px 10px 3px black);"/>
</div>
</br>
</br>

#### Favorite Problem List
사용자가 문제은행 내의 문제풀이 화면에서 Add to Problem 버튼을 클릭하여 해당 문제를 저장했을 경우 저장된 문제들이 List 형태로 출력이 됩니다.
</br>
</br>
<div align="center">
  <img align="center" src="./docs/imgs/main-problems.png" alt="My Problems" style="width:90%;height:90%;filter: drop-shadow(10px 10px 3px black);"/>
</div>
</br>
</br>

#### 관리 페이지
관리자 권한을 보유한 경우에는 문제은행 내 저장되어 있는 모든 문제를 등록/수정/삭제를 할 수 있습니다.
</br>
</br>
<div align="center">
  <img align="center" src="./docs/imgs/admin-page.png" alt="My Problems" style="width:90%;height:90%;filter: drop-shadow(10px 10px 3px black);"/>
</div>
</br>
</br>

## 개발 멤버[![](./docs/imgs/pin.svg)](#member)
- 동국대학교 PLASS 연구실 연구원

<h1 align="center" style="display: block; font-size: 2.5em; font-weight: bold; margin-block-start: 1em; margin-block-end: 1em;">
END
</h1>
