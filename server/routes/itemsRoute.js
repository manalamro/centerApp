const express = require('express');
const router = express.Router();
const coursesController = require('../controller/courseController');
const studentController = require('../controller/studentController');
const enrollmentController = require('../controller/enrollmentsController');
const managerController = require('../controller/managersController.js');
const { authenticate, authenticateAdmin } = require('../middleware/authMiddleware');
const centerOperationalCostsController = require('../controller/centerOperationCosts.js');
const adminController = require('../controller/adminController.js');
const overViewController = require('../controller/overViewController.js')
// Register route
router.post('/createManager', authenticateAdmin, managerController.register);
router.post('/managers/register', managerController.register);

// Login route
router.post('/managers/login', managerController.login);

// Logout route
router.post('/managers/logout', managerController.logout);

// Admin routes
router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.post('/logout', adminController.logout);
router.get('/admin/managers', authenticateAdmin, adminController.getManagers); // New route

// Change password route for managers
router.post('/managers/change-password', authenticate, managerController.changePassword);

// Forgot password route for managers
router.post('/managers/forgot-password', managerController.forgotPassword);

// Reset password route for managers
router.post('/managers/reset-password/:resetToken', managerController.resetPassword);

// // Admin routes for password management
router.post('/change-password', authenticateAdmin, adminController.changePassword);
router.post('/forgot-password',adminController.forgotPassword);
router.post('/reset-password/:resetToken',adminController.resetPassword);
// Overview routes for admin.
router.post('/admin/add-manager', authenticateAdmin,adminController.addManagerToAdmin);
router.get('/totals-by-manager', authenticateAdmin, overViewController.getTotalNumbersByManager);
router.get('/enrollment-trends-by-manager', authenticateAdmin, overViewController.getStudentEnrollmentTrendsByManager);
router.get('/completion-rates-by-manager', authenticateAdmin, overViewController.getCourseCompletionRatesByManager);
router.get('/financial-summaries-by-manager', authenticateAdmin, overViewController.getFinancialSummariesByManager);
router.get('/manager/:managerId', authenticateAdmin, overViewController.getManagerDetails);

// Courses Routes

// Route to get detailed information about courses, teachers, and calculate salary for the logged-in manager
router.get('/teachers/detailedInfo', authenticate,coursesController.getTeachersDetailedInfoAndCalculateSalary);

// Route to get courses for the logged-in manager
router.get('/courses',authenticate, coursesController.getCourses);

// Route to add a new course for the logged-in manager
router.post('/courses', authenticate,coursesController.addCourse);

// Route to get a specific course by its ID for the logged-in manager
router.get('/courses/:id',authenticate,coursesController.getCourseById);

// Route to update an existing course for the logged-in manager
router.put('/courses/:id', authenticate,coursesController.updateCourse);

// Route to delete an existing course for the logged-in manager
router.delete('/courses/:id',authenticate, coursesController.deleteCourse);
router.post('/courses/search',authenticate, coursesController.searchCoursesByTitle);
router.post('/teachers/search',authenticate, coursesController.searchTeachersByName);

// Students Routes

router.get('/students', authenticate,studentController.getAllStudents);
router.get('/students/:id',authenticate, studentController.getStudentById);
router.post('/students', authenticate,studentController.createStudent);
router.put('/students/:id',authenticate, studentController.updateStudent);
router.delete('/students/:id',authenticate, studentController.deleteStudent);
router.post('/students/search',authenticate, studentController.searchStudentsByName);

// Route to create Center Operational Costs
router.post('/centerOperationalCosts',authenticate,centerOperationalCostsController.createCenterOperationalCosts);

// Route to get Center Operational Costs
router.get('/centerOperationalCosts',authenticate ,centerOperationalCostsController.getCenterOperationalCosts);

// Route to update an operation
router.put('/centerOperationalCosts/operation',authenticate, centerOperationalCostsController.updateOperation);

// Route to delete an operation
router.delete('/centerOperationalCosts/operation',authenticate, centerOperationalCostsController.deleteOperation);

router.post('/centerOperationalCosts/:centerId/addOperation',authenticate, centerOperationalCostsController.addOperationToCenter);

// Enrollments Routes
router.get('/enrollments',authenticate, enrollmentController.getAllEnrollments);
router.post('/enrollments',authenticate, enrollmentController.createEnrollment);
router.get('/enrollments/:id',authenticate, enrollmentController.getEnrollmentById);
router.put('/enrollments/:id',authenticate, enrollmentController.updateEnrollment);
router.delete('/enrollments/:id',authenticate, enrollmentController.deleteEnrollment);
router.get('/enrollments/teacher/:teacherName',authenticate, coursesController.getCoursesAndCalculateSalary);
router.post('/enrollments/:id/addPayment',authenticate, enrollmentController.addPayment);
router.get('/enrollments-by-month', authenticate,enrollmentController.getEnrollmentsByMonth);
router.get('/most-famous-course', authenticate,enrollmentController.getMostFamousCourse);
router.get('/profit-from-each-course',authenticate, enrollmentController.getProfitFromEachCourse);
router.get('/total-revenue-by-month',authenticate, enrollmentController.getTotalRevenueByMonth);


module.exports = router;
