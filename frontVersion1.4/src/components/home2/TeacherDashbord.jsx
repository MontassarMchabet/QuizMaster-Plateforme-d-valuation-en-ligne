import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Card,
    CardContent
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';

export default function TeacherDashbord() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/quiz/getquizzes');
                setQuizzes(response.data);
            } catch (err) {
                setError('Erreur lors du chargement des quizs');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/quiz/deleteQuiz/${id}`);
            setQuizzes(quizzes.filter(quiz => quiz._id !== id));
        } catch (err) {
            setError('Erreur lors de la suppression du quiz');
        }
    };

    return (
        <>
        <div className='body2'>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Liste des Quizs
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <Button
                            component={Link}
                            to="/AddQuizs"
                            variant="contained"
                            color="primary"
                            sx={{
                                mb: 2,
                                borderRadius: '8px',
                                backgroundColor: '#4f46e5',
                                ':hover': {
                                    backgroundColor: '#3e3aa8'
                                }
                            }}
                        >
                            Create a quiz
                        </Button>
                        {quizzes.length > 0 ? (
                            <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
                                <CardContent>
                                    <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: 1 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Titre</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Durée (minutes)</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {quizzes.map((quiz) => (
                                                    <TableRow
                                                        key={quiz._id}
                                                        sx={{
                                                            '&:last-child td, &:last-child th': { border: 0 },
                                                            '&:hover': {
                                                                backgroundColor: '#f5f5f5',
                                                            }
                                                        }}
                                                    >
                                                        <TableCell>{quiz.title}</TableCell>
                                                        <TableCell>{quiz.description}</TableCell>
                                                        <TableCell>{quiz.duration}</TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Modifier">
                                                                <IconButton
                                                                    component={Link}
                                                                    to={`/EditQuiz/${quiz._id}`}
                                                                    color="primary"
                                                                    sx={{ marginRight: 1 }}
                                                                >
                                                                    <Edit />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Supprimer">
                                                                <IconButton
                                                                    onClick={() => handleDelete(quiz._id)}
                                                                    color="secondary"
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        ) : (
                            <Typography variant="body1" color="text.secondary">
                                Aucun quiz disponible
                            </Typography>
                        )}
                    </>
                )}
            </Container>
            <Footer />
            </div>
        </>
    );
}
