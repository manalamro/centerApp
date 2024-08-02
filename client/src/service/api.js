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

export const adminService = {
  register: async (username, password) => {
    try {
      const response = await axios.post(`${baseURL}/register`, { username, password });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  login: async (username, password) => {
    try {
      const response = await axios.post(`${baseURL}/login`, { username, password });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  logout: async () => {
    try {
      const response = await axios.post(`${baseURL}/logout`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  forgotPassword : async (email) => {
    try {
      const response = await axios.post(`${baseURL}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  resetPassword: async (resetToken, newPassword) => {
    try {
      const response = await axios.post(`${baseURL}/reset-password/${resetToken}`, { newPassword });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  changePassword :async (oldPassword, newPassword) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${baseURL}/change-password`, {
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

// services/adminService.js

  totalsByManager: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseURL}/totals-by-manager`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

 getManagerDetails : async (managerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseURL}/manager/${managerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      return response.data;
    } catch (error) {
      console.error('Error fetching manager details:', error);
      throw error.response.data;
    }},
  
};

export const courseService = {
  getCourses : async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

      if (!token) {
        return { error: 'No token found. Please log in again.' };
      }

      const response = await axios.get(`${baseURL}/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data; // This will return the whole response object, including status

    } catch (error) {
      // Improved error handling
      if (error.response) {
        // Server responded with a status other than 2xx
        const { status, data } = error.response;

        if (status === 401) {
          return { error: 'Token expired or invalid. Please log in again.' };
        } else if (status === 500) {
          return { error: 'Internal Server Error. Please try again later.' };
        } else {
          return { error: data.error || 'An error occurred while fetching courses.' };
        }
      } else if (error.request) {
        // Request was made but no response received
        return { error: 'No response from the server. Please check your internet connection.' };
      } else {
        // Something else caused the error
        return { error: error.message || 'An unexpected error occurred.' };
      }
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
      if (error.response) {
        // Server responded with a status other than 2xx
        const { status, data } = error.response;

        if (status === 401) {
          return { error: 'Token expired or invalid. Please log in again.' };
        } else if (status === 500) {
          return { error: 'Internal Server Error. Please try again later.' };
        } else {
          return { error: data.error || 'An error occurred while adding the course.' };
        }
      } else if (error.request) {
        // Request was made but no response received
        return { error: 'No response from the server. Please check your internet connection.' };
      } else {
        // Something else caused the error
        return { error: error.message || 'An unexpected error occurred.' };
      }
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
      if (error.response) {
        // Server responded with a status other than 2xx
        const {status, data} = error.response;

        if (status === 401) {
          return {error: 'Token expired or invalid. Please log in again.'};
        } else if (status === 500) {
          return {error: 'Internal Server Error. Please try again later.'};
        } else {
          return {error: data.error || 'An error occurred while adding the course.'};
        }
      } else if (error.request) {
        // Request was made but no response received
        return {error: 'No response from the server. Please check your internet connection.'};
      } else {
        // Something else caused the error
        return {error: error.message || 'An unexpected error occurred.'};
      }
    }
  },

  deleteCourse: async (courseId) => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const response =   await axios.delete(`${baseURL}/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.course;
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        const {status, data} = error.response;

        if (status === 401) {
          return {error: 'Token expired or invalid. Please log in again.'};
        } else if (status === 500) {
          return {error: 'Internal Server Error. Please try again later.'};
        } else {
          return {error: data.error || 'An error occurred while adding the course.'};
        }
      } else if (error.request) {
        // Request was made but no response received
        return {error: 'No response from the server. Please check your internet connection.'};
      } else {
        // Something else caused the error
        return {error: error.message || 'An unexpected error occurred.'};
      }
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
      if (error.response) {
        // Server responded with a status other than 2xx
        const { status, data } = error.response;

        if (status === 401) {
          throw new Error('Token expired or invalid. Please log in again.');
        } else if (status === 500) {
          throw new Error('Internal Server Error. Please try again later.');
        } else {
          throw new Error(data.error || 'An error occurred while fetching the data.');
        }
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from the server. Please check your internet connection.');
      } else {
        // Something else caused the error
        throw new Error(error.message || 'An unexpected error occurred.');
      }
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
  getAllStudents : async (token) => {
    try {
      const response = await axios.get(`${baseURL}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("getAllStudents Response Data:", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          return { error: 'Token expired or invalid. Please log in again.' };
        } else if (status === 500) {
          return { error: 'Internal Server Error. Please try again later.' };
        } else {
          return { error: data.error || 'An error occurred while fetching students.' };
        }
      } else if (error.request) {
        return { error: 'No response from the server. Please check your internet connection.' };
      } else {
        return { error: error.message || 'An unexpected error occurred.' };
      }
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
      if (error.response) {
        // Server responded with a status other than 2xx
        const { status, data } = error.response;

        if (status === 401) {
          return { error: 'Token expired or invalid. Please log in again.' };
        } else if (status === 500) {
          return { error: 'Internal Server Error. Please try again later.' };
        } else {
          return { error: data.error || 'An error occurred while adding the course.' };
        }
      } else if (error.request) {
        // Request was made but no response received
        return { error: 'No response from the server. Please check your internet connection.' };
      } else {
        // Something else caused the error
        return { error: error.message || 'An unexpected error occurred.' };
      }
    }
  },

  updateStudent: async (studentId, studentData, token) => {
    try {
      const { name, phone, discount, enrollments } = studentData;
      const response = await axios.put(`${baseURL}/students/${studentId}`, {
        name,
        phone,
        discount,
        enrollments
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      // Capture detailed error message from backend
      const errorMessage = error.response?.data?.error || "Failed to update student";
      throw new Error(errorMessage);
    }
  },
  
 
  deleteStudent: async (studentId) => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      const response = await axios.delete(`${baseURL}/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        const {status, data} = error.response;

        if (status === 401) {
          return {error: 'Token expired or invalid. Please log in again.'};
        } else if (status === 500) {
          return {error: 'Internal Server Error. Please try again later.'};
        } else {
          return {error: data.error || 'An error occurred while adding the course.'};
        }
      } else if (error.request) {
        // Request was made but no response received
        return {error: 'No response from the server. Please check your internet connection.'};
      } else {
        // Something else caused the error
        return {error: error.message || 'An unexpected error occurred.'};
      }
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
    }catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        const {status, data} = error.response;

        if (status === 401) {
          return {error: 'Token expired or invalid. Please log in again.'};
        } else if (status === 500) {
          return {error: 'Internal Server Error. Please try again later.'};
        } else {
          return {error: data.error || 'An error occurred while adding the course.'};
        }
      } else if (error.request) {
        // Request was made but no response received
        return {error: 'No response from the server. Please check your internet connection.'};
      } else {
        // Something else caused the error
        return {error: error.message || 'An unexpected error occurred.'};
      }
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
      throw error.response.data.error || 'An error occurred while searching for student.';

    }
  },
};

export const enrollmentService = {
  // Function to get all enrollments
  getAllEnrollments: async (token) => {
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
    throw error;
  }
},


};

export const centerOperationalCostsService = {
  // 1. Get Center Operational Costs
  getCenterOperationalCosts : async (token) => {
    try {
      const response = await axios.get(`${baseURL}/centerOperationalCosts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Check if response data has the success key and is true
      if (response.data.success) {
        console.log("API Response:", response.data.centerOperationalCosts);
        return { data: response.data.centerOperationalCosts, error: null };
      } else {
        return { data: null, error: 'Failed to fetch center operational costs.' };
      }

    } catch (error) {
      // Handle different error cases
      if (error.response) {
        const { status } = error.response;

        if (status === 401) {
          return { data: null, error: 'Token expired or invalid. Please log in again.' };
        } else if (status === 404) {
          return { data: null, error: 'No center operational costs found.' };
        } else if (status === 500) {
          return { data: null, error: 'Internal Server Error. Please try again later.' };
        } else {
          return { data: null, error: error.response.data.error || 'An error occurred while fetching the operational costs.' };
        }

      } else if (error.request) {
        // No response was received
        console.error('Error Request:', error.request);
        return { data: null, error: 'No response from the server. Please check your internet connection.' };

      } else {
        // Other errors
        console.error('Error:', error.message);
        return { data: null, error: error.message || 'An unexpected error occurred.' };
      }
    }
  },
  
  createCenterOperationalCost: async (monthYear, operations, token) => {
    try {
      const response = await axios.post(
          `${baseURL}/centerOperationalCosts`,
          { monthYear, operations },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
      );

      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Center operational cost created successfully.',
      };
    } catch (error) {
      // Check if the error has a response with a message from the backend
      if (error.response && error.response.data) {
        const { status, data } = error.response;

        // Handle specific status codes
        if (status === 401) {
          throw new Error(data.message || 'Unauthorized: Invalid or expired token login again');
        } else if (status === 400) {
          throw new Error(data.message || 'Validation Error');
        } else if (status === 500) {
          throw new Error(data.message || 'Internal Server Error');
        } else {
          throw new Error(data.message || 'An unexpected error occurred');
        }
      } else {
        // Handle network or other unexpected errors
        throw new Error('An unexpected error occurred');
      }
    }
  },
  
  // 3. Update Operation
  updateOperation: async (operationId, title, price, token) => {
    try {
      const response = await axios.put(`${baseURL}/centerOperationalCosts/operation`,
          { operationId, title, price },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
      );

      return {
        success: true,
        data: response.data,
        message: 'Operation updated successfully.',
      };
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          return { error: 'Token expired or invalid. Please log in again.' };
        } else if (status === 404) {
          return { error: 'Operation not found.' };
        } else if (status === 400) {
          return { error: data.message || 'Validation error: Please check your input data.' };
        } else if (status === 500) {
          return { error: 'Internal Server Error. Please try again later.' };
        } else {
          return { error: data.error || 'An error occurred while updating the operation.' };
        }
      } else if (error.request) {
        return { error: 'No response from the server. Please check your internet connection.' };
      } else {
        return { error: error.message || 'An unexpected error occurred.' };
      }
    }
  },

  // 4. Delete Operation
  deleteOperation: async (operationId, token) => {
    try {
      const response = await axios.delete(`${baseURL}/centerOperationalCosts/operation`,
          {
            data: { operationId }, // Send data in the request body for DELETE method
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
      );
     return response;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          // Handle specific token-related errors
          if (data.error.includes('Token expired')) {
            return { error: 'Token expired or invalid. Please log in again.' };
          }
          return { error: data.error || 'Authentication error. Please log in again.' };
        } else if (status === 404) {
          return { error: 'Operation not found.' };
        } else if (status === 400) {
          return { error: data.message || 'Validation error: Please check your input data.' };
        } else if (status === 500) {
          return { error: 'Internal Server Error. Please try again later.' };
        } else {
          return { error: data.error || 'An error occurred while deleting the operation.' };
        }
      } else if (error.request) {
        return { error: 'No response from the server. Please check your internet connection.' };
      } else {
        return { error: error.message || 'An unexpected error occurred.' };
      }
    }
  },

  // 5. Add Operation to Center
  addOperationToCenter: async (centerId, newOperation, token) => {
    try {
      const response = await axios.post(`${baseURL}/centerOperationalCosts/${centerId}/addOperation`,
          newOperation,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
      );

      return response;
      
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          return { error: 'Token expired or invalid. Please log in again.' };
        } else if (status === 404) {
          return { error: 'Center not found.' };
        } else if (status === 400) {
          return { error: data.message || 'Validation error: Please check your input data.' };
        } else if (status === 500) {
          return { error: 'Internal Server Error. Please try again later.' };
        } else {
          return { error: data.error || 'An error occurred while adding the operation to the center.' };
        }
      } else if (error.request) {
        return { error: 'No response from the server. Please check your internet connection.' };
      } else {
        return { error: error.message || 'An unexpected error occurred.' };
      }
    }
  },
};





