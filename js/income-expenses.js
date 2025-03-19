// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有事件监听器
    initializeEventListeners();
    
    // 初始化图表
    initializeCharts();
});

// 初始化所有事件监听器
function initializeEventListeners() {
    // 返回按钮事件
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.history.back();
        });
    }

    // 更多按钮事件
    const moreBtn = document.querySelector('.more-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', handleMoreOptions);
    }

    // 时间周期选择器事件
    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            periodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateCharts(btn.textContent);
        });
    });

    // 交易模态框事件
    initializeTransactionModal();
}

// 初始化图表
function initializeCharts() {
    initializeMonthlyTrendChart();
    initializeCategoryChart();
}

// 初始化月度趋势图表
function initializeMonthlyTrendChart() {
    const ctx = document.getElementById('monthlyTrendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
            datasets: [{
                label: '收入',
                data: [15000, 16000, 15500, 18000, 21000, 19000],
                borderColor: '#10B981',
                borderWidth: 2,
                pointBackgroundColor: 'white',
                pointRadius: 4,
                tension: 0.4,
                fill: false
            }, {
                label: '支出',
                data: [10000, 11000, 9500, 12000, 11000, 9000],
                borderColor: '#EF4444',
                borderWidth: 2,
                pointBackgroundColor: 'white',
                pointRadius: 4,
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            }
        }
    });
}

// 初始化分类占比图表
function initializeCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['餐饮', '交通', '购物', '娱乐'],
            datasets: [{
                data: [3000, 1500, 2500, 1000],
                backgroundColor: [
                    '#4F46E5',
                    '#10B981',
                    '#F59E0B',
                    '#EC4899'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// 显示交易模态框
function showTransactionModal(type = 'expense') {
    const modal = document.getElementById('addTransactionModal');
    const typeBtns = modal.querySelectorAll('.type-btn');
    
    // 设置交易类型
    typeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        }
    });

    modal.classList.add('show');
}

// 初始化交易模态框
function initializeTransactionModal() {
    const modal = document.getElementById('addTransactionModal');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.btn-secondary');
    const submitBtn = modal.querySelector('.btn-primary');
    const typeBtns = modal.querySelectorAll('.type-btn');

    // 关闭按钮事件
    [closeBtn, cancelBtn].forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    });

    // 类型选择事件
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateCategoryOptions(btn.dataset.type);
        });
    });

    // 提交按钮事件
    submitBtn.addEventListener('click', handleTransactionSubmit);

    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// 更新类别选项
function updateCategoryOptions(type) {
    const select = document.querySelector('.transaction-form select');
    const categories = {
        expense: [
            { value: 'food', label: '餐饮' },
            { value: 'transport', label: '交通' },
            { value: 'shopping', label: '购物' },
            { value: 'entertainment', label: '娱乐' },
            { value: 'education', label: '教育' },
            { value: 'medical', label: '医疗' },
            { value: 'housing', label: '住房' },
            { value: 'other', label: '其他' }
        ],
        income: [
            { value: 'salary', label: '工资' },
            { value: 'bonus', label: '奖金' },
            { value: 'investment', label: '投资收益' },
            { value: 'other', label: '其他' }
        ]
    };

    // 清空现有选项
    select.innerHTML = '<option value="">选择类别</option>';

    // 添加新选项
    const optgroup = document.createElement('optgroup');
    optgroup.label = type === 'expense' ? '支出' : '收入';
    
    categories[type].forEach(category => {
        const option = document.createElement('option');
        option.value = category.value;
        option.textContent = category.label;
        optgroup.appendChild(option);
    });

    select.appendChild(optgroup);
}

// 处理交易提交
function handleTransactionSubmit() {
    const modal = document.getElementById('addTransactionModal');
    const form = modal.querySelector('.transaction-form');
    const type = modal.querySelector('.type-btn.active').dataset.type;
    const amount = form.querySelector('input[type="number"]').value;
    const category = form.querySelector('select').value;
    const date = form.querySelector('input[type="date"]').value;
    const description = form.querySelector('input[type="text"]').value;

    if (!amount || !category || !date) {
        showToast('请填写完整信息');
        return;
    }

    // TODO: 发送数据到服务器
    console.log({
        type,
        amount,
        category,
        date,
        description
    });

    // 显示成功提示
    showToast('交易记录已保存');

    // 重置表单并关闭模态框
    form.reset();
    modal.classList.remove('show');

    // 更新图表和列表
    updateCharts();
    updateTransactionList();
}

// 更新图表数据
function updateCharts(period = '月') {
    // TODO: 根据选择的时间周期更新图表数据
    console.log('更新图表数据:', period);
}

// 更新交易列表
function updateTransactionList() {
    // TODO: 更新交易列表数据
    console.log('更新交易列表');
}

// 显示提示信息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // 强制重绘
    toast.offsetHeight;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 格式化金额
function formatAmount(amount) {
    return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY'
    }).format(amount);
}

// 格式化百分比
function formatPercentage(value) {
    return new Intl.NumberFormat('zh-CN', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(value / 100);
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return '昨天';
    } else {
        return new Intl.DateTimeFormat('zh-CN', {
            month: 'long',
            day: 'numeric'
        }).format(date);
    }
} 