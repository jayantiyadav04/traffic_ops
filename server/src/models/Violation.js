const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
    vehicle_number: {
        type: String,
        required: true,
    },
    owner_name: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null, // Optional reference if citizen is registered
    },
    violation_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ViolationType',
        required: true,
    },
    area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area',
        required: true,
    },
    officer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    violation_date: {
        type: Date,
        default: Date.now,
    },
    fine_amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['unpaid', 'paid', 'disputed'],
        default: 'unpaid',
    },
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Violation', violationSchema);
