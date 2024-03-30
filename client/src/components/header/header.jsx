import React from 'react';
import { Layout, Avatar } from 'antd';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth hook
import logo from "../../assets/newww.png";
import ProfileComponent from './profile';
import './header.css'
const { Header } = Layout;

const HeaderComponent = () => {
  const { isAuthenticated } = useAuth(); // Get isAuthenticated state from useAuth hook

  if (!isAuthenticated) {
    return null; // If user is not authenticated, don't render the header
  }

  return (
    <Layout style={{ height: '0vh', width: '100vw' }}>
    <>
      <Header
        style={{
          padding: 0,
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          position: 'fixed',
          top: 0,
          zIndex: 1000,
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Add a subtle shadow for separation
        }}
      >
        <ProfileComponent />
        <Avatar
          src={<img src={logo} alt="avatar" />}
          style={{
            objectFit: 'cover',
            marginRight: '20px', // Adjusted for spacing
            marginTop: '-5px', // Adjusted for spacing
            width: '70px',
            height: '70px',
          }}
        />
      </Header>
</>
 </Layout>
  );
};

export default HeaderComponent;
