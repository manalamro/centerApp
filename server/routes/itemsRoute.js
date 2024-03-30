const express = require('express');
const router = express.Router();
const coursesController = require('../controller/courseController');
const studentController = require('../controller/studentController');
const enrollmentController = require('../controller/enrollmentsController');
const managerController = require('../controller/managersController.js');
const authMiddleware = require('../middleware/authMiddleware');
const centerOperationalCostsController = require('../controller/centerOperationCosts.js');

// Register route
router.post('/managers/register', managerController.register);

// Login route
router.post('/managers/login', managerController.login);

// Logout route
router.post('/managers/logout', managerController.logout);

// Authentication route
router.get('/protected', managerController.authenticate);

// Change password route
router.post('/managers/change-password', authMiddleware.authenticate, managerController.changePassword);

// Forgot password route
router.post('/managers/forgot-password', managerController.forgotPassword);

// Reset password route
router.post('/managers/reset-password/:resetToken', managerController.resetPassword);

// Require authentication for routes below this line
router.use(authMiddleware.authenticate);

// Courses Routes

// Route to get detailed information about courses, teachers, and calculate salary for the logged-in manager
router.get('/teachers/detailedInfo', coursesController.getTeachersDetailedInfoAndCalculateSalary);

// Route to get courses for the logged-in manager
router.get('/courses', coursesController.getCourses);

// Route to add a new course for the logged-in manager
router.post('/courses', coursesController.addCourse);

// Route to get a specific course by its ID for the logged-in manager
router.get('/courses/:id', coursesController.getCourseById);

// Route to update an existing course for the logged-in manager
router.put('/courses/:id', coursesController.updateCourse);

// Route to delete an existing course for the logged-in manager
router.delete('/courses/:id', coursesController.deleteCourse);
router.post('/courses/search', coursesController.searchCoursesByTitle);
router.post('/teachers/search', coursesController.searchTeachersByName);

// Students Routes

router.get('/students', studentController.getAllStudents);
router.get('/students/:id', studentController.getStudentById);
router.post('/students', studentController.createStudent);
router.put('/students/:id', studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);
router.post('/students/search', studentController.searchStudentsByName);

// Route to create Center Operational Costs
router.post('/centerOperationalCosts', centerOperationalCostsController.createCenterOperationalCosts);

// Route to get Center Operational Costs
router.get('/centerOperationalCosts', centerOperationalCostsController.getCenterOperationalCosts);

// Route to update an operation
router.put('/centerOperationalCosts/operation', centerOperationalCostsController.updateOperation);

// Route to delete an operation
router.delete('/centerOperationalCosts/operation', centerOperationalCostsController.deleteOperation);

router.post('/centerOperationalCosts/:centerId/addOperation', centerOperationalCostsController.addOperationToCenter);

// Enrollments Routes
router.get('/enrollments', enrollmentController.getAllEnrollments);
router.post('/enrollments', enrollmentController.createEnrollment);
router.get('/enrollments/:id', enrollmentController.getEnrollmentById);
router.put('/enrollments/:id', enrollmentController.updateEnrollment);
router.delete('/enrollments/:id', enrollmentController.deleteEnrollment);
router.get('/enrollments/teacher/:teacherName', coursesController.getCoursesAndCalculateSalary);
router.post('/enrollments/:id/addPayment', enrollmentController.addPayment);
router.get('/enrollments-by-month', enrollmentController.getEnrollmentsByMonth);
router.get('/most-famous-course', enrollmentController.getMostFamousCourse);
router.get('/profit-from-each-course', enrollmentController.getProfitFromEachCourse);
router.get('/total-revenue-by-month', enrollmentController.getTotalRevenueByMonth);

module.exports = router;
