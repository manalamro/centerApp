import React, { useState } from "react";
import { Layout, Button, Typography, theme } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import ManagerLogin from "./managerLogin";
import AdminLogin from "./adminLogin";

const { Content } = Layout;
const { Title } = Typography;

const Login = () => {
  const [signInType, setSignInType] = useState("manager");
  const { useToken } = theme;
  const { token } = useToken();

  const handleTabClick = (type) => {
    setSignInType(type);
  };

  const styles = {
    layout: {
      minHeight: "100vh",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      width: "100%",
      maxWidth: "400px",
      position: "relative",
      padding: "24px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    },
    title: {
      textAlign: "center",
      marginBottom: "24px",
    },
    tabContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      marginTop: "8px", // Adjusted marginTop to reduce space
    },
    button: {
      flex: 1,
      maxWidth: "180px",
    },
  };

  return (
    <Layout style={styles.layout}>
      <Content style={styles.content}>
        <div style={styles.container}>
          <Title level={3} style={styles.title}>
            Welcome back
          </Title>
          <div style={styles.tabContainer}>
            <Button
              type={signInType === "admin" ? "primary" : "default"}
              onClick={() => handleTabClick("admin")}
              icon={signInType === "admin" && <CheckCircleOutlined />}
              style={styles.button}
            >
              Sign in as Admin
            </Button>
            <Button
              type={signInType === "manager" ? "primary" : "default"}
              onClick={() => handleTabClick("manager")}
              icon={signInType === "manager" && <CheckCircleOutlined />}
              style={{ ...styles.button, marginLeft: "8px" }}
            >
              Sign in as Manager
            </Button>
          </div>
          {signInType === "admin" ? <AdminLogin /> : <ManagerLogin />}
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
