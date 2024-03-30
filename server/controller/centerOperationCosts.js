const CenterOperationalCosts = require('../models/operationSchema');

// 1. Create Center Operational Costs
exports.createCenterOperationalCosts = async (req, res) => {
    try {
        const { monthYear, operations } = req.body;
        const manager = req.manager._id;

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
            res.status(200).json(existingCosts);
        } else {
            // Create new CenterOperationalCosts entry
            const newCenterOperationalCosts = await CenterOperationalCosts.create({ monthYear, operations, manager });
            res.status(201).json(newCenterOperationalCosts);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// 2. Get Center Operational Costs
exports.getCenterOperationalCosts = async (req, res) => {
    try {
      const manager = req.manager._id;
      const centerOperationalCosts = await CenterOperationalCosts.find({ manager });
        res.json(centerOperationalCosts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 3. Update Operation
exports.updateOperation = async (req, res) => {
    try {
        const { operationId, title, price } = req.body;
        const updatedOperation = await CenterOperationalCosts.findOneAndUpdate(
            { 'operations._id': operationId },
            { $set: { 'operations.$.title': title, 'operations.$.price': price } },
            { new: true }
        );
        res.json(updatedOperation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 4. Delete Operation
exports.deleteOperation = async (req, res) => {
    try {
        const { operationId } = req.body;
        const deletedOperation = await CenterOperationalCosts.findOneAndUpdate(
            { 'operations._id': operationId },
            { $pull: { operations: { _id: operationId } } },
            { new: true }
        );
        res.json(deletedOperation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Function to add an operation to an existing center's operational costs
exports.addOperationToCenter = async (req, res) => {
    try {
        const { centerId } = req.params;
        const newOperation = req.body;

        const center = await CenterOperationalCosts.findById(centerId);

        if (!center) {
            return res.status(404).json({ success: false, message: 'Center not found' });
        }

        center.operations.push(newOperation);
        await center.save();

        res.status(200).json({ success: true, message: 'Operation added successfully', center });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};