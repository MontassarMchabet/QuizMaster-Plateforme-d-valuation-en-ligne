import React, { useState, useEffect } from 'react';
import './login.css';
import Header from './header';
import Footer from './footer';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      const { token, refreshToken } = response.data;

      // Stockage des tokens et de la durée d'expiration
      const expirationTime = Date.now() + 4 * 60 * 60 * 1000; // 4 heures
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('expirationTime', expirationTime);

      // Décodage du token JWT
      const decodedToken = jwtDecode(token);
      const { role } = decodedToken;

      // Redirection selon le rôle de l'utilisateur
      handleUserRole(role);
    } catch (error) {
      // Gestion des erreurs retournées par l'API
      if (error.response) {
        setError(error.response.data.error || 'Une erreur est survenue.');
      } else {
        setError('Erreur réseau ou problème serveur.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserRole = (role) => {
    if (role === 'admin') {
      navigate('/teachers');
    } else if (role === 'prof') {
      navigate('/Homepage');
    } else {
      navigate('/Homepage');
    }
  };

  useEffect(() => {
    // Vérification si un token existe déjà
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const { role } = decodedToken;

        if (role) {
          handleUserRole(role);
        }
      } catch (error) {
        console.error('Token invalide ou expiré', error);
      }
    }
  }, []);

  return (
    <>
      <Header />
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Connexion</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="input-item">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Entrez votre email"
              required
            />
          </div>
          <div className="input-item">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
          <div className="forgot-password">
            <a href="/reset-password">Mot de passe oublié ?</a>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
