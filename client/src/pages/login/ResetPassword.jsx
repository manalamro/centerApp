import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { resetPassword } from '../../utils/managerUtils';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useHistory hook

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await resetPassword(resetToken, values.password);
      message.success('Password reset successful');
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000); // 2000 milliseconds delay (adjust as needed)
    } catch (error) {
      message.error(error.error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2 style={{ marginBottom: 20 }}>Reset Password</h2>
      <Form
        name="reset-password"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please enter your new password!' }]}
        >
          <Input.Password placeholder="New Password" />
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

export default ResetPassword;
