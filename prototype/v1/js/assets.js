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

    // 筛选按钮事件
    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', handleFilter);
    }

    // 更多选项菜单事件
    initializeMoreOptionsMenu();
}

// 初始化更多选项菜单
function initializeMoreOptionsMenu() {
    const menu = document.getElementById('moreOptionsMenu');
    const closeBtn = menu.querySelector('.close-menu');
    const menuItems = menu.querySelectorAll('.menu-item');

    // 关闭按钮事件
    closeBtn.addEventListener('click', () => {
        menu.classList.remove('show');
    });

    // 菜单项点击事件
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            handleMenuAction(action);
            menu.classList.remove('show');
        });
    });

    // 点击菜单外部关闭
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('show') && 
            !menu.contains(e.target) && 
            !e.target.closest('.more-btn')) {
            menu.classList.remove('show');
        }
    });
}

// 处理更多选项按钮点击
function handleMoreOptions() {
    const menu = document.getElementById('moreOptionsMenu');
    menu.classList.add('show');
}

// 处理菜单项点击
function handleMenuAction(action) {
    switch (action) {
        case 'export':
            exportData();
            break;
        case 'share':
            shareAssetInfo();
            break;
        case 'settings':
            openSettings();
            break;
        case 'help':
            showHelp();
            break;
    }
}

// 导出数据
function exportData() {
    const data = {
        totalAssets: 328550,
        distribution: {
            '活期存款': 125000,
            '定期存款': 80000,
            '基金投资': 65550,
            '股票投资': 58000
        },
        history: [
            {
                type: 'increase',
                title: '工资收入',
                amount: 12500,
                category: '活期存款',
                date: '2024-03-19'
            },
            // ... 其他历史记录
        ]
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asset-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showToast('数据导出成功');
}

// 分享资产信息
function shareAssetInfo() {
    if (navigator.share) {
        navigator.share({
            title: '我的资产概况',
            text: '总资产: ¥328,550.00\n月度增长: +2.5%',
            url: window.location.href
        }).catch(() => {
            showToast('分享失败，请稍后重试');
        });
    } else {
        showToast('您的浏览器不支持分享功能');
    }
}

// 打开设置
function openSettings() {
    // TODO: 实现设置功能
    showToast('设置功能开发中');
}

// 显示帮助
function showHelp() {
    // TODO: 实现帮助功能
    showToast('帮助功能开发中');
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

// 初始化图表
function initializeCharts() {
    initializeAssetTrendChart();
    initializeDistributionChart();
}

// 初始化资产趋势图表
function initializeAssetTrendChart() {
    const ctx = document.getElementById('assetTrendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
            datasets: [{
                label: '资产趋势',
                data: [280000, 285000, 290000, 305000, 315000, 328550],
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: 'white',
                pointRadius: 4,
                tension: 0.4,
                fill: {
                    target: 'origin',
                    above: 'rgba(255, 255, 255, 0.1)'
                }
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

// 初始化资产分布图表
function initializeDistributionChart() {
    const ctx = document.getElementById('distributionChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['活期存款', '定期存款', '基金投资', '股票投资'],
            datasets: [{
                data: [125000, 80000, 65550, 58000],
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

// 更新图表数据
function updateCharts(period) {
    // TODO: 根据选择的时间周期更新图表数据
    console.log('更新图表数据:', period);
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
        return dateString;
    }
}

// 处理筛选按钮点击
function handleFilter() {
    const modal = document.getElementById('filterModal');
    modal.classList.add('show');
    initializeFilterModal();
}

// 初始化筛选模态框
function initializeFilterModal() {
    const modal = document.getElementById('filterModal');
    const closeBtn = modal.querySelector('.close-modal');
    const resetBtn = document.getElementById('resetFilter');
    const applyBtn = document.getElementById('applyFilter');
    const typeChips = modal.querySelectorAll('[data-type]');
    const categoryChips = modal.querySelectorAll('[data-category]');

    // 关闭按钮事件
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // 重置按钮事件
    resetBtn.addEventListener('click', resetFilters);

    // 应用按钮事件
    applyBtn.addEventListener('click', () => {
        applyFilters();
        modal.classList.remove('show');
    });

    // 类型选择事件
    typeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            typeChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });

    // 类别选择事件
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            categoryChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });

    // 设置默认日期范围（最近一个月）
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    
    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
}

// 重置筛选条件
function resetFilters() {
    const modal = document.getElementById('filterModal');
    const typeChips = modal.querySelectorAll('[data-type]');
    const categoryChips = modal.querySelectorAll('[data-category]');

    // 重置类型选择
    typeChips.forEach(chip => {
        chip.classList.remove('active');
        if (chip.dataset.type === 'all') {
            chip.classList.add('active');
        }
    });

    // 重置类别选择
    categoryChips.forEach(chip => {
        chip.classList.remove('active');
        if (chip.dataset.category === 'all') {
            chip.classList.add('active');
        }
    });

    // 重置日期范围
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    
    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];

    // 重置金额范围
    document.getElementById('minAmount').value = '';
    document.getElementById('maxAmount').value = '';
}

// 应用筛选条件
function applyFilters() {
    const modal = document.getElementById('filterModal');
    const filters = {
        type: modal.querySelector('[data-type].active').dataset.type,
        category: modal.querySelector('[data-category].active').dataset.category,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        minAmount: document.getElementById('minAmount').value,
        maxAmount: document.getElementById('maxAmount').value
    };

    // 模拟的历史记录数据
    const historyData = [
        {
            type: 'increase',
            title: '工资收入',
            amount: 12500,
            category: '活期存款',
            date: '2024-03-19'
        },
        {
            type: 'decrease',
            title: '基金赎回',
            amount: 5000,
            category: '基金投资',
            date: '2024-03-18'
        },
        {
            type: 'transfer',
            title: '转入定期',
            amount: 20000,
            category: '定期存款',
            date: '2024-03-15'
        }
    ];

    // 筛选数据
    const filteredData = historyData.filter(item => {
        if (filters.type !== 'all' && item.type !== filters.type) return false;
        if (filters.category !== 'all' && item.category !== filters.category) return false;
        
        const itemDate = new Date(item.date);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        if (itemDate < startDate || itemDate > endDate) return false;
        
        if (filters.minAmount && item.amount < parseFloat(filters.minAmount)) return false;
        if (filters.maxAmount && item.amount > parseFloat(filters.maxAmount)) return false;
        
        return true;
    });

    // 更新历史记录列表
    updateHistoryList(filteredData);
}

// 更新历史记录列表
function updateHistoryList(data) {
    const historyList = document.querySelector('.history-list');
    historyList.innerHTML = '';

    if (data.length === 0) {
        historyList.innerHTML = `
            <div class="no-results">
                <i class="material-icons">search_off</i>
                <p>没有找到符合条件的记录</p>
            </div>
        `;
        return;
    }

    data.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = `history-item ${item.type}`;
        
        historyItem.innerHTML = `
            <div class="history-icon">
                <i class="material-icons">${getIconByType(item.type)}</i>
            </div>
            <div class="history-info">
                <div class="history-main">
                    <span class="history-title">${item.title}</span>
                    <span class="history-amount">${formatAmount(item.amount)}</span>
                </div>
                <div class="history-details">
                    <span class="history-category">${item.category}</span>
                    <span class="history-time">${formatDate(item.date)}</span>
                </div>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// 根据类型获取图标
function getIconByType(type) {
    switch (type) {
        case 'increase':
            return 'add_circle';
        case 'decrease':
            return 'remove_circle';
        case 'transfer':
            return 'swap_horiz';
        default:
            return 'fiber_manual_record';
    }
} 