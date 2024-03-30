import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavComponent from './components/header/nav';
import Login from './pages/login/login';
import HeaderComponent from './components/header/header';
import Home from './pages/home/home';
import Courses from './pages/courses/courses';
import Students from './pages/students/students';
import Teachers from './pages/teachers/teachers';
import { useAuth, AuthProvider } from './hooks/useAuth';
import AddCoursePage from './pages/courses/addNewCourse';
import AddStudentForm from './components/students/createStudnet';
import ForgotPassword from './pages/login/forgotPassword';
import ResetPassword from './pages/login/ResetPassword'; // Note: Ensure correct path to ResetPassword component
import CenterOperationalCosts from './pages/centerOperationCosts/centerOperations';
import CenterOperationalCostsForm from './components/centerOperationCosts/addNewMonthOperations';
import './App.css';
import { Layout } from 'antd';
const { Content } = Layout;

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {isAuthenticated && <HeaderComponent />}
      {isAuthenticated && <NavComponent />}

      {/* <Content style={{ margin: window.innerWidth > 955 ? '57px 220px' : '55px 40px',fontFamily: 'Condiment - Regular' }}> */}
      <Content >
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/forgotPassword" element={<ForgotPassword />} /> {/* Added route for ForgotPassword */}
          <Route exact path="/reset-password/:resetToken" element={<ResetPassword />} /> {/* Added route for ResetPassword */}
          {isAuthenticated ? (
            <>
              <Route exact path="/" element={<Navigate to="home" />} />
              <Route exact path="/home" element={<Home />} />
              <Route exact path="/courses" element={<Courses />} />
              <Route exact path="/students" element={<Students />} />
              <Route exact path="/teachers" element={<Teachers />} />
              <Route exact path="/addCourse" element={<AddCoursePage />} />
              <Route exact path="/addStudent" element={<AddStudentForm />} />
              <Route exact path="/CenterOperationalCosts" element={<CenterOperationalCosts />} />
              <Route exact path="/addNewMonthOperations" element={<CenterOperationalCostsForm />} />

            </>
          ) : (
            <Route exact path="/" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Content>
    </Router>
  );
};

export default App;


