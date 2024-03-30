import { studentService } from '../service/api'; // Import enrollmentService
import { message } from 'antd';

export const fetchStudents = async () => {
  try {
    const token = localStorage.getItem('token');
    return await studentService.getAllStudents(token);
  } catch (error) {
    message.error('Failed to fetch students');
    throw error;
  }
};

export const updateStudents = async (studentId, studentData) => {
  try {
    const token = localStorage.getItem('token');
    await studentService.updateStudent(studentId, studentData, token);
    message.success('Student updated successfully');
  } catch (error) {
    message.error('Failed to update student');
    throw error;
  }
};


export const deleteStudent = async (studentId) => {
  try {
    const token = localStorage.getItem('token');
    await studentService.deleteStudent(studentId, token);
    message.success('Student deleted successfully');
  } catch (error) {
    message.error('Failed to delete student');
    throw error;
  }
};

export const getStudentById = async (studentId) => {
  try {
    const token = localStorage.getItem('token');
    return await studentService.getStudentById(studentId, token);
  } catch (error) {
    message.error('Failed to fetch student');
    throw error;
  }
};

// New functions related to enrollments
export const fetchEnrollmentsForStudent = async (studentId) => {
  try {
    const token = localStorage.getItem('token');
    return await studentService.getEnrollmentsForStudent(studentId, token);
  } catch (error) {
    message.error('Failed to fetch enrollments for student');
    throw error;
  }
};


// New function for creating a student
export const createStudent = async (studentData) => {
  try {
    const token = localStorage.getItem('token');
    return await studentService.createStudent(studentData, token);
  } catch (error) {
    message.error('Failed to add student');
    throw error;
  }
};


// New function for creating a student
export const searchStudents = async (name) => {
  try {
    const token = localStorage.getItem('token');
    return await studentService.searchStudentByName(name, token);
  } catch (error) {
    message.error('we do not have student with this name');
    throw error;
  }
};