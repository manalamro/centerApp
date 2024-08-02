import { centerOperationalCostsService } from '../service/api';
import { message } from 'antd';

// utils/operationsCost.js

export const fetchCenterOperationalCosts = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      message.error("Authentication error: Please log in to continue.");
      return [];
    }

    const { data, error } = await centerOperationalCostsService.getCenterOperationalCosts(token);

    if (error) {
      // Show error message if there's an error from the API
      message.error(error);
      return [];
    }

    return data || []; // Return the actual data if there's no error
  } catch (error) {
    console.error("Error in fetchCenterOperationalCosts:", error);
    return [];
  }
};

export const addCenterOperationalCosts = async (monthYear, operations) => {
  try {
    const token = localStorage.getItem('token');
    return await centerOperationalCostsService.createCenterOperationalCost(monthYear, operations, token);
  } catch (error) {
    // Display the error message from the backend
    throw error; // Optional: Rethrow the error if you want further handling
  }
};


export const updateOperation = async (operationId, title, price) => {
  try {
    const token = localStorage.getItem('token');
    return await centerOperationalCostsService.updateOperation(operationId, title, price, token);
  } catch (error) {
    message.error('Failed to update operation');
    throw error;
  }
};
export const deleteCenterOperationalCosts = async (operationId) => {
  try {
    const token = localStorage.getItem('token');
   return  await centerOperationalCostsService.deleteOperation(operationId, token);
  } catch (error) {
    throw new Error(error.response ? error.response.data.error : 'Failed to delete operation');
  }
};
export const addOperationToCenter = async (centerId, newOperation) => {
  try {
    const token = localStorage.getItem('token');
    return await centerOperationalCostsService.addOperationToCenter(centerId, newOperation, token);
  } catch (error) {
    // message.error('Failed to add operation to center');
    throw error;
  }
};