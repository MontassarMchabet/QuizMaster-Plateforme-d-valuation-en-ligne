import'./globals2.css'
import { Link } from 'react-router-dom';
export default function Header() {return(
    <>
    <header class="header1" >
      <div class="header-content1">
        <a class="logo" href="#">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
            <line x1="6" x2="10" y1="12" y2="12"></line>
            <line x1="8" x2="8" y1="10" y2="14"></line>
            <line x1="15" x2="15.01" y1="13" y2="13"></line>
            <line x1="18" x2="18.01" y1="11" y2="11"></line>
            <rect width="20" height="12" x="2" y="6" rx="2"></rect>
          </svg>
          
          <Link to="/home" className="logo-text">QuizMaster</Link>
        </a>
        <div class="nav-links">
        {/*   <a class="nav-link" href="#">Leaderboard</a>
          <a class="nav-link" href="#">Settings</a> */}
            <Link to="/signin" className="btn sign-in">Sign In</Link>
            <Link to="/signup" className="btn sign-up">Sign Up</Link>
        </div>
      </div>
    </header>
    </>
)}