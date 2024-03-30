import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Form,
  Grid,
  Input,
  theme,
  Typography,
  message,
  Modal,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import "./login.css";
import ForgotPassword from "./forgotPassword"; // Import the ForgotPassword component

const Login = () => {
  const { useToken } = theme;
  const { useBreakpoint } = Grid;
  const { Text, Title } = Typography;
  const { token } = useToken();
  const screens = useBreakpoint();
  const { isAuthenticated, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] =
    useState(false);

  const showForgotPasswordModal = () => {
    setForgotPasswordModalVisible(true);
  };

  const handleCloseForgotPasswordModal = () => {
    setForgotPasswordModalVisible(false);
  };

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      await login(values.username, values.password);
      message.success("Login successful"); // Display success message
      navigate("/home"); // Redirect to '/home' after successful login using useNavigate
    } catch (error) {
      console.error("Login failed:", error);
      message.error(error.error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
  };

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return navigate("/home", { replace: true });
  }

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "400px",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: token.marginXL,
    },

    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "70vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Title style={styles.title}>Sign in</Title>
          <Text style={styles.text}>
            Welcome back to your educational center website! Please enter your
            details below to sign in.
          </Text>
        </div>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={handleLogin}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          requiredMark="optional"
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                type: "username",
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a style={styles.forgotPassword} onClick={showForgotPasswordModal}>
              Forgot password?
            </a>
          </Form.Item>
          <Form.Item
            style={{
              marginBottom: "0px",
              backgroundColor: "rgb(30, 132, 126)",
            }}
          >
            <Button
              block="true"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
        {/* Forgot Password Modal */}
        <Modal
          title="Forgot Password"
          visible={forgotPasswordModalVisible}
          onCancel={handleCloseForgotPasswordModal}
          footer={null}
        >
          <ForgotPassword onClose={handleCloseForgotPasswordModal} />
        </Modal>
      </div>
    </section>
  );
};

export default Login;
