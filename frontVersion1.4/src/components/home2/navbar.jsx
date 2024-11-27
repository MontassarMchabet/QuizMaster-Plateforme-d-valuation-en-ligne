import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './navbar.css';

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const { userId, role } = decodedToken;
  const [name, setName] = useState('');
  const [profilepic, setprofile] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (role === "prof" ||role === "client" ) {
          const response = await axios.get(`http://localhost:5000/auth/getUserById/${userId}`);
          const prof = response.data;
          setName(prof.fullName);
          setprofile(prof.profilePicture);
        }
      } catch (err) {
        console.log('Erreur lors du chargement du profil');
      }
    };
    fetchUser();
  }, [role, userId]);

  const handleLogout = () => {
    Swal.fire({
      title: "Do you want to logout?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/home");
      }
    });
  };

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Empêche la propagation de l'événement de clic pour éviter que le dropdown se ferme immédiatement
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    window.addEventListener('click', closeDropdown);
    return () => {
      window.removeEventListener('click', closeDropdown);
    };
  }, []);

  return (
    <header className="navbar">
      
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

       
      
      <nav className="navbar-links">
        
        {role==="prof"&&(
          <>
          
          <Link to="/Homepage" className="nav-link">Home</Link>
            <Link to="/TeacherDashbord" className="nav-link">Quizzes</Link>
            <Link to="/StudentList" className="nav-link" >analyse d'étudiant </Link>
          </>
        )}
         {role==="client"&&(
          <>
            <Link to="/Homepage" className="nav-link">Home</Link>
            <Link to="/clientHome" className="nav-link">Quizzes</Link>
            <Link to="/review" className="nav-link">Review</Link>
           
          </>
        )}
        
       
        
       
      </nav>
      
      <div className="dropdown">
    
        <button className="profile-button" onClick={toggleDropdown}>
          <img
            src={( profilepic ? `http://localhost:5000/uploads/${profilepic}`: 'https://via.placeholder.com/150')} 
            width="32"
            height="32"
            alt="User Avatar"
            className="profile-avatar"
          />
        </button>
        {dropdownOpen && (
          <div className="dropdown-content show">
            <span className="dropdown-label">{name}</span>
            <div style={{marginLeft:"60px"}}>{role}</div>
            <hr className="dropdown-separator" />
           
            <Link to="/profil" className="nav-link">Profil</Link>
            <a href="#" className="dropdown-item" onClick={handleLogout}>Logout</a>
          </div>
        )}
      </div>
    </header>
  );
}
