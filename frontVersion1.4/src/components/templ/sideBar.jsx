import React from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { BiSolidUserDetail } from "react-icons/bi";
const SideBar = () => {
  const user = localStorage.getItem("token");
  console.log("userrrrr", user)
  const decodedToken = jwtDecode(user);
        const { userId, role } = decodedToken;
        console.log('rrr', role)
  const isAdmin = user && role === "admin";

  return (
    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
      <div className="app-brand demo">
      <Link  className="logo d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon2 me-2">
              <line x1="6" x2="10" y1="12" y2="12"></line>
              <line x1="8" x2="8" y1="10" y2="14"></line>
              <line x1="15" x2="15.01" y1="13" y2="13"></line>
              <line x1="18" x2="18.01" y1="11" y2="11"></line>
              <rect width="20" height="12" x="2" y="6" rx="2"></rect>
            </svg>
            <span className="logo-text2">QuizMaster</span>
          </Link>
        <Link to="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
          <i className="bx bx-chevron-left bx-sm align-middle" />
        </Link>
      </div>
      <div className="menu-inner-shadow" />

      <ul className="menu-inner py-1">
        {/* TP Section */}
        <li className="menu-header small text-uppercase"><span className="menu-header-text">Users</span></li>
        {isAdmin && (
          <>
            <li className="menu-item">
              <Link to="/teachers" className="menu-link">
                <i className="menu-icon tf-icons bx bx-collection" />
                <div data-i18n="Basic">Teachers </div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/Students" className="menu-link">
              <i className="menu-icon " >
              <BiSolidUserDetail /></i>
                <div data-i18n="Basic">Students </div>
              </Link>
            </li>
          </>
        )}
      
        {!isAdmin && (
           <li className="menu-item">
          <Link to="/QuizApp" className="menu-link">
            <i className="menu-icon tf-icons bx bx-collection" />
            <div data-i18n="Basic">QuizApp </div>
          </Link>
        </li>
        )}
        {/* Questionnaire Section */}
        <li className="menu-header small text-uppercase"><span className="menu-header-text">Questionnaire</span></li>
        {isAdmin && (
          <>
            <li className="menu-item">
              <Link to="/questionnaireForm" className="menu-link">
                <i className="menu-icon tf-icons bx bx-collection" />
                <div data-i18n="Basic">Questionnaire Form  ccc</div>
              </Link>
            </li>
          </>
        )}
        
        <li className="menu-item">
          <Link to="/questionnairelist" className="menu-link">
            <i className="menu-icon tf-icons bx bx-collection" />
            <div data-i18n="Basic">Questionnaire List </div>
          </Link>
        </li>
        {!isAdmin && (
          <li className="menu-item">
            <Link to="/quest" className="menu-link">
              <i className="menu-icon tf-icons bx bx-collection" />
              <div data-i18n="Basic">Questionnaire </div>
            </Link>
          </li>
        )}
      </ul>
    </aside>
  );
}

export default SideBar;
