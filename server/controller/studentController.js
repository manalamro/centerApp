const Student = require('../models/studentsModel');
const Enrollment = require('../models/enrollmentsModel');
const Manager = require('../models/managersModel');
const Course = require('../models/coursesModel');


//   exports.createStudent = async (req, res) => {
//   const managerId = req.manager._id;
//   const { name, phone, discount, enrolledCourses } = req.body;

//   try {
//     // Ensure at least one course is provided
//     if (!enrolledCourses || enrolledCourses.length === 0) {
//       return res.status(400).json({ error: 'At least one course must be provided for enrollment' });
//     }

//     // Ensure the new student is associated with the logged-in manager
//     const newStudent = await Student.create({
//       name,
//       phone,
//       discount,
//       manager: managerId,
//       enrollments: [], // Initialize the enrollments array
//     });

//     // Enroll the student in specified courses
//     for (const courseTitle of enrolledCourses) {
//       // Find the course by title
//       const course = await Course.findOne({ title: courseTitle, manager: managerId });

//       // Make sure the course exists and is managed by the logged-in manager
//       if (course) {
//         // Create enrollment for the student in the course
//         await Enrollment.create({
//           student: newStudent._id,
//           course: course._id,
//           manager: managerId,
//         });
//       }
//     }

//     res.json(newStudent);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

exports.createStudent = async (req, res) => {
  const managerId = req.manager._id;
  const { name, phone, discount, enrolledCourses } = req.body;

  try {
    // Ensure at least one course is provided
    if (!enrolledCourses || enrolledCourses.length === 0) {
      return res.status(400).json({ error: 'At least one course must be provided for enrollment' });
    }

    // Ensure the new student is associated with the logged-in manager
    const newStudent = await Student.create({
      name,
      phone,
      discount,
      manager: managerId,
      enrollments: [], // Initialize the enrollments array
    });

    // Enroll the student in specified courses
    for (const { title, enrollmentDate } of enrolledCourses) {
      // Find the course by title
      const course = await Course.findOne({ title, manager: managerId });

      // Make sure the course exists and is managed by the logged-in manager
      if (course) {
        // Create enrollment for the student in the course
        await Enrollment.create({
          student: newStudent._id,
          course: course._id,
          manager: managerId,
          createdAt: enrollmentDate, // Use the provided enrollment date
        });
      }
    }

    res.json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  const studentId = req.params.id;
  const managerId = req.manager._id;
  const { name, phone, discount, enrollments } = req.body; // Include 'enrollments' in the request body

  try {
    // Update student data
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: studentId, manager: managerId },
      { name, phone, discount, enrollments }, // Include 'enrollments' in the update operation
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
exports.getStudentById = async (req, res) => {
  const managerId = req.manager?._id;
  const studentId = req.params.id;

  // Check if the user is authenticated
  if (!managerId) {
    return res.status(401).json({ error: 'Please authenticate' });
  }

  try {
    // Ensure the student is associated with the logged-in manager
    const student = await Student.findOne({ _id: studentId, manager: managerId }).populate({
      path: 'enrollments',
      populate: { path: 'course' }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentDiscount = student.discount || 0;
    const enrichedEnrollments = student.enrollments.map(enrollment => {
      const course = enrollment.course;
      const costAfterDiscount = course.cost * (1 - studentDiscount / 100);
      return {
        _id: enrollment._id, // Include enrollment ID
        courseTitle: course.title,
        cost: course.cost,
        costAfterDiscount: costAfterDiscount,
        schedule: course.schedule
      };
    });

    const { _id, name, phone, discount } = student;

    res.json({
      _id,
      name,
      phone,
      discount: studentDiscount,
      enrollments: enrichedEnrollments
    });
  } catch (error) {
    console.error('Error fetching student by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.searchStudentsByName = async (req, res) => {
  try {
    const { name } = req.body; // Retrieve name from the request body

    // Search for students by name
    const students = await Student.find({ name: { $regex: new RegExp(name, 'i') } }).populate({
      path: 'enrollments',
      populate: { 
        path: 'course',
        select: 'title cost schedule' // Select only necessary fields from the course
      }
    });

    const enrichedStudents = await Promise.all(students.map(async student => {
      const studentDiscount = student.discount || 0;

      // Fetch enrollments with populated course and payments
      const enrichedEnrollments = await Promise.all(student.enrollments.map(async enrollment => {
        const course = enrollment.course;
        const costAfterDiscount = course.cost * (1 - studentDiscount / 100);
        
        // Calculate remaining balance after each payment
        let remainingBalance = costAfterDiscount;
        const enrichedPayments = enrollment.payments.map(payment => {
          remainingBalance -= payment.amount;
          return {
            ...payment.toObject(), // Convert Mongoose document to plain object
            costAfterDiscount,
            remainingBalanceAfterPayment: remainingBalance // Include remaining balance after each payment
          };
        });

        // Include required fields directly under enrollment object
        return {
          ...enrollment.toObject(), // Convert Mongoose document to plain object
          payments: enrichedPayments
        };
      }));

      return {
        _id: student._id,
        name: student.name,
        phone: student.phone,
        discount: studentDiscount,
        enrollments: enrichedEnrollments
      };
    }));

    res.json({ students: enrichedStudents });
  } catch (error) {
    console.error('Error in searchStudentsByName:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ manager: req.manager._id }).populate({
      path: 'enrollments',
      populate: { 
        path: 'course',
        select: 'title cost schedule' // Select only necessary fields from the course
      }
    });

    const enrichedStudents = await Promise.all(students.map(async student => {
      const studentDiscount = student.discount || 0;

      // Fetch enrollments with populated course and payments
      const enrichedEnrollments = await Promise.all(student.enrollments.map(async enrollment => {
        const course = enrollment.course;
        const costAfterDiscount = course.cost * (1 - studentDiscount / 100);
        
        // Calculate remaining balance after each payment
        let remainingBalance = costAfterDiscount;
        const enrichedPayments = enrollment.payments.map(payment => {
          remainingBalance -= payment.amount;
          return {
            ...payment.toObject(), // Convert Mongoose document to plain object
            remainingBalanceAfterPayment: remainingBalance // Include remaining balance after each payment
          };
        });

        // Include required fields directly under enrollment object
        return {
          ...enrollment.toObject(), // Convert Mongoose document to plain object
          costAfterDiscount, // Include cost after discount
          payments: enrichedPayments
        };
      }));

      return {
        _id: student._id,
        name: student.name,
        phone: student.phone,
        discount: studentDiscount,
        enrollments: enrichedEnrollments
      };
    }));

    res.json(enrichedStudents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
