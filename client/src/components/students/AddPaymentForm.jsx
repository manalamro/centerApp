import React, { useState } from 'react';
import { Modal, Button, message, Form, Input } from 'antd';

const { Item } = Form;

const AddPaymentForm = ({
                          enrollmentId,
                          onAddPayment,
                          visible,
                          error,
                          onCancel,
                          costAfterDiscount,
                          remainingBalanceAfterPayment
                        }) => {
  const [form] = Form.useForm();

  const handleAddPayment = () => {
    form.validateFields()
        .then((values) => {
          const parsedAmount = parseFloat(values.amount);

          if (parsedAmount > costAfterDiscount) {
            message.error('Amount must be less than or equal to cost after discount, your cost after discount:' + costAfterDiscount);
            return;
          }

          if (remainingBalanceAfterPayment === 0) {
            message.error('No remaining balance to pay');
            return;
          }

          if (parsedAmount > remainingBalanceAfterPayment) {
            message.error('Amount must be less than or equal to remaining balance after payment');
            return;
          }

          if (parsedAmount <= 0) {
            message.error('Amount must be greater than zero');
            return;
          }

          const paymentData = {
            date: Date.now(), // Use current date
            amount: parsedAmount
          };

          // Call the parent function to handle payment addition
          onAddPayment(enrollmentId, paymentData);

          form.resetFields(); // Reset form fields
          onCancel(); // Close modal after submission
        })
        .catch(() => {
          message.error(error);
        });
  };

  return (
      <Modal
          title='Add Payment' // Display student name in the modal title
          visible={visible}
          onCancel={onCancel}
          footer={[
            <Button key="cancel" onClick={onCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleAddPayment}>
              Add Payment
            </Button>,
          ]}
      >
        <p>Your cost After Discount: {costAfterDiscount}, remaining Balance After last Payment: {remainingBalanceAfterPayment}</p>
        <Form form={form}>
          <Item
              label="Amount"
              name="amount"
              rules={[
                {
                  required: true,
                  message: "Please enter the amount",
                }
              ]}
          >
            <Input placeholder="Enter the amount" type="number" />
          </Item>
        </Form>
      </Modal>
  );
};

export default AddPaymentForm;
