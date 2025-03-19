const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profile: {
        firstName: String,
        lastName: String,
        avatar: String,
        phoneNumber: String,
        address: String
    },
    financialProfile: {
        monthlyIncome: Number,
        monthlyExpenses: Number,
        savingsGoal: Number,
        riskTolerance: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        }
    },
    accounts: [{
        type: {
            type: String,
            enum: ['savings', 'checking', 'credit', 'investment'],
            required: true
        },
        name: String,
        balance: Number,
        accountNumber: String,
        institution: String
    }],
    goals: [{
        title: String,
        targetAmount: Number,
        currentAmount: Number,
        deadline: Date,
        category: {
            type: String,
            enum: ['savings', 'investment', 'debt', 'purchase']
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'cancelled'],
            default: 'active'
        }
    }],
    notifications: [{
        type: String,
        message: String,
        read: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    preferences: {
        language: {
            type: String,
            default: 'zh-CN'
        },
        currency: {
            type: String,
            default: 'CNY'
        },
        theme: {
            type: String,
            default: 'light'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            }
        }
    }
}, {
    timestamps: true
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(config.bcrypt.saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// 验证密码方法
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// 获取用户财务概览
userSchema.methods.getFinancialOverview = function() {
    const totalBalance = this.accounts.reduce((sum, account) => sum + account.balance, 0);
    const totalSavings = this.accounts
        .filter(account => account.type === 'savings')
        .reduce((sum, account) => sum + account.balance, 0);
    
    return {
        totalBalance,
        totalSavings,
        monthlyIncome: this.financialProfile.monthlyIncome,
        monthlyExpenses: this.financialProfile.monthlyExpenses,
        savingsRate: this.financialProfile.monthlyIncome ? 
            ((this.financialProfile.monthlyIncome - this.financialProfile.monthlyExpenses) / 
             this.financialProfile.monthlyIncome * 100).toFixed(2) : 0
    };
};

// 获取用户目标进度
userSchema.methods.getGoalsProgress = function() {
    return this.goals.map(goal => ({
        ...goal.toObject(),
        progress: goal.targetAmount ? 
            (goal.currentAmount / goal.targetAmount * 100).toFixed(2) : 0
    }));
};

const User = mongoose.model('User', userSchema);

module.exports = User; 