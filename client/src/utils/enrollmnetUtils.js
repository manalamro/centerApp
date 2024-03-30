// enrollmentUtils.js

import { enrollmentService } from '../service/api';
import { message } from 'antd';

export const fetchEnrollments = async () => {
  try {
    const token = localStorage.getItem('token');
    return await enrollmentService.getAllEnrollments(token);
  } catch (error) {
    message.error('Failed to fetch enrollments');
    throw error;
  }
};

export const createEnrollment = async (enrollmentData) => {
  try {
    const token = localStorage.getItem('token');
    await enrollmentService.createEnrollment(enrollmentData, token);
  } catch (error) {
    message.error('Failed to create enrollment');
    throw error;
  }
};

export const updateEnrollment = async (enrollmentId, enrollmentData) => {
  try {
    const token = localStorage.getItem('token');
    await enrollmentService.updateEnrollment(enrollmentId, enrollmentData, token);
    message.success('Enrollment updated successfully');
  } catch (error) {
    message.error('Failed to update enrollment');
    throw error;
  }
};

export const deleteEnrollment = async (enrollmentId) => {
  try {
    const token = localStorage.getItem('token');
    await enrollmentService.deleteEnrollment(enrollmentId, token);

  } catch (error) {
    message.error('Failed to delete enrollment');
    throw error;
  }
};

export const getEnrollmentById = async (enrollmentId) => {
  try {
    const token = localStorage.getItem('token');
    return await enrollmentService.getEnrollmentById(enrollmentId, token);
  } catch (error) {
    message.error('Failed to fetch enrollment');
    throw error;
  }
};

export const addPayment = async (enrollmentId, paymentData) => {
  try {
    return await enrollmentService.addPayment(enrollmentId, paymentData);
  } catch (error) {
    throw new Error(error.message || 'Failed to add payment');
  }
};





export const fetchEnrollmentsByMonth = async () => {
  try {
    const token = localStorage.getItem('token');
    return await enrollmentService.getEnrollmentsByMonth(token); // Assuming your service method is named getEnrollmentsByMonth
  } catch (error) {
    if (error.response && error.response.status === 404) {
      message.warning('No enrollments found'); // Display a warning message if no enrollments are found
    } else {
      message.error('Failed to fetch enrollments by month'); // Display an error message for other errors
    }
    throw error;
  }
};

export const fetchMostFamousCourse = async () => {
  try {
    const token = localStorage.getItem('token');
    return await enrollmentService.getMostFamousCourse(token); // Assuming your service method is named getMostFamousCourse
  } catch (error) {
    if (error.response && error.response.status === 404) {
      message.warning('No most famous course found'); // Display a warning message if no most famous course is found
    } else {
      message.error('Failed to fetch most famous course'); // Display an error message for other errors
    }
    throw error;
  }
};

export const fetchProfitFromEachCourse = async () => {
  try {
    const token = localStorage.getItem('token');
    return await enrollmentService.getProfitFromEachCourse(token); // Assuming your service method is named getProfitFromEachCourse
  } catch (error) {
    if (error.response && error.response.status === 404) {
      message.warning('No profit from each course found'); // Display a warning message if no profit from each course is found
    } else {
      message.error('Failed to fetch profit from each course'); // Display an error message for other errors
    }
    throw error;
  }
};

export const TotalRevenueByMonth = async () => {
  try {
    const token = localStorage.getItem('token');
    return await enrollmentService.TotalRevenueByMonth(token); // Assuming your service method is named getTotalRevenueByMonth
  } catch (error) {
    if (error.response && error.response.status === 404) {
      message.warning('No total revenue by month found'); // Display a warning message if no total revenue by month is found
    } else {
      message.error('Failed to fetch Total Revenue By Month'); // Display an error message for other errors
    }
    throw error;
  }
};
