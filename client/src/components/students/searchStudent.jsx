import React, { useState } from 'react';
import { searchStudents } from '../../utils/studentOperations';
import { Input, Button, Modal, message, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const StudentSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = async () => {
    try {
      if (searchTerm.trim() !== '') {
        const students = await searchStudents(searchTerm);
        if (students.length > 0) {
          setSelectedStudent(students[0]);
          setModalVisible(true);
        } else {
          message.error('Student not found in our system.');
          setSearchTerm('');
        }
      } else {
        message.error('Please enter a student name before searching.');
        setSearchTerm('');
      }
    } catch (error) {
      message.error(error);
      setSearchTerm('');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedStudent(null);
    setSearchTerm('');
  };

  return (
    <Card title="Are you looking for a student?">
      <Input
        placeholder="Enter student name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        addonAfter={<SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer' , padding:"0px"}} />}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Modal
        title={selectedStudent ? selectedStudent.name : ''}
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedStudent && (
          <>
            <p>Name: {selectedStudent.name}</p>
            <p>Phone: {selectedStudent.phone}</p>
            <p>Discount: {selectedStudent.discount}</p>
            <p>Enrollments:</p>
            <ul>
              {selectedStudent.enrollments.map((enrollment) => (
                <li key={enrollment._id}>
                  <p>Course Title: {enrollment.course.title}</p>
                  <ul>
                    {enrollment.payments.map((payment) => (
                      <li key={payment._id}>
                        <p>Payment Date: {payment.date}</p>
                        <p>Payment Amount: {payment.amount}</p>
                        <p>Cost After Discount: {payment.costAfterDiscount}</p>
                        <p>Remaining Balance After Payment: {payment.remainingBalanceAfterPayment}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <Button onClick={handleCloseModal}>Close</Button>
          </>
        )}
      </Modal>
    </Card>
  );
};

export default StudentSearch;
