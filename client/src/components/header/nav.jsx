import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { IoHomeOutline } from "react-icons/io5";
import { GiBlackBook } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth'; // Import useAuth hook
import "./header.css";

const { Sider } = Layout;

const NavComponent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [smallScreen, setSmallScreen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
    }
  };

  if (!isAuthenticated) {
    return null; // If not authenticated, don't render the navigation component
  }

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      collapsible
      style={{
        backgroundColor: "rgb(30 132 126)",
        height: "100vh",
        position: "fixed",
        left: 0,
      }}
      onBreakpoint={broken => {
        setSmallScreen(broken);
      }}
    >
      <Menu
        style={{
          backgroundColor: "rgb(30 132 126)",
          color: "white",
          fontSize: "15px",
        }}
        onClick={({ key }) => {
          if (key === "signoutToLogin") {
            handleLogout(); // Call the handleLogout function for signout
            navigate('/');
          } else {
            navigate(key);
          }
        }}
        theme="dark"
        mode="inline"
        // defaultSelectedKeys={["/home"]}
        items={[
          {
            key: "/home",
            icon: <IoHomeOutline />,
            label: "Home",
          },
          {
            key: "/courses",
            icon: <GiBlackBook />,
            label: "Courses",
          },
          {
            key: "/students",
            icon: <PiStudentFill />,
            label: "Students",
          },
          {
            key: "/teachers",
            icon: <GiTeacher />,
            label: "Teachers",
          },
        ]}
      />
      {!smallScreen ? (
        <Button className="logoutButton" onClick={handleLogout}>
          <IoLogOut />
          Logout
        </Button>
      ):(
      // <span style={{display:"flex",justifyContent:"center",flexDirection:"row",paddingTop:"10px",fontWeight:"bold"}}>
      <Button onClick={handleLogout} style={{paddingLeft:"18px",fontSize:"medium",alignItems:"center",border:"none",borderTopRightRadius:"0px",fontFamily:'monospace'}}>
      LogOut
      </Button>
   )}
    </Sider>
  );
};

export default NavComponent;
