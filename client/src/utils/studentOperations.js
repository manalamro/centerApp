import { studentService } from '../service/api'; // Import enrollmentService
import { message } from 'antd';

export const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    return await studentService.getAllStudents(token);
};

export const updateStudents = async (studentId, studentData) => {
    try {
        const token = localStorage.getItem('token');
        const res = await studentService.updateStudent(studentId, studentData, token);
        return res;
    }
    catch (error){
        return { error: error.message }; // Return the error message to be handled
    }
};

export const deleteStudent = async (studentId) => {
    try {
        const res = await studentService.deleteStudent(studentId);
        return res;
    } catch (error) {
        return { error: error.message }; // Return the error message to be handled
    }
};


export const getStudentById = async (studentId) => {
  try {
    const token = localStorage.getItem('token');
    return await studentService.getStudentById(studentId, token);
  } catch (error) {
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
    throw error;
  }
};