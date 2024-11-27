import React, { useEffect, useState } from 'react';
import SideBar from "../components/templ/sideBar";
import Topbar from "../components/templ/topbar";
import Footer from '../components/templ/footer';
import axios from 'axios';

const Home = () => {
  const [PendingTeachers, setPendingTeachers] = useState([]);
  const [verifiedProfs, setverifiedProfs] = useState([]);
  const fetchPendingTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/UnverifiedProfs');
      setPendingTeachers(response.data);
    } catch (error) {
      console.error('Error fetching PendingTeachers:', error);
    }
  };
  const AcceptedTeacher = async (id) => {
    try {
      await axios.put(`http://localhost:5000/auth/updateTeacherVerification/${id}`);
    
      fetchPendingTeachers();
      fetchVerifiedTeachers();
    } catch (error) {
      console.error('Error updating teacher verification:', error);
    }
  };

  const fetchVerifiedTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/verifiedProfs');
      setverifiedProfs(response.data);
    } catch (error) {
      console.error('Error fetching PendingTeachers:', error);
    }
  };

  useEffect(() => {
    fetchPendingTeachers();
    fetchVerifiedTeachers();
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
              <div className="row">
                <div className="col-md-12">
                  <ul className="nav nav-tabs" id="teacherTabs" role="tablist">
                    <li className="nav-item">
                      <button className="nav-link active" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending" type="button" role="tab" aria-controls="pending" aria-selected="true">Pending Teachers</button>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link" id="accepted-tab" data-bs-toggle="tab" data-bs-target="#accepted" type="button" role="tab" aria-controls="accepted" aria-selected="false">Accepted Teachers</button>
                    </li>
                  </ul>

                  <div className="tab-content mt-4">
                    <div className="tab-pane fade show active" id="pending" role="tabpanel" aria-labelledby="pending-tab">
                      <div className="card">
                        <div className="card-body">
                          <h3 className="card-title">Pending Teachers</h3>
                          <p className="card-text">Review and accept or reject pending teacher applications.</p>
                          <div className="table-responsive">
                            <table className="table table-striped table-hover">
                              <thead className="table-dark">
                                <tr>
                                  <th>Full Name</th>
                                  <th>Email</th>
                                  <th>Password</th>
                                  <th>Date of Birth</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                              {PendingTeachers.length === 0 ? (
                                  <tr>
                                    <td colSpan="5" className="text-center">No pending teachers found</td>
                                  </tr>
                                ) : (
                                  PendingTeachers.map((teacher) => (
                                    <tr key={teacher.id}> {/* Assuming each teacher has a unique id */}
                                      <td>{teacher.fullName}</td> {/* Adjust the property names based on your API response */}
                                      <td>{teacher.email}</td>
                                      <td>********</td>
                                      <td>{teacher.dateOfBirth}</td>
                                      <td>
                                        <button className="btn btn-success btn-sm me-2" onClick={()=>AcceptedTeacher(teacher._id)}>
                                          <i className="bi bi-check-lg"></i> Accept
                                        </button>
                                        <button className="btn btn-danger btn-sm">
                                          <i className="bi bi-x-lg"></i> Reject
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

                    <div className="tab-pane fade" id="accepted" role="tabpanel" aria-labelledby="accepted-tab">
                      <div className="card">
                        <div className="card-body">
                          <h3 className="card-title">Accepted Teachers</h3>
                          <p className="card-text">List of teachers whose applications have been accepted.</p>
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
                              {verifiedProfs.length === 0 ? (
                                  <tr>
                                    <td colSpan="4" className="text-center">No accepted teachers found</td>
                                  </tr>
                                ) : (
                                  verifiedProfs.map((teacher) => (
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

export default Home;
