import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminService } from '../../service/api';
import { Card, Table, Spin, Empty, Button, Typography, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const ManagerDetails = () => {

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
    const { managerId } = useParams(); // Get managerId from URL params
    const [managerData, setManagerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await adminService.getManagerDetails(managerId);
                setManagerData(data);
            } catch (error) {
                setError(error.error);
                message.error(error.error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [managerId]);
    if (loading) return <Spin indicator={antIcon} />;
    if (error ==='Invalid token, please log in again'){
        return(
            <>
                <Title level={3}>No available data for this manager</Title>
                <Button onClick={handleLogout}>
                    Login again
                </Button>
                
            </>
           
        ) 
    } 
    const columns = [
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        },
    ];

    const mapToTableData = (data) => {
        return Object.entries(data).map(([key, value]) => ({
            key,
            month: key,
            value,
        }));
    };
    // Handle no data state
    if (!managerData || Object.keys(managerData).length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Title level={3}>No available data for this manager</Title>
            </div>
        );
    }
    
    const renderEnrollmentsTable = () => {
        const data = Object.entries(managerData.enrollmentsByMonth).map(([month, courses]) => ({
            month,
            courses: Object.entries(courses).map(([course, enrollments]) => ({
                course,
                enrollments
            }))
        }));

        const columns = [
            {
                title: 'Month',
                dataIndex: 'month',
                key: 'month',
            },
            {
                title: 'Courses',
                dataIndex: 'courses',
                key: 'courses',
                render: (courses) => (
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                        <Table
                            dataSource={courses}
                            columns={[
                                { title: 'Course', dataIndex: 'course', key: 'course' },
                                { title: 'Enrollments', dataIndex: 'enrollments', key: 'enrollments' }
                            ]}
                            pagination={false}
                            size="small" // Matches table font size
                        />
                    </div>
                )
            },
        ];

        return <Table dataSource={data} columns={columns} pagination={false} size="small" />;
    };

    const CourseColumns = [
        {
            title: 'Course Title',
            dataIndex: 'courseTitle',
            key: 'courseTitle',
        },
        {
            title: 'Teacher Profit',
            dataIndex: 'teacherProfit',
            key: 'teacherProfit',
            render: (text) => parseFloat(text).toFixed(1),
        },
        {
            title: 'Center Profit',
            dataIndex: 'centerProfit',
            key: 'centerProfit',
            render: (text) => parseFloat(text).toFixed(1),
        },
        {
            title: 'Operational Costs',
            dataIndex: 'operationalCosts',
            key: 'operationalCosts',
            render: (text) => parseFloat(text).toFixed(1),
        },
        {
            title: 'Net Profit',
            dataIndex: 'netProfit',
            key: 'netProfit',
            render: (text) => parseFloat(text).toFixed(1),
        },
        {
            title: 'Loss',
            dataIndex: 'loss',
            key: 'loss',
            render: (text) => (text < 0 ? 0 : parseFloat(text).toFixed(1)),
        },
        {
            title: 'Is it Profitable',
            dataIndex: 'isProfit',
            key: 'isProfit',
            render: (text) => (text ? 'Yes' : 'No'),
        },
    ];

    const renderRevenueTable = () => {
        const data = managerData.revenueByMonth.map(entry => ({
            month: entry.month,
            netProfit: parseFloat(entry.initialNetProfit).toFixed(1),
            totalCenterOperationCosts: parseFloat(entry.centerOperationsCosts).toFixed(1),
            theFinalRevenue: entry.finalNetProfit < 0 ? 0 : parseFloat(entry.finalNetProfit).toFixed(1),
        }));

        const columns = [
            {
                title: 'Month',
                dataIndex: 'month',
                key: 'month',
            },
            {
                title: 'Net Profit',
                dataIndex: 'netProfit',
                key: 'netProfit',
            },
            {
                title: 'Total Center Operation Costs',
                dataIndex: 'totalCenterOperationCosts',
                key: 'totalCenterOperationCosts',
            },
            {
                title: 'The Final Revenue',
                dataIndex: 'theFinalRevenue',
                key: 'theFinalRevenue',
            },
        ];

        return <Table dataSource={data} columns={columns} pagination={false} size="small" />;
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Manager Details for {managerData.manager.username}</Title>
            <Card bordered={false} style={{ marginBottom: '20px' }}>
                <Title level={3}>Most Famous Courses</Title>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {managerData.mostFamousCourses.length > 0 ? (
                        managerData.mostFamousCourses.map((course, index) => (
                            <Card
                                key={index}
                                title={`Course ${index + 1}`}
                                style={{ margin: '10px', textAlign: 'center' }}
                            >
                                <Text style={{ fontSize: '14px' }}>{course}</Text> {/* Match font size */}
                            </Card>
                        ))
                    ) : (
                        <Empty description="No famous courses available" />
                    )}
                </div>
            </Card>
            <Card bordered={false} style={{ marginBottom: '20px' }}>
                <Title level={3}>Enrollments By Month</Title>
                {renderEnrollmentsTable()}
            </Card>
            <Card bordered={false} style={{ marginBottom: '20px' }}>
                <Title level={3}>Profits By Course</Title>
                <Table
                    dataSource={managerData.profitsByCourse}
                    columns={CourseColumns}
                    pagination={false}
                    size="small"
                    style={{ overflowX: 'auto' }}
                />
            </Card>
            <Card bordered={false} style={{ marginBottom: '20px' }}>
                <Title level={3}>Revenue By Month</Title>
                {renderRevenueTable()}
            </Card>
        </div>
    );
};

export default ManagerDetails;
