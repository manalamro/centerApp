import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { changePassword } from '../utils/managerUtils';
import { adminChangePassword } from '../utils/adminOperations';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const ChangePasswordForm = () => {
    const [form] = Form.useForm();
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Get the user's role from localStorage
    const role = localStorage.getItem('role');

    const onFinish = async (values) => {
        try {
            // Use the appropriate function based on the user's role
            if (role === 'admin') {
                await adminChangePassword(values.oldPassword, values.newPassword);
            } else {
                await changePassword(values.oldPassword, values.newPassword);
            }

             } catch (error) {
            // Display error message
            setError(error.response.data.error || 'Failed to change password.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <Title level={3}>Change Password</Title>
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
                        {
                            min: 8,
                            message: 'Password must be at least 8 characters long!',
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
            {error && <div style={{ color: 'red', marginTop: '16px' }}>{error}</div>}
        </div>
    );
};

export default ChangePasswordForm;
