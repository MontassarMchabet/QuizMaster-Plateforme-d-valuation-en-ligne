import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Image, Tabs, Tab } from 'react-bootstrap';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaArrowLeft, FaClock, FaMedal } from 'react-icons/fa';
import Navbar from '../home2/navbar';
import axios from 'axios';

const StudentDetailedAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('progress');
  const [studentData, setStudentData] = useState(null);  // Modifié pour accepter null au départ

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reponses/GetDetailsByStudentd/${id}`);
        setStudentData(response.data);
      } catch (error) {
        console.error('Error fetching quiz result details:', error);
      }
    };

    fetchUserDetails();
  }, [id]);

  const getBadgeVariant = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getBadgeText = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    return 'À améliorer';
  };

  if (!studentData) {
    return <div>Chargement des données...</div>; // Un écran de chargement
  }

  return (
    <>
      <div className='body2'>
        <Navbar />
        <Container className="my-4">
          <Button variant="outline-primary" className="mb-4" onClick={() => navigate(-1)}>
            <FaArrowLeft className="me-2" /> Retour à la liste des étudiants
          </Button>

          <Row>
            <Col xs={12}>
              <Card className="mb-4">
                <Card.Body>
                  <Row>
                    <Col md={3} className="text-center mb-3 mb-md-0">
                      <Image src={( studentData.picture ? `http://localhost:5000/uploads/${studentData.picture}`: 'https://via.placeholder.com/150')}  roundedCircle width={100} height={100} alt={studentData.name} />
                    </Col>
                    <Col md={9}>
                      <h2>{studentData.name}</h2>
                      <p><strong>Email:</strong> {studentData.email}</p>
                      <p><strong>Quizzes Passés:</strong> {studentData.quizzesTaken}</p>
                      <p>
                        <strong>Score Moyen:</strong> {studentData.averageScore.toFixed(1)}% 
                        <Badge bg={getBadgeVariant(studentData.averageScore)} className="ms-2">
                          {getBadgeText(studentData.averageScore)}
                        </Badge>
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    <span>Temps Total de Quiz</span>
                    <FaClock />
                  </Card.Title>
                  <h3>{studentData.totalQuizTime} minutes</h3>
                  <p className="text-muted">
                    Temps moyen par quiz: {(studentData.totalQuizTime / studentData.quizzesTaken).toFixed(1)} minutes
                  </p>
                  <ProgressBar now={(studentData.totalQuizTime / 300) * 100} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    <span>Meilleur Score</span>
                    <FaMedal />
                  </Card.Title>
                  <h3>{Math.max(...studentData.progressData.map(d => d.score))}%</h3>
                  <p className="text-muted">
                    {studentData.progressData.find(d => d.score === Math.max(...studentData.progressData.map(d => d.score)))?.quiz}
                  </p>
                  <ProgressBar now={Math.max(...studentData.progressData.map(d => d.score))} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    <span>Progression</span>
                  </Card.Title>
                  <h3>
                    {studentData.progression}%
                  </h3>
                  <p className="text-muted">
                    Amélioration depuis le premier quiz
                  </p>
                  <ProgressBar
                    now={(studentData.progressData[studentData.progressData.length - 1].score - studentData.progressData[0].score) / studentData.progressData[0].score * 100}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            <Tab eventKey="progress" title="Progression">
              <Card>
                <Card.Body>
                  <Card.Title>Progression des Scores</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Évolution des scores et du temps moyen par quiz</Card.Subtitle>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={studentData.progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quiz" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="score" stroke="#8884d8" name="Score" />
                      <Line yAxisId="right" type="monotone" dataKey="averageTime" stroke="#82ca9d" name="Temps Moyen" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="emotional" title="Analyse Émotionnelle">
              <Card>
                <Card.Body>
                  <Card.Title>Analyse Émotionnelle</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Évolution de la confiance et du stress par quiz</Card.Subtitle>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={studentData.emotionalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quiz" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="confidence" fill="#8884d8" name="Confiance" />
                      <Bar dataKey="stress" fill="#82ca9d" name="Stress" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Tab>

            
          </Tabs>
        </Container>
      </div>
    </>
  );
};

export default StudentDetailedAnalysis;
