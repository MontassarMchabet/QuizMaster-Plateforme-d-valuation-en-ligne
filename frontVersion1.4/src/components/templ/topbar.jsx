import React from 'react'

import { useNavigate,Link} from 'react-router-dom';
import Swal from 'sweetalert2';

const Topbar = () => {
  const navigate = useNavigate();
  const name = JSON.parse(localStorage.getItem("name"));
  const role = JSON.parse(localStorage.getItem("role"));

   const refresh_token = JSON.parse(localStorage.getItem("refresh_token"));
  const handlelogout = () => {
    Swal.fire({
      title: "Do you want to logout?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes",
      denyButtonText: `No`
    }).then((result) => {
       if (result.isConfirmed) {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('token');
        
      localStorage.clear();
      navigate("/signin");
        
      } else if (result.isDenied) {
       }
    });  
  };
  return (
 
    <nav className="mb-5 layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
    <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
      <a className="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
        <i className="bx bx-menu bx-sm" />
      </a>
    </div>
    <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
 
      <ul className="navbar-nav flex-row align-items-center ms-auto">
        {/* Place this tag where you want the button to render. */}
        
        {/* User */}
        <li className="nav-item navbar-dropdown dropdown-user dropdown">
          <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
            <div className="avatar avatar-online">
              <img src="../assets/img/avatars/1.png" alt className="w-px-40 h-auto rounded-circle" />
            </div>
          </a>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <a className="dropdown-item" href="#">
                <div className="d-flex">
                  <div className="flex-shrink-0 me-3">
                    <div className="avatar avatar-online">
                      <img src="../assets/img/avatars/1.png" alt className="w-px-40 h-auto rounded-circle" />
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <span className="fw-semibold d-block">{name}</span>
                    <small className="text-muted">{role}</small>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <div className="dropdown-divider" />
            </li>
            <li>
              <Link className="dropdown-item" to="/profil">
                <i className="bx bx-user me-2" />
                <span className="align-middle">My Profile</span>
              </Link>
            </li>
        
         
            <li>
              <div className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" >
                <i className="bx bx-power-off me-2" />
                <button   onClick={handlelogout} className="align-middle" style={{
                      backgroundColor: "#ffffff",
                      color: "#697a8d",
                        padding: "0",  
                 
                      fontSize: "15px" 
                }}>Log Out</button>
              </a>
            </li>
          </ul>
        </li>
        {/*/ User */}
      </ul>
    </div>
  </nav>
 
   )
}

export default Topbar