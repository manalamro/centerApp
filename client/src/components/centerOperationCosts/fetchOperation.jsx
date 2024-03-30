
// import React, { useState, useEffect } from "react";
// import { Table, Button, Modal, message, Row, Col } from "antd";
// import { useNavigate } from "react-router-dom";
// import UpdateOperationForm from "./UpdateOperationForm";
// import AddOperationForm from "./AddOperationForm"; // Import AddOperationForm
// import {
//   fetchCenterOperationalCosts,
//   deleteCenterOperationalCosts,
// } from "../../utils/operationsCost";

// const handlePrintPaymentDetails = () => {
//   window.print();
// };

// const CenterOperationalCostsList = ({ token }) => {
//   const [centerOperationalCosts, setCenterOperationalCosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
//   const [deletingOperation, setDeletingOperation] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false); // State to manage visibility of AddOperationForm
//   const [showUpdateForm, setShowUpdateForm] = useState(false);
//   const [selectedOperation, setSelectedOperation] = useState(null);
//   const [selectedCenterId, setSelectedCenterId] = useState(null); // State to store selected center ID
//   const [operationsDetails, setOperationsDetails] = useState(null); // State to store operations details for selected row
//   const [selectedRow, setSelectedRow] = useState(null); // State to store the selected row
//   const [showOperationsModal, setShowOperationsModal] = useState(false); // State to manage visibility of operations modal

//   const navigate = useNavigate();

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetchCenterOperationalCosts(token);
//       setCenterOperationalCosts(response);
//     } catch (error) {
//       console.error("Error fetching center operational costs:", error);
//       message.error("Failed to fetch center operational costs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [token]);

//   const handleUpdate = () => {
//     // Refresh operation list after update
//     fetchData();
//     setShowUpdateForm(false);
//     setShowOperationsModal(false); // Close the operations modal
//   };

//   const handleUpdateClick = (operation) => {
//     setSelectedOperation(operation);
//     setShowUpdateForm(true);
//     setShowOperationsModal(false); // Show the operations modal

//   };

//   const handleAddOperationClick = (centerId) => {
//     setSelectedCenterId(centerId); // Set selected center ID
//     setShowAddForm(true); // Show AddOperationForm
//   };

//   const handleAdd = async () => {
//     try {
//       await fetchData(); // Refresh data after adding new operation
//       setShowAddForm(false);
//     } catch (error) {
//       message.error("Failed to add operation");
//     }
//   };

//   const handleShowOperationsDetails = (record) => {
//     setSelectedRow(record);
//     setOperationsDetails(record.operations);
//     setShowOperationsModal(true); // Show the operations modal
//   };

//   const columns = [
//     {
//       title: "Month",
//       dataIndex: "monthYear",
//       key: "monthYear",
//       render: (monthYear) => {
//         const date = new Date(monthYear);
//         const year = date.getFullYear();
//         const month = date.getMonth() + 1; // Month index starts from 0, so adding 1
//         return <span>{`${year}-${month}`}</span>;
//       },
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Button type="link" onClick={() => handleShowOperationsDetails(record)}>
//           Operations Details
//         </Button>
//       ),
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <Button type="link" onClick={() => handleAddOperationClick(record._id)}>
//           Add new Operation
//         </Button>
//       ),
//     },
//   ];

//   const handleDeleteConfirmation = (operationalCostsId, operationId) => {
//     setDeletingOperation({
//       operationalCostsId,
//       operationId,
//     });
//     setConfirmDeleteVisible(true);
//     setShowOperationsModal(false); // Show the operations modal

//   };

//   const handleDelete = async () => {
//     const { operationId } = deletingOperation;
//     try {
//       await deleteCenterOperationalCosts(operationId);
//       const updatedCosts = centerOperationalCosts.map((cost) => ({
//         ...cost,
//         operations: cost.operations.filter(
//           (operation) => operation._id !== operationId
//         ),
//       }));
//       setCenterOperationalCosts(updatedCosts);
//       setConfirmDeleteVisible(false);
      
//       message.success("Operation deleted successfully");
//     } catch (error) {
//       message.error("Failed to delete operation");
//     }
//   };

//   const handleCancelDelete = () => {
//     setDeletingOperation(null);
//     setConfirmDeleteVisible(false);
//   };

//   return (
//     <div>
//       <Row justify="space-between" align="middle" style={{ marginTop: "30px" }}>
//         <Col>
//           <h3>Center Operational Costs List</h3>
//         </Col>
//         <Col>
//           <Button
//             type="primary"
//             onClick={() => navigate("/addNewMonthOperations")}
//           >
//             Add New
//           </Button>
//         </Col>
//       </Row>
//       <Table
//         style={{ overflowX: "auto" }}
//         columns={columns}
//         dataSource={centerOperationalCosts}
//         loading={loading}
//         rowKey="_id"
//       />
//       <Modal
//         title={`Operations Details"${monthYear}`}
//         visible={showOperationsModal}
//         onCancel={() => setShowOperationsModal(false)}
//         footer={[
//           <Button key="print" onClick={handlePrintPaymentDetails}>
//             Print
//           </Button>,
//         ]}
        
//       >
//         {operationsDetails && (
//           <div key={selectedRow._id}>
//             <Table
//               columns={[
//                 { title: "Title", dataIndex: "title", key: "title" },
//                 { title: "Price", dataIndex: "price", key: "price" },
//                 {
//                   title: "Action",
//                   key: "action",
//                   render: (_, operationRecord) => (
//                     <>
//                       <Button
//                         type="link"
//                         onClick={() =>
//                           handleDeleteConfirmation(selectedRow._id, operationRecord._id)
//                         }
//                       >
//                         Delete
//                       </Button>
//                       <Button
//                         type="link"
//                         onClick={() => handleUpdateClick(operationRecord)}
//                       >
//                         Update
//                       </Button>
//                     </>
//                   ),
//                 },
//               ]}
//               dataSource={operationsDetails}
//               pagination={false}
//               rowKey="_id"
//             />
//           </div>
//         )}
//       </Modal>

//       <Modal
//         title="Confirm Delete"
//         visible={confirmDeleteVisible}
//         onOk={handleDelete}
//         onCancel={handleCancelDelete}
//         okText="Delete"
//         cancelText="Cancel"
//       >
//         <p>Are you sure you want to delete this operation?</p>
//       </Modal>

//       {showUpdateForm && (
//         <Modal
//           title="Update Operation"
//           visible={showUpdateForm}
//           onCancel={() => setShowUpdateForm(false)}
//           footer={null}
//         >
//           <UpdateOperationForm
//             operationId={selectedOperation._id}
//             title={selectedOperation.title}
//             price={selectedOperation.price}
//             onUpdate={handleUpdate}
//           />
//         </Modal>
//       )}

//       {showAddForm && (
//         <Modal
//           title="Add New Operation"
//           visible={showAddForm}
//           onCancel={() => setShowAddForm(false)}
//           footer={null}
//         >
//           <AddOperationForm centerId={selectedCenterId} onAdd={handleAdd} />
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default CenterOperationalCostsList;
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import UpdateOperationForm from "./UpdateOperationForm";
import AddOperationForm from "./AddOperationForm"; // Import AddOperationForm
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
  const [showAddForm, setShowAddForm] = useState(false); // State to manage visibility of AddOperationForm
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedCenterId, setSelectedCenterId] = useState(null); // State to store selected center ID
  const [operationsDetails, setOperationsDetails] = useState(null); // State to store operations details for selected row
  const [selectedRow, setSelectedRow] = useState(null); // State to store the selected row
  const [showOperationsModal, setShowOperationsModal] = useState(false); // State to manage visibility of operations modal
  const [monthYear, setMonthYear] = useState(null); // State to store the monthYear for operations details title

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchCenterOperationalCosts(token);
      setCenterOperationalCosts(response);
    } catch (error) {
      console.error("Error fetching center operational costs:", error);
      message.error("Failed to fetch center operational costs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleUpdate = () => {
    // Refresh operation list after update
    fetchData();
    setShowUpdateForm(false);
    setShowOperationsModal(false); // Close the operations modal
  };

  const handleUpdateClick = (operation) => {
    setSelectedOperation(operation);
    setShowUpdateForm(true);
    setShowOperationsModal(false); // Show the operations modal

  };

  const handleAddOperationClick = (centerId) => {
    setSelectedCenterId(centerId); // Set selected center ID
    setShowAddForm(true); // Show AddOperationForm
  };

  const handleAdd = async () => {
    try {
      await fetchData(); // Refresh data after adding new operation
      setShowAddForm(false);
    } catch (error) {
      message.error("Failed to add operation");
    }
  };

  const handleShowOperationsDetails = (record) => {
    setSelectedRow(record);
    setOperationsDetails(record.operations);
    setMonthYear(record.monthYear); // Set the monthYear for operations details title
    setShowOperationsModal(true); // Show the operations modal
  };

  const columns = [
    {
      title: "Month",
      dataIndex: "monthYear",
      key: "monthYear",
      render: (monthYear) => {
        const date = new Date(monthYear);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Month index starts from 0, so adding 1
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
    setShowOperationsModal(false); // Show the operations modal

  };

  const handleDelete = async () => {
    const { operationId } = deletingOperation;
    try {
      await deleteCenterOperationalCosts(operationId);
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
      <Table
        style={{ overflowX: "auto" }}
        columns={columns}
        dataSource={centerOperationalCosts}
        loading={loading}
        rowKey="_id"
      />
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
                          handleDeleteConfirmation(selectedRow._id, operationRecord._id)
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
