import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Table, Button } from "antd";

const PaymentDetailsPage = () => {
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    if (location.state && location.state.paymentDetails) {
      setPaymentDetails(location.state.paymentDetails);
    }
    if (location.state && location.state.studentName) {
      setStudentName(location.state.studentName);
    }
  }, [location.state]);

  const handlePrintPaymentDetails = () => {
    window.print();
  };

  return (
    <div>
      <h2>Payment Details for {studentName}</h2>
      <Button onClick={handlePrintPaymentDetails}>Print</Button>
      <Table
        columns={[
          {
            title: "Payment Date",
            dataIndex: "date",
            key: "date",
            render: (date) => new Date(date).toLocaleString(),
          },
          {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
          },
          {
            title: "Cost After Payment",
            dataIndex: "remainingBalanceAfterPayment",
            key: "remainingBalanceAfterPayment",
            render: (remainingBalanceAfterPayment) =>
              remainingBalanceAfterPayment || "0",
          },
        ]}
        dataSource={paymentDetails}
        pagination={false}
      />
    </div>
  );
};

export default PaymentDetailsPage;
