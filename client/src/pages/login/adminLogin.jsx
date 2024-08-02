import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Form,
  Grid,
  Input,
  Typography,
  message,
  Modal,
  theme
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import "./login.css";
import AdminForgotPassword from "./adminForgotPassword";

const { Text, Title } = Typography;
const { useToken } = theme;
const { useBreakpoint } = Grid;

const AdminLogin = () => {
  const { token } = useToken();
  const screens = useBreakpoint();
  const { isAuthenticated, adminLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
      await adminLogin(values.username, values.password);
      message.success("Login successful");
      navigate("/AdminHome");
    } catch (error) {
      console.error("Login failed:", error);
      message.error(error.error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  if (isAuthenticated) {
    return navigate("/AdminHome", { replace: true });
  }

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? "0px 25px"
        : "0px 25px",
      width: "100%",
      maxWidth: "400px",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    section: {
      alignItems: "flex-start",
      backgroundColor: "white",
      display: "flex",
      minHeight: "90%",
      justifyContent: "center",
      marginBottom:"10px",
      padding: "35px 0px",
   
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
      marginTop:"0.20px",
    },
  };
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Title style={styles.title}>Sign in</Title>
          <Text style={styles.text}>
            Welcome back Admin! Please enter your details below to sign in.
          </Text>
        </div>
        <Form
          name="admin_login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          requiredMark="optional"
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input prefix={<MailOutlined />} placeholder="username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your Password!" }]}
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
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block type="primary" htmlType="submit" loading={loading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
        <Modal
          title="Forgot Password"
          visible={forgotPasswordModalVisible}
          onCancel={handleCloseForgotPasswordModal}
          footer={null}
        >
          <AdminForgotPassword onClose={handleCloseForgotPasswordModal} />
        </Modal>
      </div>
    </section>
  );
};

export default AdminLogin;
