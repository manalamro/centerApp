import React, { useContext, useState, useEffect } from 'react';
import {managerService} from '../service/api';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username'));
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const tokenFromStorage = localStorage.getItem('token');
        if (tokenFromStorage) {
          const response = await managerService.authenticate(tokenFromStorage);
          setIsAuthenticated(response.success);
        } else {
          setIsAuthenticated(false);
          redirect('/login');
        }
      } catch (error) {
        setIsAuthenticated(false);
        redirect('/login');
      }
    };

    checkAuthentication();
  }, []);

  
  const login = async (username, password) => {
    try {
      const response = await managerService.login(username, password);
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUsername(username);
      localStorage.setItem('username',username);
      setIsLoggedIn(true);
      setIsAuthenticated(true);
    } catch (error) {
      setIsLoggedIn(false);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await managerService.logout();
      setToken('');
      localStorage.setItem('token','');
      setIsLoggedIn(false);
      setIsAuthenticated(false);
      localStorage.setItem('username','');
      setUsername('');
    } catch (error) {
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
        username
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
