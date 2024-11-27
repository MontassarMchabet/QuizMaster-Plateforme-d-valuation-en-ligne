import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import Navbar from '../home2/navbar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import "./c.css"

const QuizResultsList = () => {
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const { userId, role } = decodedToken;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reponses/getAllResultsbyId/${userId}`);
        console.log('Quiz Results:', response.data); // Log des résultats récupérés
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      }
    };

    fetchResults();
  }, [userId]);

  // Calculer le score pour chaque résultat de quiz
  const calculateScore = (result, totalQuestions) => {
    console.log('Answers:', result);  // Log des réponses récupérées
    console.log('Total Questions:', totalQuestions);  // Log du nombre total de questions

    const correctAnswers = result.answers.filter(answer => answer.isCorrect === true).length;
    console.log('Correct Answers:', correctAnswers);  // Log du nombre de bonnes réponses

    if (totalQuestions === 0) {
      return 0;
    }

    return (correctAnswers / totalQuestions) * 100;
  };

  return (
    <>
      <div className='body2'>
        <Navbar />
        <Container className="my-4">
          <h1 className="mb-4">Vos résultats de quiz</h1>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Quiz Title</th>
                <th>Score</th>
                <th>Date Taken</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => {
                const totalQuestions = result.quizId.questions.length; // Nombre total de questions
                const scorePercentage = calculateScore(result, totalQuestions);

                return (
                  <tr key={result._id}>
                    <td>{result.quizId.title}</td>
                    <td>{scorePercentage.toFixed(1)}%</td>
                    <td>{new Date(result.submittedAt).toLocaleString()}</td>
                    <td>
                      <Link to={`/getResultById/${result._id}`}>
                        <Button variant="primary" size="sm">View Details</Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
      </div>
    </>
  );
};

export default QuizResultsList;
