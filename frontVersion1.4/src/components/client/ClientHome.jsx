import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, ProgressBar, Form,Image } from 'react-bootstrap'
import { CheckCircle2, XCircle, Award, Brain, BookOpen } from 'lucide-react'
import Navbar from "../home2/navbar"
import Footer from "../home2/footer"
import "./c.css"
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BsLightbulbFill  } from "react-icons/bs";
import {jwtDecode} from 'jwt-decode';
import Spinner from 'react-bootstrap/Spinner';
const ItemType = 'ITEM';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {[...Array(20)].map((_, index) => (
          <motion.circle
            key={index}
            r={Math.random() * 50 + 10}
            cx={Math.random() * 100 + "%"}
            cy={Math.random() * 100 + "%"}
            fill="url(#grad1)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0, 0.5, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

const QuizList = ({ quizzes, onStartQuiz }) => {
  
  const [selectedQuiz, setSelectedQuiz] = useState("")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-100 max-w-3xl mx-auto bg-white bg-opacity-90">
        <Card.Header>
          <Card.Title className="h3 text-purple-700" style={{color:"#7e22ce",fontSize: "2.5rem",fontWeight: "bold", marginBottom: "5px"}}>Choisissez un Quiz</Card.Title>
          <Card.Subtitle className="text-purple-600"style={{color:"#7e22ce", marginTop: "10px"}}>Sélectionnez un quiz dans la liste ci-dessous pour commencer</Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <div style={{ height: '400px', paddingRight: '1rem' ,padding: "20px",overflowX:"auto"}}>
            {quizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className={`mb-4 cursor-pointer ${
                    selectedQuiz === quiz._id ? 'bg-dark' :''
                  }`}
                  onClick={() => {setSelectedQuiz(quiz._id)}}                  
                >
                  <Card.Header>
                    <Card.Title className="d-flex align-items-center text-purple-700" style={{color:"#7e22ce",fontSize: "1.5rem",fontWeight: "bold", marginBottom: "5px"}}>
                      {quiz.title === 'Quiz de Géographie' ? <Brain className="me-2" /> : <BookOpen className="me-2" />}
                      {quiz.title}
                    </Card.Title>
                    <Card.Subtitle className="text-purple-600" style={{color:"#7e22ce",fontSize: "1rem",marginTop: "10px"}}>
                      {quiz.description}
                    </Card.Subtitle>
                  </Card.Header>
                  <Card.Footer>
                    <p  style={{color:"#7e22ce"}}>{quiz.questions.length} questions</p>
                  </Card.Footer>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card.Body>
        <Card.Footer>
          <Button 
            variant="primary"
            className="w-100"
            disabled={!selectedQuiz}
            onClick={() => selectedQuiz && onStartQuiz(selectedQuiz)}
          >
            Commencer le Quiz
          </Button>
        </Card.Footer>
      </Card>
    </motion.div>
  )
}

QuizList.propTypes = {
  quizzes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    questions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
      correctAnswer: PropTypes.number.isRequired
    })).isRequired
  })).isRequired,
  onStartQuiz: PropTypes.func.isRequired
}


const DraggableItem = ({ item, index }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { item, index },
  });

  return (
    <div
      ref={ref}
      style={{
        padding: '10px',
        margin: '5px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        cursor: 'grab',
      }}
    >
      {item}
    </div>
  );
};

const DroppableZone = ({ option, onDrop, droppedItem }) => {
  const [{ isOver }, ref] = useDrop({
    accept: ItemType,
    drop: (item) => onDrop(option, item.item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={ref}
      style={{
        padding: '10px',
        margin: '5px',
        backgroundColor: isOver ? '#e2e6ea' : '#ffffff',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        minHeight: '40px',
      }}
    >
      {droppedItem || 'Drop here: ' + option}
    </div>
  );
};

const DragAndDropQuiz = ({ dragOptions, options, droppedItems, setDroppedItems }) => {
  // Fonction appelée lorsqu'un élément est déposé
  const handleDrop = (option, item) => {
    setDroppedItems((prevState) => ({
      ...prevState,
      [option]: item,  // Associer l'option (zone de dépôt) à l'élément glissé
    }));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <h4>Draggable Items</h4>
        {dragOptions.map((item, index) => (
          <DraggableItem key={index} item={item} index={index} />
        ))}
      </div>
      <div>
        <h4>Drop Zones</h4>
        {options.map((option, index) => (
          <DroppableZone
            key={index}
            option={option}
            droppedItem={droppedItems[option]} // Afficher l'élément déposé s'il y en a un
            onDrop={handleDrop} // Gérer le dépôt d'un élément
          />
        ))}
      </div>
    </div>
  );
};


const QuizResult = ({ score, totalQuestions, onRestart }) => {
  const percentage = (score / totalQuestions) * 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-100 max-w-2xl mx-auto bg-white bg-opacity-90">
        <Card.Header>
          <Card.Title className="h3 d-flex align-items-center justify-content-center text-warning">
            <Award className="me-2" size={32} />
            Résultat du Quiz
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="text-center mb-4">
            <p className="display-4 mb-2 text-warning">Votre score : {score}/{totalQuestions}</p>
            <ProgressBar now={percentage} label={`${percentage.toFixed(0)}%`} variant="warning" />
          </div>
          <p className="text-center h4 mt-4">
            {percentage >= 80 ? (
              <span className="d-flex align-items-center justify-content-center text-success">
                <CheckCircle2 className="me-2" />
                Excellent travail !
              </span>
            ) : percentage >= 60 ? (
              <span className="d-flex align-items-center justify-content-center text-warning">
                <CheckCircle2 className="me-2" />
                Bon travail, continuez à vous améliorer !
              </span>
            ) : (
              <span className="d-flex align-items-center justify-content-center text-danger">
                <XCircle className="me-2" />
                Continuez à pratiquer, vous vous améliorerez !
              </span>
            )}
          </p>
        </Card.Body>
        <Card.Footer>
          <Button 
            variant="warning"
            className="w-100 text-white"
            onClick={onRestart}
          >
            Retour à la liste des Quiz
          </Button>
        </Card.Footer>
      </Card>
    </motion.div>
  )
}

QuizResult.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  onRestart: PropTypes.func.isRequired
}
const ReponseId = Array();
const QuizQuestion = ({ question, onAnswer, currentQuestion, totalQuestions, quizDuration,maxh }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [shortAnswer, setShortAnswer] = useState('');
  const [usedHints, setUsedHints] = useState([]);
  const [dragOptions, setDragOptions] = useState(question.dragOptions || []);
  const [Option, setOptions] = useState(question.options || []);
  const [timeLeft, setTimeLeft] = useState(quizDuration * 60); // Convert minutes to seconds
  const [droppedItems, setDroppedItems] = useState({}); 
  const [showHints, setShowHints] = useState(false);
  const [co,setC]= useState(0);
  const [emotionData, setEmotionData] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false); 
/*   --------------- */
  const [isCorrect, setIsCorrect] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0); // Temps passé sur la question
    const [timer, setTimer] = useState(null);
    const videoRef = useRef(null);    

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onAnswer(null); // Auto-submit when time is up
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onAnswer, quizDuration]);

  useEffect(() => {
    setSelectedOption(null);
    setShortAnswer('');
    setUsedHints([]);
    if (question.type === 'drag_and_drop') {
      setDragOptions(question.dragOptions);
      setOptions(question.options);
    }
    setShowHints(false);
  }, [question]);
    // Demander l'accès à la webcam et démarrer la vidéo
    useEffect(() => {
      const startWebcam = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    
          if (videoRef.current) {
            videoRef.current.srcObject = stream; // Attache le flux vidéo à l'élément
            videoRef.current.onloadedmetadata = () => {
              setIsVideoReady(true); // Marque la vidéo comme prête une fois que les métadonnées sont chargées
            };
          } else {
            console.error("L'élément vidéo n'est pas encore monté.");
          }
        } catch (error) {
          console.error("Erreur d'accès à la webcam :", error);
        }
      };
    
      startWebcam();
    }, []);
  
    const uploadImageToCloudinary = async (imageData) => {
     
      const formData = new FormData();
      formData.append("file", imageData); // Ajoute l'image en base64
      formData.append("upload_preset", "ml_default"); // Ton preset d'upload Cloudinary
      formData.append("cloud_name", "dyfgn9cgt");
    
      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dyfgn9cgt/image/upload',
          formData, // Envoie du formData directement
          {
            headers: { 'Content-Type': 'multipart/form-data' }, // Nécessaire pour form-data
          }
        );
        console.log("response",response.data.secure_url);
        return response.data.secure_url; // Retourne l'URL publique de l'image

      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image:', error);
        return null;
      }
    };

    const captureImage = async () => {
      if (!isVideoReady || !videoRef.current) {
        console.error('L\'élément vidéo n\'est pas encore disponible.');
        return null;
      }
    
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
    
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth /2;
        canvas.height = video.videoHeight/2;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const base64Image = canvas.toDataURL('image/jpeg'); 
        console.log("Image en base64 capturée :", base64Image);

        const imageUrl = await uploadImageToCloudinary(base64Image);
        
        if (imageUrl) {
          console.log("URL de l'image :", imageUrl);
          return imageUrl; // Retourne l'URL publique de l'image
        } else {
          console.error("Erreur lors de la génération de l'URL de l'image.");
          return null;
        }
      } else {
        console.error('Les dimensions de la vidéo sont invalides.');
        return null;
      }
    };
    


  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };
  // Fonction pour analyser l'image capturée via l'API RapidAPI
  const analyzeEmotion = async () => {
    
    const imageData = await captureImage(); // Capture l'image à partir de la webcam
    console.log("imageData",imageData)
    const options = {
      method: 'POST',
      url: 'https://emotion-detection2.p.rapidapi.com/emotion-detection',
      headers: {
        'x-rapidapi-key': '52c6bd961cmshe3e94c21b403f81p10ca7ajsneed53a590313',
        'x-rapidapi-host': 'emotion-detection2.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      data:{
        url: imageData,
      },
    };

    try {
      const response = await axios.request(options);
      console.log("reeeep",response)
      const emotion = response.data[0];
    return emotion.emotion.value;
     
    } catch (error) {
      console.error('Erreur lors de l\'analyse des émotions :', error);
     
    }
  };

  const handleShortAnswerChange = (e) => {
    setShortAnswer(e.target.value);
  };

  const handleSubmit = () => {
    let answer;
    switch (question.type) {
      case 'multiple_choice':
        answer = selectedOption;
        break;
      case 'short_answer':
        answer = shortAnswer;
        break;
      case 'drag_and_drop':
               answer = Object.keys(droppedItems)
               .map(option => `${droppedItems[option]}=${option}`)
               .join(',');
               console.log(answer,"answer");
             break;
        break;
        case 'image': 
        answer = selectedOption;
        break;  
      default:
        answer = selectedOption;
    }
    onAnswer(answer,analyzeEmotion);
  };

   const handleUseHint = () => {
    if (co < maxh) {
      setC(co+1);
      console.log(co)
      setShowHints(true);
    }
    else{
      
    }
   
  }; 
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="video-container">
          <video ref={videoRef} id="videoElement" width="40" height="10" autoPlay muted   style={{ visibility: isVideoVisible ? 'visible' : 'hidden' }} />
        </div>
      <Card className="quiz-question-card">
      
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
          {question.hints && maxh > usedHints.length && (
            <Button variant="outline-info" onClick={handleUseHint} className="mt-3">
             {maxh - co} <BsLightbulbFill />

            </Button>
          )}
            <h2>Question {currentQuestion} of {totalQuestions}</h2>
            <div className="timer">Time Left: {formatTime(timeLeft)}</div>
          </div>
          <ProgressBar now={(currentQuestion / totalQuestions) * 100} variant="info" />
        </Card.Header>
        <Card.Body>
          <Card.Title> <h2>{question.content}</h2></Card.Title>
          {/* Ajoutez l'élément vidéo ici */}
        
          {question.type === 'multiple_choice' && (
                     <Form>
                     {(showHints  ? question.hints : question.options).map((option, index) => (
                       <Form.Check
                         key={index}
                         type="radio"
                         id={`option-${index}`}
                         label={option}
                         name="quizOption"
                         checked={selectedOption === option}
                         onChange={() => handleOptionChange(option)}
                         className="mb-2"
                       />
                     ))}
                   </Form>
          )}
          {question.type === 'short_answer' && (
            <Form.Control
              type="text"
              placeholder="Enter your answer"
              value={shortAnswer}
              onChange={handleShortAnswerChange}
            />
          )}
        {question.type === 'drag_and_drop' && (
           <DndProvider backend={HTML5Backend}>
          
           <DragAndDropQuiz
             dragOptions={question.dragOptions}
             options={question.options}
             droppedItems={droppedItems} // Passer droppedItems au composant enfant
             setDroppedItems={setDroppedItems}     
           />
         </DndProvider>
      )}     
      {question.type === 'image' && (
            <>
              {question.media && (
                <Image src={question.media} alt="Question image" fluid className="mb-3" />
                
              )}
              <Form>
              {(showHints ? question.hints : question.options).map((option, index) => (
                <Form.Check
                  key={index}
                  type="radio"
                  id={`option-${index}`}
                  label={option}
                  name="quizOption"
                  checked={selectedOption === option}
                  onChange={() => handleOptionChange(option)}
                  className="mb-2"
                />
              ))}
            </Form>
            </>
          )} 

        </Card.Body>
        <Card.Footer>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              (question.type === 'multiple_choice' && !selectedOption) ||
              (question.type === 'short_answer' && !shortAnswer) ||
              (question.type === 'drag_and_drop' && dragOptions.length === 0)||
              (question.type === 'image' && !selectedOption) 
            }
          >
            Submit Answer
          </Button>
        </Card.Footer>
      </Card>
    </motion.div>
  );
};
export default function ClientHome() {
  const [currentQuizId, setCurrentQuizId] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [questions, setQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const { userId, role } = decodedToken;
  const [startTime, setStartTime] = useState(null); // état pour enregistrer le temps de début
  const [timeSpent, setTimeSpent] = useState(0); // état pour enregistrer le temps passé
  
  useEffect(() => {
      const fetchQuizzes = async () => {
          try {
              const response = await axios.get('http://localhost:5000/quiz/getquizzes');
              setQuizzes(response.data);
          } catch (err) {
              setError('Erreur lors du chargement des quizs');
          }
      };

      fetchQuizzes();
  }, []);

  const handleStartQuiz = (quizId) => {
    setCurrentQuizId(quizId)
    setCurrentQuestionIndex(0)
    setScore(0)
    setQuizCompleted(false)
    setStartTime(Date.now());
  }
  const calculateTimeSpent = () => {
    const now = Date.now();
    const timeElapsed = (now - startTime) / 1000; // Temps passé en secondes
    return timeElapsed;
  };


 
 const fetchResult = async (selectedOption ,emotions,timeSpentOnquiz) => {
  console.log("emotionssss",emotions)
  try {
    const rep = await axios.post('http://localhost:5000/reponses/submitquiz', {
        studentId :userId,
        quizId: currentQuizId,
        answers: selectedOption,
        emotion:emotions,
        timeSpent:timeSpentOnquiz

    });
    
    setScore(rep.data)
   
} catch (error) {
    console.error('Erreur lors de la soumission du résultat:', error);
}
}

 const compareTexts = async (userAnswer, correctAnswer) => {
  const options = {
    method: 'POST',
    url: 'https://api.api-ninjas.com/v1/textsimilarity',
    headers: {
      'X-Api-Key': 'z6tIKCQyM2BKc+BV7J6T0w==zTJt9ZFZhMSGUQwJ',  
      'Content-Type': 'application/json', 
    },
    data: {
      text_1: userAnswer,
      text_2: correctAnswer
    }
  };

  try {
    const response = await axios.request(options);
    const similarityScore = response.data.similarity;

    return similarityScore;
  } catch (error) {
    console.error("Erreur lors de la comparaison des textes :", error);
    return 0;  // Retourne 0 en cas d'erreur
  }
};

  const handleAnswer2 = async (selectedOption,analyzeEmotion) => {
    
    try {
      const currentQuiz = quizzes.find(quiz => quiz._id === currentQuizId)
  
      let isCorrect = false;
      if(currentQuiz.questions[currentQuestionIndex].type === "drag_and_drop"){
        const similarityScore = await compareTexts(selectedOption, currentQuiz.questions[currentQuestionIndex].correctAnswer);

        console.log("similarityScore", similarityScore);
         isCorrect = similarityScore >= 1;

      }
      else{
        const similarityScore = await compareTexts(selectedOption, currentQuiz.questions[currentQuestionIndex].correctAnswer);

        console.log("similarityScore", similarityScore);
         isCorrect = similarityScore >= 0.5;

      }

      const rep = await axios.post('http://localhost:5000/reponses/submitReponse', {
          studentId :userId,
          questionId :currentQuiz.questions[currentQuestionIndex]._id ,
          quizId: currentQuizId,
          answer: selectedOption, 
          timeSpent:1 ,
          isCorrect:isCorrect
      });
      const reponse = rep.data;
      
       ReponseId.push(reponse)

       
      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1)
      } else {
       
        setQuizCompleted(true)
        const timeSpentOnQuestion = calculateTimeSpent();
        setLoading(true)
        const emotion  = await analyzeEmotion()
        setLoading(false)
        console.log("emotion", emotion)
        
        console.log(ReponseId)
        fetchResult(ReponseId,emotion,timeSpentOnQuestion)

      }
  } catch (error) {
      console.error('Erreur lors de la soumission du résultat:', error);
  }
  }
  const handleRestart = () => {
    setCurrentQuizId(null)
    setCurrentQuestionIndex(0)
    setScore(0)
    setQuizCompleted(false)
    setStartTime(null);
    setTimeSpent(0);
  }

  const currentQuiz = currentQuizId ? quizzes.find(quiz => quiz._id === currentQuizId) : null

  return(
    <>
      <div className='body2'>
        <Navbar />
        <div className="position-relative min-vh-100 overflow-hidden">
          <AnimatedBackground />
          <div className="container py-4 position-relative" style={{ zIndex: 10 }}>
            <AnimatePresence mode="wait">
              {!currentQuizId && (
                <QuizList key="quiz-list" quizzes={quizzes} onStartQuiz={handleStartQuiz} />
              )}
              {currentQuizId && !quizCompleted && currentQuiz && (
                <div key="quiz-question">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ originX: 0 }}
                  >
                   
                  </motion.div>
                  <QuizQuestion 
                    question={currentQuiz.questions[currentQuestionIndex]} 
                    onAnswer={handleAnswer2}
                    currentQuestion={currentQuestionIndex + 1}
                    totalQuestions={currentQuiz.questions.length}
                    quizDuration={currentQuiz.duration}
                    maxh={currentQuiz.maxH}
                    userid ={userId}
                    currentQuizId= {currentQuiz._id}

                  />
                </div>
              )}
                {loading && (  // Affichage du spinner si le quiz est terminé et loading est true
                <div className="d-flex justify-content-center align-items-center">
              
                    <span className="sr-only">Chargement en cours...</span>
                  
                </div>
              )}


              {!loading && quizCompleted && currentQuiz && (
                <QuizResult 
                  key="quiz-result"
                  score={score} 
                  totalQuestions={currentQuiz.questions.length} 
                  onRestart={handleRestart} 
                />
              )}
            </AnimatePresence>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}