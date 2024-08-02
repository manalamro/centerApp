const Course = require('../models/coursesModel');
const Enrollment = require('../models/enrollmentsModel');
const Student = require('../models/studentsModel');
const CenterOperationalCosts = require('../models/operationSchema');
const { json } = require('react-router-dom');
const Manager = require('../models/managersModel');

// Controller to get enrollments for a specific student by their ID and populate course details
exports.getEnrollmentsDetailsForStudents = async (req, res) => {
  try {
    const managerId = req.manager._id; // Assuming manager information is available in req.manager
    const studentId = req.params.id;

    // Find the student by ID and ensure they are enrolled in a course managed by the logged-in manager
    const student = await Student.findOne({ _id: studentId, manager: managerId }).populate('enrollments');

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Extract course IDs from the student's enrollments
    const courseIds = student.enrollments.map(enrollment => enrollment.course);

    // Find courses for the student and populate teacher details
    const courses = await Course.find({ _id: { $in: courseIds } }).populate('teachers');

    // Map courses to include the desired details
    const enrichedEnrollments = student.enrollments.map(enrollment => {
      const course = courses.find(c => c._id.equals(enrollment.course));
      const studentDiscount = student.discount || 0;
      const costOnStudent = course.cost * (1 - studentDiscount);

      return {
        student: {
          name: student.name,
          phone: student.phone
        },
        course: {
          title: course.title,
          schedule: course.schedule,
          costOnStudent
        }
      };
    });

    res.json(enrichedEnrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ manager: req.manager._id });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 // Controller to get enrollments for a specific course by its ID and return the number of students
exports.getEnrollmentsByCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Find enrollments for the course and populate student details
    const enrollments = await Enrollment.find({ course: courseId }).populate('student');

    // Calculate total profit for the course
    const totalProfit = enrollments.reduce((total, enrollment) => {
      const studentDiscount = enrollment.student.discount || 0;
      const costAfterDiscount = course.cost * (1 - studentDiscount);
      return total + costAfterDiscount;
    }, 0);

    // Calculate teacher's salary
    const teacherSalary = totalProfit * (course.teachers[0].percentOfProfit || 0); // Assuming one teacher per course

    // Calculate the final profit (profits - teacher's salary)
    const finalProfit = totalProfit - teacherSalary;

    // Extract unique student IDs
    const uniqueStudentIds = new Set(enrollments.map(enrollment => enrollment.student._id));

    // Calculate the number of students
    const numberOfStudents = uniqueStudentIds.size;

    res.json({ numberOfStudents, totalProfit, teacherSalary, finalProfit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEnrollment = async (req, res) => {
  const { studentName, courseTitle, enrollmentDate } = req.body;

  try {
    const student = await Student.findOne({ name: studentName });
    const course = await Course.findOne({ title: courseTitle, manager: req.manager._id });

    if (!req.manager._id || !student || !course) {
      return res.status(401).json({ error: 'Unauthorized or invalid student/course' });
    }

    const newEnrollment = await Enrollment.create({
      student: student._id,
      course: course._id,
      manager: req.manager._id,
      createdAt: enrollmentDate // Assigning enrollment date from the request body
    });
    res.json(newEnrollment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateEnrollment = async (req, res) => {
  const enrollmentId = req.params.id;
  const { studentName, courseTitle } = req.body;

  try {
    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const student = await Student.findOne({ name: studentName });
    const course = await Course.findOne({ title: courseTitle, manager: req.manager._id });

    if (!student || !course) {
      return res.status(401).json({ error: 'Invalid student/course' });
    }

    enrollment.student = student._id;
    enrollment.course = course._id;
    await enrollment.save();

    res.json(enrollment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEnrollment = async (req, res) => {
  const enrollmentId = req.params.id;

  try {
    await Enrollment.findByIdAndDelete(enrollmentId);
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEnrollmentById = async (req, res) => {
  try {
    // Extract enrollment ID from request parameters
    const enrollmentId = req.params.id;

    // Find enrollment by ID
    const enrollment = await Enrollment.findById(enrollmentId);

    // Check if enrollment exists
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // If enrollment exists, return it
    res.json(enrollment);
  } catch (error) {
    console.error('Error in getEnrollmentById:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  const studentId = req.params.id;
  const managerId = req.manager._id;

  try {
    // Find the student and delete it
    const deletedStudent = await Student.findOneAndDelete({ _id: studentId, manager: managerId });

    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Delete enrollments related to the deleted student
    await Enrollment.deleteMany({ student: studentId });

    res.json({ message: 'Student and associated enrollments deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.addPayment = async (req, res) => {
  const enrollmentId = req.params.id; // Extract enrollment ID from URL parameter
  const { date, amount } = req.body;

  console.log("Received enrollment ID:", enrollmentId); // Log enrollmentId

  try {
    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Calculate remaining cost after payment
    const studentDiscount = enrollment.student.discount || 0;
    const courseCost = enrollment.course.cost;
    const costAfterDiscount = courseCost * (1 - studentDiscount / 100);
    const remainingCost = Math.max(0, costAfterDiscount - amount); // Ensure remaining cost is non-negative

    // Push the new payment to the payments array with user-supplied date
    enrollment.payments.push({ date, amount });
    await enrollment.save();

    res.json({ enrollment, remainingCost }); // Return enrollment and remaining cost
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMostFamousCourse = async (req, res) => {
  try {
    const managerId = req.manager._id;

    // Fetch the courses managed by the manager
    const courses = await Course.find({ manager: managerId });
    if (!courses.length) {
      return res.status(404).json({ error: 'No courses found for this manager' });
    }

    // Extract course IDs managed by the manager
    const courseIds = courses.map(course => course._id);

    // Calculate the number of enrollments for each managed course
    const enrollmentCounts = await Promise.all(courseIds.map(async (courseId) => {
      const count = await Enrollment.countDocuments({ course: courseId });
      return { courseId, count };
    }));

    // Sort the managed courses by enrollment count in descending order
    enrollmentCounts.sort((a, b) => b.count - a.count);

    // Get the highest enrollment count among managed courses
    const highestEnrollmentCount = enrollmentCounts[0].count;

    // Filter managed courses with the highest enrollment count
    const mostFamousCourses = enrollmentCounts.filter(course => course.count === highestEnrollmentCount);

    // Retrieve course details for the most famous courses
    const mostFamousCourseDetails = await Course.find({ _id: { $in: mostFamousCourses.map(c => c.courseId) } });

    // Extract the titles of the most famous courses
    const mostFamousCourseTitles = mostFamousCourseDetails.map(course => course.title);

    res.json({ mostFamousCourseTitles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEnrollmentsByMonth = async (req, res) => {
  try {
    const managerId = req?.manager?._id;

    if (!managerId) {
      return res.status(400).json({ error: 'Manager ID not found in request' });
    }

    // Fetch the courses managed by the manager
    const courses = await Course.find({ manager: managerId });

    if (!courses.length) {
      return res.status(404).json({ error: 'No courses found for this manager' });
    }

    // Extract course IDs from the fetched courses
    const courseIds = courses.map(course => course._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
        .populate('course', 'title')
        .populate('student', '_id');

    if (!enrollments.length) {
      return res.status(404).json({ error: 'No enrollments found' });
    }

    // Define month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Initialize object to store monthly enrollments
    const monthlyEnrollments = {};

    enrollments.forEach(enrollment => {
      // Check if createdAt is a valid Date
      if (enrollment.createdAt && enrollment.createdAt instanceof Date) {
        const date = new Date(enrollment.createdAt);
        const monthName = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const monthYear = `${monthName} ${year}`;

        // Initialize entry for month if not present
        if (!monthlyEnrollments[monthYear]) {
          monthlyEnrollments[monthYear] = {};
        }

        // Safely access the course title and student ID
        const courseTitle = enrollment.course?.title;
        const studentId = enrollment.student?._id;

        if (!courseTitle || !studentId) {
          console.warn(`Enrollment data is missing course title or student ID for enrollment ID: ${enrollment._id}`);
          return;
        }

        // Initialize entry for course if not present
        if (!monthlyEnrollments[monthYear][courseTitle]) {
          monthlyEnrollments[monthYear][courseTitle] = new Set();
        }

        // Add student ID to the set for the course
        monthlyEnrollments[monthYear][courseTitle].add(studentId);
      } else {
        console.warn(`Invalid createdAt date for enrollment ID: ${enrollment._id}`);
      }
    });

    // Convert sets to counts
    for (const monthYear in monthlyEnrollments) {
      for (const courseTitle in monthlyEnrollments[monthYear]) {
        monthlyEnrollments[monthYear][courseTitle] = monthlyEnrollments[monthYear][courseTitle].size;
      }
    }

    // Return the monthly enrollments data as JSON
    res.json(monthlyEnrollments);
  } catch (error) {
    // Catch and return any server errors
    res.status(500).json({ error: error.message });
  }
};

exports.getProfitFromEachCourse = async (req, res) => {
  try {
    const managerId = req.manager._id;

    // Fetch the courses managed by the manager
    const courses = await Course.find({ manager: managerId });
    if (!courses.length) {
      return res.status(404).json({ error: 'No courses found for this manager' });
    }

    // Calculate profit for each course managed by the manager
    const profits = await Promise.all(courses.map(async (course) => {
      const enrollments = await Enrollment.find({ course: course._id }).populate('student');
      let teacherProfit = 0;
      let centerProfit = 0;

      enrollments.forEach(enrollment => {
        const student = enrollment.student;
        const discount = student ? (student.discount || 0) : 0;
        const costAfterDiscount = course.cost * (1 - discount / 100); // Calculate cost after discount
        const teacherPercentOfProfit = course.teachers[0].percentOfProfit || 0;
        const teacherProfitPerEnrollment = costAfterDiscount * (teacherPercentOfProfit / 100);
        const centerProfitPerEnrollment = costAfterDiscount - teacherProfitPerEnrollment;

        teacherProfit += teacherProfitPerEnrollment;
        centerProfit += centerProfitPerEnrollment;
      });

      // Calculate operational costs
      const operationalCosts = course.operationalCosts.reduce((acc, cost) => acc + cost.price, 0);

      // Calculate net profit or loss
      let netProfit = 0;
      let loss = 0;
      if (operationalCosts <= centerProfit) {
        netProfit = centerProfit - operationalCosts;
      } else {
        loss = operationalCosts - centerProfit;
      }

      // Ensure loss is non-negative
      if (loss < 0) {
        loss = 0;
      }

      // Determine if there's a profit or loss
      const isProfit = netProfit > 0;

      return {
        courseTitle: course.title,
        teacherProfit,
        centerProfit,
        operationalCosts,
        netProfit,
        isProfit,
        loss
      };
    }));

    res.json(profits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getTotalRevenueByMonth = async (req, res) => {
  try {
    const managerId = req.manager._id;

    // Fetch the courses managed by the manager
    const courses = await Course.find({ manager: managerId });
    if (!courses.length) {
      return res.status(404).json({ error: 'No courses found for this manager' });
    }

    // Fetch enrollments for the manager's courses
    const enrollments = await Enrollment.find({ course: { $in: courses.map(course => course._id) } })
        .populate('course')
        .populate('student');

    if (!enrollments.length) {
      return res.status(404).json({ error: 'No enrollments found' });
    }

    // Fetch center operational costs for each month.
    const centerCostsByMonth = {};
    const centerOperationalCosts = await CenterOperationalCosts.find({ manager: managerId });

    centerOperationalCosts.forEach(cost => {
      const date = new Date(cost.monthYear);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

      // Initialize the center cost for each month
      if (!centerCostsByMonth[monthYear]) {
        centerCostsByMonth[monthYear] = 0;
      }

      // Sum up operations for each month only once
      cost.operations.forEach(operation => {
        centerCostsByMonth[monthYear] += operation.price;
      });
    });

    console.log('Center Costs by Month:', centerCostsByMonth); // Debugging

    // Calculate net profit for each enrollment by month
    const revenueByMonth = {};

    enrollments.forEach(enrollment => {
      const date = new Date(enrollment.createdAt);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

      // Initialize revenueByMonth with 0 for each monthYear
      if (!revenueByMonth[monthYear]) {
        revenueByMonth[monthYear] = {
          month: monthYear,
          initialNetProfit: 0,
          finalNetProfit: 0,
          centerOperationsCosts: centerCostsByMonth[monthYear] || 0
        };
      }

      // Calculate the discounted cost for each enrollment
      const discount = enrollment.student?.discount || 0;
      const costAfterDiscount = enrollment.course.cost * (1 - discount / 100);

      // Calculate the profit share for the teacher
      const teacherProfit = enrollment.course.teachers[0]?.percentOfProfit / 100 * costAfterDiscount || 0;

      // Calculate the operational costs related to this specific course
      const operationalCosts = enrollment.course.operationalCosts.reduce((acc, cost) => acc + cost.price, 0);

      // Initial net profit calculation for the current enrollment
      const initialNetProfit = costAfterDiscount - teacherProfit - operationalCosts;

      // Accumulate initial net profit for the month
      revenueByMonth[monthYear].initialNetProfit += initialNetProfit;
    });

    // Calculate final net profit for each month once
    Object.keys(revenueByMonth).forEach(monthYear => {
      const revenue = revenueByMonth[monthYear];

      // Deduct center operations costs from the total initial net profit for the month
      const finalNetProfit = revenue.initialNetProfit - revenue.centerOperationsCosts;

      // Ensure final net profit does not go below zero
      revenue.finalNetProfit = Math.max(finalNetProfit, 0);

      // Debugging
      console.log(`Month: ${monthYear}`);
      console.log(`Initial Net Profit: ${revenue.initialNetProfit}`);
      console.log(`Center Operations Costs: ${revenue.centerOperationsCosts}`);
      console.log(`Final Net Profit: ${revenue.finalNetProfit}`);
    });

    // Convert revenueByMonth object into an array of objects for response
    const revenueByMonthArray = Object.values(revenueByMonth);

    // Send the revenueByMonthArray as JSON response
    res.json(revenueByMonthArray);
  } catch (error) {
    // If any error occurs during execution, return 500 with an error message
    res.status(500).json({ error: error.message });
  }
};
