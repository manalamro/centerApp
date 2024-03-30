import React, { useState } from 'react';
import './header.css';
import { Layout, Avatar, Dropdown, Menu, Modal } from 'antd';
import { UserOutlined, CloseOutlined } from '@ant-design/icons'; // Import CloseOutlined icon
import { useAuth } from '../../hooks/useAuth';
import ChangePasswordForm from '../changePassword'; // Import ChangePasswordForm
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const ProfileComponent = () => {
  const { logout,username } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false); // State to manage the visibility of the Change Password form
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
    }
  };

  const showChangePasswordForm = () => {
    setShowChangePassword(true);
  };

  const hideChangePasswordForm = () => {
    setShowChangePassword(false);
  };

  const handlePasswordChangeSuccess = () => {
    // Close the ChangePasswordForm modal
    hideChangePasswordForm();
    // Logout the user
    handleLogout();
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={showChangePasswordForm} key="changePassword">
        Change Password
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="header">
      <Avatar className="avatar" icon={<UserOutlined />} />
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()} href="#">
          {username}
        </a>
      </Dropdown>
      {/* Render the ChangePasswordForm component conditionally based on showChangePassword state */}
      <Modal
        title="Change Password"
        open={showChangePassword}
        onCancel={hideChangePasswordForm}
        footer={null}
        closeIcon={<CloseOutlined />} // Add close icon to the modal header
      >
        <ChangePasswordForm onSuccess={handlePasswordChangeSuccess} />
      </Modal>
    </Header>
  );
};

export default ProfileComponent;