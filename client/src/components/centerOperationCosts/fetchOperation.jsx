// components/CenterOperationalCostsList.js

import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import UpdateOperationForm from "./UpdateOperationForm";
import AddOperationForm from "./AddOperationForm";
import {
  fetchCenterOperationalCosts,
  deleteCenterOperationalCosts,
} from "../../utils/operationsCost";

const handlePrintPaymentDetails = () => {
  window.print();
};

const CenterOperationalCostsList = ({ token }) => {
  const [centerOperationalCosts, setCenterOperationalCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [deletingOperation, setDeletingOperation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedCenterId, setSelectedCenterId] = useState(null);
  const [operationsDetails, setOperationsDetails] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showOperationsModal, setShowOperationsModal] = useState(false);
  const [monthYear, setMonthYear] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchCenterOperationalCosts();
      if (response.length === 0) {
        console.log("No operational costs available.");
      } else {
        setCenterOperationalCosts(response);
      }
    } catch (error) {
      console.error("Error fetching center operational costs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleUpdate = () => {
    fetchData();
    setShowUpdateForm(false);
    setShowOperationsModal(false);
  };

  const handleUpdateClick = (operation) => {
    setSelectedOperation(operation);
    setShowUpdateForm(true);
    setShowOperationsModal(false);
  };

  const handleAddOperationClick = (centerId) => {
    setSelectedCenterId(centerId);
    setShowAddForm(true);
  };

  const handleAdd = async () => {
    try {
      await fetchData();
      setShowAddForm(false);
    } catch (error) {
      message.error("Failed to add operation");
    }
  };

  const handleShowOperationsDetails = (record) => {
    setSelectedRow(record);
    setOperationsDetails(record.operations);
    setMonthYear(record.monthYear);
    setShowOperationsModal(true);
  };

  const columns = [
    {
      title: "Month",
      dataIndex: "monthYear",
      key: "monthYear",
      render: (monthYear) => {
        const date = new Date(monthYear);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        return <span>{`${year}-${String(month).padStart(2, '0')}`}</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
          <Button type="link" onClick={() => handleShowOperationsDetails(record)}>
            Operations Details
          </Button>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
          <Button type="link" onClick={() => handleAddOperationClick(record._id)}>
            Add new Operation
          </Button>
      ),
    },
  ];

  const handleDeleteConfirmation = (operationalCostsId, operationId) => {
    setDeletingOperation({
      operationalCostsId,
      operationId,
    });
    setConfirmDeleteVisible(true);
    setShowOperationsModal(false);
  };

  const handleDelete = async () => {
    const { operationId } = deletingOperation;
    try {
      const result = await deleteCenterOperationalCosts(operationId);
      console.log("delResult:",result);
      if(result.error){
        message.error(result.error);
        return;
      }
      
      const updatedCosts = centerOperationalCosts.map((cost) => ({
        ...cost,
        operations: cost.operations.filter(
            (operation) => operation._id !== operationId
        ),
      }));
      setCenterOperationalCosts(updatedCosts);
      setConfirmDeleteVisible(false);

      message.success("Operation deleted successfully");
    } catch (error) {
      message.error("Failed to delete operation");
    }
  };

  const handleCancelDelete = () => {
    setDeletingOperation(null);
    setConfirmDeleteVisible(false);
  };

  return (
      <div>
        <Row justify="space-between" align="middle" style={{ marginTop: "30px" }}>
          <Col>
            <h3>Center Operational Costs List</h3>
          </Col>
          <Col>
            <Button
                type="primary"
                onClick={() => navigate("/addNewMonthOperations")}
            >
              Add New
            </Button>
          </Col>
        </Row>
        {centerOperationalCosts.length > 0 ? (
            <Table
                style={{ overflowX: "auto" }}
                columns={columns}
                dataSource={centerOperationalCosts}
                loading={loading}
                rowKey="_id"
            />
        ) : (
            <p>No operational costs available.</p>
        )}
        <Modal
            title={`Operations Details ${monthYear && monthYear.slice(0, 7)}`}
            visible={showOperationsModal}
            onCancel={() => setShowOperationsModal(false)}
            footer={[
              <Button key="print" onClick={handlePrintPaymentDetails}>
                Print
              </Button>,
            ]}
        >
          {operationsDetails && (
              <div key={selectedRow._id}>
                <Table
                    columns={[
                      { title: "Title", dataIndex: "title", key: "title" },
                      { title: "Price", dataIndex: "price", key: "price" },
                      {
                        title: "Action",
                        key: "action",
                        render: (_, operationRecord) => (
                            <>
                              <Button
                                  type="link"
                                  onClick={() =>
                                      handleDeleteConfirmation(
                                          selectedRow._id,
                                          operationRecord._id
                                      )
                                  }
                              >
                                Delete
                              </Button>
                              <Button
                                  type="link"
                                  onClick={() => handleUpdateClick(operationRecord)}
                              >
                                Update
                              </Button>
                            </>
                        ),
                      },
                    ]}
                    dataSource={operationsDetails}
                    pagination={false}
                    rowKey="_id"
                />
              </div>
          )}
        </Modal>

        <Modal
            title="Confirm Delete"
            visible={confirmDeleteVisible}
            onOk={handleDelete}
            onCancel={handleCancelDelete}
            okText="Delete"
            cancelText="Cancel"
        >
          <p>Are you sure you want to delete this operation?</p>
        </Modal>

        {showUpdateForm && (
            <Modal
                title="Update Operation"
                visible={showUpdateForm}
                onCancel={() => setShowUpdateForm(false)}
                footer={null}
            >
              <UpdateOperationForm
                  operationId={selectedOperation._id}
                  title={selectedOperation.title}
                  price={selectedOperation.price}
                  onUpdate={handleUpdate}
              />
            </Modal>
        )}

        {showAddForm && (
            <Modal
                title="Add New Operation"
                visible={showAddForm}
                onCancel={() => setShowAddForm(false)}
                footer={null}
            >
              <AddOperationForm centerId={selectedCenterId} onAdd={handleAdd} />
            </Modal>
        )}
      </div>
  );
};

export default CenterOperationalCostsList;
