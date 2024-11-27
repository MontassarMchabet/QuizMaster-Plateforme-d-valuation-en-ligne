import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import {
    Container,
    Typography,
    TextField,
    Button,
    MenuItem,
    Card,
    CardContent,
    Grid,
    Alert,
    Box,
    IconButton,
    Divider
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Footer from './footer';
import Navbar from './navbar';

export default function AddQuizs() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const { userId } = decodedToken;

    const handleAddQuestion = () => { 
        
        setQuestions([
            ...questions,
            {
                type: '',
                content: '',
                options: [],
                correctAnswer: '',
                media: '',
                hints: [],
                dragOptions: [],  // Pour les questions de type glisser-déposer
            }
        ]);
    };

    const handleRemoveQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };
    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            const updatedQuestions = [...questions];
            updatedQuestions[index].media = base64String;
            setQuestions(updatedQuestions);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = async (e) => {
        console.log(questions)
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/quiz/addquizzes', {
                title,
                teacherId: userId,
                description,
                duration,
                questions
            });
            setSuccess('Quiz créé avec succès');
            setTitle('');
            setDescription('');
            setDuration('');
            setQuestions([]);
            navigate('/TeacherDashbord')
            console.log(questions)
        } catch (err) {
            setError('Erreur lors de la création du quiz');
        }
    };

    return (
        <>
          <div className='body2'>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Créer un Quiz
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    label="Titre du Quiz"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                                <TextField
                                    label="Description"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <TextField
                                    label="Durée (en minutes)"
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    required
                                />
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Questions
                            </Typography>
                            {questions.map((question, index) => (
                                <Card key={index} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            Question {index + 1}
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemoveQuestion(index)}
                                                sx={{ float: 'right' }}
                                            >
                                                <RemoveCircleIcon />
                                            </IconButton>
                                        </Typography>
                                        <TextField
                                            label="Type de Question"
                                            select
                                            fullWidth
                                            margin="normal"
                                            value={question.type}
                                            onChange={(e) => {
                                                const updatedQuestions = [...questions];
                                                updatedQuestions[index].type = e.target.value;
                                                setQuestions(updatedQuestions);
                                            }}
                                            required
                                        >
                                            <MenuItem value="multiple_choice">Choix multiples</MenuItem>
                                            <MenuItem value="image">Image</MenuItem>
                                            <MenuItem value="drag_and_drop">Glisser-déposer</MenuItem>
                                            <MenuItem value="short_answer">Réponse courte</MenuItem>
                                        </TextField>
                                        <TextField
                                            label="Contenu"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={question.content}
                                            onChange={(e) => {
                                                const updatedQuestions = [...questions];
                                                updatedQuestions[index].content = e.target.value;
                                                setQuestions(updatedQuestions);
                                            }}
                                            required
                                        />
                                        {question.type === 'multiple_choice' && (
                                            <>
                                                <TextField
                                                    label="Options (séparées par des virgules)"
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    value={question.options.join(',')}
                                                    onChange={(e) => {
                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[index].options = e.target.value.split(',');
                                                        setQuestions(updatedQuestions);
                                                    }}
                                                    required
                                                />
                                                <TextField
                                                    label="Réponse Correcte"
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    value={question.correctAnswer}
                                                    onChange={(e) => {
                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[index].correctAnswer = e.target.value;
                                                        setQuestions(updatedQuestions);
                                                    }}
                                                    required
                                                />
                                            <TextField
                                            label="Indices (séparés par des virgules)"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={question.hints.join(',')}
                                            onChange={(e) => {
                                                const updatedQuestions = [...questions];
                                                updatedQuestions[index].hints = e.target.value.split(',');
                                                setQuestions(updatedQuestions);
                                            }}
                                        />
                                            </>
                                        )}
                                        {question.type === 'drag_and_drop' && (
                                            <>
                                                <TextField
                                                    label="Options de Glisser(séparées par des virgules)"
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    value={question.dragOptions.join(',')}
                                                    onChange={(e) => {
                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[index].dragOptions = e.target.value.split(',');
                                                        setQuestions(updatedQuestions);
                                                    }}
                                                    required
                                                />
                                                  <TextField
                                                    label="Options de Déposer (séparées par des virgules)"
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    value={question.options.join(',')}
                                                    onChange={(e) => {
                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[index].options = e.target.value.split(',');
                                                        setQuestions(updatedQuestions);
                                                    }}
                                                    required
                                                />
                                                <TextField
                                                    label="Réponse Correcte"
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    value={question.correctAnswer}
                                                    onChange={(e) => {
                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[index].correctAnswer = e.target.value;
                                                        setQuestions(updatedQuestions);
                                                    }}
                                                    required
                                                />
                                            </>
                                        )}
                                    
                                      {question.type === 'short_answer' && (
                                            <>
                                            
                                                <TextField
                                                    label="Réponse Correcte"
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    value={question.correctAnswer}
                                                    onChange={(e) => {
                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[index].correctAnswer = e.target.value;
                                                        setQuestions(updatedQuestions);
                                                    }}
                                                    required
                                                />
                                            <TextField
                                            label="Indices"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={question.hints.join(',')}
                                            onChange={(e) => {
                                                const updatedQuestions = [...questions];
                                                updatedQuestions[index].hints = e.target.value.split(',');
                                                setQuestions(updatedQuestions);
                                            }}
                                        />
                                            </>
                                        )}
                                      {question.type === 'image' && (
                                            <>
                                                 <TextField
                                                    label="Options (séparées par des virgules)"
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    value={question.options.join(',')}
                                                    onChange={(e) => {
                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[index].options = e.target.value.split(',');
                                                        setQuestions(updatedQuestions);
                                                    }}
                                                  /*   required */
                                                />
                                                <TextField
                                                    label="Réponse Correcte"
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    value={question.correctAnswer}
                                                    onChange={(e) => {
                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[index].correctAnswer = e.target.value;
                                                        setQuestions(updatedQuestions);
                                                    }}
                                                    required
                                                />

                                            <TextField
                                            label="Indices (séparés par des virgules)"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={question.hints.join(',')}
                                            onChange={(e) => {
                                                const updatedQuestions = [...questions];
                                                updatedQuestions[index].hints = e.target.value.split(',');
                                                setQuestions(updatedQuestions);
                                            }}
                                        />
                                           <input
                                                        accept="image/*"
                                                        type="file"
                                                        onChange={(e) => handleFileChange(e, index)}
                                                        style={{ marginTop: '16px', marginBottom: '16px' }}
                                                        /* required */
                                                    />
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddQuestion}
                                sx={{ mb: 2 }}
                                startIcon={<AddCircleIcon />}
                            >
                                Ajouter une Question
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                type="submit"
                            >
                                Créer le Quiz
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Container>
            <Footer />
            </div>
        </>
    );
}
