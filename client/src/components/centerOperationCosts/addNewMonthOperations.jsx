// components/CenterOperationalCostForm.js

import React, { useState } from 'react';
import { Form, Input, Button, message, Space, DatePicker } from 'antd';
import { addCenterOperationalCosts } from '../../utils/operationsCost';
import { useNavigate } from 'react-router-dom';

const CenterOperationalCostForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { monthYear, operations } = values;
    try {
      setLoading(true);
      await addCenterOperationalCosts(monthYear.format('YYYY-MM-DD'), operations);
      message.success('Center operational costs added successfully');
    } catch (error) {
      console.error('Error:', error);
      message.error(error.message || 'Failed to add center operational costs');
    } finally {
      setLoading(false);
    }
  };

  return (
      <Form
          name="centerOperationalCostForm"
          layout="vertical"
          onFinish={onFinish}
      >
        <Form.Item
            name="monthYear"
            label="Month and Year"
            rules={[
              {
                required: true,
                message: 'Please select month and year',
              },
            ]}
        >
          <DatePicker picker="month" format="YYYY-MM" />
        </Form.Item>
        <Form.List name="operations">
          {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                          {...field}
                          name={[field.name, 'title']}
                          fieldKey={[field.fieldKey, 'title']}
                          rules={[{ required: true, message: 'Please enter operation title' }]}
                          label={`Operation Title ${index + 1}`}
                      >
                        <Input placeholder="Title" />
                      </Form.Item>
                      <Form.Item
                          {...field}
                          name={[field.name, 'price']}
                          fieldKey={[field.fieldKey, 'price']}
                          rules={[{ required: true, message: 'Please enter operation price' }]}
                          label={`Operation Price ${index + 1}`}
                      >
                        <Input type="number" placeholder="Price" />
                      </Form.Item>
                      <Button onClick={() => remove(field.name)}>Remove</Button>
                    </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add Operation
                  </Button>
                </Form.Item>
              </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
  );
};

export default CenterOperationalCostForm;
