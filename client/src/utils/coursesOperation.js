
// courseOperations.js

import { courseService } from '../service/api';
import { message } from 'antd';

export const fetchCourses = async () => {
  try {
    const token = localStorage.getItem('token');
    return await courseService.getCourses(token);
  } catch (error) {
    message('Failed to fetch courses');
  }
};

export const updateCourse = async (courseId, courseData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await courseService.updateCourse(courseId, courseData, token);
    if (response.status === 200) {
      message(response.data.message || 'success to update course');
    }
  } catch (error) {
    message(error.response ? error.response.data.message : 'Failed to update course');
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    await courseService.deleteCourse(courseId, token);
    return 'Course deleted successfully';
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Failed to delete course');
  }
};

// Define function to fetch a course by ID
export const getCourseById = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    return await courseService.getCourseById(courseId, token);
  } catch (error) {
    message.error('Failed to fetch course');
    throw error;
  }
};


export const searchCourses = async (title) => {
  try {
    const token = localStorage.getItem('token');
    return await courseService.searchCoursesByTitle(title, token);
  } catch (error) {
    throw error;
  }
};


export const searchTeachers = async (name) => {
  try {
    const token = localStorage.getItem('token');
    return await courseService.searchTeacherByName(name, token);
  } catch (error) {
    throw error;
  }
};