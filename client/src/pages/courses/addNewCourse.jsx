import React from 'react';
import AddCourseForm from '../../components/courses/addCourse';
import { courseService } from '../../service/api'; // Import your addCourse API function
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { message } from 'antd';

const AddCoursePage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (courseData) => {
    try {
      await courseService.addCourse(courseData);
      message.success('Course added successfully');
      navigate('/courses');
    } catch (error) {
      message.error(error.message);
      // Optionally, you can display an error message to the user
    }
  };

  return (
    <div>
      <h1>Add Course</h1>
      <AddCourseForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddCoursePage;
