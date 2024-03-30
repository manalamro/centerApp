
import React, { useState } from "react";
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
  if (!Array.isArray(courseData.operationalCosts)) {
    courseData.operationalCosts = [];
  }

  const handleInputChange = (name, value) => {
    const [fieldName, subFieldName] = name.split("."); // Splitting the name to access nested properties

    if (subFieldName) {
      // If the field is nested under schedule
      setCourseData((prevData) => ({
        ...prevData,
        [fieldName]: {
          ...prevData[fieldName], // Keep other fields in the schedule object unchanged
          [subFieldName]: value, // Update the specified nested field
        },
      }));
    } else {
      // If the field is not nested under schedule
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
      
      // Check if the teacher being updated is an existing teacher (not a new one)
      const updatedTeacher = updatedCourse.teachers[index];
      if (updatedTeacher.teacherId) {
        // Call the updateTeacher function to update the teacher's information in the database
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
    onSubmit(courseData);
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
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={16}>
      <Col span={12}>

        <Form.Item label="Title">
          <Input
            value={courseData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
        </Form.Item>
        </Col>
        <Col span={12}>
        <Form.Item label="Cost">
          <Input
            value={courseData.cost}
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
                  <Form.Item label="Title">
                    <Input
                      value={cost.title}
                      onChange={(e) => handleOperationalCostsChange(index, 'title', e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Price">
                    <Input
                      value={cost.price}
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
        <Form.Item label="Schedule Recurrence">
          <Input
            value={courseData.schedule.recurrence}
            onChange={(e) => handleInputChange("schedule.recurrence", e.target.value)}
          />
        </Form.Item>
        
         </Col>
         <Col span={12}>
        <Form.Item label="Schedule Time">
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 70px)' }}
              value={courseData.schedule.time}
              onChange={(e) => handleInputChange("schedule.time", e.target.value)}
              placeholder="HH:mm"
            />
            <Select
              value={courseData.schedule.time ? moment(courseData.schedule.time, 'HH:mm').format('a') : 'AM'}
              onChange={(value) => {
                const selectedTime = moment(courseData.schedule.time, 'HH:mm');
                if (selectedTime.isValid()) {
                  selectedTime.set('hour', value === 'PM' ? selectedTime.get('hour') + 12 : selectedTime.get('hour'));
                  handleInputChange("schedule.time", selectedTime.format('HH:mm'));
                }
              }}
            >
              <Option value="AM">AM</Option>
              <Option value="PM">PM</Option>
            </Select>
          </Input.Group>
        </Form.Item>
        </Col>
        </Row>
        <Form.Item label="Schedule Days">
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            value={courseData.schedule.days}
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
                  <Form.Item label="Teacher Name">
                    <Input
                      value={teacher.name}
                      onChange={(e) => handleTeacherChange(index, 'name', e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Teacher Phone"
                           rules={[
                            {
                              required: true,
                              message: "Please enter your course teacher phone!",
                            },
                            { validator: validatePhoneNumber },
                          ]}
                  
                  >
                    <Input
                      value={teacher.phone}
                      onChange={(e) => handleTeacherChange(index, 'phone', e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Teacher % of Profit" rules={[{ type: 'number', min: 0, max: 100, message: 'Percentage must be between 0 and 100' 

                }]}>
                    <Input
                      type="number"
                      value={teacher.percentOfProfit}
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
