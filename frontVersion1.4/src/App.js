
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import React, { useEffect } from 'react';

import Home from "./Admin/Teachers";


import Component from "./components/home2/home";
import SignUp from "./components/home2/sign-up";
import Login from "./components/home2/login";
import TeacherDashbord from "./components/home2/TeacherDashbord";
import AddQuizs from "./components/home2/AddQuiz";
import Students from "./Admin/student";
import EditQuiz from "./components/home2/EditQuiz";
import ClientHome from "./components/client/ClientHome";
import QuizResultsList from"./components/client/review";
import QuizResultDetails from"./components/client/detailsResult"; 
import StudentList from"./components/teacher/StudentList";
import UserProfile from "./components/client/profil";
import Firstpage from "./components/client/firstpage";
import TeacherHomePage from "./components/teacher/TeacherHomePage";
import ActiveStudent from "./components/teacher/ActiveStudent";
import { jwtDecode } from 'jwt-decode';
import StudentDetailedAnalysis from "./components/teacher/StudentDetailedAnalysis";
function App() {
  let isAdmin = false;
  let isClient = false;
  let isTeacher = false;
  const checkSessionExpiration = () => {
    const expirationTime = localStorage.getItem('expirationTime');

    if (expirationTime && Date.now() > parseInt(expirationTime)) {
    
      localStorage.clear(); 
      alert('Votre session a expiré. Vous allez être déconnecté.');
      <Navigate to="/home" replace />
    }
  };

  if(localStorage.getItem("token")){
    const user = localStorage.getItem("token");
    console.log("userrrrr", user)
    const decodedToken = jwtDecode(user);
          const { userId, role } = decodedToken;
          console.log(role)
   
          isAdmin = role === "admin";
          isClient = role === "client";
          isTeacher = role === "prof";

  }

  useEffect(() => {
    checkSessionExpiration(); // Vérifie au démarrage de l'application
    const intervalId = setInterval(checkSessionExpiration, 60000); // Vérifie toutes les 60 secondes

    return () => clearInterval(intervalId); // Nettoie l'intervalle lorsque le composant est démonté
  }, []);
  const PrivateRoute = ({ children }) => {
    if (!localStorage.getItem("token")) {
      return <Navigate to="/home" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes element={<PrivateRoute><Component /></PrivateRoute>}>
        <Route path="/" >
          
          {isAdmin && (
            <>
               <Route path="/teachers" element={<Home/>} /> 
               <Route path="/Students" element={<Students />} />
               </>   
          )}
            {isTeacher && (
            <>
              <Route path="/TeacherDashbord" element={<TeacherDashbord />} />
              <Route path="/AddQuizs" element={<AddQuizs />} />
              <Route path="/ActiveStudent" element={<ActiveStudent />} />
              <Route path="/Homepage" element={<TeacherHomePage />} />
              <Route path="/EditQuiz/:id" element={<EditQuiz />} />
              <Route path="/StudentList" element={<StudentList />} />
              <Route path="/student-analysis/:id" element={<StudentDetailedAnalysis />} />
            </>
          )}
          {isClient && (
            <>
              <Route path="/ClientHome" element={<ClientHome />} />
              <Route path="/Homepage" element={<Firstpage />} />
              <Route path="/review" element={<QuizResultsList />} />
              <Route path="/getResultById/:id" element={<QuizResultDetails />} />
            </>
          )}
         
  
        </Route>
        <Route path="/home" element={<Component />} />
        <Route path="/Profil" element={<UserProfile />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/signin" element={<Login />} />
 
      </Routes>
    </Router>
  );
}

export default App;
