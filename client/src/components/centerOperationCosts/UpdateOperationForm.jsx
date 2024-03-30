// UpdateOperationForm.js

import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { updateOperation } from "../../utils/operationsCost";

const UpdateOperationForm = ({ operationId, title, price, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [form] = Form.useForm();

  const handleUpdate = async (values) => {
    const { title, price } = values;
    setUpdating(true);
    try {
      await updateOperation(operationId, title, price);
      message.success("Operation updated successfully");
      onUpdate(); // Refresh operation list after update
    } catch (error) {
      message.error("Failed to update operation");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Form form={form} onFinish={handleUpdate} initialValues={{ title, price }}>
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: "Please enter the title" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: "Please enter the price" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={updating}>
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateOperationForm;
