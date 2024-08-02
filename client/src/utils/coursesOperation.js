
// courseOperations.js

import { courseService } from '../service/api';
import { message } from 'antd';

export const fetchCourses = async () => {
  const response = await courseService.getCourses();

// Handle the case when there's an error
  if (response.error) {
    throw new Error(response.error);
  }

  return response.courses; // Return only the courses list
}

export const updateCourse = async (courseId, courseData) => {

    const token = localStorage.getItem('token');
    const response = await courseService.updateCourse(courseId, courseData, token);
    return response;
};

export const deleteCourse = async (courseId) => {

    const token = localStorage.getItem('token');
    const response =  await courseService.deleteCourse(courseId, token);
    console.log(response);
    return response;
    
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