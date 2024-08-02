import React, { useState, useEffect } from "react";
import { Table, Button, message, Modal, Row, Col, Alert, Spin } from "antd";
import {
  fetchCourses,
  updateCourse,
  deleteCourse,
} from "../../utils/coursesOperation";
import UpdateCourseForm from "./updateCourse";
import "./courses.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const CourseList = ({ token }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [operationalCostsVisible, setOperationalCostsVisible] = useState(false);
  const [selectedOperationalCosts, setSelectedOperationalCosts] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const { logout } = useAuth();

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      message.error("An error occurred during logout.");
    }
  };
  const handleApiError = (error) => {
    // Handle error based on the message
    setError(error.message);
    message.error(error.message);

  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Show loading spinner while fetching data
        const fetchedCourses = await fetchCourses();

        if (fetchedCourses.length === 0) {
          message.info("No courses available. Please add new courses.");
        }
        setCourses(fetchedCourses);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false); // Hide loading spinner
      }
    };

    fetchData();
  }, []);



  const updateTeacher = (index, field, value) => {
    setTeachers((prevTeachers) => {
      const updatedTeachers = [...prevTeachers];
      updatedTeachers[index] = {
        ...updatedTeachers[index],
        [field]: value,
      };
      return updatedTeachers;
    });
  };

  const handleDeleteCourse = async (courseId) => {
    const result = await deleteCourse(courseId, token);
    if(result.error) {
      message.error(result.error);
    }
    else {
      setCourses(courses.filter((course) => course._id !== courseId));
      message.success("Course deleted successfully");
    }

    setConfirmDeleteVisible(false);

  };

  const handleUpdateCourse = (courseId) => {
    const courseToUpdate = courses.find((course) => course._id === courseId);
    setSelectedCourse(courseToUpdate);
    setShowUpdateForm(true);
  };

  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false);
    setSelectedCourse(null);
  };

  const handleUpdateSubmit = async (updatedCourseData) => {
      const result = await updateCourse(updatedCourseData._id, updatedCourseData);
      if(result.error){
        message.error(result.error);
      }
      else{
        message.success('Course updated successfully:');
        const updatedCourses = await fetchCourses(token);
        setCourses(updatedCourses);
        handleCloseUpdateForm();
      }
  };

  const handleDeleteConfirmation = (courseId) => {
    setDeletingCourseId(courseId);
    setConfirmDeleteVisible(true);
  };

  const handleCancelDelete = () => {
    setDeletingCourseId(null);
    setConfirmDeleteVisible(false);
  };

  const handleConfirmDelete = () => {
    if (deletingCourseId) {
      handleDeleteCourse(deletingCourseId);
    }
  };

  const handleShowOperationalCosts = (costs) => {
    setSelectedOperationalCosts(costs);
    setOperationalCostsVisible(true);
  };

  const handleCloseOperationalCosts = () => {
    setOperationalCostsVisible(false);
  };

  const handleAddCourse = () => {
    navigate("/addCourse");
  };

  const operationalCostsColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Cost",
      dataIndex: "price",  // Changed from 'price' to 'amount'
      key: "price",
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
    },
  ];

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
    },
    {
      title: "Schedule Time",
      dataIndex: ["schedule", "time"],
      key: "schedule.time",
    },
    {
      title: "Schedule Recurrence",
      dataIndex: ["schedule", "recurrence"],
      key: "schedule.recurrence",
    },
    {
      title: "Schedule Days",
      dataIndex: ["schedule", "days"],
      key: "schedule.days",
      render: (days) => (days ? days.join(", ") : ""),
    },
    {
      title: "Teacher Name",
      dataIndex: "teachers",
      key: "teachers",
      render: (teachers) => teachers.map((teacher) => teacher.name).join(", "),
    },
    {
      title: "Operational Costs",
      key: "operationalCosts",
      render: (_, record) => (
          <Button onClick={() => handleShowOperationalCosts(record.operationalCosts)}>View Costs</Button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
          <>
            <Button onClick={() => handleDeleteConfirmation(record._id)}>Delete</Button>
            <Button onClick={() => handleUpdateCourse(record._id)}>Update</Button>
          </>
      ),
    },
  ];

  return (
      <div>
        <Row justify="space-between" align="middle">
          <Col>
            <h2>Courses List</h2>
          </Col>
          <Col>
            <Button
                type="primary"
                onClick={handleAddCourse}
                style={{
                  backgroundColor: "#4DB6AC",
                  borderColor: "rgb(77 182 172)",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
            >
              Add New Course
            </Button>
          </Col>
        </Row>
        
        {loading ? (
            <Spin tip="Loading courses..." />
        ) : courses.length > 0 ? (
            <Table
                dataSource={courses}
                columns={columns}
                loading={loading}
                locale={{ emptyText: "You don't have any courses yet" }}
                rowKey="_id"
                scroll={{ x: "100%" }}
            />
        ) : (
            <p>There are no courses available.</p>
        )}
        {error === "Token expired or invalid. Please log in again." ? (
            <Button onClick={handleLogout}>
              Login again
            </Button>
        ):null}
        
        
        <Modal
            title="Confirm Delete"
            visible={confirmDeleteVisible}
            onOk={handleConfirmDelete}
            onCancel={handleCancelDelete}
        >
          <p>Are you sure you want to delete this course?</p>
        </Modal>

        <Modal
            title="Operational Costs"
            visible={operationalCostsVisible}
            onCancel={handleCloseOperationalCosts}
            footer={[
              <Button key="close" onClick={handleCloseOperationalCosts}>
                Close
              </Button>,
            ]}
        >
          <Table
              dataSource={selectedOperationalCosts}
              columns={operationalCostsColumns}
              pagination={false}
              rowKey={(record, index) => index}
          />
        </Modal>

        {showUpdateForm && selectedCourse && (
            <div className="modal-background">
              <div className="modal">
                <Button className="close-btn" onClick={handleCloseUpdateForm}>
                  Close
                </Button>
                <UpdateCourseForm
                    initialData={selectedCourse}
                    onSubmit={handleUpdateSubmit}
                    onCancel={handleCloseUpdateForm}
                    teachers={teachers}
                    updateTeacher={updateTeacher}
                />
              </div>
            </div>
        )}
      </div>
  );
};

export default CourseList;
