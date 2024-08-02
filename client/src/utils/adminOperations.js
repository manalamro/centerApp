
import {adminService, managerService} from '../service/api';
import { message } from 'antd';

// Function to handle API response errors
const handleApiError = (error) => {
    if (error.response) {
        // Server responded with a status code other than 2xx
        switch (error.response.status) {
            case 401:
                // Token expired or invalid
                return { message: 'Your session has expired. Please log in again.', type: 'error' };
            case 403:
                // Forbidden access
                return { message: 'You do not have permission to access this resource.', type: 'error' };
            case 404:
                // Not found
                return { message: 'Resource not found.', type: 'error' };
            case 500:
                // Server error
                return { message: 'Server error. Please try again later.', type: 'error' };
            default:
                // Other statuses
                return { message: 'An unexpected error occurred. Please try again later.', type: 'error' };
        }
    } else if (error.request) {
        // Request was made but no response was received
        return { message: 'No response received from the server. Please check your internet connection.', type: 'error' };
    } else {
        // Something happened in setting up the request
        return { message: 'An unexpected error occurred while setting up the request.', type: 'error' };
    }
};

// utils/adminOperations.js
export const totalsByManager = async () => {
    try {
        const token = localStorage.getItem('token');
        return await adminService.totalsByManager(token);
    } catch (error) {
        throw error;
    }
};

export const fetchManagerDetails = async (managerId) => {
    try {
        const data = await adminService.getManagerDetails(managerId);
        console.log("Data manager details:", data); // Check data
        return { data, error: null };
    } catch (error) {
        console.error("Error fetching manager details:", error); // Log the error
        return { data: null, error: { message: error.message || 'Failed to fetch details', type: 'error' } };
    }
};


export const adminChangePassword = async (oldPassword, newPassword) => {
    try {
        await adminService.changePassword(oldPassword, newPassword);
        message.success('Password changed successfully'); // Display success message

    } catch (error) {
        // Changed the error handling to throw the actual error object instead of just the error message
        message.error(error.error);
    }
};

export const adminForgotPassword = async (email) => {
    try {
        const response = await adminService.forgotPassword(email);
        return response;
    } catch (error) {
        throw error;
    }
};
export const AdminResetPassword = async (newPassword, resetToken) => {
    try {
        const response = await adminService.resetPassword(newPassword, resetToken);
        return response;
    } catch (error) {
        throw error;
    }
};
