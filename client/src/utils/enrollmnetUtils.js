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
    throw error;
    
  }
};

export const fetchMostFamousCourse = async () => {
  try {
    const token = localStorage.getItem('token');
    return await enrollmentService.getMostFamousCourse(token); // Assuming your service method is named getMostFamousCourse
  } catch (error) {
    throw error;
  }
};

export const fetchProfitFromEachCourse = async () => {
  try {
    const token = localStorage.getItem('token');
    return await enrollmentService.getProfitFromEachCourse(token); // Assuming your service method is named getProfitFromEachCourse
  } catch (error) {
    throw error;
  }
};

export const TotalRevenueByMonth = async () => {
  try {
    const token = localStorage.getItem('token');
    return await enrollmentService.TotalRevenueByMonth(token); // Assuming your service method is named getTotalRevenueByMonth
  } catch (error) {
    throw error;
  }
};