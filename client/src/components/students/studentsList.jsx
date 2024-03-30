import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchStudents,
  updateStudents,
  deleteStudent,
  getStudentById,
} from "../../utils/studentOperations";
import { fetchCourses } from "../../utils/coursesOperation";
import UpdateStudentForm from "./updateStudnet";
import { addPayment } from "../../utils/enrollmnetUtils";
import { Table, Button, Modal, Row, Col } from "antd";
import AddPaymentForm from "./AddPaymentForm";
import "./st.css";

const StudentList = ({ token }) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(null);
  const [paymentDetailsModalVisible, setPaymentDetailsModalVisible] =
    useState(false);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [
    selectedEnrollmentIdForPaymentDetails,
    setSelectedEnrollmentIdForPaymentDetails,
  ] = useState(null);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [enrollmentModalVisible, setEnrollmentModalVisible] = useState(false);
  const [selectedEnrollments, setSelectedEnrollments] = useState([]);
  const [costAfterDiscount, setCostAfterDiscount] = useState(0);
  const [remainingBalanceAfterPayment, setRemainingBalanceAfterPayment] =
    useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await fetchStudents(token);
        setStudents(studentsData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const coursesData = await fetchCourses();
        setCourses(coursesData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCoursesData();
  }, []);

  const handleDeleteStudent = async (studentId) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this student?",
      onOk: async () => {
        try {
          await deleteStudent(studentId, token);
          setStudents(students.filter((student) => student._id !== studentId));
        } catch (error) {
          setError(error.message);
        }
      },
      onCancel() {
        // Do nothing if user cancels deletion
      },
    });
  };

  const handleUpdateSubmit = async (updateStudentData) => {
    try {
      await updateStudents(updateStudentData._id, updateStudentData, token);
      setShowUpdateForm(false);
      setSelectedStudent(null);

      const updatedStudentsData = await fetchStudents(token);
      setStudents(updatedStudentsData);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateStudent = async (studentId) => {
    try {
      const studentData = await getStudentById(studentId);
      setSelectedStudent(studentData);
      setShowUpdateForm(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false);
  };

  const handleAddStudent = () => {
    navigate("/addStudent");
  };

  const handleOpenAddPaymentModal = async (enrollmentId, costAfterDiscount, remainingBalanceAfterPayment) => {
    try {

      // Fetch the updated list of students
      const studentsData = await fetchStudents(token);
  
      // Find the student with the relevant enrollment
      const student = studentsData.find((student) =>
        student.enrollments.some((enrollment) => enrollment._id === enrollmentId)
      );
  
      // Find the specific enrollment within the selected student's enrollments
      const enrollment = student.enrollments.find(
        (enrollment) => enrollment._id === enrollmentId
      );
  
      if (!student || !enrollment) {
        console.error('Student or enrollment not found');
        return;
      }
  
      // If costAfterDiscount and remainingBalanceAfterPayment are not provided, calculate them
      if (remainingBalanceAfterPayment === undefined) {
        const paymentsTotal = enrollment.payments.reduce(
          (total, payment) => total + payment.amount,
          0
        );
        remainingBalanceAfterPayment = costAfterDiscount - paymentsTotal;
   
      }
      // Open the add payment modal with the calculated values
      setSelectedEnrollmentId(enrollmentId);
      setCostAfterDiscount(costAfterDiscount);
      setRemainingBalanceAfterPayment(remainingBalanceAfterPayment);
      setShowAddPaymentModal(true);
    } catch (error) {
      console.error('Error opening add payment modal:', error);
      setError(error.message || 'Failed to open add payment modal');
    }
  };
  
  const handleCloseAddPaymentModal = () => {
    setShowAddPaymentModal(false);
  };
  const handleAddPayment = async (enrollmentId, paymentData) => {
    try {
      await addPayment(enrollmentId, paymentData);
      // Update payment details for the specific enrollment
      const updatedStudents = students.map((student) => {
        const updatedEnrollments = student.enrollments.map((enrollment) => {
          if (enrollment._id === enrollmentId) {
            enrollment.payments.push(paymentData);
          }
          return enrollment;
        });
        return { ...student, enrollments: updatedEnrollments };
      });
      setStudents(updatedStudents);
      setShowAddPaymentModal(false); // Close the modal after adding payment

      // Update payment details for the modal if it's open for the same enrollment
      if (selectedEnrollmentIdForPaymentDetails === enrollmentId) {
        const updatedEnrollment = updatedStudents
          .find((student) =>
            student.enrollments.some(
              (enrollment) => enrollment._id === enrollmentId
            )
          )
          .enrollments.find((enrollment) => enrollment._id === enrollmentId);
        setPaymentDetails(updatedEnrollment.payments);
      }
    } catch (error) {
      setError(error.message || "Failed to add payment");
    }
  };


  const handleViewPaymentDetails = async (enrollmentId, studentName) => {
    try {
      const student = students.find((student) =>
        student.enrollments.some(
          (enrollment) => enrollment._id === enrollmentId
        )
      );
      const enrollment = student.enrollments.find(
        (enrollment) => enrollment._id === enrollmentId
      );
      setPaymentDetails(enrollment.payments);
      setSelectedEnrollmentIdForPaymentDetails(enrollmentId);
      setSelectedStudentName(studentName);
      setPaymentDetailsModalVisible(true);
    } catch (error) {
      setError(error.message || "Failed to fetch payment details");
    }
  };
  const handleClosePaymentDetailsModal = () => {
    setPaymentDetails([]);
    setSelectedEnrollmentIdForPaymentDetails(null);
    setSelectedStudentName("");
    setPaymentDetailsModalVisible(false);
  };

  const handlePrintPaymentDetails = () => {
    window.print();
  };

  const handleViewEnrollments = (enrollments) => {
    setSelectedEnrollments(enrollments);
    setEnrollmentModalVisible(true);
  };

  const handleCloseEnrollmentModal = () => {
    setEnrollmentModalVisible(false);
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Enrollments",
      dataIndex: "enrollments",
      key: "enrollments",
      render: (enrollments, record) => (
        <div>
          <Button onClick={() => handleViewEnrollments(enrollments)}>
            View Enrollments
          </Button>
          <Modal
            title="Enrollments"
            visible={enrollmentModalVisible}
            onCancel={handleCloseEnrollmentModal}
            footer={null}
            width={800} // Set the width of the modal
          >
            <Table
              columns={[
                {
                  title: "Course Title",
                  dataIndex: "course",
                  key: "courseTitle",
                  render: (course) => course.title,
                  width: "25%", // Set the width of the column
                },
                {
                  title: "Cost",
                  dataIndex: "course",
                  key: "courseCost",
                  render: (course) => course.cost,
                  width: "15%", // Set the width of the column
                },
                {
                  title: "Cost After Discount",
                  dataIndex: "costAfterDiscount",
                  key: "costAfterDiscount",
                  width: "20%", // Set the width of the column
                },
                {
                  title: "Schedule",
                  dataIndex: "course",
                  key: "courseSchedule",
                  render: (course) =>
                    course.schedule
                      ? `${
                          course.schedule.recurrence
                        } on ${course.schedule.days.join(", ")} at ${
                          course.schedule.time
                        }`
                      : "Not specified",
                  width: "30%", // Set the width of the column
                },
                {
                  title: "Actions",
                  key: "actions",
                  render: (_, enrollment) => (
                    <div>
                      <Button
                        onClick={() =>
                          handleViewPaymentDetails(
                            enrollment._id,
                            record.name, // Pass student name to view payment details
                         
                            )
                        }
                        style={{ marginRight: 8 }}
                      >
                       View Payments
                      </Button>
                      <Button
                        onClick={() =>
                          handleOpenAddPaymentModal(
                            enrollment._id,
                            enrollment.costAfterDiscount,
                            enrollment.remainingBalanceAfterPayment
                          )
                        }
                      >
                        Add Payment
                      </Button>
                    </div>
                  ),
                  width: "10%", // Set the width of the column
                },
              ]}
              dataSource={selectedEnrollments}
              pagination={false}
              rowKey={(enrollment) => enrollment._id}
              scroll={{ x: "100%" }} // Ensure horizontal scrolling if content exceeds modal width
            />
          </Modal>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button.Group>
          <Button onClick={() => handleDeleteStudent(record._id)}>
            Delete
          </Button>
          <Button onClick={() => handleUpdateStudent(record._id)}>
            Update
          </Button>
        </Button.Group>
      ),
    },
  ];
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <h2>Students List</h2>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={handleAddStudent}
            style={{
              backgroundColor: "#4DB6AC",
              borderColor: "rgb(77 182 172)",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            Add New student
          </Button>
        </Col>
      </Row>

      {students.length === 0 ? (
        <div>You don't have any students yet</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <Table columns={columns} dataSource={students} />
        </div>
      )}

      <Modal
        title="Update Student"
        visible={showUpdateForm}
        onCancel={handleCloseUpdateForm}
        footer={null}
      >
        {showUpdateForm && selectedStudent && (
          <UpdateStudentForm
            token={token}
            studentData={selectedStudent}
            courses={courses}
            onSubmit={handleUpdateSubmit}
            onCancel={handleCloseUpdateForm}
          />
        )}
      </Modal>

      <AddPaymentForm
        enrollmentId={selectedEnrollmentId}
        onAddPayment={handleAddPayment}
        visible={showAddPaymentModal}
        onCancel={handleCloseAddPaymentModal}
        costAfterDiscount={costAfterDiscount} // Pass costAfterDiscount prop
        remainingBalanceAfterPayment={remainingBalanceAfterPayment} // Pass remainingBalanceAfterPayment prop
      />

      <Modal
        title={`Payment Details for ${selectedStudentName}`} // Display student name in the modal title
        visible={paymentDetailsModalVisible}
        onCancel={handleClosePaymentDetailsModal}
        footer={[
          <Button key="print" onClick={handlePrintPaymentDetails}>
            Print
          </Button>,
        ]}
      >
        <Table
          columns={[
            {
              title: "Payment Date",
              dataIndex: "date",
              key: "date",
              render: (date) => new Date(date).toLocaleString(),
            },
            {
              title: "Amount",
              dataIndex: "amount",
              key: "amount",
            },
            {
              title: "Cost After Payment",
              dataIndex: "remainingBalanceAfterPayment",
              key: "remainingBalanceAfterPayment",
              render: (remainingBalanceAfterPayment) =>
                remainingBalanceAfterPayment || "0",
            },
          ]}
          dataSource={paymentDetails}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default StudentList;