import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useHistory,useNavigate } from 'react-router-dom';
import {  Nav, Container, Row, Col, Card, Button, Table, Form, InputGroup, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Navbar from '../home2/navbar';
import axios from 'axios';
import {
  
    Typography,
    CardContent
} from '@mui/material';
const StudentList = () => {
    const history = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [averageScores, setAverageScores] = useState({});
  
/*     const students = [
      { id: 1, name: "Alice Dupont", email: "alice@example.com", quizzesTaken: 5, averageScore: 85 },
      { id: 2, name: "Bob Martin", email: "bob@example.com", quizzesTaken: 3, averageScore: 72 },
      { id: 3, name: "Charlie Leclerc", email: "charlie@example.com", quizzesTaken: 7, averageScore: 91 },
      { id: 4, name: "Diana Tremblay", email: "diana@example.com", quizzesTaken: 4, averageScore: 88 },
      { id: 5, name: "Etienne Côté", email: "etienne@example.com", quizzesTaken: 6, averageScore: 79 },
    ]; */
    const [students, setStudends] = useState([]);

    const fetchVerifiedStudents = async () => {
        try {
          const response = await axios.get('http://localhost:5000/reponses/GetAvrgScoreByStudentd');
          const studentsList = response.data;
          setStudends(studentsList);
    
         /*  // Récupérer les scores moyens de chaque étudiant
          const scores = {};
          for (const student of studentsList) {
            const resultResponse = await axios.get(`http://localhost:5000/reponses/GetAvrgScoreByStudentd/${student.id}`);
            scores[student.id] = resultResponse.data.averageScore;
          }
          setAverageScores(scores);  */// Stocker les scores moyens dans l'état
    
        } catch (error) {
          console.error('Error fetching students or scores:', error);
        }
      };
    
    useEffect(() => {
        fetchVerifiedStudents();
   
    }, []);


    const filteredStudents = students.filter(student =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const sortedStudents = [...filteredStudents].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  
    const handleSort = (column) => {
      if (column === sortColumn) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortColumn(column);
        setSortDirection('asc');
      }
    };
  
    return (
        <>
        <div className='body2'>

           <Navbar />
           <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} style={{marginTop:50}} >
           <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
           <CardContent>

      <div>
      
        <Typography variant="h4" gutterBottom>
                    Liste des Étudiants
                </Typography>
        <Form className="mb-3">
          <InputGroup>
           
            <Form.Control
              type="text"
              placeholder="Rechercher un étudiant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{height:50}}
            />
          </InputGroup>
        </Form>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} style={{cursor: 'pointer'}}>
                Nom {sortColumn === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('email')} style={{cursor: 'pointer'}}>
                Email {sortColumn === 'email' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('quizzesTaken')} style={{cursor: 'pointer'}}>
                Quizzes Passés {sortColumn === 'quizzesTaken' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('averageScore')} style={{cursor: 'pointer'}}>
                Score Moyen {sortColumn === 'averageScore' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => (
              <tr key={student.studentId}>
                <td>{student.fullName}</td>
                <td>{student.email}</td>
                <td>{student.nbPassedQuizzes}</td>
                <td>
                  <Badge bg={student.averageScore >= 80 ? 'success' : student.averageScore >= 60 ? 'warning' : 'danger'}>
                    {student.averageScore.toFixed(2)}%
                  </Badge>
                </td>
                <td>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => history(`/student-analysis/${student.studentId}`)}
                  >
                    Analyser
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      </CardContent>
      </Card>
      </Container>
      </div>
      </>
    );
  };
  
  export default StudentList;