const Violation = require('../models/Violation');

// @desc    Get dashboard statistics
// @route   GET /api/analytics/stats
// @access  Private (Admin)
const getStats = async (req, res) => {
    try {
        const totalViolations = await Violation.countDocuments();

        const fines = await Violation.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$fine_amount' },
                    collectedAmount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'paid'] }, '$fine_amount', 0]
                        }
                    },
                    pendingAmount: {
                        $sum: {
                            $cond: [{ $ne: ['$status', 'paid'] }, '$fine_amount', 0]
                        }
                    }
                }
            }
        ]);

        const stats = fines[0] || { totalAmount: 0, collectedAmount: 0, pendingAmount: 0 };

        res.json({
            totalViolations,
            totalFines: stats.totalAmount,
            collectedFines: stats.collectedAmount,
            pendingFines: stats.pendingAmount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get violations by type
// @route   GET /api/analytics/by-type
// @access  Private (Admin)
const getViolationsByType = async (req, res) => {
    try {
        const data = await Violation.aggregate([
            {
                $group: {
                    _id: '$violation_type',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'violationtypes',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'details'
                }
            },
            {
                $unwind: '$details'
            },
            {
                $project: {
                    type_name: '$details.type_name',
                    count: 1
                }
            }
        ]);

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStats,
    getViolationsByType,
};
