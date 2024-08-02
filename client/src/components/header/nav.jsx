import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, message } from "antd";
import { IoHomeOutline, IoLogOut } from "react-icons/io5";
import { GiBlackBook } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { GiTeacher, GiFiles } from "react-icons/gi";
import { RiAdminFill, RiUserSettingsFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth'; // Import useAuth hook
import "./header.css";

const { Sider } = Layout;

const NavComponent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout} = useAuth();
  const [role, setRole]= useState(localStorage.getItem('role'))
  const [smallScreen, setSmallScreen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      message.error(error);
    }
  };

  useEffect(() => {
    if (role === '' || role === undefined || !isAuthenticated) {
      return null; // If role is not set, don't render the navigation component
    }
  }, [role]);

  const menuItems = role === 'manager' ? [
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
  ] : role === 'admin' ? [
    {
      key: "/AdminHome",
      icon: <RiAdminFill />,
      label: "Home",
    },
    
  ] : [];

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
        items={menuItems}
      />
      {!smallScreen ? (
        <Button className="logoutButton" onClick={handleLogout}>
          <IoLogOut />
          Logout
        </Button>
      ) : (
        <Button onClick={handleLogout} style={{ paddingLeft: "18px", fontSize: "medium", alignItems: "center", border: "none", borderTopRightRadius: "0px", fontFamily: 'monospace' }}>
          LogOut
        </Button>
      )}
    </Sider>
  );
};

export default NavComponent;
