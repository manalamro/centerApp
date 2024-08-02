import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import {adminForgotPassword} from "../../utils/adminOperations";

const AdminForgotPassword = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await adminForgotPassword(values.email);
      message.success('Password reset email sent successfully');
      // Close the modal after a delay
      setTimeout(() => {
        onClose();
      }, 30000); // 30 seconds delay
    } catch (error) {
      message.error(error.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <Form
        name="forgot-password"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please enter your admin email !' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminForgotPassword;
