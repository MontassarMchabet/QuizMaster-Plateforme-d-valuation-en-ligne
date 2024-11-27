import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaUsers, FaClipboardList, FaChartLine, FaCog } from 'react-icons/fa';
import Navbar from '../home2/navbar';
import axios from 'axios';
const TeacherHomePage = () => {
  // Exemple de données pour les graphiques
 
  const [studentData, setStudentData] = useState(null);
    const [quizPerformanceData, setQuizPerformanceData] = useState([]); 

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reponses/TeacherDashbord`);
        setStudentData(response.data);
        
        // Exemple de transformation des données pour le graphique
        if (response.data.progressData) {
          setQuizPerformanceData(response.data.progressData.map((quiz) => ({
            name: quiz.quiz,
            averageScore: quiz.score
          })));
        }

        console.log(response);
      } catch (error) {
        console.error('Error fetching quiz result details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <>
    <div className='body2'>
      <Navbar />
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-4">Tableau de Bord Enseignant</h1>
          <p className="lead">Bienvenue sur votre espace de gestion QuizMaster</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Étudiants Actifs</Card.Title>
              <Card.Text className="display-4 text-primary"> {studentData ? studentData.StudentLength : 'Chargement...'}</Card.Text>
              <Button as={Link} to="/ActiveStudent" variant="outline-primary">Gérer les étudiants</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Quizzes Créés</Card.Title>
              <Card.Text className="display-4 text-success"> {studentData ? studentData.QuizLength : 'Chargement...'}</Card.Text>
              <Button as={Link} to="/TeacherDashbord" variant="outline-success">Voir les quizzes</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Score Moyen</Card.Title>
              <Card.Text className="display-4 text-info">{studentData ? `${studentData.ScoreAVG}%` : 'Chargement...'}</Card.Text>
              <Button as={Link} to="/StudentList" variant="outline-info">Voir les analyses</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Taux de Complétion</Card.Title>
              <Card.Text className="display-4 text-warning">92%</Card.Text>
              <Button as={Link} to="/StudentList" variant="outline-warning">Voir les rapports</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Performance des Quizzes</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={quizPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="averageScore" fill="#8884d8" name="Score Moyen" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Actions Rapides</Card.Title>
              <div className="d-grid gap-2">
                <Button variant="primary" size="lg" as={Link} to="/AddQuizs">
                  <FaClipboardList className="me-2" /> Créer un Nouveau Quiz
                </Button>
                <Button variant="secondary" size="lg" as={Link} to="/StudentList">
                  <FaChartLine className="me-2" /> Voir le Progrès des Étudiants
                </Button>
               
                <Button variant="light" size="lg" as={Link} to="/settings">
                  <FaCog className="me-2" /> Paramètres
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      
    </Container>
    </div>
    </>
  );
};

export default TeacherHomePage;