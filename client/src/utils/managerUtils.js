import {managerService} from '../service/api'
import { message } from 'antd';

export const changePassword = async (oldPassword, newPassword) => {
  try {
    await managerService.changePassword(oldPassword, newPassword);
    message.success('Password changed successfully'); // Display success message

  } catch (error) {
    // Changed the error handling to throw the actual error object instead of just the error message
    message.error(error.error);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await managerService.forgotPassword(email);
    return response;
  } catch (error) {
    throw error;
  }
};
export const resetPassword = async (newPassword, resetToken) => {
  try {
    const response = await managerService.resetPassword(newPassword, resetToken);
    return response;
  } catch (error) {
    throw error;
  }
};
