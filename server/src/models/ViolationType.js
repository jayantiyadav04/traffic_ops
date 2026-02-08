const mongoose = require('mongoose');

const violationTypeSchema = new mongoose.Schema({
    type_name: {
        type: String,
        required: true,
        unique: true,
    },
    base_fine: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('ViolationType', violationTypeSchema);
