
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaQuestionCircle, FaClipboardList, FaChartBar, FaTrophy } from 'react-icons/fa';
import Navbar from '../home2/navbar';
const Firstpage = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(null);

  const features = [
    {
      title: "Quizzes Interactifs",
      description: "Participez à des quizzes stimulants sur divers sujets pour tester et améliorer vos connaissances.",
      icon: <FaQuestionCircle size={40} />,
      color: "primary"
    },
    {
      title: "Suivi des Progrès",
      description: "Visualisez vos performances et votre progression au fil du temps grâce à des graphiques détaillés.",
      icon: <FaChartBar size={40} />,
      color: "success"
    },
    {
      title: "Révision Personnalisée",
      description: "Recevez des recommandations de révision basées sur vos résultats pour cibler vos points faibles.",
      icon: <FaClipboardList size={40} />,
      color: "info"
    },
    {
      title: "Récompenses et Badges",
      description: "Gagnez des badges et des récompenses en atteignant différents objectifs d'apprentissage.",
      icon: <FaTrophy size={40} />,
      color: "warning"
    }
  ];

  const handleShowModal = (feature) => {
    setCurrentFeature(feature);
    setShowModal(true);
  };

  return (
    <>
    <div className='body2'>
      <Navbar />
      <br></br>
    <Container className="py-5">
      <Row className="justify-content-center mb-5">
        <Col md={8} className="text-center">
          <h1 className="display-4 mb-4">Bienvenue sur QuizMaster</h1>
          <p className="lead">
            Votre plateforme d'apprentissage interactive pour améliorer vos connaissances et suivre vos progrès.
          </p>
        </Col>
      </Row>

      <Row>
        {features.map((feature, index) => (
          <Col key={index} md={6} lg={3} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className={`text-${feature.color} mb-3`}>
                  {feature.icon}
                </div>
                <Card.Title>{feature.title}</Card.Title>
                <Card.Text>{feature.description}</Card.Text>
                <Button 
                  variant="outline-primary" 
                  className="mt-auto"
                  onClick={() => handleShowModal(feature.title)}
                >
                  En savoir plus
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-5">
        <Col className="text-center">
          <h2 className="mb-4">Prêt à commencer ?</h2>
          <Button as={Link} to="/clientHome" variant="primary" size="lg">
            Voir les Quizzes Disponibles
          </Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentFeature}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/placeholder.svg?height=300&width=800&text=Capture+d'écran+1"
                alt="Capture d'écran 1"
              />
              <Carousel.Caption>
                <h3>Fonctionnalité en action</h3>
                <p>Description détaillée de la fonctionnalité.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/placeholder.svg?height=300&width=800&text=Capture+d'écran+2"
                alt="Capture d'écran 2"
              />
              <Carousel.Caption>
                <h3>Comment l'utiliser</h3>
                <p>Guide étape par étape pour utiliser cette fonctionnalité.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
          <Button variant="primary" as={Link} to={`/feature/${currentFeature}`}>
            Essayer maintenant
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </div>
    </>
  );
};

export default Firstpage;