
// import React, { useState, useEffect } from "react";
// import { fetchCourses } from "../../utils/coursesOperation";
// import { createStudent } from "../../utils/studentOperations";
// import { message, Form, Input, Button, Row, Col, DatePicker, Select } from "antd";
// import { useNavigate } from "react-router-dom";

// const { Option } = Select;

// const CreateStudentForm = () => {
//   const [form] = Form.useForm();
//   const [courses, setCourses] = useState([]);
//   const [selectedCourses, setSelectedCourses] = useState([]);
//   const [enrollmentDate, setEnrollmentDate] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCourses()
//       .then((courses) => {
//         setCourses(courses);
//       })
//       .catch((error) => {
//         message.error("Failed to fetch courses");
//       });
//   }, []);

//   const onFinish = async (values) => {
//     try {
//       if (selectedCourses.length === 0) {
//         message.error("Please select at least one course for enrollment.");
//         return;
//       }

//       const enrolledCoursesData = selectedCourses.map(courseId => ({
//         title: courses.find(course => course._id === courseId).title,
//         enrollmentDate: enrollmentDate ? enrollmentDate.format('YYYY-MM-DD') : null,
//       }));

//       const studentData = {
//         name: values.name,
//         phone: values.phone,
//         discount: values.discount,
//         enrolledCourses: enrolledCoursesData,
//       };

//       await createStudent(studentData);

//       form.resetFields();
//       setSelectedCourses([]);
//       setEnrollmentDate(null);

//       message.success("Student created successfully");
//       navigate("/students");
//     } catch (error) {
//       console.error("Error creating student:", error);
//       message.error("Failed to create student");
//     }
//   };
//   const validatePhoneNumber = (rule, value) => {
//     return new Promise((resolve, reject) => {
//       if (value && value.length !== 10) {
//         reject("Phone number must be 10 digits");
//       } else {
//         resolve();
//       }
//     });
//   };

//   const validateDiscount = (rule, value) => {
//     if (value < 0 || value > 100) {
//       return Promise.reject("Discount must be between 0 and 100");
//     } else {
//       return Promise.resolve();
//     }
//   };

//   return (
//     <div
//       style={{
//         background: "white",
//         padding: "20px",
//         borderRadius: "8px",
//         boxShadow: "#ffffff 0px 0px 6px",
//       }}
//     >
//       <h2
//         style={{
//           marginBottom: "20px",
//           fontSize: "24px",
//           fontWeight: "bold",
//           color: "#333",
//         }}
//       >
//         Create New Student
//       </h2>
//       <Form form={form} onFinish={onFinish} layout="vertical">
//         <Row gutter={[16, 16]}>
//           <Col xs={24} sm={12} lg={8}>
//             <Form.Item
//               label="Name"
//               name="name"
//               rules={[
//                 { required: true, message: "Please input student name!" },
//               ]}
//             >
//               <Input />
//             </Form.Item>
//           </Col>
//           <Col xs={24} sm={12} lg={8}>
//             <Form.Item
//               label="Phone"
//               name="phone"
//               rules={[
//                 { required: true, message: "Please input the student's PhoneNumber!" },
//                 { validator: validatePhoneNumber },
//               ]}
//             >
//               <Input />
//             </Form.Item>
//           </Col>
//           <Col xs={24} sm={12} lg={8}>
//             <Form.Item label="Discount" name="discount" initialValue={0}
//                rules={[
//                 { required: true, message: "Please input the student's discount!" },
//                 { validator: validateDiscount },
//               ]}
//             >
//               <Input type="number" />
//             </Form.Item>
//           </Col>
//         </Row>
//         <Form.Item label="Enrolled Courses"
   
//         >
//           <Select
//             mode="multiple"
//             value={selectedCourses}
//             onChange={(value) => setSelectedCourses(value)}
//             style={{ width: "100%" }}
//             placeholder="Select courses"
//           >
//             {courses.map((course) => (
//               <Option key={course._id} value={course._id}>
//                 {course.title}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>
//         {selectedCourses.length > 0 && (
//           <Form.Item label="Enrollment Date">
//             <DatePicker
//               value={enrollmentDate}
//               onChange={(date) => setEnrollmentDate(date)}
//               format="YYYY-MM-DD"
//               style={{ width: "100%" }}
//             />
//           </Form.Item>
//         )}
//         <Form.Item>
//           <Button
//             type="primary"
//             htmlType="submit"
//             style={{ width: "100%", borderRadius: "4px" }}
//           >
//             Create Student
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default CreateStudentForm;
import React, { useState, useEffect } from "react";
import { fetchCourses } from "../../utils/coursesOperation";
import { createStudent } from "../../utils/studentOperations";
import { message, Form, Input, Button, Row, Col, DatePicker, Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CreateStudentForm = () => {
  const [form] = Form.useForm();
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [enrollmentDate, setEnrollmentDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses()
      .then((courses) => {
        setCourses(courses);
      })
      .catch((error) => {
        message.error("Failed to fetch courses");
      });
  }, []);

  const onFinish = async (values) => {
    try {
      if (selectedCourses.length === 0) {
        message.error("Please select at least one course for enrollment.");
        return;
      }

      if (!enrollmentDate) {
        message.error("Please select enrollment date.");
        return;
      }

      const enrolledCoursesData = selectedCourses.map(courseId => ({
        title: courses.find(course => course._id === courseId).title,
        enrollmentDate: enrollmentDate.format('YYYY-MM-DD'),
      }));

      const studentData = {
        name: values.name,
        phone: values.phone,
        discount: values.discount,
        enrolledCourses: enrolledCoursesData,
      };

      await createStudent(studentData);

      form.resetFields();
      setSelectedCourses([]);
      setEnrollmentDate(null);

      message.success("Student created successfully");
      navigate("/students");
    } catch (error) {
      console.error("Error creating student:", error);
      message.error("Failed to create student");
    }
  };

  const validatePhoneNumber = (rule, value) => {
    return new Promise((resolve, reject) => {
      if (value && value.length !== 10) {
        reject("Phone number must be 10 digits");
      } else {
        resolve();
      }
    });
  };

  const validateDiscount = (rule, value) => {
    if (value < 0 || value > 100) {
      return Promise.reject("Discount must be between 0 and 100");
    } else {
      return Promise.resolve();
    }
  };

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "#ffffff 0px 0px 6px",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Create New Student
      </h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input student name!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: "Please input the student's PhoneNumber!" },
                { validator: validatePhoneNumber },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="Discount" name="discount" initialValue={0}
               rules={[
                { required: true, message: "Please input the student's discount!" },
                { validator: validateDiscount },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Enrolled Courses"
          name="enrolledCourses"
          rules={[
            { required: true, message: "Please select at least one course for enrollment." },
          ]}
        >
          <Select
            mode="multiple"
            value={selectedCourses}
            onChange={(value) => setSelectedCourses(value)}
            style={{ width: "100%" }}
            placeholder="Select courses"
          >
            {courses.map((course) => (
              <Option key={course._id} value={course._id}>
                {course.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Enrollment Date" shouldUpdate={(prevValues, currentValues) => prevValues.enrolledCourses !== currentValues.enrolledCourses}>
          {({getFieldValue}) => {
            const selectedCourses = getFieldValue('enrolledCourses');
            return (
              <DatePicker
                disabled={!selectedCourses || selectedCourses.length === 0}
                value={enrollmentDate}
                onChange={(date) => setEnrollmentDate(date)}
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
              />
            );
          }}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", borderRadius: "4px" }}
          >
            Create Student
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateStudentForm;
