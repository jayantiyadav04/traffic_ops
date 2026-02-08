const User = require('../models/User');
const Violation = require('../models/Violation');
const ViolationType = require('../models/ViolationType');
const Area = require('../models/Area');

// @desc    Create a violation
// @route   POST /api/violations
// @access  Private (Officer/Admin)
const createViolation = async (req, res) => {
    try {
        const { vehicle_number, owner_name, violation_type, area, fine_amount, notes } = req.body;

        // Auto-create user for the violator if not exists
        let generatedCredentials = null;
        let userId = null;

        if (owner_name) {
            // Generate email from name (e.g., aditya@traffic.com)
            const email = `${owner_name.toLowerCase().replace(/\s+/g, '')}@traffic.com`;

            let user = await User.findOne({ email });

            if (!user) {
                // Generate random password (8 chars)
                const password = Math.random().toString(36).slice(-8);

                user = await User.create({
                    username: email.split('@')[0] + Math.floor(Math.random() * 1000),
                    full_name: owner_name,
                    email: email,
                    password: password, // Will be hashed by pre-save hook
                    role: 'citizen'
                });

                generatedCredentials = {
                    email: email,
                    password: password
                };
            }
            userId = user._id;
        }

        const violation = await Violation.create({
            vehicle_number,
            owner_name,
            violation_type,
            area,
            fine_amount,
            notes,
            officer: req.user.id,
            user: userId // Link violation to user if created/found (requires schema update if not present, but good practice)
        });

        // Convert mongoose doc to object to append extra data
        const responseData = {
            ...violation.toObject(),
            newUser: generatedCredentials
        };

        res.status(201).json(responseData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all violations
// @route   GET /api/violations
// @access  Private
const getViolations = async (req, res) => {
    try {
        let query = {};

        // If citizen, only see own violations (by matching vehicle or linked user - simplification: assuming vehicle number logic later or user link)
        // For now, if citizen, we might filter by their ID if we linked them, but the requirement said "User (optional reference to citizen)".
        // So if linked:
        if (req.user.role === 'citizen') {
            // Find violations where the 'user' field matches the logged in citizen
            // OR filtering by vehicle number manually (not implemented in auth yet)
            query = { user: req.user.id };
        }

        // If admin/officer see all
        const violations = await Violation.find(query)
            .populate('officer', 'username full_name')
            .populate('violation_type', 'type_name base_fine')
            .populate('area', 'area_name city');

        res.status(200).json(violations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all violation types
// @route   GET /api/violations/types
// @access  Private (Authenticated)
const getViolationTypes = async (req, res) => {
    try {
        const types = await ViolationType.find({});
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all areas
// @route   GET /api/violations/areas
// @access  Private (Authenticated)
const getAreas = async (req, res) => {
    try {
        const areas = await Area.find({});
        res.status(200).json(areas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark violation as paid (Manual override by Admin/Officer)
// @route   PUT /api/violations/:id/pay
// @access  Private (Officer/Admin)
const markViolationAsPaid = async (req, res) => {
    try {
        const violation = await Violation.findById(req.params.id);

        if (!violation) {
            res.status(404);
            throw new Error('Violation not found');
        }

        if (violation.status === 'paid') {
            res.status(400);
            throw new Error('Violation is already paid');
        }

        violation.status = 'paid';
        // Optional: you could add paidAt date or paymentMethod field here
        await violation.save();

        res.status(200).json(violation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createViolation,
    getViolations,
    getViolationTypes,
    getAreas,
    markViolationAsPaid,
};
