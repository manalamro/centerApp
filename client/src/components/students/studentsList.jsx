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
import {Table, Button, Modal, Row, Col, message, Spin} from "antd";
import AddPaymentForm from "./AddPaymentForm";
import "./st.css";
import { useAuth } from "../../hooks/useAuth";
import {studentService} from '../../service/api';

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

  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      message.error("An error occurred during logout.");
    }
  };

  useEffect(() => {
      setLoading(true);
    const fetchStudents = async () => {
      let token = localStorage.getItem('token');
      const data = await studentService.getAllStudents(token);
      if (Array.isArray(data)) {
        setStudents(data);
        setLoading(false);
      } else {
        console.log(data.error);
        message.error(data.error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const fetchCoursesData = async () => {
    try {
      const coursesData = await fetchCourses();
      setCourses(coursesData);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCoursesData();
  }, []);

    const handleDeleteStudent = async (studentId) => {
        try {
            let totalRemainingBalance = 0;

            for (const student of students) {
                if (student._id === studentId) {
                    for (const enrollment of student.enrollments) {
                        const paymentsTotal = enrollment.payments.reduce(
                            (total, payment) => total + payment.amount,
                            0
                        );
                        const remainingBalance = enrollment.costAfterDiscount - paymentsTotal;
                        totalRemainingBalance += remainingBalance;
                    }
                    break;
                }
            }

            if (totalRemainingBalance === 0) {
                // If there are no outstanding balances, show confirmation message
                Modal.confirm({
                    title: 'Confirm Deletion',
                    content: 'Are you sure you want to delete this student?',
                    onOk: async () => {
                        try {
                            const result = await deleteStudent(studentId);
                            if (!result.error) {
                                setStudents(
                                    students.filter((student) => student._id !== studentId)
                                );
                                message.success('Student deleted successfully');
                            } else {
                                message.error(result.error); // Display API error message
                            }
                        } catch (error) {
                            message.error(error.message); // Display error message from API call
                        }
                    },
                });
            } else {
                // If there are outstanding balances, show error message
                Modal.error({
                    title: 'Cannot Delete Student',
                    content: `There are outstanding balances totaling ${totalRemainingBalance} for this student. Please clear them before deleting.`,
                });
            }
        } catch (error) {
            message.error(error.message); // Display error message from balance calculation
        }
    };
    const handleUpdateSubmit = async (updateStudentData) => {
        try {
           const result =  await updateStudents(updateStudentData._id, updateStudentData, token);
           console.log("result:",result);

            if (result.error) {
                message.error(result.error);
                return;
            }
            
            setShowUpdateForm(false);
            setSelectedStudent(null);
 
            const updatedStudentsData = await fetchStudents(token);
            if (!Array.isArray(updatedStudentsData)) {
                message.error(updatedStudentsData.error);
                return;
            }

            if (updatedStudentsData.error) {
                message.error(updatedStudentsData.error);
                return;
            }
            setStudents(updatedStudentsData);
            message.success(result.message);
        } catch (error) {
            setError(error.message);
            // message.error(error);
            
        }
    };

    const handleUpdateStudent = async (studentId) => {
        try {
            const studentData = await getStudentById(studentId);
            if(studentData.error){
                message.error(studentData.error);
                return;
            }
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

  
    const handleOpenAddPaymentModal = async (
        enrollmentId,
        costAfterDiscount,
        remainingBalanceAfterPayment
    ) => {
        try {
            const studentsData = await fetchStudents(token);
            console.log('studentsData:', studentsData); // Add this line to inspect the data structure

            if (!Array.isArray(studentsData)) {
                message.error(studentsData.error);
                return;
            }

            if (studentsData.error) {
                message.error(studentsData.error.message);
                return;
            }

            const student = studentsData.find((student) =>
                student.enrollments.some((enrollment) => enrollment._id === enrollmentId)
            );

            if (!student) {
                console.error('Student not found');
                return;
            }

            const enrollment = student.enrollments.find(
                (enrollment) => enrollment._id === enrollmentId
            );

            if (!enrollment) {
                console.error('Enrollment not found');
                return;
            }

            if (remainingBalanceAfterPayment === undefined) {
                const paymentsTotal = enrollment.payments.reduce(
                    (total, payment) => total + payment.amount,
                    0
                );
                remainingBalanceAfterPayment = costAfterDiscount - paymentsTotal;
            }

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

            // Find the student and update the local state for the specific enrollment
            const updatedStudents = students.map(student => {
                const updatedEnrollments = student.enrollments.map(enrollment => {
                    if (enrollment._id === enrollmentId) {
                        return {
                            ...enrollment,
                            payments: [...enrollment.payments, paymentData], // Add new payment locally
                        };
                    }
                    return enrollment;
                });
                return {
                    ...student,
                    enrollments: updatedEnrollments,
                };
            });

            setStudents(updatedStudents); // Update students state with the modified enrollment
            setPaymentDetails((prevDetails) => [...prevDetails, paymentData]); // Update payment details state
        } catch (error) {
            console.error("Error adding payment:", error);
            message.error("Failed to add payment. Please try again.");
        }
    };

  const handleViewPaymentDetails = async (enrollmentId, studentName) => {
    try {
        const token = localStorage.getItem('token');
        
        const  students=  await studentService.getAllStudents(token);

        if (!Array.isArray(students)) {
            message.error(students.error);
            return;
        }

        if (students.error) {
            message.error(students.error.message);
            return;
        }
        
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
      setSelectedStudentName(studentName); // Set the correct student name here
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
      render: (enrollments) => (
        <div>
          <Button onClick={() => handleViewEnrollments(enrollments)}>
            View Enrollments
          </Button>
          <Modal
            title="Enrollments"
            visible={enrollmentModalVisible}
            onCancel={handleCloseEnrollmentModal}
            footer={null}
            width={800}
          >
            <Table
              columns={[
                {
                  title: "Course Title",
                  dataIndex: "course",
                  key: "courseTitle",
                  render: (course) => course.title,
                  width: "25%",
                },
                {
                  title: "Cost",
                  dataIndex: "course",
                  key: "courseCost",
                  render: (course) => course.cost,
                  width: "15%",
                },
                {
                  title: "Cost After Discount",
                  dataIndex: "costAfterDiscount",
                  key: "costAfterDiscount",
                  width: "20%",
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
                  width: "30%",
                },
                {
                  title: "Actions",
                  key: "actions",

                  render: (name, enrollment) => (
                    <div>
                      <Button
                         onClick={() => {
                          const enrollmentId = enrollment._id;
                          const studentId = enrollment.student; // Assuming this is how you access student ID in enrollment
                          const student = students.find(student => student._id === studentId);
                          const studentName = student ? student.name : 'Unknown'; // Fallback if student is not found

                          handleViewPaymentDetails(enrollmentId, studentName);
                        }}

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
                  width: "10%",
                },
              ]}
              dataSource={selectedEnrollments}
              pagination={false}
              rowKey={(enrollment) => enrollment._id}
              scroll={{ x: "100%" }}
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
    return  <Spin tip="Loading courses..." />
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

      {students.length === 0 || !students? (
        <div>You don't have any students yet</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <Table columns={columns} dataSource={students} />
        </div>
      )}

      {error === "Token expired or invalid. Please log in again." ? (
          <Button onClick={handleLogout} style={{marginTop:"20px"}}>
            Login again
          </Button>
      ):null}

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
        costAfterDiscount={costAfterDiscount}
        error = {error}
        remainingBalanceAfterPayment={remainingBalanceAfterPayment}
      />

      <Modal
        title={`Payment Details for ${selectedStudentName}`}
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






