import React, { useState, useEffect } from "react";
import { message, Form, Input, Button, List, DatePicker, Select, Row, Col } from "antd";
import { fetchCourses } from "../../utils/coursesOperation";
import {
  createEnrollment,
  deleteEnrollment,
} from "../../utils/enrollmnetUtils";

const UpdateStudentForm = ({ studentData, onSubmit, onCancel, token }) => {
  const [form] = Form.useForm();
  const [managerCourses, setManagerCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    form.setFieldsValue(studentData);
    setEnrollments(studentData.enrollments || []);
  }, [studentData, form]);

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const coursesData = await fetchCourses();
        setManagerCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
        message.error(error.message);
      }
    };

    fetchCoursesData();
  }, []);

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

  const handleAddEnrollment = async () => {
    // Check if the course is already enrolled
    const isAlreadyEnrolled = enrollments.some(
        (enrollment) => enrollment.courseTitle === selectedCourse
    );

    if (isAlreadyEnrolled) {
      message.warning("Course is already enrolled.");
      return; // Prevent adding the same course again
    }

    try {
      await createEnrollment(
          {
            studentName: form.getFieldValue("name"),
            courseTitle: selectedCourse,
            enrollmentDate: enrollmentDate.format("YYYY-MM-DD"), // Format the date
          },
          token
      );
      message.success("Enrollment created successfully");
      setEnrollments([...enrollments, { courseTitle: selectedCourse }]);
      setSelectedCourse(""); // Reset selectedCourse after adding enrollment
    } catch (error) {
      console.error("Error creating enrollment:", error);
    }
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    try {
      await deleteEnrollment(enrollmentId, token);
      message.success("Enrollment deleted successfully");
      setEnrollments(
          enrollments.filter((enrollment) => enrollment._id !== enrollmentId)
      );
    } catch (error) {
      message.error("Failed to delete enrollment");
      console.error("Error deleting enrollment:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formDataWithId = { ...values, _id: studentData._id };
      await onSubmit(formDataWithId);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const placeholderText = "Select a course";

  return (
      <div>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input student name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: "Please input the student's PhoneNumber!" },
                { validator: validatePhoneNumber },
              ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
              label="Discount"
              name="discount"
              rules={[
                { required: true, message: "Please input the student's discount!" },
                { validator: validateDiscount },
              ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Enrolled Courses">
            <Row gutter={[16, 16]}>
              {enrollments.map((enrollment) => (
                  <Col key={enrollment._id} span={8}>
                    <List.Item>
                      {enrollment.courseTitle}
                      <Button
                          type="link"
                          danger
                          onClick={() => handleDeleteEnrollment(enrollment._id)}
                      >
                        Delete
                      </Button>
                    </List.Item>
                  </Col>
              ))}
            </Row>
          </Form.Item>
          <Form.Item label="Select Courses">
            <Select
                placeholder={placeholderText}
                onChange={setSelectedCourse}
                value={selectedCourse}
            >
              {managerCourses
                  .filter(
                      (course) =>
                          !enrollments.some(
                              (enrollment) => enrollment.courseTitle === course.title
                          )
                  )
                  .map((course) => (
                      <Select.Option key={course._id} value={course.title}>
                        {course.title}
                      </Select.Option>
                  ))}
            </Select>
          </Form.Item>
          {managerCourses.length !== enrollments.length && (
              <>
                <Form.Item label="Enrollment Date">
                  <DatePicker
                      value={enrollmentDate}
                      onChange={setEnrollmentDate}
                      format="YYYY-MM-DD"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                      type="primary"
                      onClick={handleAddEnrollment}
                      disabled={!selectedCourse || !enrollmentDate}
                  >
                    Add Enrollment
                  </Button>
                </Form.Item>
              </>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
            <Button type="default" onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
  );
};

export default UpdateStudentForm;
