// AdminHome Component
import React, { useEffect, useState } from 'react';
import {Card, Row, Col, message, Spin, Button, Typography} from 'antd';
import { totalsByManager } from '../../utils/adminOperations'; // Adjust the path according to your project structure
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
const { Title, Text } = Typography;

const AdminHome = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null);
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
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await totalsByManager();
                setManagers(response.managers);
            } catch (error) {
                message.error(error.error);
                setError(error.error);
            } finally {
                setLoading(false); // Set loading to false once the data is fetched
            }
        };

        fetchData();
    }, []);

    const handleCardClick = (managerId) => {
        navigate(`/manager/${managerId}`); // Adjust the path according to your project structure
    };

    const handleDetailsClick = (event, managerId) => {
        event.stopPropagation(); // Prevent the card click event from firing when clicking "More Details"
        navigate(`/manager/${managerId}`); // Navigate to the details page
    };

    if (error ==='Invalid token, please log in again'){
        return(
            <>
                <Title level={3}>No available data</Title>
                <Button onClick={handleLogout}>
                    Login again
                </Button>

            </>

        )
    }
    else{
        <Title level={3}>No available data </Title>
    }

    // Handle no data state
    if (!managers || Object.keys(managers).length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Title level={3}>No available data</Title>
            </div>
        );
    }
    
    return (
        <div style={{ padding: '20px' }}>
            <h2>Centers List</h2>
            {loading ? ( // Conditionally render loading indicator or content
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[16, 16]}>
                    {managers.map(manager => (
                        <Col
                            key={manager._id}
                            xs={24} // Span 24 columns on extra small screens
                            sm={12} // Span 12 columns on small screens and above
                        >
                            <Card
                                title={
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span>{manager.username}</span>
                                        <span
                                            style={{
                                                cursor: 'pointer',
                                                color: '#1e847e',
                                                textDecoration: 'underline',
                                                fontSize: '14px', // Adjust the font size as needed
                                            }}
                                            onClick={(event) => handleDetailsClick(event, manager._id)}
                                        >
                      More Details
                    </span>
                                    </div>
                                }
                                hoverable
                                style={{
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleCardClick(manager._id)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                    <p>Total Students: {manager.totalStudents}</p>
                                    <p>Total Enrollments: {manager.totalEnrollments}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                    <p>Total Teachers: {manager.totalTeachers}</p>
                                    <p>Total Courses: {manager.totalCourses}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                    <p>Contact Email: {manager.email}</p>
                                    <p>Phone Number: {manager.phoneNumber}</p>
                                </div>

                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};
export default AdminHome;
