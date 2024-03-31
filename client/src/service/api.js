import axios from 'axios';
import { message } from 'antd';
export const baseURL = "http://localhost:5000";



export const managerService = {
  register: async (username, password) => {
    try {
      const response = await axios.post(`${baseURL}/managers/register`, { username, password });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  login: async (username, password) => {
    try {
      const response = await axios.post(`${baseURL}/managers/login`, { username, password });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(`${baseURL}/managers/logout`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  forgotPassword : async (email) => {
    try {
      const response = await axios.post(`${baseURL}/managers/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
resetPassword: async (resetToken, newPassword) => {
    try {
      const response = await axios.post(`${baseURL}/managers/reset-password/${resetToken}`, { newPassword });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  authenticate: async (token) => {
    try {
      const response = await axios.get(`${baseURL}/protected`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  changePassword :async (oldPassword, newPassword) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${baseURL}/managers/change-password`, {
        oldPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export const courseService = {
  getCourses: async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      const response = await axios.get(`${baseURL}/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.courses;
    } catch (error) {
      throw new Error('Failed to fetch courses');
    }
  },

  addCourse: async (courseData) => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      const response = await axios.post(`${baseURL}/courses`, courseData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.course;
    } catch (error) {
      throw new Error('Failed to add course');
    }
  },

  updateCourse: async (courseId, courseData) => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      const response = await axios.put(`${baseURL}/courses/${courseId}`, courseData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.course;
    } catch (error) {
      throw new Error('Failed to update course');
    }
  },

  deleteCourse: async (courseId) => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      await axios.delete(`${baseURL}/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error('Failed to delete course');
    }
  },

  getCourseById: async (courseId) => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      const response = await axios.get(`${baseURL}/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.course;
    } catch (error) {
      throw new Error('Failed to fetch course');
    }
  },

  getTeachersDetailedInfoAndCalculateSalary: async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      const response = await axios.get(`${baseURL}/teachers/detailedInfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.teachers;
    } catch (error) {
      throw new Error('Failed to fetch teachers information');
    }
  },


  searchCoursesByTitle: async (title, token) => {
    try {
      const response = await axios.post(`${baseURL}/courses/search`, { title }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.courses;
    } catch (error) {
      throw error.response.data.error || 'An error occurred while searching for courses.';
    }
  },

  searchTeacherByName: async (name, token) => {
    try {
      const response = await axios.post(`${baseURL}/teachers/search`, { name }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.teachers;
    } catch (error) {
      throw error.response.data.error || 'An error occurred while searching for courses.';
    }
  },
};

export const studentService = {
  getAllStudents: async (token) => {
    try {
      const response = await axios.get(`${baseURL}/students`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch students');
    }
  },

  createStudent: async (studentData, token) => {
    try {
      // Extract enrolled courses from studentData
      const { enrolledCourses, ...rest } = studentData;
  
      // Map enrolledCourses to include the enrollmentDate
      const mappedEnrolledCourses = enrolledCourses.map(course => {
        return {
          title: course.title,
          enrollmentDate: course.enrollmentDate || new Date().toISOString() // Default to current date if enrollmentDate not provided
        };
      });
  
      // Construct modified studentData object
      const modifiedStudentData = { ...rest, enrolledCourses: mappedEnrolledCourses };
  
      const response = await axios.post(`${baseURL}/students`, modifiedStudentData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to add student');
    }
  },
  
  updateStudent: async (studentId, studentData, token) => {
    try {
      const { name, phone, discount, enrollments } = studentData; // Extract student data from studentData
      const response = await axios.put(`${baseURL}/students/${studentId}`, {
        name,
        phone,
        discount,
        enrollments // Pass enrollments data directly
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update student');
    }
  },
  
  
  deleteStudent: async (studentId, token) => {
    try {
      const response = await axios.delete(`${baseURL}/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete student');
    }
  },

  getStudentById: async (studentId, token) => {
    try {
      const response = await axios.get(`${baseURL}/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch student');
    }
  },

   // Function to get enrollments for a specific student
   getEnrollmentsForStudent: async (studentId, token) => {
    try {
      const response = await axios.get(`${baseURL}/students/${studentId}/enrollments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch enrollments for student');
    }
  },


  searchStudentByName: async (name, token) => {
    try {
      const response = await axios.post(`${baseURL}/students/search`, { name }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.students;
    } catch (error) {
      message.error('we do not have student with this name');
      throw error.response.data.error || 'An error occurred while searching for courses.';
    }
  },
};

export const enrollmentService = {
  // Function to get all enrollments
  getAllEnrollments: async (token) => {
    try {
      const response = await axios.get(`${baseURL}/enrollments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch enrollments');
    }
  },

  // Function to create an enrollment
  createEnrollment: async (enrollmentData, token) => {
    try {
      const response = await axios.post(`${baseURL}/enrollments`, enrollmentData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to add enrollment');
    }
  },

  // Function to update an enrollment
  updateEnrollment: async (enrollmentId, studentName, courseTitle) => {
    try {
      const response = await axios.put(`/enrollments/${enrollmentId}`, {
        studentName,
        courseTitle,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error || 'Failed to update enrollment');
    }
  },

  // Function to delete an enrollment
  deleteEnrollment: async (enrollmentId, token) => {
    try {
      const response = await axios.delete(`${baseURL}/enrollments/${enrollmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete enrollment');
    }
  },

  
  // Function to get enrollment by ID
  getEnrollmentById: async (enrollmentId, token) => {
    try {
      const response = await axios.get(`${baseURL}/enrollments/${enrollmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch enrollment');
    }
  },


 // API function to add payment to an enrollment
 addPayment: async (enrollmentId, paymentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${baseURL}/enrollments/${enrollmentId}/addPayment`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    message.success('Payment added successfully');
    return response.data;
  } catch (error) {
    message.error(error.response.data.error || 'Failed to add payment');
    throw error;
  }
},



getEnrollmentsByMonth: async (token) => {
  try {
    const response = await axios.get(`${baseURL}/enrollments-by-month`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching enrollments by month:', error);
    throw error;
  }
},

 getMostFamousCourse :async (token) => {
  try {
    const response = await axios.get(`${baseURL}/most-famous-course`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching most famous course:', error);
    throw error;
  }
},

getProfitFromEachCourse :async (token) => {
  try {
    const response = await axios.get(`${baseURL}/profit-from-each-course`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profit from each course:', error);
    throw error;
  }
},


TotalRevenueByMonth :async (token) => {
  try {
    const response = await axios.get(`${baseURL}/total-revenue-by-month`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total revenue by month:', error);
    throw error;
  }
},


};

export const centerOperationalCostsService = {
  getCenterOperationalCosts: async (token) => {
    try {
      const response = await axios.get(`${baseURL}/centerOperationalCosts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data; // Assuming response.data contains the entire response
    } catch (error) {
      throw new Error('Failed to fetch center operational costs');
    }
  },
  
  createCenterOperationalCost: async (monthYear, operations, token) => {
    try {
      const response = await axios.post(`${baseURL}/centerOperationalCosts`, { monthYear, operations }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to add center operational costs');
    }
  },

  updateOperation: async (operationId, title, price, token) => {
    try {
      const response = await axios.put(`${baseURL}/centerOperationalCosts/operation`, { operationId, title, price }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update operation');
    }
  },


  deleteOperation: async (operationId, token) => {
    try {
      await axios.delete(`${baseURL}/centerOperationalCosts/operation`, {
        data: { operationId }, // Send data in the request body for DELETE method
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return true;
    } catch (error) {
      throw new Error('Failed to delete operation');
    }
  },

  addOperationToCenter: async (centerId, newOperation, token) => {
    try {
      const response = await axios.post(`${baseURL}/centerOperationalCosts/${centerId}/addOperation`, newOperation, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to add operation to center');
    }
  },
};






