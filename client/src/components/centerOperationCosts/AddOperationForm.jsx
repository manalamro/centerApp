import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { addOperationToCenter } from '../../utils/operationsCost';

const AddOperationForm = ({ centerId, onAdd }) => { // Accept onAdd callback function
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await addOperationToCenter(centerId, values);
      message.success('Operation added successfully');
      onAdd(); // Call onAdd callback to refresh data
      // Clear form fields after successful submission if needed
    } catch (error) {
      message.error('Failed to add operation');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="addOperationForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[
          {
            required: true,
            message: 'Please enter the title of the operation',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[
          {
            required: true,
            message: 'Please enter the price of the operation',
          },
        ]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Add Operation
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddOperationForm;
