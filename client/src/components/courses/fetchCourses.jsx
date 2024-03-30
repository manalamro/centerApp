// import React, { useState, useEffect } from "react";
// import { Table, Button, message, Modal, Row, Col } from "antd";
// import {
//   fetchCourses,
//   updateCourse,
//   deleteCourse,
// } from "../../utils/coursesOperation";
// import UpdateCourseForm from "./updateCourse";
// import "./courses.css";
// import { useNavigate } from "react-router-dom"; // Import useNavigate hook

// const CourseList = ({ token }) => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showUpdateForm, setShowUpdateForm] = useState(false);
//   const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
//   const [deletingCourseId, setDeletingCourseId] = useState(null);
//   const [operationalCostsVisible, setOperationalCostsVisible] = useState(false); // New state to manage visibility of operational costs modal
//   const [selectedOperationalCosts, setSelectedOperationalCosts] = useState([]); // New state to store selected operational costs
//   const [teachers, setTeachers] = useState([]); // Global teacher state

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const fetchedCourses = await fetchCourses(token);
//         setCourses(fetchedCourses);
//         setLoading(false);
//       } catch (error) {
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchData();

//     return () => {};
//   }, [token]);

//   // Function to update teacher data globally
//   const updateTeacher = (index, field, value) => {
//     setTeachers((prevTeachers) => {
//       const updatedTeachers = [...prevTeachers];
//       updatedTeachers[index] = {
//         ...updatedTeachers[index],
//         [field]: value,
//       };
//       return updatedTeachers;
//     });
//   };

//   const handleDeleteCourse = async (courseId) => {
//     try {
//       await deleteCourse(courseId, token);
//       setCourses(courses.filter((course) => course._id !== courseId));
//       setConfirmDeleteVisible(false); // Close the confirmation modal after deletion
//       message.success("Course deleted successfully");
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   const handleUpdateCourse = (courseId) => {
//     const courseToUpdate = courses.find((course) => course._id === courseId);
//     setSelectedCourse(courseToUpdate);
//     setShowUpdateForm(true);
//   };

//   const handleCloseUpdateForm = () => {
//     setShowUpdateForm(false);
//   };

//   const handleUpdateSubmit = async (updatedCourseData) => {
//     try {
//       await updateCourse(updatedCourseData._id, updatedCourseData);
//       message.success("The course has been successfully updated");
//       const updatedCourses = await fetchCourses(token);
//       setCourses(updatedCourses);
//       setShowUpdateForm(false);
//       setSelectedCourse(null);
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   const handleDeleteConfirmation = (courseId) => {
//     setDeletingCourseId(courseId);
//     setConfirmDeleteVisible(true);
//   };

//   const handleCancelDelete = () => {
//     setDeletingCourseId(null);
//     setConfirmDeleteVisible(false);
//   };

//   const handleConfirmDelete = () => {
//     if (deletingCourseId) {
//       handleDeleteCourse(deletingCourseId);
//     }
//   };

//   const handleShowOperationalCosts = (costs) => {
//     setSelectedOperationalCosts(costs);
//     setOperationalCostsVisible(true);
//   };

//   const handleCloseOperationalCosts = () => {
//     setOperationalCostsVisible(false);
//   };

//   const navigate = useNavigate(); // Initialize useNavigate hook
//   const handleAddCourse = () => {
//     // Redirect the user to the add course page
//     navigate("/addCourse"); // Assuming '/add-course' is the route for adding a new course
//   };

//   const operationalCostsColumns = [
//     {
//       title: "Title",
//       dataIndex: "title",
//       key: "title",
//     },
//     {
//       title: "Price",
//       dataIndex: "price",
//       key: "price",
//       render: (text) => `$${parseFloat(text).toFixed(2)}`, // Limit to two decimal places
//     },
//   ];

//   const columns = [
//     {
//       title: "Title",
//       dataIndex: "title",
//       key: "title",
//     },
//     {
//       title: "Cost",
//       dataIndex: "cost",
//       key: "cost",
//       render: (text) => `$${parseFloat(text).toFixed(2)}`, // Limit to two decimal places
//     },
//     {
//       title: "Schedule Time",
//       dataIndex: ["schedule", "time"],
//       key: "schedule.time",
//     },
//     {
//       title: "Schedule Recurrence",
//       dataIndex: ["schedule", "recurrence"],
//       key: "schedule.recurrence",
//     },
//     {
//       title: "Schedule Days",
//       dataIndex: ["schedule", "days"],
//       key: "schedule.days",
//       render: (days) => (days ? days.join(", ") : ""),
//     },
//     {
//       title: "Teacher Name",
//       dataIndex: "teachers",
//       key: "teachers",
//       render: (teachers) => teachers.map((teacher) => teacher.name).join(", "),
//     },
//     {
//       title: "Operational Costs",
//       key: "operationalCosts",
//       render: (_, record) => (
//         <Button
//           onClick={() => handleShowOperationalCosts(record.operationalCosts)}
//         >
//           View Costs
//         </Button>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <>
//           <Button onClick={() => handleDeleteConfirmation(record._id)}>
//             Delete
//           </Button>
//           <Button onClick={() => handleUpdateCourse(record._id)}>Update</Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <Row justify="space-between" align="middle">
//         <Col>
//           <h2>Courses List</h2>
//         </Col>
//         <Col>
//           <Button
//             type="primary"
//             onClick={handleAddCourse}
//             style={{
//               backgroundColor: "#4DB6AC",
//               borderColor: "rgb(77 182 172)",
//               boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             Add New Course
//           </Button>
//         </Col>
//       </Row>
//       <Table
//         dataSource={courses}
//         columns={columns}
//         loading={loading}
//         locale={{ emptyText: "You don't have any courses yet" }}
//         rowKey="_id" // Assuming "_id" is the unique identifier for each course
//         scroll={{ x: "100%" }} // Ensure horizontal scrolling if content exceeds modal width
//       />

//       {/* Delete confirmation modal */}
//       <Modal
//         title="Confirm Delete"
//         visible={confirmDeleteVisible}
//         onOk={handleConfirmDelete}
//         onCancel={handleCancelDelete}
//       >
//         <p>Are you sure you want to delete this course?</p>
//       </Modal>

//       {/* Operational Costs modal */}
//       <Modal
//         title="Operational Costs"
//         visible={operationalCostsVisible}
//         onCancel={handleCloseOperationalCosts}
//         footer={[
//           <Button key="close" onClick={handleCloseOperationalCosts}>
//             Close
//           </Button>,
//         ]}
//       >
//         <Table
//           dataSource={selectedOperationalCosts}
//           columns={operationalCostsColumns}
//           pagination={false}
//           rowKey={(record, index) => index}
//         />
//       </Modal>

//       {/* Render the UpdateCourseForm component as a pop-up */}
//       {showUpdateForm && selectedCourse && (
//         <div className="modal-background">
//           <div className="modal">
//             <Button className="close-btn" onClick={handleCloseUpdateForm}>
//               Close
//             </Button>
//             <UpdateCourseForm
//               initialData={selectedCourse}
//               onSubmit={handleUpdateSubmit}
//               onCancel={() => setShowUpdateForm(false)}
//               teachers={teachers} // Pass global teacher data
//               updateTeacher={updateTeacher} // Pass global teacher update function
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CourseList;
import React, { useState, useEffect } from "react";
import { Table, Button, message, Modal, Row, Col } from "antd";
import {
  fetchCourses,
  updateCourse,
  deleteCourse,
} from "../../utils/coursesOperation";
import UpdateCourseForm from "./updateCourse";
import "./courses.css";
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const CourseList = ({ token }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [operationalCostsVisible, setOperationalCostsVisible] = useState(false); // New state to manage visibility of operational costs modal
  const [selectedOperationalCosts, setSelectedOperationalCosts] = useState([]); // New state to store selected operational costs
  const [teachers, setTeachers] = useState([]); // Global teacher state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCourses = await fetchCourses(token);
        setCourses(fetchedCourses);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();

    return () => {};
  }, [token]);


    // Function to update teacher data globally
    const updateTeacher = (index, field, value) => {
      setTeachers(prevTeachers => {
        const updatedTeachers = [...prevTeachers];
        updatedTeachers[index] = {
          ...updatedTeachers[index],
          [field]: value
        };
        return updatedTeachers;
      });
    };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId, token);
      setCourses(courses.filter((course) => course._id !== courseId));
      setConfirmDeleteVisible(false); // Close the confirmation modal after deletion
      message.success("Course deleted successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateCourse = (courseId) => {
    const courseToUpdate = courses.find((course) => course._id === courseId);
    setSelectedCourse(courseToUpdate);
    setShowUpdateForm(true);
  };

  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false);
  };

  const handleUpdateSubmit = async (updatedCourseData) => {
    try {
      await updateCourse(updatedCourseData._id, updatedCourseData);
      message.success("The course has been successfully updated");
      const updatedCourses = await fetchCourses(token);
      setCourses(updatedCourses);
      setShowUpdateForm(false);
      setSelectedCourse(null);
    } catch (error) {
      setError(error.message);
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

  const navigate = useNavigate(); // Initialize useNavigate hook
  const handleAddCourse = () => {
    // Redirect the user to the add course page
    navigate('/addCourse'); // Assuming '/add-course' is the route for adding a new course
  };

  const operationalCostsColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `$${parseFloat(text).toFixed(2)}`, // Limit to two decimal places
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
      render: (text) => `$${parseFloat(text).toFixed(2)}`, // Limit to two decimal places
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
          <Button type="primary" onClick={handleAddCourse} style={{ backgroundColor: "#4DB6AC", borderColor: "rgb(77 182 172)", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>Add New Course</Button>
        </Col>
      </Row>
      <Table
        dataSource={courses}
        columns={columns}
        loading={loading}
        locale={{ emptyText: "You don't have any courses yet" }}
        rowKey="_id" // Assuming "_id" is the unique identifier for each course
        scroll={{ x: "100%" }} // Ensure horizontal scrolling if content exceeds modal width

     />

      {/* Delete confirmation modal */}
      <Modal
        title="Confirm Delete"
        visible={confirmDeleteVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete this course?</p>
      </Modal>

      {/* Operational Costs modal */}
      <Modal
        title="Operational Costs"
        visible={operationalCostsVisible}
        onCancel={handleCloseOperationalCosts}
        footer={[
          <Button key="close" onClick={handleCloseOperationalCosts}>Close</Button>
        ]}
      >
        <Table
          dataSource={selectedOperationalCosts}
          columns={operationalCostsColumns}
          pagination={false}
          rowKey={(record, index) => index}
        />
      </Modal>

      {/* Render the UpdateCourseForm component as a pop-up */}
      {showUpdateForm && selectedCourse && (
        <div className="modal-background">
          <div className="modal">
            <Button className="close-btn" onClick={handleCloseUpdateForm}>
              Close
            </Button>
           <UpdateCourseForm
              initialData={selectedCourse}
              onSubmit={handleUpdateSubmit}
              onCancel={() => setShowUpdateForm(false)}
              teachers={teachers} // Pass global teacher data
              updateTeacher={updateTeacher} // Pass global teacher update function
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;
