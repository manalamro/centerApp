const mongoose = require('mongoose');

const centerOperationalCostsSchema = new mongoose.Schema({
    monthYear: {
        type: Date,
        required: true
    },
    operations: [
        {
            title: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manager',
        required: true
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const CenterOperationalCosts = mongoose.model('CenterOperationalCosts', centerOperationalCostsSchema);

module.exports = CenterOperationalCosts;
