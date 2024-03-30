import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { changePassword } from '../utils/managerUtils';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const ChangePasswordForm = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await changePassword(values.oldPassword, values.newPassword);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <Form
        form={form}
        name="change_password_form"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={[
            {
              required: true,
              message: 'Please input your old password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            {
              required: true,
              message: 'Please input your new password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Change Password
          </Button>
        </Form.Item>
      </Form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default ChangePasswordForm;
