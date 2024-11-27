import React, { useEffect, useState } from 'react';
import SideBar from "../components/templ/sideBar";
import Topbar from "../components/templ/topbar";
import Footer from '../components/templ/footer';
import axios from 'axios';

const Students = () => {

  const [VerifiedStudends, setVerifiedStudends] = useState([]);

  const fetchVerifiedStudends = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/verifiedclients');
      setVerifiedStudends(response.data);
    } catch (error) {
      console.error('Error fetching PendingTeachers:', error);
    }
  };

  useEffect(() => {
    fetchVerifiedStudends();
 
  }, []);

  return (
    <div className='body2'>
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        {/* Menu */}
        <SideBar />
        {/* / Menu */}
        {/* Layout container */}
        <div className="layout-page">
          {/* Navbar */}
          <Topbar />
          {/* / Navbar */}
          {/* Content wrapper */}
          <div className="content-wrapper">
            {/* Content */}
            <main className="container my-4">
             
                <div className="col-md-12">
                

                  <div className="tab-content mt-4">
                   

                      <div className="card">
                        <div className="card-body">
                          <h3 className="card-title">Accepted Students</h3>
                          <p className="card-text">List of students whose applications have been accepted.</p>
                          <div className="table-responsive">
                            <table className="table table-striped table-hover">
                              <thead className="table-dark">
                                <tr>
                                  <th>Full Name</th>
                                  <th>Email</th>
                                  <th>Date of Birth</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                              {VerifiedStudends.length === 0 ? (
                                  <tr>
                                    <td colSpan="4" className="text-center">No accepted student found</td>
                                  </tr>
                                ) : (
                                    VerifiedStudends.map((teacher) => (
                                    <tr key={teacher.id}> {/* Assuming each teacher has a unique id */}
                                      <td>{teacher.fullName}</td> {/* Adjust the property names based on your API response */}
                                      <td>{teacher.email}</td>
                                      <td>{teacher.dateOfBirth}</td>
                                      <td>
                                        <button className="btn btn-warning btn-sm me-2">
                                          <i className="bi bi-pencil"></i> Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm">
                                          <i className="bi bi-trash"></i> Delete
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}

                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                   
                  </div>
                </div>
              
            </main>
            {/* / Content */}
            {/* Footer */}
            <Footer />
            {/* / Footer */}
            <div className="content-backdrop fade" />
          </div>
          {/* Content wrapper */}
        </div>
        {/* / Layout page */}
      </div>
      {/* Overlay */}
      <div className="layout-overlay layout-menu-toggle" />
    </div>
    </div>
  );
};

export default Students;