const Manager = require('../models/managersModel');
const Student = require('../models/studentsModel');
const Course = require('../models/coursesModel');
const Enrollment = require('../models/enrollmentsModel');
const CenterOperationalCosts = require('../models/operationSchema');
const Admin = require('../models/adminModel')
// Get total numbers by manager
const getTotalNumbersByManager = async (req, res) => {
  try {
    const adminId = req.admin._id; // Assuming req.admin contains the authenticated admin's info

    // Find managers related to the logged-in admin
    const admin = await Admin.findById(adminId).populate('managers');
    const managerIds = admin.managers.map((manager) => manager._id);

    // Fetch manager details including username, email, and phoneNumber
    const managersDetails = await Manager.aggregate([
      { $match: { _id: { $in: managerIds } } },
      { $project: { _id: 1, username: 1, email: 1, phoneNumber: 1 } }, // Include phoneNumber here
    ]);

    const totalManagers = managerIds.length;

    // Fetch total students per manager
    const studentsByManager = await Student.aggregate([
      { $match: { manager: { $in: managerIds } } },
      { $group: { _id: "$manager", totalStudents: { $sum: 1 } } },
    ]);

    // Fetch courses managed by each manager
    const coursesByManager = await Course.aggregate([
      { $match: { manager: { $in: managerIds } } },
      { $group: { _id: "$manager", courses: { $push: "$_id" } } },
    ]);

    // Calculate total enrollments (students) per manager across all courses
    const totalEnrollmentsByManager = await Enrollment.aggregate([
      { $match: { course: { $in: coursesByManager.map((course) => course.courses).flat() } } },
      { $group: { _id: "$manager", totalEnrollments: { $sum: 1 } } },
    ]);

    // Fetch total teachers per manager
    const teachersByManager = await Course.aggregate([
      { $match: { manager: { $in: managerIds } } },
      { $unwind: "$teachers" },
      { $group: { _id: "$manager", totalTeachers: { $sum: 1 } } },
    ]);

    // Merge manager details with aggregated data
    const managersData = managersDetails.map((manager) => {
      const managerId = manager._id;
      const phoneNumber = manager.phoneNumber; // Retrieve the phoneNumber
      const managerStudents = studentsByManager.find((s) => String(s._id) === String(managerId));
      const managerEnrollments = totalEnrollmentsByManager.find((e) => String(e._id) === String(managerId));
      const managerTeachers = teachersByManager.find((t) => String(t._id) === String(managerId));
      const managerCourses = coursesByManager.find((c) => String(c._id) === String(managerId));

      return {
        _id: managerId,
        username: manager.username,
        email: manager.email,
        phoneNumber: phoneNumber, // Ensure phoneNumber is included here
        totalStudents: managerStudents ? managerStudents.totalStudents : 0,
        totalEnrollments: managerEnrollments ? managerEnrollments.totalEnrollments : 0,
        totalCourses: managerCourses ? managerCourses.courses.length : 0,
        totalTeachers: managerTeachers ? managerTeachers.totalTeachers : 0,
      };
    });

    res.json({
      totalManagers,
      managers: managersData,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Get student enrollment trends by manager
const getStudentEnrollmentTrendsByManager = async (req, res) => {
  try {
    const adminId = req.admin._id; // Assuming req.admin contains the authenticated admin's info

    // Find managers related to the logged-in admin
    const managers = await Manager.find({ adminId }).select('_id username'); // Select only _id and username fields
    const managerIds = managers.map(manager => manager._id);

    const enrollments = await Enrollment.aggregate([
      { $match: { manager: { $in: managerIds } } },
      {
        $lookup: {
          from: "courses", // Assuming the collection name for courses is 'courses'
          localField: "course",
          foreignField: "_id",
          as: "courseDetails"
        }
      },
      {
        $lookup: {
          from: "managers", // Assuming the collection name for managers is 'managers'
          localField: "manager",
          foreignField: "_id",
          as: "managerDetails"
        }
      },
      {
        $group: {
          _id: {
            managerId: "$manager",
            managerUsername: { $arrayElemAt: ["$managerDetails.username", 0] }, // Extract the username
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            course: { $arrayElemAt: ["$courseDetails.title", 0] } // Extract the course title
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.managerId": 1, "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Get course completion rates by manager
const getCourseCompletionRatesByManager = async (req, res) => {
  try {
    const adminId = req.admin._id; // Assuming req.admin contains the authenticated admin's info

    // Find managers related to the logged-in admin
    const managers = await Manager.find({ adminId });
    const managerIds = managers.map(manager => manager._id);

    const completionRates = await Enrollment.aggregate([
      { $match: { manager: { $in: managerIds } } },
      {
        $group: {
          _id: { manager: "$manager", status: "$status" },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.manager",
          totalEnrollments: { $sum: "$count" },
          completedEnrollments: {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "completed"] }, "$count", 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          completionRate: {
            $multiply: [{ $divide: ["$completedEnrollments", "$totalEnrollments"] }, 100]
          }
        }
      }
    ]);

    res.json(completionRates);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get financial summaries by manager
const getFinancialSummariesByManager = async (req, res) => {
  try {
    const adminId = req.admin._id; // Assuming req.admin contains the authenticated admin's info

    // Find managers related to the logged-in admin
    const managers = await Manager.find({ adminId });
    const managerIds = managers.map(manager => manager._id);

    const incomeByManager = await Enrollment.aggregate([
      { $match: { manager: { $in: managerIds } } },
      { $unwind: "$payments" },
      {
        $group: {
          _id: "$manager",
          totalIncome: { $sum: "$payments.amount" }
        }
      }
    ]);

    const expensesByManager = await CenterOperationalCosts.aggregate([
      { $match: { manager: { $in: managerIds } } },
      { $unwind: "$operations" },
      {
        $group: {
          _id: "$manager",
          totalExpenses: { $sum: "$operations.price" }
        }
      }
    ]);

    const financialSummaries = incomeByManager.map(income => {
      const expense = expensesByManager.find(exp => exp._id.equals(income._id)) || { totalExpenses: 0 };
      return {
        manager: income._id,
        totalIncome: income.totalIncome,
        totalExpenses: expense.totalExpenses,
        totalProfit: income.totalIncome - expense.totalExpenses
      };
    });

    res.json(financialSummaries);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getManagerDetails = async (req, res) => {
  try {
    const managerId = req.params.managerId;

    if (!managerId) {
      return res.status(400).json({ error: 'Manager ID is required' });
    }

    // Find the manager using the managerId
    const manager = await Manager.findById(managerId);

    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    // Fetch all courses managed by the manager
    const courses = await Course.find({ manager: managerId });
    if (!courses.length) {
      return res.status(404).json({ error: 'No courses found for this manager' });
    }

    const courseIds = courses.map(course => course._id);

    // Calculate the number of enrollments for each course
    const enrollmentCounts = await Promise.all(
        courseIds.map(async (courseId) => {
          const count = await Enrollment.countDocuments({ course: courseId });
          return { courseId, count };
        })
    );

    // Sort courses based on enrollment counts
    enrollmentCounts.sort((a, b) => b.count - a.count);

    // Determine the highest enrollment count and most famous courses
    const highestEnrollmentCount = enrollmentCounts[0]?.count || 0;
    const mostFamousCourses = enrollmentCounts.filter(course => course.count === highestEnrollmentCount);

    // Fetch course details for the most famous courses
    const mostFamousCourseDetails = await Course.find({
      _id: { $in: mostFamousCourses.map(c => c.courseId) }
    });

    // Extract the titles of the most famous courses
    const mostFamousCourseTitles = mostFamousCourseDetails.map(course => course.title);

    // Fetch enrollments for the manager's courses
    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
        .populate('course', 'title cost teachers operationalCosts')
        .populate('student', '_id discount');

    // Define month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Create a data structure for enrollments by month
    const enrollmentsByMonth = {};

    // Populate enrollmentsByMonth with enrollment data
    enrollments.forEach(enrollment => {
      if (enrollment.createdAt && enrollment.createdAt instanceof Date) {
        const date = new Date(enrollment.createdAt);
        const monthName = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const monthYear = `${monthName} ${year}`;

        if (!enrollmentsByMonth[monthYear]) {
          enrollmentsByMonth[monthYear] = {};
        }

        const courseTitle = enrollment.course?.title;
        const studentId = enrollment.student?._id;

        if (!courseTitle || !studentId) {
          console.warn(`Enrollment data is missing course title or student ID for enrollment ID: ${enrollment._id}`);
          return;
        }

        if (!enrollmentsByMonth[monthYear][courseTitle]) {
          enrollmentsByMonth[monthYear][courseTitle] = new Set();
        }

        // Add unique student IDs to the set
        enrollmentsByMonth[monthYear][courseTitle].add(studentId);
      } else {
        console.warn(`Invalid createdAt date for enrollment ID: ${enrollment._id}`);
      }
    });

    // Convert Set to size to get the number of unique students per course per month
    for (const monthYear in enrollmentsByMonth) {
      for (const courseTitle in enrollmentsByMonth[monthYear]) {
        enrollmentsByMonth[monthYear][courseTitle] = enrollmentsByMonth[monthYear][courseTitle].size;
      }
    }

    // Calculate profits for each course managed by the manager
    const profitsByCourse = await Promise.all(courses.map(async (course) => {
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

    // Calculate revenue by month for all enrollments
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
          centerOperationsCosts: 0 // To be calculated once per month
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

    // Fetch center operational costs for each month
    const centerOperationalCosts = await CenterOperationalCosts.find({ manager: managerId });

    // Map center costs to the corresponding month
    const centerCostsByMonth = {};
    centerOperationalCosts.forEach(cost => {
      const date = new Date(cost.monthYear);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

      if (!centerCostsByMonth[monthYear]) {
        centerCostsByMonth[monthYear] = 0;
      }

      // Sum up operations for each month only once
      cost.operations.forEach(operation => {
        centerCostsByMonth[monthYear] += operation.price;
      });
    });

    // Calculate final net profit for each month once
    Object.keys(revenueByMonth).forEach(monthYear => {
      const revenue = revenueByMonth[monthYear];

      // Apply the center operations costs for the month only once
      revenue.centerOperationsCosts = centerCostsByMonth[monthYear] || 0;

      // Deduct center operations costs from the total initial net profit for the month
      const finalNetProfit = revenue.initialNetProfit - revenue.centerOperationsCosts;

      // Ensure final net profit does not go below zero
      revenue.finalNetProfit = Math.max(finalNetProfit, 0);

      // Debugging: Log calculations for each month
      console.log(`Month: ${monthYear}`);
      console.log(`Initial Net Profit: ${revenue.initialNetProfit}`);
      console.log(`Center Operations Costs: ${revenue.centerOperationsCosts}`);
      console.log(`Final Net Profit: ${revenue.finalNetProfit}`);
    });

    // Convert revenueByMonth object into an array of objects for response
    const revenueByMonthArray = Object.values(revenueByMonth);

    // Send JSON response with the relevant details
    res.json({
      manager: {
        name: manager.name,
        username: manager.username // Include the username
      },
      mostFamousCourses: mostFamousCourseTitles,
      enrollmentsByMonth,
      profitsByCourse,
      revenueByMonth: revenueByMonthArray
    });
  } catch (error) {
    // Handle any errors during execution
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTotalNumbersByManager,
  getStudentEnrollmentTrendsByManager,
  getCourseCompletionRatesByManager,
  getFinancialSummariesByManager,
  getManagerDetails
};
