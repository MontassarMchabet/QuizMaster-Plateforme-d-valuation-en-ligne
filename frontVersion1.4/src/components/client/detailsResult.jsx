import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, ProgressBar, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaTrophy, FaClock, FaCheckCircle, FaTimesCircle, FaQuestionCircle } from 'react-icons/fa';
import Navbar from '../home2/navbar';
ChartJS.register(ArcElement, Tooltip, Legend);

const QuizResultDetails = () => {
  const [result, setResult] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchResultDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reponses/getResultById/${id}`);
        setResult(response.data);
      } catch (error) {
        console.error('Error fetching quiz result details:', error);
      }
    };

    fetchResultDetails();
  }, [id]);

  if (!result) {
    return <Container className="my-4"><p>Loading...</p></Container>;
  }

  const totalQuestions = result.answers.length;
  console.log("totalQuestions",totalQuestions)
  const answeredQuestions = result.answers.filter(answer => answer.answer !== null).length;
  const correctAnswers = result.answers.filter(answer => answer.isCorrect===true).length;
  console.log("correctAnswers",correctAnswers)
  const incorrectAnswers = totalQuestions - correctAnswers;
  const unansweredQuestions = totalQuestions - answeredQuestions;
  const scorePercentage = (correctAnswers / totalQuestions) * 100;
  const pieChartData = {
    labels: ['Correct', 'Incorrect', 'Unanswered'],
    datasets: [
      {
        data: [correctAnswers, incorrectAnswers, unansweredQuestions],
        backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
        hoverBackgroundColor: ['#218838', '#c82333', '#e0a800'],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <>
    <div className='body2'>
      <Navbar />
<Container className="my-5">
      <Card className="shadow-lg">
        <Card.Header className="bg-primary text-white">
          <h1 className="mb-0">{result.quizId.title} - Détails du résultat</h1>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <h2 className="text-center mb-4">
                    <FaTrophy className="text-warning me-2" />
                    Score global
                  </h2>
                  <div className="text-center">
                    <h1 className="display-1 text-primary mb-3">{scorePercentage}%</h1>
                    <ProgressBar 
                      now={scorePercentage} 
                      label={`${scorePercentage}%`} 
                      variant="success" 
                      className="mb-3" 
                      style={{height: '30px'}}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <h2 className="text-center mb-4">
                    <FaQuestionCircle className="text-info me-2" />
                    Répartition des réponses
                  </h2>
                  <div style={{ height: '250px' }}>
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Body>
                  <h2 className="mb-4">Statistiques détaillées</h2>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Métrique</th>
                        <th>Valeur</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><FaCheckCircle className="text-success me-2" /> Réponses correctes</td>
                        <td>{correctAnswers}</td>
                      </tr>
                      <tr>
                        <td><FaTimesCircle className="text-danger me-2" /> Réponses incorrectes</td>
                        <td>{incorrectAnswers}</td>
                      </tr>
                      <tr>
                        <td><FaQuestionCircle className="text-warning me-2" /> Questions sans réponse</td>
                        <td>{unansweredQuestions}</td>
                      </tr>
                      <tr>
                        <td><FaQuestionCircle className="text-info me-2" /> Total des questions</td>
                        <td>{totalQuestions}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="text-muted">
          <FaClock className="me-2" />
          Submitted on: {new Date(result.submittedAt).toLocaleString()}
        </Card.Footer>
      </Card>
    </Container>
    </div>
    </>
  );
};

export default QuizResultDetails;