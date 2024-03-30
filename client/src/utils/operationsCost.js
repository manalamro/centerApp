import { centerOperationalCostsService } from '../service/api';
import { message } from 'antd';

export const fetchCenterOperationalCosts = async () => {
  try {
    const token = localStorage.getItem('token');
    const operationalCosts = await centerOperationalCostsService.getCenterOperationalCosts(token);
    return operationalCosts;
  } catch (error) {
    message.error('Failed to fetch center operational costs');
    throw error;
  }
};

export const addCenterOperationalCosts = async (monthYear, operations) => {
  try {
    const token = localStorage.getItem('token');
    return await centerOperationalCostsService.createCenterOperationalCost(monthYear, operations, token);
  } catch (error) {
    message.error('Failed to add center operational costs');
    throw error;
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
    await centerOperationalCostsService.deleteOperation(operationId, token);
    return 'Operation deleted successfully';
  } catch (error) {
    throw new Error(error.response ? error.response.data.error : 'Failed to delete operation');
  }
};

export const addOperationToCenter = async (centerId, newOperation) => {
  try {
    const token = localStorage.getItem('token');
    return await centerOperationalCostsService.addOperationToCenter(centerId, newOperation, token);
  } catch (error) {
    message.error('Failed to add operation to center');
    throw error;
  }
};