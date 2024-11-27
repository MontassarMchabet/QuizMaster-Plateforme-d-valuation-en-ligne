import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Image } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import "react-datepicker/dist/react-datepicker.css";
import Navbar from '../home2/navbar';
import "./c.css";

const UserProfile = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const { userId, role } = decodedToken;

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (role === "prof" || role === "client") {
          const response = await axios.get(`http://localhost:5000/auth/getUserById/${userId}`);
          setUser(response.data);
          setFormData(response.data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement du profil');
        setError('Erreur lors du chargement du profil');
      }
    };

    fetchUser();
  }, [userId, role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("profilePicture", image); // Ajout du fichier image
      
      const response = await axios.put(`http://localhost:5000/auth/updateUser/${userId}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setUser(response.data);
      setSuccess('Profil mis à jour avec succès');
      setEditMode(false);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil');
      setError('Erreur lors de la mise à jour du profil');
    }
  };

  return (
    <>
      <div className='body2'>
        <Navbar />
        <Container className="my-5">
          <Row className="justify-content-center">
            <Col md={8}>
              <Card>
                <Card.Header as="h2" className="text-center">User Profile</Card.Header>
                <Card.Body>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
                  {user ? (
                    <Form onSubmit={handleSubmit}>
                      <Row className="mb-3">
                        <Col md={4} className="text-center">
                        <Image 
                        src={`http://localhost:5000/uploads/${user.profilePicture}`} 
                        roundedCircle 
                        width={150} 
                        height={150} 
                        alt="Profile Picture" 
                        className="mb-3"
                        />
                          {editMode && (
                            <Form.Group controlId="profilePicture">
                              <Form.Label>Update Profile Picture</Form.Label>
                              <Form.Control 
                                type="file" 
                                name="profilePicture"
                               
                                onChange={handleImageChange}
                                disabled={!editMode}
                              />
                            </Form.Group>
                          )}
                        </Col>
                        <Col md={8}>
                          <Form.Group className="mb-3" controlId="fullName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="fullName"
                              value={formData.fullName || ''} 
                              onChange={handleInputChange}
                              disabled={!editMode}
                            />
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                              type="email" 
                              name="email"
                              value={formData.email || ''} 
                              onChange={handleInputChange}
                              disabled={!editMode}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      {editMode && (
                        <Button variant="primary" type="submit">
                          Save Changes
                        </Button>
                      )}
                      {!editMode && (
                        <Button variant="secondary" onClick={() => setEditMode(true)}>
                          Edit Profile
                        </Button>
                      )}
                    </Form>
                  ) : (
                    <p>Loading...</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserProfile;
