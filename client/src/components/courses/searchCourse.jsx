
import React, { useState } from 'react';
import { searchCourses } from '../../utils/coursesOperation';
import { Input, Modal, message, Card, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const CourseSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = async () => {
    try {
      if (searchTerm.trim() !== '') {
        const courses = await searchCourses(searchTerm);
        if (courses.length > 0) {
          setSelectedCourse(courses[0]);
          setModalVisible(true);
        } else {
          message.error('Course not found in our system.');
          setSearchTerm('');
        }
      } else {
        message.error('Please enter a course title before searching.');
        setSearchTerm('');
      }
    } catch (error) {
      message.error(error);
      setSearchTerm('');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCourse(null);
    setSearchTerm('');
  };

  return (
    <Card title="Are you looking for a course?">
      <Input
        placeholder="Enter course title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        addonAfter={<SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer' }} />}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Modal
        title={selectedCourse ? selectedCourse.title : ''}
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedCourse && (
          <>
            <p>
              Schedule: {selectedCourse.schedule.recurrence} -{' '}
              {selectedCourse.schedule.days.join(', ')} -{' '}
              {selectedCourse.schedule.time}
            </p>
            <p>Teachers:</p>
            <ul>
              {selectedCourse.teachers.map((teacher) => (
                <li key={teacher._id}>{teacher.name}</li>
              ))}
            </ul>
            <p>Cost: {selectedCourse.cost}</p>
            <Button onClick={handleCloseModal}>Close</Button>
          </>
        )}
      </Modal>
    </Card>
  );
};

export default CourseSearch;
