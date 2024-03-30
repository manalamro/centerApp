
import React, { useEffect, useState } from "react";
import { courseService } from "../../service/api";
import { Spin, Typography, Row, Col, Tag, Divider, Table } from 'antd';
import './teachers.css'

const { Title, Text } = Typography;

const TeachersComponent = () => {  
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersData = await courseService.getTeachersDetailedInfoAndCalculateSalary();
        setTeachers(teachersData);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const columns = [
    {
      title: 'Teacher Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
      align: 'center', // Align text center vertically
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center', // Align text center vertically
    },
    {
      title: 'Total Salary',
      dataIndex: 'totalSalary',
      key: 'totalSalary',
      align: 'center', // Align text center vertically
    },
    {
      title: 'Percent of Profit',
      dataIndex: 'percentOfProfit',
      key: 'percentOfProfit',
      align: 'center', // Align text center vertically
    },
    {
      title: 'Courses',
      dataIndex: 'courses',
      key: 'courses',
      align: 'center', // Align text center vertically
      render: (courses) => (
        <Table
          dataSource={courses}
          columns={[
            {
              title: 'Course Title',
              dataIndex: 'courseName',
              key: 'courseName',
              render: (text) => <strong>{text}</strong>,
            },
            {
              title: 'Salary',
              dataIndex: 'salary',
              key: 'salary',
              render: (text) => <strong>{text}</strong>,
            }
          ]}
          pagination={false}
          rowKey={(record) => record.courseName}
          size="small"
        />
      ),
    },
  ];

  const rowClassName = () => 'highlighted-row';

  const tableStyle = {
    borderCollapse: 'separate',
    borderSpacing: '0 10px', // Adjust vertical line height
   overflowX: "auto" 
  };

  const trStyle = {
    borderBottom: '1px solid #f0f0f0', // Thinner bottom border
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        Teachers Detailed Information and Salary
      </Title>
      <style>
        {`
          .highlighted-row td {
            background-color: #f5f5f5; /* Change this color to match the hover action color */
          }
        `}
      </style>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={teachers}
          columns={columns}
          pagination={false}
          rowKey={(record) => record.name}
          style={tableStyle} // Apply custom table style
          rowClassName={rowClassName}
          components={{
            body: {
              row: (props) => <tr style={trStyle} {...props} />
            }
          }}
        />
      )}
    </div>
  );
};

export default TeachersComponent;
