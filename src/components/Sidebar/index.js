import React, { useState } from 'react';
import './style.scss';
import styled from 'styled-components';
import { Link, NavLink, useLocation } from 'react-router-dom';

function Sidebar(props) {
	const location = useLocation();
	const pathName = location && location.pathname;

	const isAudmin = props.user.userData.roleId == 1 || // manager
	props.user.userData.roleId == 2 || // coursecreator
	props.user.userData.roleId == 3 || // professor
	props.user.userData.roleId == 10;
	return (
		<div className="Sidebar">
			<ul className="Sidebar-list">
				<li>
					<div id="Sidebar2">
						<button className="page-info-test">내 시험/대회</button>
						<div className="panel">
							{ isAudmin ? 
							<SiderbarWithAdminlUser 
								user={props.user}  
								pathName={pathName}
							/> :
							<SiderbarWithNormalUser 
								user={props.user}  
								pathName={pathName}
							/>
						}
							{/* <ul>
							{
									props.user.userData.roleId == 1 || // manager
									props.user.userData.roleId == 2 || // coursecreator
									props.user.userData.roleId == 3 || // professor
									props.user.userData.roleId == 10 ? // ta
									(
										<li>
											<NavLink to="/mypage/mytest/create" className="navLink" id={pathName.includes('create') ? 'navLink-active' : ''}>시험 생성</NavLink>
										</li>
									) : (
										<li />
									)}

								{
									props.user.userData.roleId == 1 || // manager
									props.user.userData.roleId == 2 || // coursecreator
									props.user.userData.roleId == 3 || // professor
									props.user.userData.roleId == 10 ? // ta
									(
										<li>
											<NavLink to="/mypage/mytest/manage" className="navLink" id={pathName.includes('manage') ? 'navLink-active' : ''}>시험 수정</NavLink>
										</li>
									) : (
										<li>
											<NavLink to="/mypage/mytest/apply" className="navLink" id={pathName.includes('apply') ? 'navLink-active' : ''}>신청 시험 조회</NavLink>
										</li>
									)}

								{(props.user.userData.roleId == 1) ? ( // student
									<li>
										<NavLink to="/mypage/mytest/adminresults" className="navLink navLink-active" id={pathName.includes('adminresults') ? 'navLink-active' : ''}>시험 결과 조회</NavLink>
									</li>
								) : (
									<li>
										<NavLink to="/mypage/mytest/studentresults" className="navLink" id={pathName === '/mypage/mytest/studentresults' ? 'navLink-active' : ''}>시험 결과 조회</NavLink>
									</li>
								)}

							</ul> */}
						</div>
					</div>
				</li>
			</ul>
		</div>
	);
}

//관리 페이지
function SiderbarWithAdminlUser({pathName, user}) {
	const { userData } = user;
	const { data } = userData;
	const { username } = data;
	console.log(username)
	return (
		<ul>
			<li><NavLink to="/mypage/mytest/adminresults" className="navLink" id={pathName.includes('adminresults') ? 'navLink-active' : ''}>신청 시험 조회</NavLink></li>
			<li><NavLink to="/mypage/mytest/create" className="navLink" id={pathName.includes('create') ? 'navLink-active' : ''}>시험 생성</NavLink></li>
			{
				username === 'admin' &&
			<li><NavLink to="/mypage/mytest/manage" className="navLink" id={pathName.includes('manage') ? 'navLink-active' : ''}>시험 관리</NavLink></li>
			}
		</ul>
	)
}

//일반 페이지
function SiderbarWithNormalUser({pathName}) {
	return (
		<ul>
			<li><NavLink to="/mypage/mytest/studentsearch" className="navLink" id={pathName.includes('studentsearch') ? 'navLink-active' : ''}>신청 시험 조회</NavLink></li>
			<li><NavLink to="/mypage/mytest/studentresults" className="navLink" id={pathName === '/mypage/mytest/studentresults' ? 'navLink-active' : ''}>시험 결과 조회</NavLink></li>
		</ul>
	)
}
export default Sidebar;
