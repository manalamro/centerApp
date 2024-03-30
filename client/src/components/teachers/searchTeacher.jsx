
import React, { useState } from 'react';
import { searchTeachers } from '../../utils/coursesOperation';
import { Input, Modal, message, Card ,Button} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const TeacherSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = async () => {
    try {
      if (searchTerm.trim() !== '') {
        const teachers = await searchTeachers(searchTerm);
        if (teachers.length > 0) {
          setSelectedTeacher(teachers[0]);
          setModalVisible(true);
        } else {
          message.error('Teacher not found in our system.', 4, () => setError(''));
          setSearchTerm('');
        }
      } else {
        message.error('Please enter a teacher name before searching.', 4, () => setError(''));
        setSearchTerm('');
      }
    } catch (error) {
      message.error(error, 4, () => setError(''));
      setSearchTerm('');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTeacher(null);
    setSearchTerm('');
  };

  return (
    <Card title="Are you looking for a teacher?">
      <Input 
        placeholder="Enter teacher name" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        addonAfter={<SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer' }} />}
      />
      {error && <p>{error}</p>}
      <Modal
        title={selectedTeacher ? selectedTeacher.name : ''}
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedTeacher && (
          <>
            <p>Phone Number: {selectedTeacher.phone}</p>
            <p>Total Salary is {selectedTeacher.totalSalary} &#8362; </p>
            <h4>{selectedTeacher.name} courses:</h4>
            <ol>
              {selectedTeacher.courses.map(course => (
                <li key={course._id}>
                  <p>Course Title: {course.courseName}</p>
                  <p>Percent Of Profit: {course.percentOfProfit}%</p>
                  <p>Profit Get From This Course: {course.salary} &#8362;</p>
                </li>
              ))}
            </ol>
          </>
        )}
      </Modal>
    </Card>
  );
};

export default TeacherSearch;
