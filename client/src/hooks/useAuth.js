import React, { useContext, useState, useEffect } from 'react';
import {managerService,adminService} from '../service/api';
import { redirect} from 'react-router-dom';
export const AuthContext = React.createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('IsAuthenticated')); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [error,setError] = useState(null);
  const login = async (username, password) => {
    const response = await managerService.login(username, password);
    try {
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.UserRole);
      localStorage.setItem('IsAuthenticated',response.isAuthenticated);
      setToken(response.token);
      setUsername(username);
      setRole(response.UserRole);
      setIsAuthenticated(response.isAuthenticated);
      localStorage.setItem('username',username);
      setIsLoggedIn(true);
    } catch (error) {
      setError(response.error);
      localStorage.setItem('IsAuthenticated',response.isAuthenticated);
    }
  };

  const adminLogin = async (username, password) => {
      const response = await adminService.login(username, password);
      try {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.UserRole);
        localStorage.setItem('IsAuthenticated',response.isAuthenticated);
        setToken(response.token);
        setUsername(username);
        setRole(response.UserRole);
        setIsAuthenticated(response.isAuthenticated);
        localStorage.setItem('username',username);
        setIsLoggedIn(true);
      } catch (error) {
        setError(response.error);
        localStorage.setItem('IsAuthenticated',response.isAuthenticated);
      }
  };
  
  const logout = async () => {
    try {
      const response = await managerService.logout();
      setToken('');
      localStorage.setItem('token','');
      setIsLoggedIn(false);
      localStorage.setItem('username','');
      setUsername('');
      localStorage.setItem('role','');
      setRole('');
      setIsAuthenticated('');
      localStorage.setItem('IsAuthenticated','');
    } catch (error) {
      setIsAuthenticated('');
      localStorage.setItem('IsAuthenticated', '');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoggedIn,
        token,
        login,
        logout,
        adminLogin,
        role,
        username
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
