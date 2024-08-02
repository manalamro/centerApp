import React, { useEffect, useState } from "react";
import { Table, Button, message, Spin, Typography, Row, Col } from "antd";
import { courseService } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./teachers.css";

const { Title } = Typography;

const TeachersComponent = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleApiError = (error) => {
    setError(error.message);
    message.error(error.message);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      message.error("An error occurred during logout.");
    }
  };
console.log("error",error);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Show loading spinner while fetching data
        const teachersData = await courseService.getTeachersDetailedInfoAndCalculateSalary();

        if (!teachersData || teachersData.length === 0) {
          message.info("There are no available teachers.");
          setTeachers([]);
        } 
          setTeachers(teachersData);
        
      } catch (error) {
        handleApiError(error); // Display any errors
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Teacher Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
      align: "center",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Total Salary",
      dataIndex: "totalSalary",
      key: "totalSalary",
      align: "center",
    },
    {
      title: "Percent of Profit",
      dataIndex: "percentOfProfit",
      key: "percentOfProfit",
      align: "center",
    },
    {
      title: "Courses",
      dataIndex: "courses",
      key: "courses",
      align: "center",
      render: (courses) => (
          <Table
              dataSource={courses}
              columns={[
                {
                  title: "Course Title",
                  dataIndex: "courseName",
                  key: "courseName",
                  render: (text) => <strong>{text}</strong>,
                },
                {
                  title: "Salary",
                  dataIndex: "salary",
                  key: "salary",
                  render: (text) => <strong>{text}</strong>,
                },
              ]}
              pagination={false}
              rowKey={(record) => record.courseName}
              size="small"
          />
      ),
    },
  ];

  const rowClassName = () => "highlighted-row";

  const tableStyle = {
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    overflowX: "auto",
  };

  const trStyle = {
    borderBottom: "1px solid #f0f0f0",
  };

  return (
      <div style={{ padding: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ marginBottom: 24 }}>
              Teachers Detailed Information and Salary
            </Title>
          </Col>
          <Col>
            {error === "Token expired or invalid. Please log in again." ?
                <Button
                    onClick={handleLogout}
                >
                  Login Again
                </Button>
            :null
            }
          </Col>
        </Row>
        <style>
          {`
          .highlighted-row td {
            background-color: #f5f5f5; 
          }
        `}
        </style>
        {loading ? (
            <Spin tip="Loading teachers..." />
        ) : teachers && teachers.length > 0 ? (
            <Table
                dataSource={teachers}
                columns={columns}
                pagination={false}
                rowKey={(record) => record.name}
                style={tableStyle}
                rowClassName={rowClassName}
                components={{
                  body: {
                    row: (props) => <tr style={trStyle} {...props} />,
                  },
                }}
            />
        ) : (
            <p>There are no teachers available.</p>
        )}
      </div>
  );
};

export default TeachersComponent;
