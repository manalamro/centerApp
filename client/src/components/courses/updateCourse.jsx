import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Select, Row, Col } from 'antd';
import moment from 'moment';

const { Option } = Select;

const UpdateCourseForm = ({ initialData, onSubmit, onCancel, teachers, updateTeacher }) => {
  const [form] = Form.useForm();
  const [courseData, setCourseData] = useState(initialData);

  const daysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Ensure that operationalCosts is initialized as an array
  useEffect(() => {
    if (!Array.isArray(courseData.operationalCosts)) {
      setCourseData(prevData => ({
        ...prevData,
        operationalCosts: [],
      }));
    }
  }, [courseData.operationalCosts]);

  const handleInputChange = (name, value) => {
    const [fieldName, subFieldName] = name.split(".");

    if (subFieldName) {
      setCourseData((prevData) => ({
        ...prevData,
        [fieldName]: {
          ...prevData[fieldName],
          [subFieldName]: value,
        },
      }));
    } else {
      setCourseData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleDayChange = (value) => {
    setCourseData((prevData) => ({
      ...prevData,
      schedule: {
        ...prevData.schedule,
        days: value,
      },
    }));
  };

  const handleTeacherChange = (index, field, value) => {
    setCourseData(prevData => {
      const updatedCourse = {
        ...prevData,
        teachers: prevData.teachers.map((teacher, i) => {
          if (i === index) {
            return {
              ...teacher,
              [field]: value
            };
          }
          return teacher;
        })
      };

      const updatedTeacher = updatedCourse.teachers[index];
      if (updatedTeacher.teacherId) {
        updateTeacher(updatedTeacher.teacherId, { [field]: value });
      }

      return updatedCourse;
    });
  };

  const handleOperationalCostsChange = (index, field, value) => {
    setCourseData((prevData) => {
      const updatedOperationalCosts = [...prevData.operationalCosts];
      updatedOperationalCosts[index][field] = value;
      return {
        ...prevData,
        operationalCosts: updatedOperationalCosts,
      };
    });
  };

  const handleAddOperationalCost = () => {
    setCourseData((prevData) => ({
      ...prevData,
      operationalCosts: [...prevData.operationalCosts, { title: "", price: "" }]
    }));
  };

  const handleSubmit = () => {
    form.validateFields().then(() => {
      onSubmit(courseData);
    }).catch(errorInfo => {
      console.log('Validation Failed:', errorInfo);
    });
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

  const validatePercentOfProfit = (rule, value) => {
    if (value < 0 || value > 100) {
      return Promise.reject("Percentage must be between 0 and 100");
    } else {
      return Promise.resolve();
    }
  };

  useEffect(() => {
    form.setFieldsValue(courseData); // Set form values when courseData changes
  }, [courseData, form]);

  return (
      <Modal
          visible={true}
          onCancel={onCancel}
          footer={[
            <Button key="submit" type="primary" onClick={handleSubmit}>
              Update
            </Button>,
          ]}
      >
        <h2>Edit Course</h2>
        <Form layout="vertical" form={form} onFinish={handleSubmit} initialValues={courseData}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: 'Please enter the title' }]}
              >
                <Input
                    onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  label="Cost"
                  name="cost"
                  rules={[{ required: true, message: 'Please enter the cost' }]}
              >
                <Input
                    onChange={(e) => handleInputChange("cost", e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Operational Costs">
            {courseData.operationalCosts.map((cost, index) => (
                <div key={index}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                          label="Title"
                          name={["operationalCosts", index, "title"]}
                          rules={[{ required: true, message: 'Please enter the title' }]}
                      >
                        <Input
                            onChange={(e) => handleOperationalCostsChange(index, 'title', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                          label="Price"
                          name={["operationalCosts", index, "price"]}
                          rules={[{ required: true, message: 'Please enter the price' }]}
                      >
                        <Input
                            onChange={(e) => handleOperationalCostsChange(index, 'price', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
            ))}
            <Button type="dashed" onClick={handleAddOperationalCost} style={{ width: '100%' }}>+ Add Operational Cost</Button>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                  label="Schedule Recurrence"
                  name={["schedule", "recurrence"]}
                  rules={[{ required: true, message: 'Please enter the recurrence' }]}
              >
                <Input
                    onChange={(e) => handleInputChange("schedule.recurrence", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  label="Schedule Time"
                  name={["schedule", "time"]}
                  rules={[{ required: true, message: 'Please enter the time' }]}
              >
                  <Input
                      style={{ width: 'calc(100% - 70px)' }}
                      onChange={(e) => handleInputChange("schedule.time", e.target.value)}
                  />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
              label="Schedule Days"
              name={["schedule", "days"]}
              rules={[{ required: true, message: 'Please select the schedule days' }]}
          >
            <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
                onChange={handleDayChange}
            >
              {daysList.map(day => (
                  <Option key={day} value={day}>{day}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Teachers">
            {courseData.teachers.map((teacher, index) => (
                <div key={index}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                          label="Teacher Name"
                          name={["teachers", index, "name"]}
                          rules={[{ required: true, message: 'Please enter the teacher name' }]}
                      >
                        <Input
                            onChange={(e) => handleTeacherChange(index, 'name', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                          label="Teacher Phone"
                          name={["teachers", index, "phone"]}
                          rules={[{ required: true, message: 'Please enter the teacher phone number' },{ validator: validatePhoneNumber }]}
                      >
                        <Input
                            onChange={(e) => handleTeacherChange(index, 'phone', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                          label="Teacher % of Profit"
                          name={["teachers", index, "percentOfProfit"]}
                          rules={[{ required: true, message: 'Please enter the teacher percent Of Profit' },{ validator: validatePercentOfProfit }]}
                      >
                        <Input
                            type="number"
                            onChange={(e) => handleTeacherChange(index, 'percentOfProfit', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
            ))}
          </Form.Item>
        </Form>
      </Modal>
  );
};

export default UpdateCourseForm;

