import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import Header from './header';
import Footer from './footer';
import { useNavigate } from 'react-router-dom';
export default function SignUp() {
  const [role, setRole] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { fullName, email, password, confirmPassword, dateOfBirth } = formData;

    // Validation simple du formulaire
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/auth/registerClient', {
        fullName,
        email,
        password,
        dateOfBirth,
        role,
      });
      console.log(role)
      navigate("/home");
      if(role =="client"){
        alert("Verifier votre mail please ")

      }
      else{
        alert("")
      }
      setError(null);  // Réinitialisez les erreurs
    } catch (error) {
      setError(error.response ? error.response.data : "Erreur lors de l'inscription");
      setSuccess(null);  // Réinitialisez le message de succès
    }
  };

  return (
    <>
      <Header />
      <div className="signup-container">
        {step === 1 && (
          <div className="role-selection">
            <h2>Choisissez votre rôle</h2>
            <label>
              <input
                type="radio"
                value="prof"
                checked={role === 'prof'}
                onChange={handleRoleChange}

              />
              Enseignant
            </label>
            <label>
              <input
                type="radio"
                value="client"
                checked={role === 'client'}
                onChange={handleRoleChange}
              />
              Étudiant
            </label>
            <button
              className="next-button"
              onClick={handleNextStep}
              disabled={!role}
            >
              Suivant
            </button>
          </div>
        )}

        {step === 2 && role === 'prof' && (
          <form className="teacher-form" onSubmit={handleSubmit}>
            <h2>Formulaire Enseignant</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <label>Prénom et Nom</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
            <label>Email professionnel</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <label>Confirmation du mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <button type="submit">S'inscrire</button>
          </form>
        )}
        {step === 2 && role === 'client' && (
          <form className="student-form" onSubmit={handleSubmit}>
            <h2>Formulaire Étudiant</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <label>Prénom et Nom</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
            <label>Email étudiant</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <label>Date de naissance</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
            />
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <label>Confirmation du mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <button type="submit">S'inscrire</button>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
}
