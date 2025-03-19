// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有事件监听器
    initializeEventListeners();
    
    // 如果在首页，初始化图表
    if (document.querySelector('#balanceChart')) {
        initializeCharts();
    }
});

// 初始化所有事件监听器
function initializeEventListeners() {
    // 底部导航栏事件
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // 快捷功能按钮事件
    const actionItems = document.querySelectorAll('.action-item');
    actionItems.forEach(item => {
        item.addEventListener('click', handleQuickAction);
    });

    // 通知按钮事件
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', handleNotifications);
    }

    // 查看详情按钮事件
    const viewDetailsBtn = document.querySelector('.view-details');
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', handleViewDetails);
    }

    // 交易列表查看全部按钮事件
    const viewAllTransactions = document.querySelector('.recent-transactions .view-all');
    if (viewAllTransactions) {
        viewAllTransactions.addEventListener('click', handleViewAllTransactions);
    }

    // AI建议查看更多按钮事件
    const viewAllInsights = document.querySelector('.ai-insights .view-all');
    if (viewAllInsights) {
        viewAllInsights.addEventListener('click', handleViewAllInsights);
    }
}

// 处理底部导航
function handleNavigation(event) {
    event.preventDefault();
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // 根据点击的导航项执行相应操作
    const icon = event.currentTarget.querySelector('.material-icons').textContent;
    switch (icon) {
        case 'home':
            window.location.href = 'index.html';
            break;
        case 'history':
            window.location.href = 'income-expenses.html';
            break;
        case 'add':
            showAddTransactionModal();
            break;
        case 'search':
            showSearchModal();
            break;
        case 'person':
            window.location.href = 'profile.html';
            break;
    }
}

// 处理快捷功能按钮点击
function handleQuickAction(event) {
    event.preventDefault();
    const action = event.currentTarget.querySelector('.action-label').textContent;
    switch (action) {
        case '收支记录':
            window.location.href = 'income-expenses.html';
            break;
        case '信用卡':
            window.location.href = 'credit.html';
            break;
        case '家庭规划':
            window.location.href = 'family.html';
            break;
        case 'AI顾问':
            window.location.href = 'advisor.html';
            break;
    }
}

// 处理通知按钮点击
function handleNotifications() {
    const panel = document.getElementById('notificationPanel');
    panel.classList.add('show');
    
    // 初始化通知面板
    initializeNotificationPanel(panel);
}

// 初始化通知面板
function initializeNotificationPanel(panel) {
    // 设置关闭按钮事件
    const closeButton = panel.querySelector('.close-panel');
    closeButton.addEventListener('click', () => closeNotificationPanel(panel));
    
    // 初始化筛选器
    initializeNotificationFilters(panel);
    
    // 初始化通知项点击事件
    initializeNotificationItems(panel);
    
    // 更新未读通知数量
    updateNotificationBadge();
}

// 关闭通知面板
function closeNotificationPanel(panel) {
    panel.classList.remove('show');
}

// 初始化通知筛选器
function initializeNotificationFilters(panel) {
    const filterButtons = panel.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除其他按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active类
            button.classList.add('active');
            
            // 筛选通知
            filterNotifications(button.dataset.filter);
        });
    });
}

// 筛选通知
function filterNotifications(filter) {
    const notifications = document.querySelectorAll('.notification-item');
    notifications.forEach(notification => {
        switch (filter) {
            case 'unread':
                notification.style.display = notification.classList.contains('unread') ? '' : 'none';
                break;
            case 'important':
                notification.style.display = notification.classList.contains('important') ? '' : 'none';
                break;
            default:
                notification.style.display = '';
        }
    });
}

// 初始化通知项点击事件
function initializeNotificationItems(panel) {
    const notificationItems = panel.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', () => {
            // 如果是未读通知，标记为已读
            if (item.classList.contains('unread')) {
                markNotificationAsRead(item);
            }
            
            // 处理通知点击事件
            handleNotificationClick(item);
        });
    });
}

// 标记通知为已读
function markNotificationAsRead(notification) {
    notification.classList.remove('unread');
    updateNotificationBadge();
}

// 更新通知徽章
function updateNotificationBadge() {
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    const badge = document.querySelector('.notification-badge');
    
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? '' : 'none';
    }
}

// 处理通知点击事件
function handleNotificationClick(notification) {
    // 获取通知类型和内容
    const title = notification.querySelector('.notification-title span:first-child').textContent;
    const text = notification.querySelector('.notification-text').textContent;
    
    // 根据不同类型的通知执行相应操作
    if (title.includes('信用卡还款')) {
        window.location.href = 'credit.html';
    } else if (title.includes('支出分析')) {
        window.location.href = 'income-expenses.html';
    } else if (title.includes('储蓄目标')) {
        window.location.href = 'family.html';
    } else if (title.includes('理财建议')) {
        window.location.href = 'advisor.html';
    }
    
    // 关闭通知面板
    closeNotificationPanel(document.getElementById('notificationPanel'));
}

// 处理查看详情按钮点击
function handleViewDetails() {
    // TODO: 实现资产详情显示逻辑
    console.log('显示资产详情');
}

// 处理查看全部交易按钮点击
function handleViewAllTransactions() {
    window.location.href = 'income-expenses.html';
}

// 处理查看更多AI建议按钮点击
function handleViewAllInsights() {
    window.location.href = 'advisor.html';
}

// 显示添加交易的模态框
function showAddTransactionModal() {
    const modal = document.getElementById('addTransactionModal');
    modal.classList.add('show');
    
    // 设置默认日期为今天
    document.getElementById('date').valueAsDate = new Date();
    
    // 初始化交易类型选择器
    initializeTypeSelector();
    
    // 添加模态框事件监听器
    setupModalEventListeners(modal);
}

// 初始化交易类型选择器
function initializeTypeSelector() {
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除其他按钮的active类
            typeButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active类
            this.classList.add('active');
            
            // 更新类别选项
            updateCategoryOptions(this.dataset.type);
        });
    });
}

// 更新类别选项
function updateCategoryOptions(type) {
    const categorySelect = document.getElementById('category');
    const expenseGroup = categorySelect.querySelector('optgroup[label="支出类别"]');
    const incomeGroup = categorySelect.querySelector('optgroup[label="收入类别"]');
    
    if (type === 'expense') {
        expenseGroup.style.display = '';
        incomeGroup.style.display = 'none';
    } else {
        expenseGroup.style.display = 'none';
        incomeGroup.style.display = '';
    }
    
    // 重置选择
    categorySelect.value = '';
}

// 设置模态框事件监听器
function setupModalEventListeners(modal) {
    // 关闭按钮事件
    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal(modal);
        });
    });
    
    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // 表单提交事件
    const form = modal.querySelector('#transactionForm');
    form.addEventListener('submit', handleTransactionSubmit);
}

// 关闭模态框
function closeModal(modal) {
    modal.classList.remove('show');
    // 重置表单
    const form = modal.querySelector('#transactionForm');
    form.reset();
}

// 处理交易表单提交
function handleTransactionSubmit(event) {
    event.preventDefault();
    
    // 获取表单数据
    const formData = new FormData(event.target);
    const transactionData = {
        type: document.querySelector('.type-btn.active').dataset.type,
        amount: formData.get('amount'),
        category: formData.get('category'),
        date: formData.get('date'),
        description: formData.get('description') || '未添加描述'
    };
    
    // TODO: 发送数据到服务器
    console.log('提交的交易数据:', transactionData);
    
    // 关闭模态框
    const modal = document.getElementById('addTransactionModal');
    closeModal(modal);
    
    // 显示成功提示
    showToast('交易已添加');
}

// 显示提示消息
function showToast(message) {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 添加显示类
    setTimeout(() => toast.classList.add('show'), 100);
    
    // 3秒后移除
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 显示搜索模态框
function showSearchModal() {
    const modal = document.getElementById('searchModal');
    modal.classList.add('show');
    
    // 初始化搜索模态框
    initializeSearchModal(modal);
}

// 初始化搜索模态框
function initializeSearchModal(modal) {
    // 设置关闭按钮事件
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => closeModal(modal));
    
    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // 初始化筛选器
    initializeFilters(modal);
    
    // 初始化搜索输入
    initializeSearchInput(modal);
    
    // 显示空状态
    showNoResults();
}

// 初始化筛选器
function initializeFilters(modal) {
    const chipGroups = modal.querySelectorAll('.chip-group');
    chipGroups.forEach(group => {
        const chips = group.querySelectorAll('.chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                // 移除同组其他选项的active类
                chips.forEach(c => c.classList.remove('active'));
                // 添加当前选项的active类
                chip.classList.add('active');
                // 执行搜索
                performSearch();
            });
        });
    });
}

// 初始化搜索输入
function initializeSearchInput(modal) {
    const searchInput = modal.querySelector('#searchInput');
    let debounceTimer;
    
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch();
        }, 300);
    });
}

// 执行搜索
function performSearch() {
    const searchInput = document.querySelector('#searchInput');
    const query = searchInput.value.trim().toLowerCase();
    const type = document.querySelector('.chip-group .chip.active[data-type]').dataset.type;
    const period = document.querySelector('.chip-group .chip.active[data-period]').dataset.period;
    
    // 模拟搜索结果数据
    const mockData = getMockSearchResults(query, type, period);
    
    if (mockData.length > 0) {
        displaySearchResults(mockData);
    } else {
        showNoResults();
    }
}

// 获取模拟搜索结果
function getMockSearchResults(query, type, period) {
    // 模拟数据
    const mockTransactions = [
        {
            id: 1,
            type: 'expense',
            category: '餐饮',
            amount: -286.50,
            description: '超市购物',
            date: '2024-03-20',
            icon: 'shopping_cart'
        },
        {
            id: 2,
            type: 'income',
            category: '工资',
            amount: 12500.00,
            description: '工资收入',
            date: '2024-03-19',
            icon: 'account_balance'
        },
        {
            id: 3,
            type: 'expense',
            category: '餐饮',
            amount: -45.00,
            description: '午餐',
            date: '2024-03-19',
            icon: 'restaurant'
        }
    ];
    
    // 根据查询条件筛选
    return mockTransactions.filter(transaction => {
        const matchesQuery = query === '' ||
            transaction.description.toLowerCase().includes(query) ||
            transaction.category.toLowerCase().includes(query) ||
            Math.abs(transaction.amount).toString().includes(query);
            
        const matchesType = type === 'all' || transaction.type === type;
        
        // 简单的时间范围筛选
        const matchesPeriod = period === 'all'; // 这里简化处理，实际应该根据日期判断
        
        return matchesQuery && matchesType && matchesPeriod;
    });
}

// 显示搜索结果
function displaySearchResults(results) {
    const resultsList = document.querySelector('.results-list');
    const resultsCount = document.querySelector('.results-count');
    
    // 更新结果数量
    resultsCount.textContent = `${results.length} 条记录`;
    
    // 清空现有结果
    resultsList.innerHTML = '';
    
    // 添加新结果
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="result-icon ${result.type}">
                <i class="material-icons">${result.icon}</i>
            </div>
            <div class="result-info">
                <div class="result-main">
                    <span class="merchant">${result.description}</span>
                    <span class="amount ${result.type}">${result.amount > 0 ? '+' : ''}¥${Math.abs(result.amount).toFixed(2)}</span>
                </div>
                <div class="result-details">
                    <span class="category">${result.category}</span>
                    <span class="date">${formatDate(result.date)}</span>
                </div>
            </div>
        `;
        resultsList.appendChild(resultItem);
    });
}

// 显示无结果状态
function showNoResults() {
    const resultsList = document.querySelector('.results-list');
    const resultsCount = document.querySelector('.results-count');
    
    resultsCount.textContent = '0 条记录';
    resultsList.innerHTML = `
        <div class="no-results">
            <i class="material-icons">search_off</i>
            <p>未找到匹配的交易记录</p>
        </div>
    `;
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

// 初始化图表
function initializeCharts() {
    // 初始化资产趋势图表
    const balanceCtx = document.getElementById('balanceChart').getContext('2d');
    new Chart(balanceCtx, {
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

    // 初始化支出分析图表
    const spendingCtx = document.getElementById('spendingChart').getContext('2d');
    new Chart(spendingCtx, {
        type: 'doughnut',
        data: {
            labels: ['餐饮', '交通', '购物', '娱乐', '其他'],
            datasets: [{
                data: [30, 20, 25, 15, 10],
                backgroundColor: [
                    '#4F46E5',
                    '#10B981',
                    '#F59E0B',
                    '#EC4899',
                    '#6B7280'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}