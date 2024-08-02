const CenterOperationalCosts = require('../models/operationSchema');

// 1. Create Center Operational Costs
// backend controller.
exports.createCenterOperationalCosts = async (req, res) => {
    try {
        const { monthYear, operations } = req.body;
        const manager = req.manager?._id;

        if (!manager) {
            return res.status(401);
        }

        // Extract year and month from the provided monthYear date
        const monthYearDate = new Date(monthYear);
        const year = monthYearDate.getFullYear();
        const month = monthYearDate.getMonth();

        // Find existing record with the same year and month
        let existingCosts = await CenterOperationalCosts.findOne({
            monthYear: { $gte: new Date(year, month, 1), $lt: new Date(year, month + 1, 1) },
            manager
        });

        if (existingCosts) {
            // Add operations to the existing entry
            existingCosts.operations.push(...operations);
            await existingCosts.save();
            return res.status(200).json({ success: true, message: 'Operations added successfully to existing record', existingCosts });
        } else {
            // Create new CenterOperationalCosts entry
            const newCenterOperationalCosts = await CenterOperationalCosts.create({ monthYear, operations, manager });
            return res.status(201).json({ success: true, message: 'Center operational costs created successfully', newCenterOperationalCosts });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Validation Error', details: error.message });
        }
        res.status(500).json({ success: false, error:'Internal Server Error check your internet connection'  });
    }
};

// 2. Get Center Operational Costs
exports.getCenterOperationalCosts = async (req, res) => {
    try {
        const managerId = req.params.managerId || req.manager?._id;

        // Check for valid managerId
        if (!managerId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized: Invalid or expired token'
            });
        }

        // Fetch center operational costs based on the manager's ID
        const centerOperationalCosts = await CenterOperationalCosts.find({ manager: managerId });

        // Check if any operational costs are found
        if (!centerOperationalCosts || centerOperationalCosts.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No center operational costs found for the specified manager'
            });
        }

        // Send the retrieved operational costs to the client
        res.status(200).json({
            success: true,
            message: 'Center operational costs retrieved successfully',
            centerOperationalCosts
        });
    } catch (error) {
        // Log the error and send a response
        console.error('Error retrieving center operational costs:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error check your internet connection',
        });
    }
};

// 1. Update Operation
exports.updateOperation = async (req, res) => {
    try {
        const managerId = req.params.managerId || req.manager?._id;

        // Check for valid managerId
        if (!managerId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized: Invalid or expired token'
            });
        }
        
        const { operationId, title, price } = req.body;

        // Check for missing required fields
        if (!operationId || !title || !price) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: operationId, title, and price are required'
            });
        }

        // Update the operation
        const updatedOperation = await CenterOperationalCosts.findOneAndUpdate(
            { 'operations._id': operationId },
            { $set: { 'operations.$.title': title, 'operations.$.price': price } },
            { new: true }
        );

        // Check if the operation was found and updated
        if (!updatedOperation) {
            return res.status(404).json({
                success: false,
                error: 'Operation not found'
            });
        }

        // Send the updated operation to the client
        res.status(200).json({
            success: true,
            message: 'Operation updated successfully',
            updatedOperation
        });
    } catch (error) {
        // Log the error and send a response
        console.error('Error updating operation:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error check your connection',
        });
    }
};

// 2. Delete Operation
exports.deleteOperation = async (req, res) => {
    try {
        const managerId = req.params.managerId || req.manager?._id;

        // Check for valid managerId
        if (!managerId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized: Invalid or expired token'
            });
        }
        
        const { operationId } = req.body;

        // Check for missing required field
        if (!operationId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: operationId is required'
            });
        }

        // Delete the operation
        const deletedOperation = await CenterOperationalCosts.findOneAndUpdate(
            { 'operations._id': operationId },
            { $pull: { operations: { _id: operationId } } },
            { new: true }
        );

        // Check if the operation was found and deleted
        if (!deletedOperation) {
            return res.status(404).json({
                success: false,
                error: 'Operation not found'
            });
        }

        // Send the result to the client
        res.status(200).json({
            success: true,
            message: 'Operation deleted successfully',
            deletedOperation
        });
    } catch (error) {
        // Log the error and send a response
        console.error('Error deleting operation:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error, check your internet'
        });
    }
};

// 3. Add Operation to an Existing Center's Operational Costs
exports.addOperationToCenter = async (req, res) => {
    try {
        const managerId = req.params.managerId || req.manager?._id;

        // Check for valid managerId
        if (!managerId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized: Invalid or expired token'
            });
        }
        
        const { centerId } = req.params;
        const newOperation = req.body;

        // Check for missing required fields
        if (!centerId || !newOperation) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: centerId and operation details are required'
            });
        }

        // Find the center and add the new operation
        const center = await CenterOperationalCosts.findById(centerId);

        // Check if the center was found
        if (!center) {
            return res.status(404).json({
                success: false,
                error: 'Center not found'
            });
        }

        center.operations.push(newOperation);
        await center.save();

        // Send the updated center to the client
        res.status(200).json({
            success: true,
            message: 'Operation added successfully',
            center
        });
    } catch (error) {
        // Log the error and send a response
        console.error('Error adding operation to center:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error, check your internet'
        });
    }
};
