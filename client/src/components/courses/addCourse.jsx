import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Button, Select, TimePicker } from "antd";
import { courseService } from "../../service/api";
import {message} from "antd";
const { Item } = Form;
const { Option } = Select;

const AddCourseForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [isNewTeacher, setIsNewTeacher] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [operationalCosts, setOperationalCosts] = useState([]);

  
  const fetchData = async () => {
    try {
      const teachersData =await courseService.getTeachersDetailedInfoAndCalculateSalary();
     console.log("teachersData"+JSON.stringify(teachersData));
      const formattedTeachers = teachersData.map((teacher) => ({
        teacherId: teacher.teacherId,
        name: teacher.name,
        phone: teacher.phone,
        percentOfProfit: teacher.percentOfProfit,
      }));
      console.log("Formatted teachers:", formattedTeachers); // Log formatted teachers
      setTeachers(formattedTeachers);
      setLoading(false);
    } catch (error) {
      setError("Error fetching data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  const validatePercentOfProfit = (rule, value) => {
    if (value < 0 || value > 100) {
      return Promise.reject("Percentage must be between 0 and 100");
    } else {
      return Promise.resolve();
    }
  };

  // Handler for submitting the form
  const handleSubmit = async (values) => {
    let formData = {
      title: values.title,
      teachers: [],
      cost: values.cost,
      schedule: {
        recurrence: values.schedule.recurrence,
        days: values.schedule.days,
        time: values.schedule.time.format("HH:mm A"), // Format time to "HH:mm AM/PM"
      },
      operationalCosts: operationalCosts, // Include operational costs in the form data
    };

    if (isNewTeacher) {
      formData.teachers.push({
        name: values.teacherName,
        phone: values.teacherPhone,
        percentOfProfit: parseInt(values.percentOfProfit), // Convert to array
      });
    } else if (selectedTeacher) {
      formData.teachers.push({
        _id: selectedTeacher.teacherId, // Include the teacher ID
        name: selectedTeacher.name,
        phone: selectedTeacher.phone,
        percentOfProfit: selectedTeacher.percentOfProfit,
      });
    }

    const result = await courseService.addCourse(formData);

    if (result.error) {
      // Handle error, possibly redirect to login
      message.error(result.error);
      // Optionally handle redirection or display an error message
    } else {
      // Handle successful course addition
      message.success('Course added successfully:');

      // Reset form values
      form.resetFields(); // If you're using Ant Design Form
      setOperationalCosts([]); // Reset operational costs state
      setIsNewTeacher(true); // Reset new teacher flag if needed
      setSelectedTeacher(null); // Reset selected teacher if needed
    }
  };

  const handleTeacherSelect = (value) => {
    console.log("Selected value:", value); // Check the selected value
    console.log("Teachers:", teachers); // Log the teachers array
    if (value === "new") {
      setIsNewTeacher(true);
      setSelectedTeacher(null); // Clear selectedTeacher
    } else {
      const selected = teachers.find((teacher) => teacher.teacherId === value);
      console.log("Selected teacher:", selected); // Check the selected teacher
      setSelectedTeacher(selected);
      setIsNewTeacher(false);
    }
  };
   


  const daysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleAddOperationalCost = () => {
    setOperationalCosts([...operationalCosts, { title: "", price: "" }]);
  };

  const handleOperationalCostChange = (index, field, value) => {
    const updatedOperationalCosts = [...operationalCosts];
    updatedOperationalCosts[index][field] = value;
    setOperationalCosts(updatedOperationalCosts);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input placeholder="example: Math" />
          </Item>
        </Col>
        <Col xs={24} sm={12}>
          <Item
            label="Cost"
            name="cost"
            rules={[{ required: true, message: "Please input the cost!" }]}
          >
            <Input placeholder="example: 200" />
          </Item>
        </Col>
        <Col xs={24} sm={12}>
          <Item
            label="Schedule Recurrence"
            name={["schedule", "recurrence"]}
            rules={[
              {
                required: true,
                message: "Please enter course schedule recurrence!",
              },
            ]}
          >
            <Input placeholder="example: daily or weekly" />
          </Item>
        </Col>
        <Col xs={24} sm={12}>
          <Item
            label="Schedule Time"
            name={["schedule", "time"]}
            rules={[
              { required: true, message: "Please enter course schedule time!" },
            ]}
          >
            <TimePicker format="HH:mm A" placeholder="Select time" />
          </Item>
        </Col>
        <Col xs={24}>
          <Item
            label="Schedule Days"
            name={["schedule", "days"]}
            rules={[
              {
                required: true,
                message: "Please select your course schedule days!",
              },
            ]}
          >
            <Select mode="multiple" placeholder="Please select">
              {daysList.map((day) => (
                <Option key={day} value={day}>
                  {day}
                </Option>
              ))}
            </Select>
          </Item>
        </Col>

        <Col xs={24}>
          <Item
            label="Teacher"
            name="teacher"
            rules={[
              {
                required: true,
                message: "Please select teacher",
              },
            ]}
          >
<Select
  onChange={handleTeacherSelect}
  placeholder="Select teacher or add new"
  value={
    isNewTeacher
      ? "new"
      : selectedTeacher
      ? selectedTeacher.teacherId
      : undefined
  }
>
  <Option value="new">Add New Teacher</Option>
  {teachers.map((teacher) => (
    <Option key={teacher.teacherId} value={teacher.teacherId}>
      {teacher.name}
    </Option>
  ))}
</Select>


          </Item>
        </Col>

        {isNewTeacher && (
          <>
            <Col xs={24}>
              <Item
                label="Teacher Name"
                name="teacherName"
                rules={[
                  {
                    required: true,
                    message: "Please enter your course teacher name!",
                  },
                ]}
              >
                <Input placeholder="example: Ali" />
              </Item>
            </Col>
            <Col xs={24} sm={12}>
              <Item
                label="Teacher Phone"
                name="teacherPhone"
                rules={[
                  {
                    required: true,
                    message: "Please enter your course teacher phone!",
                  },
                  { validator: validatePhoneNumber },
                ]}
              >
                <Input placeholder="example: 0000000000" />
              </Item>
            </Col>
            <Col xs={24} sm={12}>
              <Item
                label="Teacher % of Profit"
                name="percentOfProfit"
                rules={[
                  {
                    required: true,
                    message: "Please enter your teacher percent of profit!",
                  },
                  { validator: validatePercentOfProfit },
                ]}
              >
                <Input placeholder="example: 3 or 50" type="number" />
              </Item>
            </Col>
          </>
        )}
        {operationalCosts.map((cost, index) => (
          <React.Fragment key={index}>
            <Col xs={24} sm={12}>
              <Item
                label={`Operational Cost Title ${index + 1}`}
                name={`operationalCosts[${index}].title`}
                rules={[
                  {
                    required: true,
                    message: "Please enter your center Operational Cost Title",
                  },
                ]}
              >
                <Input
                  value={cost.title}
                  onChange={(e) =>
                    handleOperationalCostChange(index, "title", e.target.value)
                  }
                  placeholder="Enter title"
                />
              </Item>
            </Col>
            <Col xs={24} sm={12}>
              <Item
                label={`Operational Cost Price ${index + 1}`}
                name={`operationalCosts[${index}].price`}
                rules={[
                  {
                    required: true,
                    message: "Please enter your center Operational Cost price",
                  },
                ]}
              >
                <Input
                  value={cost.price}
                  onChange={(e) =>
                    handleOperationalCostChange(index, "price", e.target.value)
                  }
                  placeholder="Enter price"
                />
              </Item>
            </Col>
          </React.Fragment>
        ))}
        <Col xs={24}>
          <Button type="dashed" onClick={handleAddOperationalCost} block>
            Add Operational Cost
          </Button>
        </Col>
        <Col xs={24}>
          <Item>
            <br />
            <Button type="primary" htmlType="submit">
              Add Course
            </Button>
          </Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AddCourseForm;
