const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: String,
    description: String,
    date: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit_card', 'debit_card', 'transfer', 'other']
    },
    location: {
        name: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    attachments: [{
        type: String,
        url: String,
        name: String
    }],
    recurring: {
        isRecurring: {
            type: Boolean,
            default: false
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly']
        },
        endDate: Date
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'completed'
    },
    tags: [String],
    metadata: {
        device: String,
        ip: String,
        userAgent: String
    }
}, {
    timestamps: true
});

// 索引优化
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });

// 获取指定时间范围的交易统计
transactionSchema.statics.getStatsByDateRange = async function(userId, startDate, endDate) {
    const stats = await this.aggregate([
        {
            $match: {
                user: mongoose.Types.ObjectId(userId),
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    type: '$type',
                    category: '$category'
                },
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: '$_id.type',
                categories: {
                    $push: {
                        category: '$_id.category',
                        total: '$total',
                        count: '$count'
                    }
                },
                totalAmount: { $sum: '$total' }
            }
        }
    ]);

    return stats;
};

// 获取每月趋势数据
transactionSchema.statics.getMonthlyTrend = async function(userId, months = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    return await this.aggregate([
        {
            $match: {
                user: mongoose.Types.ObjectId(userId),
                date: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' },
                    type: '$type'
                },
                total: { $sum: '$amount' }
            }
        },
        {
            $sort: {
                '_id.year': 1,
                '_id.month': 1
            }
        }
    ]);
};

// 获取分类支出排名
transactionSchema.statics.getCategoryRanking = async function(userId, type, limit = 5) {
    return await this.aggregate([
        {
            $match: {
                user: mongoose.Types.ObjectId(userId),
                type: type
            }
        },
        {
            $group: {
                _id: '$category',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { total: -1 }
        },
        {
            $limit: limit
        }
    ]);
};

// 计算每日平均支出
transactionSchema.statics.getDailyAverage = async function(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await this.aggregate([
        {
            $match: {
                user: mongoose.Types.ObjectId(userId),
                type: 'expense',
                date: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: '$amount' },
                totalDays: {
                    $sum: {
                        $cond: [
                            { $gt: ['$amount', 0] },
                            1,
                            0
                        ]
                    }
                }
            }
        }
    ]);

    if (result.length === 0) return 0;
    return result[0].totalAmount / days;
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 