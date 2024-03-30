const Course = require('../models/coursesModel');
const Manager = require('../models/managersModel');
const jwt = require('jsonwebtoken');
const Enrollment = require('../models/enrollmentsModel');

// Get courses for the logged-in manager
const getCourses = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'your-secret-key');
    const manager = await Manager.findOne({ _id: decoded.id });

    if (!manager) {
      throw new Error();
    }

    const courses = await Course.find({ manager: manager._id });

    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error, check your internet connection' });
  }
};

// // Add a new course for the logged-in manager
const addCourse = async (req, res) => {
  try {
    const managerId = req.manager._id;
    const { title, cost, schedule, teachers, operationalCosts } = req.body;

    const newCourse = new Course({
      title,
      cost,
      schedule,
      teachers,
      operationalCosts,
      manager: managerId,
    });

    await newCourse.save();

    // Update the manager's courses array
    await Manager.findByIdAndUpdate(managerId, { $push: { courses: newCourse._id } });

    res.status(201).json({ message: 'Course added successfully', course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error, check your internet connection' });
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const managerId = req.manager._id;
    const { title, cost, schedule, teachers, operationalCosts } = req.body;

    // Update the course with the provided data, including the teacher details
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        title,
        cost,
        schedule,
        teachers, // Update the teachers array directly
        operationalCosts,
      },
      { new: true } // Return the updated course
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Update the teacher details in other courses where the same teacher is assigned
    const otherCourses = await Course.find({ _id: { $ne: courseId }, 'teachers._id': { $in: teachers.map(teacher => teacher._id) } });
    for (const course of otherCourses) {
      for (const updatedTeacher of teachers) {
        const existingTeacherIndex = course.teachers.findIndex(t => t._id.toString() === updatedTeacher._id.toString());
        if (existingTeacherIndex !== -1) {
          course.teachers[existingTeacherIndex] = updatedTeacher;
        }
      }
      await course.save();
    }

    res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error, check your internet connection' });
  }
};


// Delete an existing course for the logged-in manager
const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const managerId = req.manager._id;

    // Delete all enrollments related to the course being deleted
    await Enrollment.deleteMany({ course: courseId });

    // Find the course and remove it
    const deletedCourse = await Course.findOneAndDelete({ _id: courseId });

    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Remove the course ID from the manager's courses array
    await Manager.findByIdAndUpdate(managerId, { $pull: { courses: courseId } });

    res.status(200).json({ message: 'Course deleted successfully', course: deletedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error, check your internet connection' });
  }
};

// Controller to get a specific course by its ID for the logged-in manager
const getCourseById = async (req, res) => {
  try {
    const managerId = req.manager._id;
    const courseId = req.params.id;

    const course = await Course.findOne({ _id: courseId, manager: managerId });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error('Error in getCourseById:', error);
    res.status(500).json({ error: 'Internal Server Error, check your internet connection' });
  }
};

const getTeachersDetailedInfoAndCalculateSalary = async (req, res) => {
  try {
    const managerId = req.manager._id;

    // Find all courses for the logged-in manager
    const courses = await Course.find({ manager: managerId });

    if (!courses.length) {
      return res.json('You dont have courses yet so you dont have teachers');
    }

    // Initialize an object to store teacher information
    const teachersInfo = {};

    // Iterate through each course
    for (const course of courses) {
      // Iterate through each teacher in the course
      for (const teacher of course.teachers) {
        // Find enrollments for the course and populate student details
        const enrollments = await Enrollment.find({ course: course._id }).populate('student');

        // Calculate total profit for the course considering student discounts
        let totalProfit = 0;
        for (const enrollment of enrollments) {
          // Check if enrollment has a student
          if (enrollment.student) {
            const studentDiscount = enrollment.student.discount || 0;
            totalProfit += course.cost * (1 - (studentDiscount / 100));
          }
        }

        // Calculate teacher's salary for the course
        const teacherSalary = (totalProfit * (teacher.percentOfProfit || 0)) / 100;

        // If the teacher already exists in teachersInfo, update their salary and course details
        if (teacher._id in teachersInfo) {
          teachersInfo[teacher._id].courses.push({
            courseId: course._id,
            courseName: course.title,
            salary: teacherSalary,
          });
          teachersInfo[teacher._id].totalSalary += teacherSalary;
        } else {
          // Otherwise, add a new entry for the teacher
          teachersInfo[teacher._id] = {
            teacherId: teacher._id,
            name: teacher.name,
            phone: teacher.phone,
            percentOfProfit: teacher.percentOfProfit,
            courses: [{
              courseId: course._id,
              courseName: course.title,
              salary: teacherSalary,
            }],
            totalSalary: teacherSalary,
          };
        }
      }
    }

    // Convert teachersInfo object to array
    const teachersArray = Object.values(teachersInfo);

    res.json({ teachers: teachersArray });
  } catch (error) {
    console.error('Error in getTeachersDetailedInfoAndCalculateSalary:', error);
    res.status(500).json({ error: 'Internal Server Error, check your internet connection' });
  }
};


const getCoursesAndCalculateSalary = async (req, res) => {
  const managerId = req.manager._id;
  const { teacherName } = req.params;

  try {
    // Find all courses where the specified teacher's name matches
    const courses = await Course.find({ 'teachers.name': teacherName, manager: managerId });

    if (!courses.length) {
      return res.status(404).json({ error: 'No courses found for the specified teacher' });
    }

    // Initialize total salary
    let totalSalary = 0;

    // Initialize an array to store teacher's courses and salary
    const teacherSalaryInfo = {
      teacher: teacherName,
      courses: []
    };

    // Iterate through each course taught by the teacher
    for (const course of courses) {
      // Find enrollments for the course and populate student details
      const enrollments = await Enrollment.find({ course: course._id }).populate('student');

      // Calculate total profit for the course
      let totalProfit = 0;
      let numberOfStudents = enrollments.length; // Initialize the number of students

      // Calculate profit for each student enrolled in the course
      for (const enrollment of enrollments) {
        const student = enrollment.student;
        const discount = student ? (student.discount || 0) : 0;
        const profit = course.cost * (1 - discount / 100); // Calculate profit after discount
        totalProfit += profit;
      }

      // Calculate teacher's salary for the course based on their percentage of profit
      const teacher = course.teachers.find(t => t.name === teacherName);
      const teacherSalary = totalProfit * (teacher.percentOfProfit / 100); // Calculate teacher's salary

      // Add course information to teacher's salary info
      teacherSalaryInfo.courses.push({
        courseName: course.title,
        percentOfProfit: teacher.percentOfProfit,
        numberOfStudents,
        totalProfit,
        salary: teacherSalary
      });

      // Add teacher's salary for this course to the total salary
      totalSalary += teacherSalary;
    }

    // Set the total salary in the response object
    teacherSalaryInfo.totalSalary = totalSalary;

    res.json(teacherSalaryInfo);
  } catch (error) {
    console.error('Error in getCoursesAndCalculateSalary:', error);
    res.status(500).json({ error: 'Internal Server Error, check your internet connection' });

  }
};

// Controller to search for courses by title
const searchCoursesByTitle = async (req, res) => {
  try {
    const managerId = req.manager._id;
    const { title } = req.body; // Retrieve title from the request body

    const courses = await Course.find({ title: { $regex: new RegExp(title, 'i') }, manager: managerId });

    if (!courses.length) {
      return res.status(404).json({ error: 'No courses found with the specified title' });
    }

    res.json({ courses });
  } catch (error) {
    console.error('Error in searchCoursesByTitle:', error);
    res.status(500).json({ error: 'Internal Server Error, check your internet connection' });
  }
};


const searchTeachersByName = async (req, res) => {
  try {
    const { name } = req.body; // Retrieve name from the request body

    // Search for teachers by name using the courses collection
    const courses = await Course.find({ 'teachers.name': { $regex: new RegExp(name, 'i') } });

    if (!courses.length) {
      return res.status(404).json({ error: 'No teachers found with the specified name' });
    }

    // Initialize an array to store teacher details
    const teachersDetails = [];

    // Iterate through each course
    for (const course of courses) {
      // Filter teachers by name
      const matchingTeachers = course.teachers.filter(teacher => teacher.name.toLowerCase().includes(name.toLowerCase()));

      // Iterate through each matching teacher
      for (const teacher of matchingTeachers) {
        // Find enrollments for the course and populate student details
        const enrollments = await Enrollment.find({ course: course._id }).populate('student');

        // Calculate total profit for the course considering student discounts
        let totalProfit = 0;
        for (const enrollment of enrollments) {
          // Check if enrollment has a student
          if (enrollment.student) {
            const studentDiscount = enrollment.student.discount || 0;
            totalProfit += course.cost * (1 - (studentDiscount / 100));
          }
        }

        // Calculate teacher's salary for the course
        const teacherSalary = (totalProfit * (teacher.percentOfProfit || 0)) / 100;

        // Add teacher details to the array
        teachersDetails.push({
          name: teacher.name,
          phone: teacher.phone,
          courses: [
            {
              courseName: course.title,
              percentOfProfit: teacher.percentOfProfit,
              salary: teacherSalary,
            },
          ],
          totalSalary: teacherSalary,
        });
      }
    }

    res.json({ teachers: teachersDetails });
  } catch (error) {
    console.error('Error in searchAndReturnTeacherDetails:', error);
    res.status(500).json({ error: 'Internal Server Error, check your internet connection' });
  }
};



module.exports = {
  getCourses,
  addCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesAndCalculateSalary,
  getTeachersDetailedInfoAndCalculateSalary,
  searchCoursesByTitle,
  searchTeachersByName
};
