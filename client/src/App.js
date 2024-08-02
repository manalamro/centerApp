import React ,{useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes,useNavigate } from 'react-router-dom';
import NavComponent from './components/header/nav';
import Login from './pages/login/login';
import HeaderComponent from './components/header/header';
import Home from './pages/home/home';
import Courses from './pages/courses/courses';
import Students from './pages/students/students';
import Teachers from './pages/teachers/teachers';
import { useAuth } from './hooks/useAuth';
import AddCoursePage from './pages/courses/addNewCourse';
import AddStudentForm from './components/students/createStudnet';
import ForgotPassword from './pages/login/forgotPassword';
import ResetPassword from './pages/login/ResetPassword'; // Note: Ensure correct path to ResetPassword component
import CenterOperationalCosts from './pages/centerOperationCosts/centerOperations';
import CenterOperationalCostsForm from './components/centerOperationCosts/addNewMonthOperations';
import AdminHome from './pages/Admin/AdminHome';
import AdminAuth from './hooks/auth/adminAuth';
import ManagerAuth from './hooks/auth/managerAuth';
import ManagerDetails from './pages/Admin/mangerDetails';
import AdminForgotPassword from "./pages/login/adminForgotPassword";
import AdminResetPasswordComponent from './pages/login/AdminResetPassword';

import './App.css';
import { Layout } from 'antd';
const { Content } = Layout;

const App = () => {
  const { isAuthenticated,role } = useAuth();
  const name = localStorage.getItem("username");

  console.log("name",name);
  
  let u;
  if (role) {
    u = role;
  }
  console.log("ROLE", u);
  return (
   <>
       <Router>
       {console.log("isAuthenticated",isAuthenticated)}
      {isAuthenticated && <HeaderComponent />}
      {isAuthenticated && <NavComponent />}
      <Content>
      {console.log("isAuthenticated after",isAuthenticated)}

   <Routes>
<Route exact path="/login" element={
  <PublicElement>
  <Login />
  </PublicElement>
  } />

<Route exact path="/forgotPassword" element={
  <PublicElement>
  <ForgotPassword />
  </PublicElement>
  } />

<Route exact path="/reset-password/:resetToken" element={
<PublicElement>
<ResetPassword />
</PublicElement>
} /> 

<Route index element={<ManagerRedirect/>} />
<Route exact path="/" 
element={
<ManagerAuth role={u}>
  <Home/>
</ManagerAuth>
} />

<Route exact path="/home" 
element={
<ManagerAuth role={u}>
  <Home/>
</ManagerAuth>
} />

<Route exact path="/courses" 
element={
<ManagerAuth role={u}>
  <Courses/>
</ManagerAuth>
} />

<Route exact path="/students" 
element={
<ManagerAuth role={u}>
  <Students/>
</ManagerAuth>
} />
<Route exact path="/teachers" 
element={
<ManagerAuth role={u}>
  <Teachers/>
</ManagerAuth>
} />

<Route exact path="/addCourse" 
element={
<ManagerAuth role={u}>
  <AddCoursePage/>
</ManagerAuth>
} />

<Route exact path="/addStudent" 
element={
<ManagerAuth role={u}>
  <AddStudentForm/>
</ManagerAuth>
} />

<Route exact path="/CenterOperationalCosts" 
element={
<ManagerAuth role={u}>
  <CenterOperationalCosts/>
</ManagerAuth>
} />

<Route exact path="/addNewMonthOperations" 
element={
<ManagerAuth role={u}>
  <CenterOperationalCostsForm/>
</ManagerAuth>
} />


{/* ADMIN routes */}
<Route index element={<AdminRedirect/>} />
<Route exact path="/" 
element={
<AdminAuth role={u}>
  <AdminHome/>
</AdminAuth>
} />

<Route exact path="/AdminHome" 
element={
<AdminAuth role={u}>
  <AdminHome/>
</AdminAuth>
} />
     
     <Route exact path="/manager/:managerId"
            element={
              <AdminAuth role={u}>
                <ManagerDetails/>
              </AdminAuth>
            } />

     <Route exact path="/admin-forgotPassword" element={
       <PublicElement>
         <AdminForgotPassword />
       </PublicElement>
     } />

     <Route exact path="/admin-resetPassword/:resetToken" element={
       <PublicElement>
         <AdminResetPasswordComponent />
       </PublicElement>
     } />
     

     
</Routes>
</Content>
</Router>
   </>
  );
};


const PublicElement = ({ children }) => {
  return <>{children}</>;
};
const ManagerRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  }, [navigate]);
  return null;
};

const AdminRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  }, [navigate]);
  return null;
};

export default App;

