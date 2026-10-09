// Smart Farm Dashboard JS
window.sfOpenTab = function(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("sf-tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("sf-tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    var target = document.getElementById(tabName);
    if (target) {
        target.style.display = "block";
    }
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active");
    } else {
        var matchingBtn = document.querySelector('.sf-tab-btn[onclick*="' + tabName + '"]');
        if (matchingBtn) {
            matchingBtn.classList.add("active");
        }
    }
    // Update Header Title & Status Badge based on active tab
    var pageTitleEl = document.getElementById("sf-page-title");
    var pageBadgeEl = document.getElementById("sf-page-badge");
    var tabInfo = {
        'tab-overview': { title: 'Tổng quan trang trại', showBadge: true },
        'tab-tasks': { title: 'Quản lý công việc', showBadge: false },
        'tab-map': { title: 'Bản đồ nông trại', showBadge: false },
        'tab-inventory': { title: 'Kho vật tư & Sản phẩm', showBadge: false }
    };
    var currentInfo = tabInfo[tabName] || { title: 'Tổng quan trang trại', showBadge: false };
    if (pageTitleEl) {
        pageTitleEl.textContent = currentInfo.title;
    }
    if (pageBadgeEl) {
        pageBadgeEl.style.display = currentInfo.showBadge ? 'inline-flex' : 'none';
    }

    try {
        localStorage.setItem('sf_active_tab', tabName);
    } catch(e) {}
};

// Go to Overview Tab
window.sfGoToOverview = function(event) {
    if (event) {
        event.preventDefault();
    }
    window.sfOpenTab(null, 'tab-overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Dropdown Toggle (Click-based)
window.sfToggleDropdown = function(event, menuId) {
    if (event) {
        event.stopPropagation();
    }
    var targetMenu = document.getElementById(menuId);
    if (!targetMenu) return;
    var isOpen = targetMenu.classList.contains('show');
    
    // Close all open dropdowns first
    var allDropdowns = document.querySelectorAll('.sf-dropdown-menu');
    for (var i = 0; i < allDropdowns.length; i++) {
        allDropdowns[i].classList.remove('show');
    }
    var allWrappers = document.querySelectorAll('.sf-dropdown-wrapper');
    for (var j = 0; j < allWrappers.length; j++) {
        allWrappers[j].classList.remove('open');
    }
    
    // Toggle requested menu
    if (!isOpen) {
        targetMenu.classList.add('show');
        var wrapper = targetMenu.closest('.sf-dropdown-wrapper');
        if (wrapper) {
            wrapper.classList.add('open');
        }
    }
};

window.sfOpenNotifications = function(event) {
    if (event) {
        event.stopPropagation();
    }
    var targetMenu = document.getElementById('sf-notif-menu');
    var notifBtn = document.getElementById('sf-notif-btn');

    // Close other dropdowns
    var allDropdowns = document.querySelectorAll('.sf-dropdown-menu');
    for (var i = 0; i < allDropdowns.length; i++) {
        if (allDropdowns[i] !== targetMenu) {
            allDropdowns[i].classList.remove('show');
        }
    }
    var allWrappers = document.querySelectorAll('.sf-dropdown-wrapper');
    for (var j = 0; j < allWrappers.length; j++) {
        allWrappers[j].classList.remove('open');
    }

    if (targetMenu) {
        targetMenu.classList.add('show');
        var wrapper = targetMenu.closest('.sf-dropdown-wrapper');
        if (wrapper) {
            wrapper.classList.add('open');
        }
    }

    if (notifBtn) {
        notifBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
};

// Close all dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.sf-dropdown-wrapper')) {
        var allDropdowns = document.querySelectorAll('.sf-dropdown-menu');
        for (var i = 0; i < allDropdowns.length; i++) {
            allDropdowns[i].classList.remove('show');
        }
        var allWrappers = document.querySelectorAll('.sf-dropdown-wrapper');
        for (var j = 0; j < allWrappers.length; j++) {
            allWrappers[j].classList.remove('open');
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    var dataElement = document.getElementById('sf-chart-data');
    if (dataElement) {
        try {
            var rawData = dataElement.getAttribute('data-chart');
            var chartData = JSON.parse(rawData);
            
            if (chartData.labels && chartData.labels.length > 0) {
                var ctx = document.getElementById('historyChart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: chartData.labels,
                        datasets: [
                            {
                                label: 'Nhiệt độ (°C)',
                                data: chartData.temps,
                                borderColor: '#ff6b6b',
                                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                yAxisID: 'y',
                                tension: 0.4,
                                fill: true
                            },
                            {
                                label: 'Độ ẩm (%)',
                                data: chartData.hums,
                                borderColor: '#4dabf7',
                                backgroundColor: 'rgba(77, 171, 247, 0.1)',
                                yAxisID: 'y1',
                                tension: 0.4,
                                fill: true
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            mode: 'index',
                            intersect: false,
                        },
                        scales: {
                            y: {
                                type: 'linear',
                                display: true,
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Nhiệt độ (°C)'
                                }
                            },
                            y1: {
                                type: 'linear',
                                display: true,
                                position: 'right',
                                title: {
                                    display: true,
                                    text: 'Độ ẩm (%)'
                                },
                                grid: {
                                    drawOnChartArea: false,
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                            }
                        }
                    }
                });
            }
        } catch (e) {
            console.error("Error parsing chart data: ", e);
        }
    }

    // Restore saved active tab
    try {
        var savedTab = localStorage.getItem('sf_active_tab');
        if (savedTab && document.getElementById(savedTab)) {
            window.sfOpenTab(null, savedTab);
        } else {
            window.sfOpenTab(null, 'tab-overview');
        }
    } catch(e) {}

    // Init Drag and Drop for Tasks
    if (window.sfInitTaskDragAndDrop) {
        window.sfInitTaskDragAndDrop();
    }
});

// Profile Modal Functions
window.sfOpenProfileModal = function() {
    // Close any open dropdowns first
    var allDropdowns = document.querySelectorAll('.sf-dropdown-menu');
    for (var i = 0; i < allDropdowns.length; i++) {
        allDropdowns[i].classList.remove('show');
    }
    var allWrappers = document.querySelectorAll('.sf-dropdown-wrapper');
    for (var j = 0; j < allWrappers.length; j++) {
        allWrappers[j].classList.remove('open');
    }

    var modal = document.getElementById('sf-profile-modal');
    if (modal) {
        modal.style.display = 'flex';
        var alertBox = document.getElementById('sf-profile-alert');
        if (alertBox) {
            alertBox.style.display = 'none';
        }
        var passInput = document.getElementById('sf-prof-pass');
        var passConfirmInput = document.getElementById('sf-prof-pass-confirm');
        if (passInput) passInput.value = '';
        if (passConfirmInput) passConfirmInput.value = '';
    }
};

window.sfCloseProfileModal = function(e) {
    if (e && e.target && e.target !== e.currentTarget && e.target.id !== 'sf-profile-modal') {
        return;
    }
    var modal = document.getElementById('sf-profile-modal');
    if (modal) {
        modal.style.display = 'none';
    }
};

window.sfSaveProfile = function(event) {
    if (event) {
        event.preventDefault();
    }
    var nameInput = document.getElementById('sf-prof-name');
    var phoneInput = document.getElementById('sf-prof-phone');
    var emailInput = document.getElementById('sf-prof-email');
    var passInput = document.getElementById('sf-prof-pass');
    var passConfirmInput = document.getElementById('sf-prof-pass-confirm');

    var name = (nameInput ? nameInput.value : '').trim();
    var phone = (phoneInput ? phoneInput.value : '').trim();
    var email = (emailInput ? emailInput.value : '').trim();
    var pass = passInput ? passInput.value : '';
    var passConfirm = passConfirmInput ? passConfirmInput.value : '';
    var btn = document.getElementById('sf-btn-save-profile');

    if (!name) {
        sfShowProfileAlert('Họ và tên không được để trống.', 'danger');
        return;
    }
    if (!email) {
        sfShowProfileAlert('Email đăng nhập không được để trống.', 'danger');
        return;
    }
    if (pass || passConfirm) {
        if (pass.length < 6) {
            sfShowProfileAlert('Mật khẩu mới phải có tối thiểu 6 ký tự.', 'danger');
            return;
        }
        if (pass !== passConfirm) {
            sfShowProfileAlert('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.', 'danger');
            return;
        }
    }

    if (btn) {
        btn.disabled = true;
        var btnText = btn.querySelector('.sf-btn-text');
        if (btnText) btnText.innerText = 'Đang lưu...';
    }

    fetch('/smart_farm/profile/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            phone: phone,
            email: email,
            password: pass
        })
    })
    .then(function(res) {
        return res.json();
    })
    .then(function(data) {
        if (btn) {
            btn.disabled = false;
            var btnText = btn.querySelector('.sf-btn-text');
            if (btnText) btnText.innerText = 'Lưu thay đổi';
        }
        if (data.success) {
            sfShowProfileAlert(data.message || 'Cập nhật hồ sơ thành công!', 'success');
            // Update top bar text immediately
            var topName = document.getElementById('sf-top-user-name');
            var topEmail = document.getElementById('sf-top-user-email');
            if (topName) topName.innerText = name;
            if (topEmail) topEmail.innerText = email;
            setTimeout(function() {
                sfCloseProfileModal();
            }, 1200);
        } else {
            sfShowProfileAlert(data.message || 'Có lỗi xảy ra khi lưu.', 'danger');
        }
    })
    .catch(function(err) {
        if (btn) {
            btn.disabled = false;
            var btnText = btn.querySelector('.sf-btn-text');
            if (btnText) btnText.innerText = 'Lưu thay đổi';
        }
        sfShowProfileAlert('Lỗi kết nối máy chủ: ' + err, 'danger');
    });
};

function sfShowProfileAlert(msg, type) {
    var alertBox = document.getElementById('sf-profile-alert');
    if (!alertBox) return;
    alertBox.className = 'sf-alert sf-alert-' + type;
    alertBox.innerText = msg;
    alertBox.style.display = 'block';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        var profileModal = document.getElementById('sf-profile-modal');
        if (profileModal && profileModal.style.display === 'flex') {
            profileModal.style.display = 'none';
        }
        var taskModal = document.getElementById('sf-task-modal');
        if (taskModal && taskModal.style.display === 'flex') {
            taskModal.style.display = 'none';
        }
    }
});

// Helper to sync task status between Overview card and Management tab
function sfSyncTaskUI(taskId, isDone, counts) {
    // 1. Overview card row
    var ovRow = document.getElementById('sf-task-' + taskId);
    if (ovRow) {
        var ovCheck = ovRow.querySelector('.sf-check');
        var ovText = ovRow.querySelector('.sf-task-text');
        if (ovCheck && ovText) {
            if (isDone) {
                ovCheck.classList.add('done');
                ovCheck.innerText = '✓';
                ovText.classList.add('done');
            } else {
                ovCheck.classList.remove('done');
                ovCheck.innerText = '';
                ovText.classList.remove('done');
            }
        }
    }

    // 2. Management tab card
    var mgmtCard = document.getElementById('sf-mgmt-task-' + taskId);
    if (mgmtCard) {
        var mgCheck = mgmtCard.querySelector('.sf-check');
        var mgTitle = mgmtCard.querySelector('.sf-task-title-text');
        mgmtCard.dataset.status = isDone ? 'done' : 'pending';
        if (mgCheck && mgTitle) {
            if (isDone) {
                mgCheck.classList.add('done');
                mgCheck.innerText = '✓';
                mgTitle.classList.add('done');
            } else {
                mgCheck.classList.remove('done');
                mgCheck.innerText = '';
                mgTitle.classList.remove('done');
            }
        }
    }

    // 3. Overview counters
    var doneStat = document.getElementById('sf-task-stat-done');
    var remainingStat = document.getElementById('sf-task-stat-remaining');
    if (counts && counts.task_done !== undefined && counts.task_remaining !== undefined) {
        if (doneStat) doneStat.innerText = '✓ ' + counts.task_done + ' hoàn thành';
        if (remainingStat) remainingStat.innerText = counts.task_remaining + ' còn lại';
    } else {
        var allDone = document.querySelectorAll('#sf-task-mgmt-list .sf-task-card[data-status="done"]').length;
        var allTotal = document.querySelectorAll('#sf-task-mgmt-list .sf-task-card').length;
        if (!allTotal) {
            allTotal = document.querySelectorAll('#sf-task-list .sf-task').length;
            allDone = document.querySelectorAll('#sf-task-list .sf-check.done').length;
        }
        var remaining = Math.max(0, allTotal - allDone);
        if (doneStat) doneStat.innerText = '✓ ' + allDone + ' hoàn thành';
        if (remainingStat) remainingStat.innerText = remaining + ' còn lại';
    }

    // 4. Management view done counter
    var allDoneCards = document.querySelectorAll('#sf-task-mgmt-list .sf-task-card[data-status="done"]');
    var doneBadge = document.getElementById('sf-count-done-text');
    if (doneBadge) {
        doneBadge.innerText = '✓ ' + allDoneCards.length + ' hoàn thành';
    }

    // Re-filter if in management view
    if (window.sfFilterTasks) {
        window.sfFilterTasks();
    }
}

// Toggle Task from Overview Card
window.sfToggleTask = function(taskId, element) {
    if (!taskId) return;
    var taskRow = document.getElementById('sf-task-' + taskId);
    if (!taskRow) return;
    var checkEl = taskRow.querySelector('.sf-check');
    var currentlyDone = checkEl ? checkEl.classList.contains('done') : false;
    var nextState = !currentlyDone;

    // Optimistic UI
    sfSyncTaskUI(taskId, nextState);

    fetch('/smart_farm/api/task/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success) {
            sfSyncTaskUI(taskId, data.is_done, data);
            if (data.alert && window.sfPushNotification) {
                window.sfPushNotification(data.alert, data.unresolved_count);
            }
        } else {
            // Revert
            sfSyncTaskUI(taskId, currentlyDone);
            alert(data.message || 'Lỗi khi cập nhật công việc.');
        }
    })
    .catch(function(err) {
        // Revert
        sfSyncTaskUI(taskId, currentlyDone);
        console.error('Error toggling task:', err);
    });
};

// Toggle Task from Management Tab
window.sfToggleMgmtTask = function(taskId, element) {
    if (!taskId) return;
    var mgmtCard = document.getElementById('sf-mgmt-task-' + taskId);
    if (!mgmtCard) return;
    var isDone = mgmtCard.dataset.status === 'done';
    var nextState = !isDone;

    // Optimistic UI
    sfSyncTaskUI(taskId, nextState);

    fetch('/smart_farm/api/task/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success) {
            sfSyncTaskUI(taskId, data.is_done, data);
            if (data.alert && window.sfPushNotification) {
                window.sfPushNotification(data.alert, data.unresolved_count);
            }
        } else {
            // Revert
            sfSyncTaskUI(taskId, isDone);
            alert(data.message || 'Lỗi khi cập nhật công việc.');
        }
    })
    .catch(function(err) {
        // Revert
        sfSyncTaskUI(taskId, isDone);
        console.error('Error toggling task:', err);
    });
};

// Search & Filter in Task Management
window.sfCurrentStatusFilter = 'all';

window.sfSetStatusFilter = function(status, btn) {
    window.sfCurrentStatusFilter = status;
    var pills = document.querySelectorAll('#sf-status-filter-pills .sf-filter-pill');
    pills.forEach(function(p) { p.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    window.sfFilterTasks();
};

window.sfFilterTasks = function() {
    var searchInput = document.getElementById('sf-task-search-input');
    var clearBtn = document.getElementById('sf-search-clear-btn');
    var categorySelect = document.getElementById('sf-task-category-filter');
    var emptyState = document.getElementById('sf-task-empty-state');
    var visibleCountEl = document.getElementById('sf-count-visible');

    var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (clearBtn) {
        clearBtn.style.display = query ? 'block' : 'none';
    }

    var selectedCategory = categorySelect ? categorySelect.value : 'all';
    var statusFilter = window.sfCurrentStatusFilter || 'all';

    var cards = document.querySelectorAll('#sf-task-mgmt-list .sf-task-card');
    var visibleCount = 0;

    cards.forEach(function(card) {
        var cardStatus = card.dataset.status || 'pending';
        var cardType = card.dataset.type || '';
        var cardName = (card.dataset.name || '').toLowerCase();
        var cardNotes = (card.dataset.notes || '').toLowerCase();

        var matchesStatus = (statusFilter === 'all') || (cardStatus === statusFilter);
        var matchesCategory = (selectedCategory === 'all') || (cardType === selectedCategory);
        var matchesQuery = !query || cardName.includes(query) || cardNotes.includes(query);

        if (matchesStatus && matchesCategory && matchesQuery) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (visibleCountEl) {
        visibleCountEl.innerText = visibleCount;
    }
    if (emptyState) {
        emptyState.style.display = (visibleCount === 0 && cards.length > 0) ? 'block' : 'none';
    }
};

window.sfClearTaskSearch = function() {
    var searchInput = document.getElementById('sf-task-search-input');
    if (searchInput) searchInput.value = '';
    window.sfFilterTasks();
};

window.sfResetTaskFilters = function() {
    var searchInput = document.getElementById('sf-task-search-input');
    if (searchInput) searchInput.value = '';
    var catSelect = document.getElementById('sf-task-category-filter');
    if (catSelect) catSelect.value = 'all';
    var defaultPill = document.querySelector('#sf-status-filter-pills [data-filter="all"]');
    window.sfSetStatusFilter('all', defaultPill);
};

// Task Modal (Open, Close, Save)
window.sfOpenTaskModal = function(taskId) {
    var modal = document.getElementById('sf-task-modal');
    if (!modal) return;

    var alertBox = document.getElementById('sf-task-modal-alert');
    if (alertBox) alertBox.style.display = 'none';

    var formId = document.getElementById('sf-task-form-id');
    var nameInput = document.getElementById('sf-task-name-input');
    var typeInput = document.getElementById('sf-task-type-input');
    var dateInput = document.getElementById('sf-task-date-input');
    var notesInput = document.getElementById('sf-task-notes-input');
    var modalTitle = document.getElementById('sf-task-modal-title');
    var modalSub = document.getElementById('sf-task-modal-sub');
    var saveText = document.getElementById('sf-task-save-text');

    if (taskId) {
        // Edit mode
        var card = document.getElementById('sf-mgmt-task-' + taskId);
        if (!card) return;

        formId.value = taskId;
        nameInput.value = card.dataset.name || '';
        typeInput.value = card.dataset.type || 'irrigation';
        dateInput.value = card.dataset.date || '';
        notesInput.value = card.dataset.notes || '';

        modalTitle.innerText = 'Chỉnh sửa công việc';
        modalSub.innerText = 'Cập nhật nội dung hoặc trạng thái của công việc này';
        saveText.innerText = 'Cập nhật công việc';
    } else {
        // Create mode
        formId.value = '';
        nameInput.value = '';
        typeInput.value = 'irrigation';
        var today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        notesInput.value = '';

        modalTitle.innerText = 'Thêm công việc mới';
        modalSub.innerText = 'Điền thông tin chi tiết để lên lịch công việc nông trại';
        saveText.innerText = 'Lưu công việc';
    }

    modal.style.display = 'flex';
    nameInput.focus();
};

window.sfCloseTaskModal = function(e) {
    if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('sf-modal-close')) {
        return;
    }
    var modal = document.getElementById('sf-task-modal');
    if (modal) modal.style.display = 'none';
};

window.sfSaveTask = function(event) {
    if (event) event.preventDefault();

    var formId = document.getElementById('sf-task-form-id').value;
    var name = document.getElementById('sf-task-name-input').value.trim();
    var taskType = document.getElementById('sf-task-type-input').value;
    var dateVal = document.getElementById('sf-task-date-input').value;
    var notes = document.getElementById('sf-task-notes-input').value.trim();
    var saveBtn = document.getElementById('sf-task-save-btn');
    var saveText = document.getElementById('sf-task-save-text');
    var alertBox = document.getElementById('sf-task-modal-alert');

    if (!name) {
        if (alertBox) {
            alertBox.className = 'sf-alert sf-alert-danger';
            alertBox.innerText = 'Vui lòng nhập tiêu đề công việc.';
            alertBox.style.display = 'block';
        }
        return;
    }

    var isEdit = !!formId;
    var url = isEdit ? '/smart_farm/api/task/update' : '/smart_farm/api/task/create';
    var payload = {
        name: name,
        task_type: taskType,
        date: dateVal,
        notes: notes
    };
    if (isEdit) {
        payload.task_id = parseInt(formId);
    }

    saveBtn.disabled = true;
    saveText.innerText = isEdit ? 'Đang cập nhật...' : 'Đang tạo...';

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        saveBtn.disabled = false;
        saveText.innerText = isEdit ? 'Cập nhật công việc' : 'Lưu công việc';

        if (data.success) {
            // Keep tab-tasks active and reload to synchronize perfectly with server state
            localStorage.setItem('sf_active_tab', 'tab-tasks');
            window.location.reload();
        } else {
            if (alertBox) {
                alertBox.className = 'sf-alert sf-alert-danger';
                alertBox.innerText = data.message || 'Lỗi khi lưu công việc.';
                alertBox.style.display = 'block';
            }
        }
    })
    .catch(function(err) {
        saveBtn.disabled = false;
        saveText.innerText = isEdit ? 'Cập nhật công việc' : 'Lưu công việc';
        if (alertBox) {
            alertBox.className = 'sf-alert sf-alert-danger';
            alertBox.innerText = 'Lỗi kết nối máy chủ.';
            alertBox.style.display = 'block';
        }
        console.error('Error saving task:', err);
    });
};

window.sfDeleteTask = function(taskId) {
    if (!taskId) return;
    if (!confirm('Bạn có chắc chắn muốn xóa công việc này khỏi hệ thống?')) return;

    fetch('/smart_farm/api/task/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success) {
            var card = document.getElementById('sf-mgmt-task-' + taskId);
            if (card) {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(function() {
                    card.remove();
                    window.sfFilterTasks();
                    var totalEl = document.getElementById('sf-count-total');
                    if (totalEl) {
                        var current = parseInt(totalEl.innerText) || 1;
                        totalEl.innerText = Math.max(0, current - 1);
                    }
                }, 150);
            }
            var overviewTask = document.getElementById('sf-task-' + taskId);
            if (overviewTask) overviewTask.remove();

            setTimeout(function() {
                var allCards = document.querySelectorAll('#sf-task-mgmt-list .sf-task-card');
                var allDone = document.querySelectorAll('#sf-task-mgmt-list .sf-task-card[data-status="done"]').length;
                var total = allCards.length;
                var remaining = Math.max(0, total - allDone);
                var doneStat = document.getElementById('sf-task-stat-done');
                var remainingStat = document.getElementById('sf-task-stat-remaining');
                if (doneStat) doneStat.innerText = '✓ ' + allDone + ' hoàn thành';
                if (remainingStat) remainingStat.innerText = remaining + ' còn lại';

                var ovList = document.getElementById('sf-task-list');
                if (ovList && ovList.querySelectorAll('.sf-task').length === 0) {
                    ovList.innerHTML = '<div id="sf-task-empty-ov" style="text-align:center;padding:24px 0;color:#94a3b8;font-size:12px;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:6px;display:inline-block;color:#cbd5e1;"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg><div>Chưa có công việc nào</div></div>';
                }
            }, 200);
        } else {
            alert(data.message || 'Không thể xóa công việc.');
        }
    })
    .catch(function(err) {
        console.error('Error deleting task:', err);
        alert('Lỗi kết nối khi xóa công việc.');
    });
};

// Drag and Drop implementation
window.sfInitTaskDragAndDrop = function() {
    var container = document.getElementById('sf-task-mgmt-list');
    if (!container) return;

    var draggingElement = null;

    container.addEventListener('dragstart', function(e) {
        var card = e.target.closest('.sf-task-card');
        if (!card) return;
        draggingElement = card;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', card.dataset.taskId);
    });

    container.addEventListener('dragend', function(e) {
        var card = e.target.closest('.sf-task-card') || draggingElement;
        if (card) {
            card.classList.remove('dragging');
        }
        var allCards = container.querySelectorAll('.sf-task-card');
        allCards.forEach(function(c) { c.classList.remove('drag-over'); });
        draggingElement = null;

        // Persist new order to server
        var taskIds = [];
        container.querySelectorAll('.sf-task-card').forEach(function(c) {
            var tid = parseInt(c.dataset.taskId);
            if (tid) taskIds.push(tid);
        });

        if (taskIds.length > 0) {
            fetch('/smart_farm/api/task/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_ids: taskIds })
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (!data.success) {
                    console.error('Lỗi khi lưu thứ tự:', data.message);
                }
            })
            .catch(function(err) {
                console.error('Lỗi kết nối khi lưu thứ tự:', err);
            });
        }
    });

    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!draggingElement) return;

        var afterElement = sfGetDragAfterElement(container, e.clientY);
        if (afterElement == null) {
            container.appendChild(draggingElement);
        } else {
            container.insertBefore(draggingElement, afterElement);
        }
    });
};

function sfGetDragAfterElement(container, y) {
    var draggableElements = [...container.querySelectorAll('.sf-task-card:not(.dragging)')];

    return draggableElements.reduce(function(closest, child) {
        var box = child.getBoundingClientRect();
        var offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ========================================================
// Interactive Smart Farm Map JS (Feature 002)
// ========================================================

// 1. Map Layer Toggle (T006)
window.sfToggleMapLayer = function(layerName, btn) {
    if (!btn) return;
    var isActive = btn.classList.toggle('active');
    var targetElements = document.querySelectorAll('.sf-layer-' + layerName);
    targetElements.forEach(function(el) {
        el.style.display = isActive ? '' : 'none';
    });
};

// 2. Vehicle Marker & Popover (T008)
window.sfShowVehicleInfo = function(event, vehicleId) {
    if (event) event.stopPropagation();
    var popover = document.getElementById('sf-vehicle-popover');
    if (!popover) return;

    var marker = event.currentTarget || event.target.closest('.sf-vehicle-marker');
    if (marker) {
        var rect = marker.getBoundingClientRect();
        var mapWrapper = document.getElementById('sf-map-wrapper');
        var mapRect = mapWrapper.getBoundingClientRect();

        var leftPos = rect.left - mapRect.left - 100;
        var topPos = rect.top - mapRect.top - 180;

        if (leftPos < 10) leftPos = 10;
        if (topPos < 10) topPos = 10;

        popover.style.left = leftPos + 'px';
        popover.style.top = topPos + 'px';
    }
    popover.style.display = 'block';
    window.sfHideAlertDetails();
};

window.sfHideVehicleInfo = function() {
    var popover = document.getElementById('sf-vehicle-popover');
    if (popover) popover.style.display = 'none';
};

// 3. Alert Beacon & Resolution (T010)
var currentAlertBeaconEl = null;
var currentAlertId = null;

window.sfOnAlertClick = function(event, el) {
    if (!el && event) {
        el = event.currentTarget || event.target.closest('.sf-alert-beacon');
    }
    if (!el) return;
    var alertId = el.getAttribute('data-id');
    var name = el.getAttribute('data-name');
    var area = el.getAttribute('data-area');
    var content = el.getAttribute('data-content');
    window.sfShowAlertDetails(event, alertId, name, area, content);
};

window.sfShowAlertDetails = function(event, alertId, name, area, content) {
    if (event) event.stopPropagation();
    currentAlertId = alertId;
    currentAlertBeaconEl = event.currentTarget || event.target.closest('.sf-alert-beacon');

    var popover = document.getElementById('sf-alert-popover');
    if (!popover) return;

    document.getElementById('sf-alert-pop-name').textContent = name || 'Cảnh báo nông trại';
    document.getElementById('sf-alert-pop-area').textContent = area || 'Toàn trang trại';
    document.getElementById('sf-alert-pop-content').textContent = content || 'Cần kiểm tra sự cố.';

    if (currentAlertBeaconEl) {
        var rect = currentAlertBeaconEl.getBoundingClientRect();
        var mapWrapper = document.getElementById('sf-map-wrapper');
        var mapRect = mapWrapper.getBoundingClientRect();

        var leftPos = rect.left - mapRect.left - 100;
        var topPos = rect.top - mapRect.top - 160;
        if (leftPos < 10) leftPos = 10;
        if (topPos < 10) topPos = 10;

        popover.style.left = leftPos + 'px';
        popover.style.top = topPos + 'px';
    }
    popover.style.display = 'block';
    window.sfHideVehicleInfo();
};

window.sfHideAlertDetails = function() {
    var popover = document.getElementById('sf-alert-popover');
    if (popover) popover.style.display = 'none';
    currentAlertId = null;
    currentAlertBeaconEl = null;
};

// Simulate sensor threshold alert for Demo & Testing
window.sfSimulateSensorAlert = function(zone, sensorType) {
    var zones = ['A', 'B', 'C'];
    var types = ['temp', 'moisture', 'ec', 'ph'];

    if (!zone) {
        zone = zones[Math.floor(Math.random() * zones.length)];
    }
    if (!sensorType) {
        sensorType = types[Math.floor(Math.random() * types.length)];
    }

    var alertPayload = {
        name: '',
        content: '',
        alert_type: 'danger',
        area: 'Khu ' + zone
    };

    if (sensorType === 'temp') {
        var tempVal = (37.5 + Math.random() * 2.5).toFixed(1);
        alertPayload.name = 'Cảnh báo nhiệt độ cao Khu ' + zone;
        alertPayload.content = 'Nhiệt độ môi trường đạt ' + tempVal + '°C vượt ngưỡng an toàn (32°C). Cần bật quạt thông gió làm mát!';
        alertPayload.alert_type = 'danger';
    } else if (sensorType === 'moisture') {
        var moistVal = (25 + Math.random() * 8).toFixed(0);
        alertPayload.name = 'Độ ẩm đất thấp Khu ' + zone;
        alertPayload.content = 'Độ ẩm đất tụt xuống ' + moistVal + '% dưới mức tối thiểu (45%). Đất khô hạn, cần kích hoạt tưới tiêu!';
        alertPayload.alert_type = 'warning';
    } else if (sensorType === 'ec') {
        alertPayload.name = 'Nồng độ dinh dưỡng bất thường Khu ' + zone;
        alertPayload.content = 'Chỉ số EC đạt 2.9 mS/cm vượt ngưỡng cho phép (2.2 mS/cm). Cần kiểm tra bồn pha phân bón NPK.';
        alertPayload.alert_type = 'warning';
    } else {
        alertPayload.name = 'Độ pH dung dịch vượt chuẩn Khu ' + zone;
        alertPayload.content = 'Độ pH rễ cây đạt 7.4 (chuẩn 5.8 - 6.5). Nguy cơ hạn chế hấp thu vi lượng.';
        alertPayload.alert_type = 'warning';
    }

    fetch('/smart_farm/api/alert/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertPayload)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success && data.alert) {
            // 1. Push real-time notification to Bell & Dashboard card & Toast
            if (window.sfPushNotification) {
                window.sfPushNotification(data.alert, data.unresolved_count);
            }

            // 2. Add dynamic Beacon on Map
            var mapWrapper = document.getElementById('sf-map-wrapper');
            if (mapWrapper) {
                var posStyle = 'left: 48%; top: 38%;';
                if (zone === 'A') posStyle = 'left: 22%; top: 34%;';
                else if (zone === 'C') posStyle = 'left: 82%; top: 58%;';

                var beaconId = 'sf-map-beacon-' + data.alert.id;
                var existingBeacon = document.getElementById(beaconId);
                if (!existingBeacon) {
                    var isDanger = data.alert.alert_type === 'danger';
                    var beaconHtml = '<div class="sf-map-layer-item sf-layer-alerts sf-alert-beacon ' + (isDanger ? 'beacon-danger' : 'beacon-warning') + '" ' +
                        'id="' + beaconId + '" ' +
                        'style="' + posStyle + '" ' +
                        'data-id="' + data.alert.id + '" ' +
                        'data-name="' + (data.alert.name || '') + '" ' +
                        'data-area="' + (data.alert.area || '') + '" ' +
                        'data-content="' + (data.alert.content || '') + '" ' +
                        'onclick="sfOnAlertClick(event, this)" ' +
                        'title="⚠️ Sự cố: ' + (data.alert.name || '') + ' (Nhấp xử lý)">' +
                        '<div class="sf-beacon-pulse"></div>' +
                        '<span class="sf-beacon-icon">⚠️</span>' +
                        '<span class="sf-beacon-badge-text">' + (data.alert.name.substring(0, 16)) + '...</span>' +
                    '</div>';
                    mapWrapper.insertAdjacentHTML('beforeend', beaconHtml);
                }
            }

            // 3. Update alert count badge on Map Topbar layer button
            var alertLayerCount = document.querySelector('#layer-alerts-btn .sf-layer-count');
            if (alertLayerCount && typeof data.unresolved_count !== 'undefined') {
                alertLayerCount.textContent = data.unresolved_count;
            }
        }
    })
    .catch(function(err) {
        console.error('Error simulating sensor alert:', err);
    });
};

// Floating Toast Notification System with countdown progress bar
window.sfShowToast = function(options, type) {
    var title = '';
    var message = '';
    var toastType = 'success';
    var duration = 4000;

    if (typeof options === 'string') {
        title = options;
        message = '';
        toastType = type || 'success';
    } else if (typeof options === 'object' && options !== null) {
        title = options.title || options.name || '';
        message = options.message || options.content || '';
        toastType = options.type || options.alert_type || type || 'success';
        if (options.duration) duration = options.duration;
    }

    if (!title && !message) return;

    var container = document.getElementById('sf-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'sf-toast-container';
        container.className = 'sf-toast-container';
        document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.className = 'sf-toast sf-toast-' + toastType;

    // SVG icon matching the user sample screenshot
    var iconSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    if (toastType === 'error' || toastType === 'danger') {
        iconSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else if (toastType === 'warning') {
        iconSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    } else if (toastType === 'info') {
        iconSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    var descHtml = message ? '<div class="sf-toast-desc">' + message + '</div>' : '';

    toast.innerHTML =
        '<div class="sf-toast-icon">' + iconSvg + '</div>' +
        '<div class="sf-toast-body">' +
            '<div class="sf-toast-title">' + title + '</div>' +
            descHtml +
        '</div>' +
        '<button type="button" class="sf-toast-close" title="Đóng">&times;</button>' +
        '<div class="sf-toast-progress-track">' +
            '<div class="sf-toast-progress-bar" style="animation-duration: ' + duration + 'ms;"></div>' +
        '</div>';

    var closeBtn = toast.querySelector('.sf-toast-close');
    if (closeBtn) {
        closeBtn.onclick = function() {
            toast.classList.add('sf-toast-hiding');
            setTimeout(function() {
                if (toast && toast.parentNode) toast.remove();
            }, 250);
        };
    }

    container.appendChild(toast);

    setTimeout(function() {
        if (toast && toast.parentNode) {
            toast.classList.add('sf-toast-hiding');
            setTimeout(function() {
                if (toast && toast.parentNode) toast.remove();
            }, 300);
        }
    }, duration);
};

// Push real-time notification to UI
window.sfPushNotification = function(alertData, unresolvedCount) {
    if (!alertData) return;

    // 1. Update dropdown list
    var notifList = document.getElementById('sf-notif-items');
    if (notifList) {
        // Remove empty state if present
        var emptyState = document.getElementById('sf-notif-empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        // Determine icon box styling and svg
        var iconBoxClass = 'icon-info';
        var iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';

        if (alertData.alert_type === 'danger') {
            iconBoxClass = 'icon-danger';
            iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
        } else if (alertData.alert_type === 'warning') {
            iconBoxClass = 'icon-warning';
            iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
        }

        var timeText = alertData.timestamp || 'Vừa xong';
        var areaHtml = alertData.area ? ' · <span class="sf-notif-area">' + alertData.area + '</span>' : '';

        var itemHtml = '<div class="sf-notif-item unresolved sf-notif-new-highlight" id="sf-notif-alert-' + alertData.id + '">' +
            '<div class="sf-notif-icon-box ' + iconBoxClass + '">' + iconSvg + '</div>' +
            '<div class="sf-notif-content">' +
                '<div class="sf-notif-msg">' + (alertData.name || 'Thông báo mới') + '</div>' +
                '<div class="sf-notif-meta">' +
                    '<span class="sf-notif-time">' + timeText + '</span>' + areaHtml +
                '</div>' +
            '</div>' +
            '<div class="sf-notif-action">' +
                '<button type="button" class="sf-btn-resolve-single" onclick="sfResolveAlert(' + alertData.id + ')" title="Đánh dấu đã xử lý">Xử lý</button>' +
            '</div>' +
        '</div>';

        // Prepend to dropdown list
        notifList.insertAdjacentHTML('afterbegin', itemHtml);

        // Cap at 15 items to keep DOM performant
        var currentItems = notifList.querySelectorAll('.sf-notif-item');
        if (currentItems.length > 15) {
            currentItems[currentItems.length - 1].remove();
        }
    }

    // 2. Update dashboard card list ("Cảnh báo & Log")
    var dashList = document.getElementById('sf-dash-alert-list');
    if (dashList) {
        var emptyDash = document.getElementById('sf-dash-alert-empty');
        if (emptyDash) {
            emptyDash.remove();
        }
        var dotType = alertData.alert_type || 'info';
        var dashItemHtml = '<div class="sf-alert-item sf-notif-new-highlight" id="sf-dash-alert-' + alertData.id + '">' +
            '<div class="sf-alert-dot dot-' + dotType + '"></div>' +
            '<div style="flex:1;">' +
                '<div class="sf-alert-text">' + (alertData.name || 'Thông báo mới') + '</div>' +
                '<div class="sf-alert-time">' + (alertData.timestamp || 'Vừa xong') + (alertData.area ? ' · ' + alertData.area : '') + '</div>' +
            '</div>' +
            '<button type="button" class="sf-btn-resolve-dash" onclick="sfResolveAlert(' + alertData.id + ')" title="Giải quyết cảnh báo">Xử lý</button>' +
        '</div>';
        dashList.insertAdjacentHTML('afterbegin', dashItemHtml);
        var dashItems = dashList.querySelectorAll('.sf-alert-item');
        if (dashItems.length > 3) {
            dashItems[dashItems.length - 1].remove();
        }
    }

    // 3. Update badge and top stats
    var count = typeof unresolvedCount !== 'undefined' ? unresolvedCount : 1;
    if (window.sfUpdateAlertsUI) {
        window.sfUpdateAlertsUI(count);
    }

    // 4. Trigger Toast Notification with bottom progress bar matching reference screenshot
    if (typeof window.sfShowToast === 'function') {
        window.sfShowToast({
            title: alertData.name || 'Thông báo mới',
            message: alertData.content || (alertData.area ? 'Khu vực: ' + alertData.area : ''),
            type: alertData.alert_type || 'info'
        });
    }
};

// Centralized Alert UI updater
window.sfUpdateAlertsUI = function(unresolvedCount, resolvedId) {
    // 1. Update Header Notification Badge
    var badge = document.getElementById('sf-notif-badge');
    if (badge) {
        badge.innerText = unresolvedCount;
        if (unresolvedCount > 0) {
            badge.classList.remove('sf-badge-hidden');
        } else {
            badge.classList.add('sf-badge-hidden');
        }
    }

    // 2. Update Header Pill Count in Dropdown
    var pill = document.getElementById('sf-notif-pill-count');
    if (pill) {
        pill.innerText = unresolvedCount + ' chưa xử lý';
    }

    // 3. Update Resolve All Button
    var btnResolveAll = document.getElementById('sf-btn-resolve-all');
    if (btnResolveAll) {
        btnResolveAll.style.display = unresolvedCount > 0 ? '' : 'none';
    }

    // 4. Update Top Dashboard Stat Card
    var statCount = document.getElementById('sf-top-stat-alert-count');
    var statSub = document.getElementById('sf-top-stat-alert-sub');
    if (statCount) {
        statCount.innerText = unresolvedCount;
    }
    if (statSub) {
        if (unresolvedCount > 0) {
            statSub.className = 'sf-stat-sub warn';
            statSub.innerText = 'Cần xử lý';
        } else {
            statSub.className = 'sf-stat-sub ok';
            statSub.innerText = 'Tất cả đã xử lý';
        }
    }

    // 5. Update Specific Alert Item or All Items
    if (resolvedId) {
        // Notification dropdown item
        var notifItem = document.getElementById('sf-notif-alert-' + resolvedId);
        if (notifItem) {
            notifItem.classList.remove('unresolved');
            notifItem.classList.add('resolved');
            var actBox = notifItem.querySelector('.sf-notif-action');
            if (actBox) {
                actBox.innerHTML = '<span class="sf-badge-resolved">Đã xong</span>';
            }
        }

        // Dashboard alert card item
        var dashItem = document.getElementById('sf-dash-alert-' + resolvedId);
        if (dashItem) {
            var text = dashItem.querySelector('.sf-alert-text');
            if (text) text.classList.add('sf-resolved');
            var btn = dashItem.querySelector('.sf-btn-resolve-dash');
            if (btn) {
                btn.outerHTML = '<span class="sf-dash-resolved-tag">Đã xong</span>';
            }
        }
    } else if (unresolvedCount === 0) {
        // All alerts resolved
        var notifItems = document.querySelectorAll('.sf-notif-item');
        notifItems.forEach(function(item) {
            item.classList.remove('unresolved');
            item.classList.add('resolved');
            var actBox = item.querySelector('.sf-notif-action');
            if (actBox) {
                actBox.innerHTML = '<span class="sf-badge-resolved">Đã xong</span>';
            }
        });

        var dashItems = document.querySelectorAll('.sf-alert-item');
        dashItems.forEach(function(item) {
            var text = item.querySelector('.sf-alert-text');
            if (text) text.classList.add('sf-resolved');
            var btn = item.querySelector('.sf-btn-resolve-dash');
            if (btn) {
                btn.outerHTML = '<span class="sf-dash-resolved-tag">Đã xong</span>';
            }
        });
    }

    // 6. Map beacons & count
    var mapAlertCount = document.querySelector('.sf-layer-count.count-danger');
    if (mapAlertCount) {
        mapAlertCount.innerText = unresolvedCount;
    }
};

window.sfResolveAlert = function(alertId) {
    if (!alertId) return;

    fetch('/smart_farm/api/alert/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: alertId })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success) {
            if (window.sfShowToast) {
                window.sfShowToast(data.message || 'Đã xử lý cảnh báo thành công!', 'success');
            }
            window.sfUpdateAlertsUI(data.unresolved_count, alertId);
            var beacon = document.querySelector('.sf-alert-beacon[data-id="' + alertId + '"]');
            if (beacon) beacon.remove();
        } else {
            if (window.sfShowToast) {
                window.sfShowToast(data.message || 'Không thể xử lý cảnh báo', 'error');
            } else {
                alert(data.message || 'Không thể xử lý cảnh báo');
            }
        }
    })
    .catch(function(err) {
        console.error('Error resolving alert:', err);
        if (window.sfShowToast) {
            window.sfShowToast('Lỗi kết nối máy chủ!', 'error');
        }
    });
};

window.sfResolveAllAlerts = function() {
    if (!confirm('Bạn có chắc chắn muốn đánh dấu đã xử lý tất cả cảnh báo?')) return;

    fetch('/smart_farm/api/alert/resolve_all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success) {
            if (window.sfShowToast) {
                window.sfShowToast(data.message || 'Đã xử lý tất cả cảnh báo!', 'success');
            }
            window.sfUpdateAlertsUI(0);
            var beacons = document.querySelectorAll('.sf-alert-beacon');
            beacons.forEach(function(b) { b.remove(); });
        } else {
            if (window.sfShowToast) {
                window.sfShowToast(data.message || 'Không thể xử lý cảnh báo', 'error');
            } else {
                alert(data.message || 'Không thể xử lý tất cả cảnh báo');
            }
        }
    })
    .catch(function(err) {
        console.error('Error resolving all alerts:', err);
    });
};

window.sfResolveAlertFromPopover = function() {
    if (!currentAlertId) return;
    window.sfResolveAlert(currentAlertId);
    window.sfHideAlertDetails();
};

// 4. Centralized Device Store & Persistent State Management (T013)
window.sfDeviceStore = (function() {
    var stored = null;
    try {
        var raw = localStorage.getItem('sf_device_store_v2');
        if (raw) stored = JSON.parse(raw);
    } catch(e) {}

    var defaults = {
        'A': {
            drip: true,
            dripRate: 'standard', // 'slow' (20ml), 'standard' (50ml), 'boost' (100ml)
            dripInterval: '4h',
            sprinkler: false,
            sprinklerAmount: '5L',
            sprinklerDuration: '15m',
            fert: true,
            fertEc: 1.8,
            mist: true,
            fan: true,
            shade: false
        },
        'B': { drip: false, fert: false },
        'C': { pump: true, aerator: true },
        plants: {}
    };

    var current = Object.assign({}, defaults, stored || {});
    current['A'] = Object.assign({}, defaults['A'], (stored && stored['A']) || {});
    if (!current.plants) current.plants = {};

    function save() {
        try {
            localStorage.setItem('sf_device_store_v2', JSON.stringify(current));
        } catch(e) {}
    }

    return {
        get: function(zone, device) {
            if (!current[zone]) return false;
            return current[zone][device] !== undefined ? current[zone][device] : false;
        },
        set: function(zone, device, value) {
            if (!current[zone]) current[zone] = {};
            current[zone][device] = value;
            save();
        },
        getPlant: function(plantId) {
            return current.plants[plantId] || null;
        },
        setPlant: function(plantId, data) {
            current.plants[plantId] = Object.assign({}, current.plants[plantId] || {}, data);
            save();
        },
        getAll: function() {
            return current;
        }
    };
})();

// Zone Drawer & Device Controls
window.sfOpenZoneDrawer = function(zoneId) {
    var drawer = document.getElementById('sf-zone-drawer');
    var backdrop = document.getElementById('sf-drawer-backdrop');
    if (!drawer) return;

    var lvl3D = document.getElementById('sf-map-level-greenhouse-3d');
    var lvlZA = document.getElementById('sf-map-level-zone-a');
    var is3D = (lvl3D && lvl3D.style.display !== 'none') || (lvlZA && lvlZA.style.display !== 'none');
    if (backdrop) {
        if (is3D) {
            backdrop.classList.add('sf-3d-clean');
            backdrop.style.pointerEvents = 'none';
        } else {
            backdrop.classList.remove('sf-3d-clean');
            backdrop.style.pointerEvents = 'auto';
        }
    }

    var zones = {
        'A': {
            title: 'Khu A - Nhà màng công nghệ cao',
            sub: 'Mô hình canh tác dưa lưới & cà chua thủy canh',
            badgetext: '🌱 Nhà màng CNC (Tự động)',
            badgeBg: '#f0fdf4',
            badgeColor: '#16a34a',
            moisture: '72%',
            moisturePct: 72,
            temp: '27.5°C',
            hum: '68%',
            lux: '8,400',
            devices: [
                {
                    id: 'drip',
                    name: 'Hệ thống tưới nhỏ giọt tự động',
                    sub: 'Cấp ẩm rễ đều đặn • Bù ẩm chính xác theo độ ẩm giá thể',
                    icon: '💧',
                    hasSubcontrols: true,
                    subcontrolsType: 'drip'
                },
                {
                    id: 'sprinkler',
                    name: 'Hệ thống tưới phun mưa tự động',
                    sub: 'Tưới rau & làm mát tán lá định kỳ hàng ngày',
                    icon: '🚿',
                    hasSubcontrols: true,
                    subcontrolsType: 'sprinkler'
                },
                {
                    id: 'fert',
                    name: 'Hệ thống châm dinh dưỡng NPK',
                    sub: 'Bơm định lượng hòa tan vi lượng vào dòng nước tưới',
                    icon: '🧪'
                },
                {
                    id: 'mist',
                    name: 'Hệ thống phun sương làm mát',
                    sub: 'Hạ nhiệt độ & bổ sung độ ẩm vi khí hậu trần',
                    icon: '💨'
                },
                {
                    id: 'fan',
                    name: 'Quạt thông gió đối lưu',
                    sub: 'Lưu thông không khí tươi trong toàn bộ nhà kính',
                    icon: '🌀'
                },
                {
                    id: 'shade',
                    name: 'Hệ thống mái che tự động',
                    sub: 'Lưới dệt Aluminet giảm bức xạ nhiệt buổi trưa',
                    icon: '⛺'
                }
            ]
        },
        'B': {
            title: 'Khu B - Cánh đồng mở (Canh tác rộng)',
            sub: 'Khu vực trồng ngô sinh khối & rau màu hữu cơ',
            badgetext: '🌾 Cánh đồng mở (Cần tưới)',
            badgeBg: '#fffbeb',
            badgeColor: '#b45309',
            moisture: '38%',
            moisturePct: 38,
            temp: '31.2°C',
            hum: '74%',
            lux: '11,200',
            devices: [
                { id: 'drip', name: 'Hệ thống tưới nhỏ giọt ngầm', sub: 'Van tưới điện từ thông minh Zone B', icon: '💧' },
                { id: 'fert', name: 'Hệ thống châm phân bón tự động', sub: 'Bơm định lượng Venturi hòa tan', icon: '🌱' }
            ]
        },
        'C': {
            title: 'Khu C - Hồ chứa & Vườn cây ăn trái',
            sub: 'Hồ tích trữ nước mưa & vườn bưởi da xanh',
            badgetext: '🌊 Hồ chứa & Thủy lợi (Đầy)',
            badgeBg: '#f0f9ff',
            badgeColor: '#0284c7',
            moisture: '81%',
            moisturePct: 81,
            temp: '29.0°C',
            hum: '82%',
            lux: '7,800',
            devices: [
                { id: 'pump', name: 'Trạm máy bơm cấp nước hồ chứa', sub: 'Công suất 15kW bơm nước lên kênh dẫn', icon: '🌊' },
                { id: 'aerator', name: 'Máy sục khí đáy hồ sinh học', sub: 'Tăng lượng oxy hòa tan trong nước', icon: '🫧' }
            ]
        }
    };

    var z = zones[zoneId] || zones['A'];
    var titleEl = document.getElementById('sf-zd-title');
    var subEl = document.getElementById('sf-zd-sub');
    var badgeEl = document.getElementById('sf-zd-badge');
    var badgeTextEl = document.getElementById('sf-zd-badgetext');
    var moistureEl = document.getElementById('sf-zd-moisture');
    var moistureBarEl = document.getElementById('sf-zd-moisture-bar');
    var tempEl = document.getElementById('sf-zd-temp');
    var humEl = document.getElementById('sf-zd-hum');
    var luxEl = document.getElementById('sf-zd-lux');

    if (titleEl) titleEl.textContent = z.title;
    if (subEl) subEl.textContent = z.sub;
    if (badgeEl) {
        badgeEl.style.background = z.badgeBg;
        badgeEl.style.color = z.badgeColor;
    }
    if (badgeTextEl) badgeTextEl.textContent = z.badgetext;
    if (moistureEl) moistureEl.textContent = z.moisture;
    if (moistureBarEl) {
        moistureBarEl.style.width = z.moisturePct + '%';
        moistureBarEl.style.background = z.badgeColor;
    }
    if (tempEl) tempEl.textContent = z.temp;
    if (humEl) humEl.textContent = z.hum;
    if (luxEl) luxEl.textContent = z.lux + ' lux';

    var controlsContainer = document.getElementById('sf-zd-controls');
    if (controlsContainer) {
        controlsContainer.innerHTML = '';
        z.devices.forEach(function(dev) {
            var card = document.createElement('div');
            card.className = 'sf-device-card';
            card.id = 'dev-card-' + dev.id;
            var isRunning = window.sfDeviceStore.get(zoneId, dev.id);
            var stateText = isRunning ? 'ĐANG CHẠY' : 'ĐANG TẮT';
            var stateClass = isRunning ? 'active' : 'inactive';

            var subcontrolsHtml = '';
            if (dev.subcontrolsType === 'drip') {
                var currentRate = window.sfDeviceStore.get(zoneId, 'dripRate') || 'standard';
                var currentInterval = window.sfDeviceStore.get(zoneId, 'dripInterval') || '4h';
                subcontrolsHtml = 
                    '<div class="sf-device-subcontrols" id="subctrl-drip" style="' + (isRunning ? 'display:flex;' : 'display:none;') + '">' +
                        '<div class="sf-subctrl-row">' +
                            '<div class="sf-subctrl-label-wrap">' +
                                '<span class="sf-subctrl-icon">💧</span>' +
                                '<span class="sf-subctrl-label">Mức nhỏ giọt:</span>' +
                            '</div>' +
                            '<select class="sf-subctrl-select" onchange="sfUpdateSubSetting(\'' + zoneId + '\', \'dripRate\', this.value)">' +
                                '<option value="slow"' + (currentRate === 'slow' ? ' selected' : '') + '>Chậm (20ml/h)</option>' +
                                '<option value="standard"' + (currentRate === 'standard' ? ' selected' : '') + '>Tiêu chuẩn (50ml/h)</option>' +
                                '<option value="boost"' + (currentRate === 'boost' ? ' selected' : '') + '>Bù ẩm nhanh (100ml/h)</option>' +
                            '</select>' +
                        '</div>' +
                        '<div class="sf-subctrl-row">' +
                            '<div class="sf-subctrl-label-wrap">' +
                                '<span class="sf-subctrl-icon">🕒</span>' +
                                '<span class="sf-subctrl-label">Chu kỳ tưới:</span>' +
                            '</div>' +
                            '<select class="sf-subctrl-select" onchange="sfUpdateSubSetting(\'' + zoneId + '\', \'dripInterval\', this.value)">' +
                                '<option value="2h"' + (currentInterval === '2h' ? ' selected' : '') + '>Mỗi 2 giờ/lần</option>' +
                                '<option value="4h"' + (currentInterval === '4h' ? ' selected' : '') + '>Mỗi 4 giờ/lần</option>' +
                                '<option value="auto"' + (currentInterval === 'auto' ? ' selected' : '') + '>Tự động theo ẩm rễ (&lt;65%)</option>' +
                            '</select>' +
                        '</div>' +
                    '</div>';
            } else if (dev.subcontrolsType === 'sprinkler') {
                var currentAmount = window.sfDeviceStore.get(zoneId, 'sprinklerAmount') || '5L';
                var currentDuration = window.sfDeviceStore.get(zoneId, 'sprinklerDuration') || '15m';
                subcontrolsHtml = 
                    '<div class="sf-device-subcontrols" id="subctrl-sprinkler" style="' + (isRunning ? 'display:flex;' : 'display:none;') + '">' +
                        '<div class="sf-subctrl-row">' +
                            '<div class="sf-subctrl-label-wrap">' +
                                '<span class="sf-subctrl-icon">🚿</span>' +
                                '<span class="sf-subctrl-label">Lượng nước tưới:</span>' +
                            '</div>' +
                            '<select class="sf-subctrl-select" onchange="sfUpdateSubSetting(\'' + zoneId + '\', \'sprinklerAmount\', this.value)">' +
                                '<option value="3L"' + (currentAmount === '3L' ? ' selected' : '') + '>3 Lít/m² (Nhẹ)</option>' +
                                '<option value="5L"' + (currentAmount === '5L' ? ' selected' : '') + '>5 Lít/m² (Tiêu chuẩn)</option>' +
                                '<option value="8L"' + (currentAmount === '8L' ? ' selected' : '') + '>8 Lít/m² (Đẫm nước)</option>' +
                            '</select>' +
                        '</div>' +
                        '<div class="sf-subctrl-row">' +
                            '<div class="sf-subctrl-label-wrap">' +
                                '<span class="sf-subctrl-icon">⏱️</span>' +
                                '<span class="sf-subctrl-label">Thời gian tưới:</span>' +
                            '</div>' +
                            '<select class="sf-subctrl-select" onchange="sfUpdateSubSetting(\'' + zoneId + '\', \'sprinklerDuration\', this.value)">' +
                                '<option value="10m"' + (currentDuration === '10m' ? ' selected' : '') + '>10 phút mỗi ca</option>' +
                                '<option value="15m"' + (currentDuration === '15m' ? ' selected' : '') + '>15 phút mỗi ca</option>' +
                                '<option value="30m"' + (currentDuration === '30m' ? ' selected' : '') + '>30 phút mỗi ca</option>' +
                            '</select>' +
                        '</div>' +
                    '</div>';
            }

            card.innerHTML =
                '<div class="sf-device-main-row">' +
                    '<div class="sf-device-info">' +
                        '<div class="sf-device-icon">' + dev.icon + '</div>' +
                        '<div class="sf-device-meta">' +
                            '<div class="sf-device-title-row">' +
                                '<span class="sf-device-name">' + dev.name + '</span>' +
                                '<span class="sf-device-status-badge ' + stateClass + '" id="dev-badge-' + dev.id + '">' + stateText + '</span>' +
                            '</div>' +
                            '<div class="sf-device-sub">' + dev.sub + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<label class="sf-switch">' +
                        '<input type="checkbox" ' + (isRunning ? 'checked' : '') + ' onchange="sfToggleDevice(\'' + zoneId + '\', \'' + dev.id + '\', this)"/>' +
                        '<span class="sf-slider"></span>' +
                    '</label>' +
                '</div>' +
                subcontrolsHtml;
            controlsContainer.appendChild(card);
        });
    }

    drawer.style.display = 'flex';
    if (backdrop) backdrop.style.display = 'block';
    setTimeout(function() {
        drawer.classList.add('show');
        if (backdrop) backdrop.classList.add('show');
    }, 10);
};

window.sfUpdateSubSetting = function(zone, key, val) {
    window.sfDeviceStore.set(zone, key, val);
    window.sfShowToast('✓ Đã cập nhật: ' + val, 'success');
};

window.sfCloseZoneDrawer = function() {
    var drawer = document.getElementById('sf-zone-drawer');
    var backdrop = document.getElementById('sf-drawer-backdrop');
    if (drawer) drawer.classList.remove('show');
    if (backdrop) backdrop.classList.remove('show');
    setTimeout(function() {
        if (drawer && !drawer.classList.contains('show')) drawer.style.display = 'none';
        if (backdrop && !backdrop.classList.contains('show')) {
            backdrop.style.display = 'none';
            backdrop.classList.remove('sf-3d-clean');
        }
    }, 350);
};

window.sfToggleDevice = function(zone, device, checkboxEl) {
    var isChecked = checkboxEl.checked;
    window.sfDeviceStore.set(zone, device, isChecked);

    var badge = document.getElementById('dev-badge-' + device);
    if (badge) {
        badge.textContent = isChecked ? 'ĐANG CHẠY' : 'ĐANG TẮT';
        badge.className = 'sf-device-status-badge ' + (isChecked ? 'active' : 'inactive');
    }

    // Toggle subcontrols
    var subctrl = document.getElementById('subctrl-' + device);
    if (subctrl) {
        subctrl.style.display = isChecked ? 'flex' : 'none';
    }

    // 2-way Sync to 3D Digital Twin if active
    if (window.sf3D && window.sf3D.state) {
        if (device === 'mist' || device === 'misting' || device === 'phun_suong') {
            window.sf3D.state.misting = isChecked;
            if (window.sf3D.mistingSystem) {
                window.sf3D.mistingSystem.visible = isChecked;
            }
            var stMist = document.getElementById('sf-3d-status-misting');
            if (stMist) {
                stMist.textContent = isChecked ? 'ĐANG PHUN' : 'ĐANG TẮT';
                stMist.style.color = isChecked ? '#16a34a' : '#64748b';
            }
        } else if (device === 'fan' || device === 'quat') {
            window.sf3D.state.fan = isChecked;
            var stFan = document.getElementById('sf-3d-status-fan');
            if (stFan) {
                stFan.textContent = isChecked ? 'ĐANG CHẠY' : 'ĐANG TẮT';
                stFan.style.color = isChecked ? '#16a34a' : '#64748b';
            }
        } else if (device === 'shade' || device === 'mai_che') {
            window.sf3D.state.shade = isChecked;
            if (window.sf3D.shadeScreen) {
                window.sf3D.shadeScreen.visible = isChecked;
            }
        } else if (device === 'drip') {
            window.sf3D.state.drip = isChecked;
            if (window.sf3D.dripDrops) {
                window.sf3D.dripDrops.visible = isChecked;
            }
        } else if (device === 'sprinkler') {
            window.sf3D.state.sprinkler = isChecked;
            if (window.sf3D.sprinklerSystem) {
                window.sf3D.sprinklerSystem.visible = isChecked;
            }
        } else if (device === 'fert' || device === 'npk' || device === 'phan_bon') {
            window.sf3D.state.fert = isChecked;
            if (window.sf3D.fertSystem) {
                window.sf3D.fertSystem.visible = isChecked;
            }
        }
    }

    fetch('/smart_farm/api/zone/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone: zone, device: device, state: isChecked })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success) {
            if (data.alert && window.sfPushNotification) {
                window.sfPushNotification(data.alert, data.unresolved_count);
            } else if (typeof window.sfShowToast === 'function') {
                window.sfShowToast({
                    title: 'Điều khiển thiết bị',
                    message: data.message,
                    type: 'success'
                });
            }
        } else {
            if (typeof window.sfShowToast === 'function') {
                window.sfShowToast({
                    title: 'Lỗi điều khiển thiết bị',
                    message: data.message || 'Lỗi khi điều khiển thiết bị',
                    type: 'error'
                });
            }
        }
    })
    .catch(function(err) {
        console.error(err);
        if (typeof window.sfShowToast === 'function') {
            window.sfShowToast('Lỗi kết nối khi gửi lệnh điều khiển!', 'error');
        }
    });
};

/* ==========================================================================
   INDIVIDUAL PLANT INSPECTION & IRRIGATION CONTROLS (TỪNG CÂY RIÊNG LẺ)
   ========================================================================== */

window.sfCurrentPlant = null;

window.sfOpenPlantDrawer = function(plantData) {
    if (!plantData) return;
    window.sfCurrentPlant = plantData;

    var drawer = document.getElementById('sf-plant-drawer');
    var zoneDrawer = document.getElementById('sf-zone-drawer');
    var backdrop = document.getElementById('sf-drawer-backdrop');

    // Nếu Zone Drawer đang mở, đóng ngay để nhường không gian cho bảng cây
    if (zoneDrawer) {
        zoneDrawer.classList.remove('show');
        zoneDrawer.style.display = 'none';
    }

    if (!drawer) {
        console.error('Không tìm thấy element #sf-plant-drawer');
        return;
    }

    if (backdrop) {
        backdrop.classList.add('sf-3d-clean');
        backdrop.style.pointerEvents = 'none';
    }

    // Populate plant values
    var titleEl = document.getElementById('sf-pd-title');
    var subEl = document.getElementById('sf-pd-sub');
    var healthEl = document.getElementById('sf-pd-health');
    var cycleEl = document.getElementById('sf-pd-cycle');
    var cycleBarEl = document.getElementById('sf-pd-cycle-bar');
    var moistureEl = document.getElementById('sf-pd-moisture');
    var moistureBarEl = document.getElementById('sf-pd-moisture-bar');
    var tempEl = document.getElementById('sf-pd-temp');
    var phEl = document.getElementById('sf-pd-ph');
    var ecEl = document.getElementById('sf-pd-ec');
    var luxEl = document.getElementById('sf-pd-lux');
    var brixEl = document.getElementById('sf-pd-brix');

    if (titleEl) titleEl.textContent = (plantData.plantName || 'Cây trồng') + ' #' + (plantData.id || '');
    if (subEl) subEl.textContent = (plantData.bedName || 'Nhà màng CNC') + ' • Giống: ' + (plantData.variety || 'Muskmelon F1');
    if (healthEl) healthEl.textContent = plantData.health || '🟢 Rất khỏe mạnh (Tối ưu)';
    if (cycleEl) cycleEl.textContent = (plantData.age || 45) + ' / 65 ngày (Còn ' + (plantData.harvestDays || 20) + ' ngày)';
    if (cycleBarEl) cycleBarEl.style.width = Math.min(100, Math.round(((plantData.age || 45) / 65) * 100)) + '%';
    if (moistureEl) moistureEl.textContent = (plantData.moisture || 72) + '%';
    if (moistureBarEl) moistureBarEl.style.width = (plantData.moisture || 72) + '%';
    if (tempEl) tempEl.textContent = (plantData.temp || 26.5) + '°C';
    if (phEl) phEl.textContent = (plantData.ph || 6.2) + ' pH';
    if (ecEl) ecEl.textContent = (plantData.ec || 1.8) + ' mS/cm';
    if (luxEl) luxEl.textContent = (plantData.lux || 8400).toLocaleString() + ' lux';
    if (brixEl) brixEl.textContent = (plantData.brix || 14.2) + '° Brix';

    // Load custom plant irrigation settings from store
    var custom = window.sfDeviceStore.getPlant(plantData.id);
    var chk = document.getElementById('sf-pd-override-chk');
    var methodSel = document.getElementById('sf-pd-method-sel');
    var rateSel = document.getElementById('sf-pd-rate-sel');
    var intervalSel = document.getElementById('sf-pd-interval-sel');

    if (chk) chk.checked = custom ? !!custom.override : false;
    if (methodSel && custom) methodSel.value = custom.method || 'drip';
    if (rateSel && custom) rateSel.value = custom.rate || '200ml';
    if (intervalSel && custom) intervalSel.value = custom.interval || '4h';

    window.sfTogglePlantOverride(chk);

    drawer.style.display = 'flex';
    void drawer.offsetWidth; // Force layout reflow
    drawer.classList.add('show');
};

window.sfBackToZoneDrawer = function() {
    window.sfClosePlantDrawer();
    setTimeout(function() {
        window.sfOpenZoneDrawer('A');
    }, 200);
};

window.sfClosePlantDrawer = function() {
    var drawer = document.getElementById('sf-plant-drawer');
    var backdrop = document.getElementById('sf-drawer-backdrop');
    if (drawer) drawer.classList.remove('show');
    if (backdrop) backdrop.classList.remove('show');
    setTimeout(function() {
        if (drawer && !drawer.classList.contains('show')) drawer.style.display = 'none';
        if (backdrop && !backdrop.classList.contains('show')) {
            backdrop.style.display = 'none';
            backdrop.classList.remove('sf-3d-clean');
        }
    }, 350);
};

window.sfTogglePlantOverride = function(chk) {
    var settingsBox = document.getElementById('sf-pd-custom-settings');
    if (!settingsBox) return;
    if (chk && chk.checked) {
        settingsBox.style.opacity = '1';
        settingsBox.style.pointerEvents = 'auto';
    } else {
        settingsBox.style.opacity = '0.75';
    }
};

window.sfSaveCurrentPlantSettings = function() {
    if (!window.sfCurrentPlant) return;
    var chk = document.getElementById('sf-pd-override-chk');
    var methodSel = document.getElementById('sf-pd-method-sel');
    var rateSel = document.getElementById('sf-pd-rate-sel');
    var intervalSel = document.getElementById('sf-pd-interval-sel');

    var data = {
        override: chk ? chk.checked : false,
        method: methodSel ? methodSel.value : 'drip',
        rate: rateSel ? rateSel.value : '200ml',
        interval: intervalSel ? intervalSel.value : '4h'
    };
    window.sfDeviceStore.setPlant(window.sfCurrentPlant.id, data);
};

window.sfWaterSinglePlantNow = function() {
    if (!window.sfCurrentPlant) return;
    var btn = document.getElementById('sf-pd-water-now-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>⏳ Đang tưới nhỏ giọt (150ml)...</span>';
    }

    setTimeout(function() {
        window.sfCurrentPlant.moisture = Math.min(85, window.sfCurrentPlant.moisture + 4);
        var moistureEl = document.getElementById('sf-pd-moisture');
        var moistureBarEl = document.getElementById('sf-pd-moisture-bar');
        if (moistureEl) moistureEl.textContent = window.sfCurrentPlant.moisture + '%';
        if (moistureBarEl) moistureBarEl.style.width = window.sfCurrentPlant.moisture + '%';

        var pName = window.sfCurrentPlant.plantName || 'Dưa lưới Taki';
        var pId = window.sfCurrentPlant.id;
        var pMois = window.sfCurrentPlant.moisture;

        fetch('/smart_farm/api/alert/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Tưới cây thành công: ' + pName + ' #' + pId,
                content: 'Đã hoàn tất cữ tưới 150ml. Độ ẩm rễ hiện tại đạt ' + pMois + '%.',
                alert_type: 'info',
                area: 'Nhà màng GH-01'
            })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data.success && data.alert && window.sfPushNotification) {
                window.sfPushNotification(data.alert, data.unresolved_count);
            } else if (typeof window.sfShowToast === 'function') {
                window.sfShowToast({
                    title: 'Tưới cây thành công (150ml)',
                    message: pName + ' #' + pId + ' • Độ ẩm rễ: ' + pMois + '%',
                    type: 'success'
                });
            }
        })
        .catch(function(e) { console.error('Alert error:', e); });

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<span>✓ Đã hoàn tất cữ tưới (150ml)</span>';
            setTimeout(function() {
                btn.innerHTML = '<span>💧 Kích hoạt tưới ngay cho cây này (150ml)</span>';
            }, 3000);
        }
    }, 1000);
};

window.sfSavePlantAndClose = function() {
    window.sfSaveCurrentPlantSettings();
    window.sfShowToast('✓ Đã lưu cấu hình tưới riêng cho cây!', 'success');
    window.sfClosePlantDrawer();
};


// Dismiss popovers when clicking elsewhere on map
document.addEventListener('click', function(e) {
    if (!e.target.closest('.sf-vehicle-marker') && !e.target.closest('#sf-vehicle-popover')) {
        window.sfHideVehicleInfo();
    }
    if (!e.target.closest('.sf-alert-beacon') && !e.target.closest('#sf-alert-popover')) {
        window.sfHideAlertDetails();
    }
});

/* ==========================================================================
   MULTI-LEVEL MAP NAVIGATION & 3D DIGITAL TWIN GREENHOUSE
   ========================================================================== */

window.sfNavigateMapLevel = function(level, data) {
    var lvlMacro = document.getElementById('sf-map-level-macro');
    var lvlZoneA = document.getElementById('sf-map-level-zone-a');
    var lvl3D = document.getElementById('sf-map-level-greenhouse-3d');
    var titleEl = document.getElementById('sf-map-main-title');
    var subEl = document.getElementById('sf-map-main-sub');

    if (level === 'macro') {
        if (lvlMacro) lvlMacro.style.display = 'block';
        if (lvlZoneA) lvlZoneA.style.display = 'none';
        if (lvl3D) lvl3D.style.display = 'none';
        if (titleEl) titleEl.textContent = 'Bản đồ số nông trại';
        if (subEl) subEl.textContent = 'Hệ thống giám sát vi khí hậu, định vị phương tiện GPS & điều khiển IoT trực tiếp';
        window.sfStop3DLoop();
        window.sfStopZoneA3DLoop();
    } else if (level === 'zone-a') {
        if (lvlMacro) lvlMacro.style.display = 'none';
        if (lvlZoneA) lvlZoneA.style.display = 'block';
        if (lvl3D) lvl3D.style.display = 'none';
        if (titleEl) titleEl.textContent = 'Khu A: High-Tech Glass Greenhouses';
        if (subEl) subEl.textContent = 'Mô hình 3D tổng quan phân khu & hệ thống 12 nhà màng công nghệ cao';
        window.sfStop3DLoop();
        // Initialize Zone A 3D Campus by default
        setTimeout(function() {
            window.sfInitZoneA3D();
        }, 50);
    } else if (level === 'greenhouse-3d') {
        if (lvlMacro) lvlMacro.style.display = 'none';
        if (lvlZoneA) lvlZoneA.style.display = 'none';
        if (lvl3D) lvl3D.style.display = 'block';

        var houseName = (data && data.name) ? data.name : 'Nhà màng 01 (GH-01) - Dưa lưới Nhật Bản CNC';
        var badgeTitle = document.getElementById('sf-3d-title-badge');
        if (badgeTitle) badgeTitle.textContent = houseName + ' • 3D Digital Twin';
        if (titleEl) titleEl.textContent = houseName;
        if (subEl) subEl.textContent = 'Mô hình 3D tương tác bên trong nhà kính • Điều khiển IoT & kiểm tra luống cây';

        window.sfStopZoneA3DLoop();
        setTimeout(function() {
            window.sfInitGreenhouse3D(data || {});
        }, 50);
    }
};

window.sfSwitchZoneAMode = function(mode) {
    var c3d = document.getElementById('sf-zone-a-3d-container');
    var c2d = document.getElementById('sf-zone-a-wrapper');
    var b3d = document.getElementById('sf-za-mode-3d-btn');
    var b2d = document.getElementById('sf-za-mode-2d-btn');

    if (mode === '3d') {
        if (c3d) c3d.style.display = 'block';
        if (c2d) c2d.style.display = 'none';
        if (b3d) b3d.classList.add('active');
        if (b2d) b2d.classList.remove('active');
        window.sfInitZoneA3D();
    } else {
        if (c3d) c3d.style.display = 'none';
        if (c2d) c2d.style.display = 'block';
        if (b3d) b3d.classList.remove('active');
        if (b2d) b2d.classList.add('active');
        window.sfStopZoneA3DLoop();
    }
};

/* ==========================================================================
   ZONE A 3D CAMPUS OVERVIEW (TỔNG THỂ PHÂN KHU A 3D)
   ========================================================================== */

window.sfZoneA3D = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    animId: null,
    greenhouses: [],
    raycaster: null,
    mouse: null
};

window.sfStopZoneA3DLoop = function() {
    if (window.sfZoneA3D && window.sfZoneA3D.animId) {
        cancelAnimationFrame(window.sfZoneA3D.animId);
        window.sfZoneA3D.animId = null;
    }
};

window.sfInitZoneA3D = function() {
    if (typeof THREE === 'undefined') return;

    var container = document.getElementById('sf-zone-a-3d-viewport');
    if (!container) return;

    window.sfStopZoneA3DLoop();

    var width = container.clientWidth || 900;
    var height = container.clientHeight || 600;

    container.innerHTML = '';

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbeafe);
    scene.fog = new THREE.FogExp2(0xdbeafe, 0.007);
    window.sfZoneA3D.scene = scene;

    var camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 800);
    camera.position.set(-36, 48, 62);
    window.sfZoneA3D.camera = camera;

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    window.sfZoneA3D.renderer = renderer;

    var isOrbitingCampus = false;
    var controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2 - 0.05;
        controls.minDistance = 15;
        controls.maxDistance = 150;
        controls.target.set(0, 2, 0);

        controls.addEventListener('start', function() {
            isOrbitingCampus = true;
        });
        controls.addEventListener('end', function() {
            setTimeout(function() {
                isOrbitingCampus = false;
            }, 120);
        });
    }
    window.sfZoneA3D.controls = controls;

    // Lights
    var ambient = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);

    var sun = new THREE.DirectionalLight(0xfffaed, 1.25);
    sun.position.set(40, 70, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    scene.add(sun);

    // 1. Campus Ground Terrain
    var groundGeo = new THREE.PlaneGeometry(120, 100);
    var groundMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.85 });
    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 2. Asphalt Roads & Walkways
    var roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    var roadV = new THREE.Mesh(new THREE.PlaneGeometry(6, 90), roadMat);
    roadV.rotation.x = -Math.PI / 2;
    roadV.position.set(0, 0.03, 0);
    scene.add(roadV);

    var roadH = new THREE.Mesh(new THREE.PlaneGeometry(90, 6), roadMat);
    roadH.rotation.x = -Math.PI / 2;
    roadH.position.set(0, 0.04, 0);
    scene.add(roadH);

    // 3. 16 Modern 3D Greenhouses in 4 Quadrants
    var ghList = [
        // Top-Left Quadrant
        { id: 'GH-01', name: 'Nhà màng 01 (GH-01) - Dưa lưới Nhật Bản CNC', x: -24, z: -22, color: 0xf59e0b, plant: 'Dưa lưới • 26.5°C' },
        { id: 'GH-02', name: 'Nhà màng 02 (GH-02) - Cà chua bi Cherry', x: -10, z: -22, color: 0xef4444, plant: 'Cà chua • 27.0°C' },
        { id: 'GH-05', name: 'Nhà màng 05 (GH-05) - Ớt chuông Sweet Pepper', x: -24, z: -10, color: 0x10b981, plant: 'Ớt chuông • 26.2°C' },
        { id: 'GH-06', name: 'Nhà màng 06 (GH-06) - Rau thủy canh xà lách', x: -10, z: -10, color: 0x22c55e, plant: 'Thủy canh • 25.0°C' },

        // Top-Right Quadrant
        { id: 'GH-03', name: 'Nhà màng 03 (GH-03) - Dâu tây Hàn Quốc', x: 10, z: -22, color: 0xf43f5e, plant: 'Dâu tây • 24.2°C' },
        { id: 'GH-04', name: 'Nhà màng 04 (GH-04) - Dưa lưới Hoàng Kim', x: 24, z: -22, color: 0xf59e0b, plant: 'Dưa lưới • 26.8°C' },
        { id: 'GH-07', name: 'Nhà màng 07 (GH-07) - Cà chua Beef Hà Lan', x: 10, z: -10, color: 0xef4444, plant: 'Cà chua Beef • 26.7°C' },
        { id: 'GH-08', name: 'Nhà màng 08 (GH-08) - Dưa leo Baby', x: 24, z: -10, color: 0x84cc16, plant: 'Dưa leo • 26.4°C' },

        // Bottom-Left Quadrant
        { id: 'GH-09', name: 'Nhà màng 09 (GH-09) - Dưa lưới Taki', x: -24, z: 10, color: 0xf59e0b, plant: 'Dưa lưới • 26.1°C' },
        { id: 'GH-10', name: 'Nhà màng 10 (GH-10) - Nho móng tay', x: -10, z: 10, color: 0x8b5cf6, plant: 'Nho móng tay • 25.8°C' },
        { id: 'GH-13', name: 'Nhà màng 13 (GH-13) - Dưa lưới Honey Globe', x: -24, z: 22, color: 0xf59e0b, plant: 'Dưa lưới • 26.3°C' },
        { id: 'GH-14', name: 'Nhà màng 14 (GH-14) - Cà chua Socola', x: -10, z: 22, color: 0xef4444, plant: 'Cà chua • 26.6°C' },

        // Bottom-Right Quadrant
        { id: 'GH-11', name: 'Nhà màng 11 (GH-11) - Dâu tây Bạch Tuyết', x: 10, z: 10, color: 0xf43f5e, plant: 'Dâu Bạch Tuyết • 23.9°C' },
        { id: 'GH-12', name: 'Nhà màng 12 (GH-12) - Khu ươm giống CNC', x: 24, z: 10, color: 0x10b981, plant: 'Ươm giống • 27.2°C' },
        { id: 'GH-15', name: 'Nhà màng 15 (GH-15) - Dưa lưới Vân Lưới', x: 10, z: 22, color: 0xf59e0b, plant: 'Dưa lưới • 26.9°C' },
        { id: 'GH-16', name: 'Nhà màng 16 (GH-16) - Dưa lưới Kim Cô Nương', x: 24, z: 22, color: 0xf59e0b, plant: 'Dưa lưới • 27.1°C' }
    ];

    window.sfZoneA3D.greenhouses = [];

    var ghBaseMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
    var ghGlassMat = new THREE.MeshStandardMaterial({
        color: 0x7dd3fc,
        transparent: true,
        opacity: 0.55,
        roughness: 0.1,
        metalness: 0.3
    });
    var ghTrussMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.8 });

    ghList.forEach(function(gh) {
        var group = new THREE.Group();
        group.position.set(gh.x, 0, gh.z);

        // Concrete Base
        var base = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.4, 9.6), ghBaseMat);
        base.position.y = 0.2;
        base.castShadow = true;
        group.add(base);

        // Glass Body
        var body = new THREE.Mesh(new THREE.BoxGeometry(9.0, 2.6, 9.4), ghGlassMat);
        body.position.y = 1.7;
        group.add(body);

        // Gable Roof (2 sloped glass roofs)
        var roofL = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.08, 9.4), ghGlassMat);
        roofL.position.set(-2.3, 3.8, 0);
        roofL.rotation.z = -0.38;
        group.add(roofL);

        var roofR = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.08, 9.4), ghGlassMat);
        roofR.position.set(2.3, 3.8, 0);
        roofR.rotation.z = 0.38;
        group.add(roofR);

        // Ridge Beam
        var ridge = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 9.4), ghTrussMat);
        ridge.position.set(0, 4.8, 0);
        group.add(ridge);

        // Miniature Crops inside
        for (var row = -2.8; row <= 2.8; row += 1.8) {
            var plantRow = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 8.0), new THREE.MeshStandardMaterial({ color: 0x16a34a }));
            plantRow.position.set(row, 0.6, 0);
            group.add(plantRow);
        }

        // Raycasting Hit Mesh (Covers the whole house)
        var hit = new THREE.Mesh(new THREE.BoxGeometry(9.8, 5.2, 10.0), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
        hit.position.set(gh.x, 2.6, gh.z);
        hit.userData = {
            id: gh.id,
            name: gh.name,
            plant: gh.plant,
            group: group
        };
        scene.add(hit);
        window.sfZoneA3D.greenhouses.push(hit);

        scene.add(group);
    });

    // 4. Solar Panels Array (Top-Left corner)
    var solarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.8, roughness: 0.2 });
    var solarFrameMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 });
    for (var s = 0; s < 4; s++) {
        var panel = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.1, 2.5), solarMat);
        panel.position.set(-34 + s * 5.2, 1.2, -34);
        panel.rotation.x = -0.45;
        scene.add(panel);

        var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2), solarFrameMat);
        leg.position.set(-34 + s * 5.2, 0.6, -34.8);
        scene.add(leg);
    }

    // 5. Water Storage Reservoir Tanks (Right side - Interactive with Capacity Gauge)
    var tankMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.3 });
    var tankData = [
        { id: 'WT-01', name: '💧 Bồn Chứa Nước Lọc RO #01 (Bể Bắc)', current: 42500, max: 50000, percent: 85, pump: 'Bơm tăng áp: 3.2 bar (Sẵn sàng)', use: 'Cấp nước tưới sạch cho GH-01 đến GH-08' },
        { id: 'WT-02', name: '💧 Bồn Nước Dinh Dưỡng NPK #02', current: 38200, max: 50000, percent: 76, pump: 'Bơm châm Venturi (Đang tưới nhỏ giọt)', use: 'Hòa tan phân vi lượng tự động' },
        { id: 'WT-03', name: '💧 Bồn Thu Gom Nước Mưa Tuần Hoàn #03', current: 48000, max: 50000, percent: 96, pump: 'Lọc vi sinh đa tầng (Đầy)', use: 'Tái sử dụng nước mưa tiết kiệm 40%' },
        { id: 'WT-04', name: '💧 Bồn Nước Hạ Nhiệt Phun Sương #04 (Bể Nam)', current: 35600, max: 50000, percent: 71, pump: 'Bơm cao áp 4.5 bar (Đang phun)', use: 'Cấp cho 12 trạm béc phun sương trần' }
    ];

    for (var t = 0; t < 4; t++) {
        var tInfo = tankData[t];
        var tankGroup = new THREE.Group();
        tankGroup.position.set(38, 2.0, -18 + t * 9);

        var tank = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 4.0, 20), tankMat);
        tank.castShadow = true;
        tankGroup.add(tank);

        // Water level gauge ring
        var gaugeRing = new THREE.Mesh(new THREE.TorusGeometry(2.42, 0.06, 8, 20), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
        gaugeRing.rotation.x = Math.PI / 2;
        gaugeRing.position.y = 2.0 * (tInfo.percent / 100) - 1.0;
        tankGroup.add(gaugeRing);

        scene.add(tankGroup);

        // Raycasting Hitbox for each water tank
        var tHit = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 4.4, 12), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
        tHit.position.set(38, 2.0, -18 + t * 9);
        tHit.userData = {
            type: 'tank',
            id: tInfo.id,
            name: tInfo.name,
            group: tankGroup,
            current: tInfo.current,
            max: tInfo.max,
            percent: tInfo.percent,
            hoverTitle: tInfo.name,
            hoverDesc: 'Lượng nước còn lại: ' + tInfo.current.toLocaleString() + ' / ' + tInfo.max.toLocaleString() + ' Lít (' + tInfo.percent + '%) • ' + tInfo.pump
        };
        scene.add(tHit);
        window.sfZoneA3D.greenhouses.push(tHit);
    }

    // 6. Raycasting on 3D Campus
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    window.sfZoneA3D.raycaster = raycaster;
    window.sfZoneA3D.mouse = mouse;

    var hoverCard = document.getElementById('sf-zone-a-hover-card');
    var hoverTitle = document.getElementById('sf-za-hud-title');
    var hoverSub = document.getElementById('sf-za-hud-sub');
    var lastHovered = null;

    function onCampusMouseMove(event) {
        var rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(window.sfZoneA3D.greenhouses);

        if (intersects.length > 0) {
            renderer.domElement.style.cursor = 'pointer';
            var obj = intersects[0].object;

            if (lastHovered && lastHovered !== obj) {
                lastHovered.userData.group.position.y = (lastHovered.userData.type === 'tank' ? 2.0 : 0);
            }
            lastHovered = obj;
            obj.userData.group.position.y = (obj.userData.type === 'tank' ? 2.3 : 0.5); // Lift up slightly

            if (hoverCard && hoverTitle && hoverSub) {
                if (obj.userData.type === 'tank') {
                    hoverTitle.textContent = obj.userData.hoverTitle;
                    hoverSub.textContent = obj.userData.hoverDesc;
                } else {
                    hoverTitle.textContent = '🏛️ ' + obj.userData.name;
                    hoverSub.textContent = obj.userData.plant + ' • Nhấp để vào tham quan 3D';
                }
                hoverCard.style.left = (event.clientX - rect.left) + 'px';
                hoverCard.style.top = (event.clientY - rect.top) + 'px';
                hoverCard.style.display = 'block';
            }
        } else {
            renderer.domElement.style.cursor = 'grab';
            if (lastHovered) {
                lastHovered.userData.group.position.y = (lastHovered.userData.type === 'tank' ? 2.0 : 0);
                lastHovered = null;
            }
            if (hoverCard) hoverCard.style.display = 'none';
        }
    }

    var lastCampusClick = 0;
    var isDraggingCampus = false;
    var cpDownX = 0, cpDownY = 0, cpDownTime = 0, cpDownTarget = null;

    function onCampusClick(clickedObj) {
        if (!clickedObj || !clickedObj.userData) return;
        var now = Date.now();
        if (now - lastCampusClick < 300) return;
        lastCampusClick = now;

        if (clickedObj.userData.type === 'tank') {
            window.sfShowToast('💧 ' + clickedObj.userData.name + ' • Dung tích hiện tại: ' + clickedObj.userData.percent + '% (' + clickedObj.userData.current.toLocaleString() + ' Lít)', 'info');
        } else {
            window.sfNavigateMapLevel('greenhouse-3d', {
                id: clickedObj.userData.id,
                name: clickedObj.userData.name
            });
        }
    }

    renderer.domElement.addEventListener('pointerdown', function(e) {
        cpDownX = e.clientX;
        cpDownY = e.clientY;
        cpDownTime = Date.now();
        isDraggingCampus = false;

        var rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(window.sfZoneA3D.greenhouses);
        cpDownTarget = (intersects.length > 0) ? intersects[0].object : null;
    });

    renderer.domElement.addEventListener('pointermove', function(e) {
        if (Math.hypot(e.clientX - cpDownX, e.clientY - cpDownY) > 4) {
            isDraggingCampus = true;
        }
    });

    renderer.domElement.addEventListener('pointerup', function(e) {
        var dist = Math.hypot(e.clientX - cpDownX, e.clientY - cpDownY);
        var elapsed = Date.now() - cpDownTime;

        var rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(window.sfZoneA3D.greenhouses);
        var cpUpTarget = (intersects.length > 0) ? intersects[0].object : null;

        // BẮT BUỘC: Không xoay 3D, không drag, dist < 4px, click dứt khoát < 350ms,
        // VÀ điểm nhấn chuột xuống & nhả chuột lên PHẢI CÙNG 1 NGÔI NHÀ!
        if (!isOrbitingCampus && !isDraggingCampus && dist < 4 && elapsed < 350 && cpDownTarget && cpUpTarget && cpDownTarget === cpUpTarget) {
            onCampusClick(cpUpTarget);
        }
        cpDownTarget = null;
        setTimeout(function() { isDraggingCampus = false; }, 80);
    });

    renderer.domElement.addEventListener('mousemove', onCampusMouseMove);

    function onCampusResize() {
        if (!container) return;
        var newW = container.clientWidth || 900;
        var newH = container.clientHeight || 600;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
    }
    window.addEventListener('resize', onCampusResize);

    function animateCampus() {
        window.sfZoneA3D.animId = requestAnimationFrame(animateCampus);
        if (controls) controls.update();
        renderer.render(scene, camera);
    }
    animateCampus();
};

/* ==========================================================================
   INTERIOR 3D DIGITAL TWIN GREENHOUSE (THAM QUAN NỘI THẤT NHÀ MÀNG 3D)
   ========================================================================== */

window.sf3D = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    animId: null,
    container: null,
    autoRotate: false,
    fans: [],
    mistingSystem: null,
    mistingSpeeds: null,
    dripDrops: null,
    sprinklerSystem: null,
    sprinklerVels: null,
    nozzleOrigins: [],
    fertSystem: null,
    sensorLeds: [],
    interactiveObjects: [],
    raycaster: null,
    mouse: null,
    state: {
        fan: true,
        misting: true,
        shade: false,
        drip: true,
        sprinkler: false,
        fert: true
    }
};

window.sfStop3DLoop = function() {
    if (window.sf3D && window.sf3D.animId) {
        cancelAnimationFrame(window.sf3D.animId);
        window.sf3D.animId = null;
    }
};

window.sfInitGreenhouse3D = function(data) {
    if (typeof THREE === 'undefined') return;

    var container = document.getElementById('sf-greenhouse-3d-viewport');
    if (!container) return;

    window.sfStop3DLoop();

    // Read real persistent states from store
    window.sf3D.state = {
        fan: window.sfDeviceStore ? window.sfDeviceStore.get('A', 'fan') : true,
        misting: window.sfDeviceStore ? window.sfDeviceStore.get('A', 'mist') : true,
        shade: window.sfDeviceStore ? window.sfDeviceStore.get('A', 'shade') : false,
        drip: window.sfDeviceStore ? window.sfDeviceStore.get('A', 'drip') : true,
        sprinkler: window.sfDeviceStore ? window.sfDeviceStore.get('A', 'sprinkler') : false,
        fert: window.sfDeviceStore ? window.sfDeviceStore.get('A', 'fert') : true
    };

    var stMist = document.getElementById('sf-3d-status-misting');
    if (stMist) {
        stMist.textContent = window.sf3D.state.misting ? 'ĐANG PHUN' : 'ĐANG TẮT';
        stMist.style.color = window.sf3D.state.misting ? '#16a34a' : '#64748b';
    }
    var stFan = document.getElementById('sf-3d-status-fan');
    if (stFan) {
        stFan.textContent = window.sf3D.state.fan ? 'ĐANG CHẠY' : 'ĐANG TẮT';
        stFan.style.color = window.sf3D.state.fan ? '#16a34a' : '#64748b';
    }

    var width = container.clientWidth || 900;
    var height = container.clientHeight || 580;

    container.innerHTML = '';

    // 1. Daylight Atmosphere Scene
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbeafe); // Soft sky blue
    scene.fog = new THREE.FogExp2(0xdbeafe, 0.012);
    window.sf3D.scene = scene;

    // 2. Camera & Perspective
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    camera.position.set(0, 14, 25);
    window.sf3D.camera = camera;

    // 3. WebGL Renderer
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    window.sf3D.renderer = renderer;

    // 4. Controls
    var isOrbiting3D = false;
    var controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.maxPolarAngle = Math.PI / 2 - 0.03;
        controls.minDistance = 5;
        controls.maxDistance = 55;
        controls.target.set(0, 3.2, 0);
        controls.autoRotate = window.sf3D.autoRotate;
        controls.autoRotateSpeed = 1.2;

        controls.addEventListener('start', function() {
            isOrbiting3D = true;
        });
        controls.addEventListener('end', function() {
            setTimeout(function() {
                isOrbiting3D = false;
            }, 120);
        });
    }
    window.sf3D.controls = controls;

    // 5. Lighting
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    var sunLight = new THREE.DirectionalLight(0xfffaed, 1.3);
    sunLight.position.set(22, 38, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    var fillLight = new THREE.DirectionalLight(0xbae6fd, 0.5);
    fillLight.position.set(-20, 20, -15);
    scene.add(fillLight);

    // Reset collections
    window.sf3D.fans = [];
    window.sf3D.sensorLeds = [];
    window.sf3D.interactiveObjects = [];

    // Dimensions
    var ghW = 20;      // Greenhouse Width
    var ghL = 32;      // Greenhouse Length
    var curbH = 0.7;   // Solid Concrete Perimeter Curb Base
    var wallH = 5.2;   // Eave Height
    var peakH = 8.2;   // Ridge Peak Height

    // 6. Outdoor Grounds & Interior Concrete Floor
    var outdoorLawn = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.9 }));
    outdoorLawn.rotation.x = -Math.PI / 2;
    outdoorLawn.position.y = -0.05;
    scene.add(outdoorLawn);

    var floorMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7, metalness: 0.1 });
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(ghW, ghL), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Central Clean Walkway
    var walkway = new THREE.Mesh(new THREE.PlaneGeometry(3.6, ghL), new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.5 }));
    walkway.rotation.x = -Math.PI / 2;
    walkway.position.y = 0.02;
    scene.add(walkway);

    // 7. SOLID CONCRETE FOUNDATION BASE WALLS (Chân tường móng)
    var concreteBaseMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85 });
    // Left & Right Base Wall
    var wallBaseL = new THREE.Mesh(new THREE.BoxGeometry(0.3, curbH, ghL), concreteBaseMat);
    wallBaseL.position.set(-ghW / 2, curbH / 2, 0);
    scene.add(wallBaseL);

    var wallBaseR = new THREE.Mesh(new THREE.BoxGeometry(0.3, curbH, ghL), concreteBaseMat);
    wallBaseR.position.set(ghW / 2, curbH / 2, 0);
    scene.add(wallBaseR);

    // Front & Back Base Wall
    var wallBaseF = new THREE.Mesh(new THREE.BoxGeometry(ghW, curbH, 0.3), concreteBaseMat);
    wallBaseF.position.set(0, curbH / 2, ghL / 2);
    scene.add(wallBaseF);

    var wallBaseB = new THREE.Mesh(new THREE.BoxGeometry(ghW, curbH, 0.3), concreteBaseMat);
    wallBaseB.position.set(0, curbH / 2, -ghL / 2);
    scene.add(wallBaseB);

    // 8. STRUCTURAL STEEL TRUSS FRAMES (Hệ khung dầm vòm thép kết nối chuẩn xác)
    var steelMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.75 });
    var glassMat = new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.40,
        roughness: 0.05,
        metalness: 0.2
    });

    // Rafter angle math:
    // Left rafter starts at (-ghW/2, wallH) = (-10, 5.2) and ends at (0, peakH) = (0, 8.2)
    // dx = 10, dy = 3.0 => length = sqrt(100 + 9) = 10.44 => angle = atan2(3.0, 10) = 0.291 rad
    var rafterLen = Math.sqrt(Math.pow(ghW / 2, 2) + Math.pow(peakH - wallH, 2));
    var rafterAngle = Math.atan2(peakH - wallH, ghW / 2);

    for (var z = -ghL / 2; z <= ghL / 2; z += 4) {
        var trussGroup = new THREE.Group();
        trussGroup.position.z = z;

        // Left Vertical Post
        var postL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, wallH - curbH, 8), steelMat);
        postL.position.set(-ghW / 2, curbH + (wallH - curbH) / 2, 0);
        trussGroup.add(postL);

        // Right Vertical Post
        var postR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, wallH - curbH, 8), steelMat);
        postR.position.set(ghW / 2, curbH + (wallH - curbH) / 2, 0);
        trussGroup.add(postR);

        // Horizontal Tie Beam (Xà ngang đỡ trần)
        var tieBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, ghW, 8), steelMat);
        tieBeam.position.set(0, wallH, 0);
        tieBeam.rotation.z = Math.PI / 2;
        trussGroup.add(tieBeam);

        // Left Rafter (Kèo thép mái trái)
        var rafL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, rafterLen, 8), steelMat);
        rafL.position.set(-ghW / 4, wallH + (peakH - wallH) / 2, 0);
        rafL.rotation.z = -rafterAngle;
        trussGroup.add(rafL);

        // Right Rafter (Kèo thép mái phải)
        var rafR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, rafterLen, 8), steelMat);
        rafR.position.set(ghW / 4, wallH + (peakH - wallH) / 2, 0);
        rafR.rotation.z = rafterAngle;
        trussGroup.add(rafR);

        // Vertical King Post (Thanh chống đứng đỉnh nóc)
        var king = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, peakH - wallH, 8), steelMat);
        king.position.set(0, wallH + (peakH - wallH) / 2, 0);
        trussGroup.add(king);

        // Diagonal Struts (Thanh giằng chéo kỹ thuật)
        var strutL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.4, 6), steelMat);
        strutL.position.set(-ghW / 4, wallH + (peakH - wallH) / 4, 0);
        strutL.rotation.z = rafterAngle;
        trussGroup.add(strutL);

        var strutR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.4, 6), steelMat);
        strutR.position.set(ghW / 4, wallH + (peakH - wallH) / 4, 0);
        strutR.rotation.z = -rafterAngle;
        trussGroup.add(strutR);

        scene.add(trussGroup);
    }

    // Longitudinal Roof Purlins & Ridge (Xà gồ mái dọc & Máng xối)
    var ridgeBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, ghL, 8), steelMat);
    ridgeBeam.position.set(0, peakH, 0);
    ridgeBeam.rotation.x = Math.PI / 2;
    scene.add(ridgeBeam);

    var eaveL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, ghL), steelMat);
    eaveL.position.set(-ghW / 2, wallH, 0);
    scene.add(eaveL);

    var eaveR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, ghL), steelMat);
    eaveR.position.set(ghW / 2, wallH, 0);
    scene.add(eaveR);

    // 9. GLASS PANELS WITH TINT & VISIBLE FRAME (Tấm kính cường lực vách & mái)
    // Side Walls Glass
    var glassWallL = new THREE.Mesh(new THREE.PlaneGeometry(ghL, wallH - curbH), glassMat);
    glassWallL.position.set(-ghW / 2, curbH + (wallH - curbH) / 2, 0);
    glassWallL.rotation.y = Math.PI / 2;
    scene.add(glassWallL);

    var glassWallR = new THREE.Mesh(new THREE.PlaneGeometry(ghL, wallH - curbH), glassMat);
    glassWallR.position.set(ghW / 2, curbH + (wallH - curbH) / 2, 0);
    glassWallR.rotation.y = -Math.PI / 2;
    scene.add(glassWallR);

    // Pitched Roof Glass (Áp đúng độ nghiêng của kèo mái)
    var roofMeshL = new THREE.Mesh(new THREE.PlaneGeometry(rafterLen, ghL), glassMat);
    roofMeshL.position.set(-ghW / 4, wallH + (peakH - wallH) / 2, 0);
    roofMeshL.rotation.x = Math.PI / 2;
    roofMeshL.rotation.y = rafterAngle;
    scene.add(roofMeshL);

    var roofMeshR = new THREE.Mesh(new THREE.PlaneGeometry(rafterLen, ghL), glassMat);
    roofMeshR.position.set(ghW / 4, wallH + (peakH - wallH) / 2, 0);
    roofMeshR.rotation.x = Math.PI / 2;
    roofMeshR.rotation.y = -rafterAngle;
    scene.add(roofMeshR);

    // 10. THERMAL SHADE SCREEN (Mái che tự động dạng lưới dệt Aluminet)
    var shadeClothMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        transparent: true,
        opacity: 0.65,
        roughness: 0.9
    });
    var shadeScreen = new THREE.Mesh(new THREE.PlaneGeometry(ghW - 0.6, ghL - 1), shadeClothMat);
    shadeScreen.rotation.x = -Math.PI / 2;
    shadeScreen.position.set(0, wallH - 0.1, 0);
    scene.add(shadeScreen);

    // 11. LED GROW LIGHT BARS (Đèn quang hợp LED dải dài)
    var ledFixtureMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    var ledEmitterMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e }); // Photosynthetic Pink Spectrum

    var bedXCoords = [-6.8, -3.2, 3.2, 6.8];
    bedXCoords.forEach(function(bx) {
        var fixture = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, ghL - 4), ledFixtureMat);
        fixture.position.set(bx, wallH - 0.35, 0);
        scene.add(fixture);

        var strip = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, ghL - 4.2), ledEmitterMat);
        strip.position.set(bx, wallH - 0.41, 0);
        scene.add(strip);
    });

    // 12. CULTIVATION BEDS & 40 INDIVIDUAL INTERACTIVE PLANTS (4 luống x 10 cây riêng lẻ)
    var troughMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
    var soilMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.95 });
    var leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
    var fruitMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 });

    var bedConfigs = [
        { name: 'Luống 01 (Dãy Tây Bắc)', plant: 'Dưa Lưới Nhật Bản CNC', variety: 'Muskmelon Snow White F1', baseAge: 45, harvestDays: 20 },
        { name: 'Luống 02 (Dãy Tây Nam)', plant: 'Dưa Lưới Taki CNC', variety: 'Taki Melon Golden Star', baseAge: 42, harvestDays: 23 },
        { name: 'Luống 03 (Dãy Đông Bắc)', plant: 'Cà Chua Bi Cherry Hà Lan', variety: 'Cherry Dutch Red Ruby', baseAge: 52, harvestDays: 13 },
        { name: 'Luống 04 (Dãy Đông Nam)', plant: 'Dưa Lưới Hoàng Kim', variety: 'Golden Queen Honey', baseAge: 50, harvestDays: 15 }
    ];

    // Drip Water Drops (Particle system for active drip irrigation)
    var dripDropCount = 80;
    var dripDropGeo = new THREE.BufferGeometry();
    var dripDropPos = new Float32Array(dripDropCount * 3);
    for (var d = 0; d < dripDropCount; d++) {
        dripDropPos[d * 3] = bedXCoords[d % 4] + (Math.random() - 0.5) * 0.3;
        dripDropPos[d * 3 + 1] = 0.55 + Math.random() * 0.2;
        dripDropPos[d * 3 + 2] = -11.5 + Math.floor(d / 4) * 2.5;
    }
    dripDropGeo.setAttribute('position', new THREE.BufferAttribute(dripDropPos, 3));
    var dripDropPoints = new THREE.Points(dripDropGeo, new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.12,
        transparent: true,
        opacity: 0.8
    }));
    dripDropPoints.visible = window.sfDeviceStore.get('A', 'drip');
    scene.add(dripDropPoints);
    window.sf3D.dripDrops = dripDropPoints;

    var plantIndex = 1;

    bedXCoords.forEach(function(bx, bIdx) {
        var cfg = bedConfigs[bIdx];

        // Raised Trough
        var bedMesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 26), troughMat);
        bedMesh.position.set(bx, 0.25, 0);
        bedMesh.castShadow = true;
        bedMesh.receiveShadow = true;
        scene.add(bedMesh);

        // Substrate Medium
        var soilMesh = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 25.6), soilMat);
        soilMesh.position.set(bx, 0.5, 0);
        scene.add(soilMesh);

        // Drip Irrigation Line
        var dripPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 26, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
        dripPipe.position.set(bx, 0.56, 0);
        dripPipe.rotation.x = Math.PI / 2;
        scene.add(dripPipe);

        // 10 Individual Plants per Bed (Total 40 Plants across greenhouse)
        for (var p = 0; p < 10; p++) {
            var pz = -11.5 + p * 2.55;
            var currentPIdx = plantIndex++;
            var pId = (currentPIdx < 10 ? '0' + currentPIdx : '' + currentPIdx);

            // Trellis Cable
            var cable = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 4.4, 4), new THREE.MeshBasicMaterial({ color: 0x94a3b8 }));
            cable.position.set(bx, 2.7, pz);
            scene.add(cable);

            // Foliage Vine Clusters for this individual plant
            var foliageList = [];
            for (var y = 0.8; y <= 3.2; y += 0.7) {
                var foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38 + ((p * 7) % 10) * 0.012), leafMat);
                foliage.position.set(bx + (((p + y) * 3) % 5 - 2) * 0.08, y, pz + (((p * 2 + y) % 5) - 2) * 0.06);
                foliage.rotation.set((p + y) * 0.4, p * 0.7, y * 0.3);
                foliage.castShadow = true;
                scene.add(foliage);
                foliageList.push(foliage);
            }

            // Fruit hanging on vine
            var melon = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 14), fruitMat);
            melon.position.set(bx + (bIdx % 2 === 0 ? 0.38 : -0.38), 1.35 + (p % 3) * 0.15, pz);
            melon.scale.set(1, 1.2, 1);
            melon.castShadow = true;
            scene.add(melon);

            // Plant Data (Uniform across all 40 plants)
            var pMoisture = 70 + ((p * 3) % 6);
            var pTemp = (26.2 + ((p * 2) % 8) * 0.1).toFixed(1);
            var pAge = cfg.baseAge + (p % 3) - 1;
            var pHarvest = cfg.harvestDays - (p % 3) + 1;
            var pBrix = (14.0 + ((p * 4) % 8) * 0.1).toFixed(1);
            var pWeight = (1.38 + ((p * 3) % 7) * 0.03).toFixed(2);

            // Raycasting Hitbox for THIS SPECIFIC INDIVIDUAL PLANT (Cylinder 1.15m x 3.8m covering the entire plant)
            var invisibleHitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
            var plantHit = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 3.8, 10), invisibleHitMat);
            plantHit.position.set(bx, 2.0, pz);
            plantHit.userData = {
                type: 'plant',
                id: 'GH01-P' + pId,
                plantName: cfg.plant,
                bedName: cfg.name + ' • Gốc #' + pId,
                variety: cfg.variety,
                moisture: pMoisture,
                temp: pTemp,
                age: pAge,
                harvestDays: pHarvest,
                ph: 6.2,
                ec: 1.8,
                lux: 8400,
                brix: pBrix,
                weight: pWeight,
                health: '🟢 Rất khỏe mạnh (Tối ưu)',
                posX: bx,
                posZ: pz,
                // UNIFORM HOVER DESCRIPTION 100% AS REQUIRED BY USER:
                hoverTitle: '🌱 ' + cfg.plant + ' #GH01-P' + pId,
                hoverDesc: 'Độ ẩm: ' + pMoisture + '% • Nhiệt độ quanh gốc: ' + pTemp + '°C • Độ tuổi: ' + pAge + ' ngày • Dự kiến thu hoạch: ' + pHarvest + ' ngày nữa'
            };
            scene.add(plantHit);
            window.sf3D.interactiveObjects.push(plantHit);

            // Also attach userData to melon, trellis wire & foliage so clicking ANY plant element activates inspection
            melon.userData = plantHit.userData;
            window.sf3D.interactiveObjects.push(melon);

            cable.userData = plantHit.userData;
            window.sf3D.interactiveObjects.push(cable);

            foliageList.forEach(function(f) {
                f.userData = plantHit.userData;
                window.sf3D.interactiveObjects.push(f);
            });
        }
    });

    // 13. INTERACTIVE EQUIPMENT: CIRCULATION FANS (Quạt đối lưu)
    var fanHousingMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6 });
    var fanBladeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.4 });

    var fanPositions = [
        { x: 0, y: 5.4, z: -ghL / 2 + 0.4, rotY: 0 },
        { x: 0, y: 5.4, z: ghL / 2 - 0.4, rotY: Math.PI }
    ];

    fanPositions.forEach(function(fc) {
        var fanGroup = new THREE.Group();
        fanGroup.position.set(fc.x, fc.y, fc.z);
        fanGroup.rotation.y = fc.rotY;

        var housing = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.4, 18, 1, true), fanHousingMat);
        housing.rotation.x = Math.PI / 2;
        fanGroup.add(housing);

        var hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.42, 12), fanHousingMat);
        hub.rotation.x = Math.PI / 2;
        fanGroup.add(hub);

        var bladesGroup = new THREE.Group();
        for (var b = 0; b < 4; b++) {
            var blade = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.78, 0.03), fanBladeMat);
            blade.position.y = 0.44;
            blade.rotation.x = 0.35;
            var bladeWrap = new THREE.Group();
            bladeWrap.rotation.z = (b * Math.PI) / 2;
            bladeWrap.add(blade);
            bladesGroup.add(bladeWrap);
        }
        fanGroup.add(bladesGroup);
        scene.add(fanGroup);
        window.sf3D.fans.push(bladesGroup);

        var hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 1.2), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
        hitBox.position.set(fc.x, fc.y, fc.z);
        hitBox.userData = {
            type: 'fan',
            name: 'Quạt thông gió đối lưu',
            deviceKey: 'quat',
            desc: 'Điều hòa luồng không khí & giảm nhiệt độ cục bộ'
        };
        scene.add(hitBox);
        window.sf3D.interactiveObjects.push(hitBox);
    });

    // 14. INTERACTIVE EQUIPMENT: OVERHEAD MISTING SYSTEM (Phun sương trần)
    var mistPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, ghL - 2, 8), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 }));
    mistPipe.position.set(0, 6.2, 0);
    mistPipe.rotation.x = Math.PI / 2;
    scene.add(mistPipe);

    var particleCount = 750;
    var particlesGeo = new THREE.BufferGeometry();
    var positions = new Float32Array(particleCount * 3);
    var speeds = new Float32Array(particleCount);

    for (var i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * (ghW - 4);
        positions[i * 3 + 1] = 6.0 - Math.random() * 4.5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * (ghL - 4);
        speeds[i] = 0.04 + Math.random() * 0.05;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var particleMat = new THREE.PointsMaterial({
        color: 0xbae6fd,
        size: 0.18,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
    });

    var mistPoints = new THREE.Points(particlesGeo, particleMat);
    scene.add(mistPoints);
    window.sf3D.mistingSystem = mistPoints;
    window.sf3D.mistingSpeeds = speeds;

    var mistHit = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, ghL - 2), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    mistHit.position.set(0, 6.2, 0);
    mistHit.userData = {
        type: 'misting',
        name: 'Hệ thống phun sương làm mát',
        deviceKey: 'phun_suong',
        desc: 'Hạ nhiệt độ & bổ sung độ ẩm vi khí hậu'
    };
    scene.add(mistHit);
    window.sf3D.interactiveObjects.push(mistHit);

    // 14B. ROTARY SPRINKLER IRRIGATION SYSTEM (Hệ thống tưới phun mưa tự động 3D)
    var sprinklerNozzles = [];
    var sprinklerPositions = [
        { x: -5.0, z: -10 }, { x: -5.0, z: -3 }, { x: -5.0, z: 4 }, { x: -5.0, z: 11 },
        { x: 5.0, z: -10 }, { x: 5.0, z: -3 }, { x: 5.0, z: 4 }, { x: 5.0, z: 11 }
    ];
    var nozzleMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2 });
    var bracketMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

    sprinklerPositions.forEach(function(sp) {
        var dropPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 6), bracketMat);
        dropPipe.position.set(sp.x, 4.7, sp.z);
        scene.add(dropPipe);

        var nozzleHead = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.16, 8), nozzleMat);
        nozzleHead.position.set(sp.x, 4.2, sp.z);
        scene.add(nozzleHead);
        sprinklerNozzles.push(nozzleHead);
    });
    window.sf3D.sprinklerNozzles = sprinklerNozzles;

    var spkCount = 480;
    var spkGeo = new THREE.BufferGeometry();
    var spkPos = new Float32Array(spkCount * 3);
    var spkMeta = [];

    for (var s = 0; s < spkCount; s++) {
        var nIdx = s % sprinklerPositions.length;
        var initRad = 0.2 + Math.random() * 3.8;
        var initAng = Math.random() * Math.PI * 2;
        var initY = 4.15 - (initRad / 4.0) * 3.2 - Math.random() * 0.4;
        spkPos[s * 3] = sprinklerPositions[nIdx].x + Math.cos(initAng) * initRad;
        spkPos[s * 3 + 1] = Math.max(0.6, initY);
        spkPos[s * 3 + 2] = sprinklerPositions[nIdx].z + Math.sin(initAng) * initRad;
        spkMeta.push({
            nIdx: nIdx,
            radius: initRad,
            angle: initAng,
            speed: 0.06 + Math.random() * 0.05
        });
    }
    spkGeo.setAttribute('position', new THREE.BufferAttribute(spkPos, 3));
    var spkMat = new THREE.PointsMaterial({
        color: 0x7dd3fc,
        size: 0.18,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
    });
    var sprinklerPoints = new THREE.Points(spkGeo, spkMat);
    sprinklerPoints.visible = window.sf3D.state.sprinkler;
    scene.add(sprinklerPoints);
    window.sf3D.sprinklerSystem = sprinklerPoints;
    window.sf3D.sprinklerMeta = spkMeta;
    window.sf3D.sprinklerPositions = sprinklerPositions;

    // 14C. NPK FERTIGATION NUTRIENT DOSING SYSTEM (Hệ thống châm dinh dưỡng NPK vi lượng)
    var fertTubeMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.55,
        roughness: 0.3
    });
    bedXCoords.forEach(function(bx) {
        var tube = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 26, 8), fertTubeMat);
        tube.position.set(bx, 0.62, 0);
        tube.rotation.x = Math.PI / 2;
        scene.add(tube);
    });

    var fertCount = 160;
    var fertGeo = new THREE.BufferGeometry();
    var fertPos = new Float32Array(fertCount * 3);
    for (var f = 0; f < fertCount; f++) {
        var b = f % 4;
        fertPos[f * 3] = bedXCoords[b] + (Math.random() - 0.5) * 0.12;
        fertPos[f * 3 + 1] = 0.60 + Math.random() * 0.15;
        fertPos[f * 3 + 2] = -12.5 + (f / 160) * 25.0;
    }
    fertGeo.setAttribute('position', new THREE.BufferAttribute(fertPos, 3));
    var fertMat = new THREE.PointsMaterial({
        color: 0x22c55e,
        size: 0.22,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
    });
    var fertPoints = new THREE.Points(fertGeo, fertMat);
    fertPoints.visible = window.sf3D.state.fert;
    scene.add(fertPoints);
    window.sf3D.fertSystem = fertPoints;

    // 15. INTERACTIVE EQUIPMENT: SOIL & CLIMATE SENSORS (Cọc cảm biến)
    var probeMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85 });
    var sensorPositions = [
        { x: -3.2, z: 0, label: 'Cảm biến vi khí hậu & Đất #1' },
        { x: 3.2, z: -6, label: 'Cảm biến vi khí hậu & Đất #2' },
        { x: -6.8, z: 6, label: 'Cảm biến độ ẩm giá thể #3' }
    ];

    sensorPositions.forEach(function(sp) {
        var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8), probeMat);
        pole.position.set(sp.x, 1.2, sp.z);
        scene.add(pole);

        var box = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.3, 0.2), probeMat);
        box.position.set(sp.x, 1.9, sp.z);
        scene.add(box);

        var led = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
        led.position.set(sp.x, 2.12, sp.z);
        scene.add(led);
        window.sf3D.sensorLeds.push(led);

        var sHit = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 1.2), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
        sHit.position.set(sp.x, 1.5, sp.z);
        sHit.userData = {
            type: 'sensor',
            name: sp.label,
            deviceKey: 'sensor',
            desc: 'Đang theo dõi: Nhiệt độ 26.5°C • Độ ẩm 72% • EC 1.8 mS/cm'
        };
        scene.add(sHit);
        window.sf3D.interactiveObjects.push(sHit);
    });

    // 16. RAYCASTING HOVER & CLICK FOR ALL OBJECTS (Ưu tiên tuyệt đối Cây trồng)
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    window.sf3D.raycaster = raycaster;
    window.sf3D.mouse = mouse;

    var hoverCard = document.getElementById('sf-3d-hover-card');
    var hoverTitle = document.getElementById('sf-3d-hud-title');
    var hoverSub = document.getElementById('sf-3d-hud-sub');

    function onMouseMove(event) {
        var rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(window.sf3D.interactiveObjects, true);

        var plantMatch = null;
        var deviceMatch = null;

        for (var i = 0; i < intersects.length; i++) {
            var currObj = intersects[i].object;
            var d = currObj.userData;
            while ((!d || (!d.hoverTitle && !d.name)) && currObj.parent) {
                currObj = currObj.parent;
                d = currObj.userData;
            }
            if (d) {
                if (!plantMatch && (d.type === 'plant' || d.type === 'crop' || d.type === 'fruit')) {
                    plantMatch = d;
                } else if (!deviceMatch && (d.deviceKey || d.type === 'fan' || d.type === 'misting' || d.type === 'sensor')) {
                    deviceMatch = d;
                }
            }
        }

        var uData = plantMatch || deviceMatch;

        if (uData) {
            renderer.domElement.style.cursor = 'pointer';
            if (hoverCard && hoverTitle && hoverSub) {
                hoverTitle.textContent = uData.hoverTitle || uData.name || 'Cây trồng';
                hoverSub.textContent = uData.hoverDesc || uData.desc || 'Nhấp để xem chi tiết & cài đặt tưới';
                hoverCard.style.left = (event.clientX - rect.left) + 'px';
                hoverCard.style.top = (event.clientY - rect.top) + 'px';
                hoverCard.style.display = 'block';
            }
        } else {
            renderer.domElement.style.cursor = 'grab';
            if (hoverCard) hoverCard.style.display = 'none';
        }
    }

    var lastInteractionTime = 0;
    function handle3DClick(event) {
        var now = Date.now();
        if (now - lastInteractionTime < 200) return; // Debounce
        lastInteractionTime = now;

        var rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(window.sf3D.interactiveObjects, true);

        var plantMatch = null;
        var deviceMatch = null;

        for (var i = 0; i < intersects.length; i++) {
            var currObj = intersects[i].object;
            var d = currObj.userData;
            while ((!d || !d.type) && currObj.parent) {
                currObj = currObj.parent;
                d = currObj.userData;
            }
            if (d) {
                if (!plantMatch && (d.type === 'plant' || d.type === 'crop' || d.type === 'fruit')) {
                    plantMatch = { object: currObj, data: d, point: intersects[i].point };
                } else if (!deviceMatch && (d.deviceKey || d.type === 'fan' || d.type === 'misting' || d.type === 'sensor')) {
                    deviceMatch = { object: currObj, data: d, point: intersects[i].point };
                }
            }
        }

        var match = plantMatch || deviceMatch;

        if (match) {
            var uData = match.data;
            if (uData.type === 'plant' || uData.type === 'crop' || uData.type === 'fruit') {
                window.sfShowToast('🌱 ' + (uData.plantName || uData.name) + ' #' + (uData.id || '') + ' • Mở bảng chi tiết & cài đặt tưới', 'success');
                // Smoothly focus camera onto this plant
                if (controls) {
                    var targetX = uData.posX || 0;
                    var targetZ = uData.posZ || 0;
                    controls.target.set(targetX, 1.8, targetZ);
                    camera.position.set(targetX + (targetX > 0 ? -2.2 : 2.2), 2.5, targetZ + 3.2);
                    controls.update();
                }
                window.sfOpenPlantDrawer(uData);
            } else if (uData.deviceKey) {
                window.sfHighlightDeviceInDrawer(uData.deviceKey, uData.name);
            }
        }
    }

    var ghDownX = 0, ghDownY = 0, ghDownTime = 0;
    renderer.domElement.addEventListener('pointerdown', function(e) {
        ghDownX = e.clientX;
        ghDownY = e.clientY;
        ghDownTime = Date.now();
    });

    renderer.domElement.addEventListener('pointerup', function(e) {
        var dist = Math.hypot(e.clientX - ghDownX, e.clientY - ghDownY);
        var elapsed = Date.now() - ghDownTime;
        // Bấm dứt khoát không drag xoay camera
        if (!isOrbiting3D && dist < 5 && elapsed < 400) {
            handle3DClick(e);
        }
    });

    // Double-click on floor / crops to smoothly glide camera forward to that spot
    function onDoubleClick(event) {
        var rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(window.sf3D.interactiveObjects, true);
        if (intersects.length > 0) {
            for (var i = 0; i < intersects.length; i++) {
                var d = intersects[i].object.userData;
                if (d && (d.type === 'plant' || d.type === 'crop' || d.type === 'fruit')) {
                    handle3DClick(event);
                    return;
                }
            }
        }

        var groundHits = raycaster.intersectObjects([floor, walkway]);
        if (groundHits.length > 0) {
            var hitPt = groundHits[0].point;
            var fwd = new THREE.Vector3().subVectors(hitPt, camera.position).normalize();
            fwd.y = 0;
            camera.position.addScaledVector(fwd, 4.0);
            controls.target.set(hitPt.x, 2.0, hitPt.z);
            controls.update();
            window.sfShowToast('🚶 Đã di chuyển đến vị trí đã chọn', 'info');
        }
    }

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('dblclick', onDoubleClick);

    function onWindowResize() {
        if (!container) return;
        var newW = container.clientWidth || 900;
        var newH = container.clientHeight || 580;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
    }
    window.addEventListener('resize', onWindowResize);

    // 17. Render Animation Loop
    var clock = new THREE.Clock();

    function animate() {
        window.sf3D.animId = requestAnimationFrame(animate);

        var elapsed = clock.getElapsedTime();

        // Rotate Fans if enabled
        if (window.sf3D.state.fan && window.sf3D.fans.length > 0) {
            window.sf3D.fans.forEach(function(fan) {
                fan.rotation.z += 0.28;
            });
        }

        // Animate Misting Particles if enabled
        if (window.sf3D.mistingSystem) {
            if (window.sf3D.state.misting) {
                window.sf3D.mistingSystem.visible = true;
                var posAttr = window.sf3D.mistingSystem.geometry.attributes.position;
                var posArr = posAttr.array;
                var spds = window.sf3D.mistingSpeeds;

                for (var i = 0; i < particleCount; i++) {
                    posArr[i * 3 + 1] -= spds[i];
                    posArr[i * 3] += Math.sin(elapsed * 2 + i) * 0.008;

                    if (posArr[i * 3 + 1] < 0.6) {
                        posArr[i * 3 + 1] = 6.0;
                        posArr[i * 3] = (Math.random() - 0.5) * (ghW - 4);
                    }
                }
                posAttr.needsUpdate = true;
            } else {
                window.sf3D.mistingSystem.visible = false;
            }
        }

        // Animate Sprinkler Irrigation (Tưới phun mưa dạng béc xoay nón)
        if (window.sf3D.sprinklerSystem) {
            if (window.sf3D.state.sprinkler) {
                window.sf3D.sprinklerSystem.visible = true;
                if (window.sf3D.sprinklerNozzles) {
                    window.sf3D.sprinklerNozzles.forEach(function(n) {
                        n.rotation.y += 0.08;
                    });
                }
                var sAttr = window.sf3D.sprinklerSystem.geometry.attributes.position;
                var sArr = sAttr.array;
                var sMeta = window.sf3D.sprinklerMeta;
                var sOrigins = window.sf3D.sprinklerPositions;

                for (var s = 0; s < spkCount; s++) {
                    var m = sMeta[s];
                    m.radius += m.speed;
                    m.angle += 0.04;
                    var orig = sOrigins[m.nIdx];
                    var px = orig.x + Math.cos(m.angle) * m.radius;
                    var pz = orig.z + Math.sin(m.angle) * m.radius;
                    var py = 4.15 - (m.radius / 4.2) * 3.4;

                    sArr[s * 3] = px;
                    sArr[s * 3 + 1] = py;
                    sArr[s * 3 + 2] = pz;

                    if (py <= 0.6 || m.radius > 4.5) {
                        m.radius = 0.2;
                        m.angle = Math.random() * Math.PI * 2;
                        sArr[s * 3] = orig.x;
                        sArr[s * 3 + 1] = 4.15;
                        sArr[s * 3 + 2] = orig.z;
                    }
                }
                sAttr.needsUpdate = true;
            } else {
                window.sf3D.sprinklerSystem.visible = false;
            }
        }

        // Animate NPK Fertigation (Châm dinh dưỡng NPK vi lượng xanh ngọc huỳnh quang)
        if (window.sf3D.fertSystem) {
            if (window.sf3D.state.fert) {
                window.sf3D.fertSystem.visible = true;
                var fAttr = window.sf3D.fertSystem.geometry.attributes.position;
                var fArr = fAttr.array;
                for (var f = 0; f < fertCount; f++) {
                    fArr[f * 3 + 2] += 0.12; // Dòng chảy dọc đường ống
                    fArr[f * 3 + 1] = 0.60 + Math.sin(elapsed * 5.0 + f) * 0.06; // Nhịp xung
                    if (fArr[f * 3 + 2] > 12.8) {
                        fArr[f * 3 + 2] = -12.8;
                    }
                }
                fAttr.needsUpdate = true;
            } else {
                window.sf3D.fertSystem.visible = false;
            }
        }

        // Animate Drip Water Drops if enabled
        if (window.sf3D.dripDrops) {
            if (window.sf3D.state.drip) {
                window.sf3D.dripDrops.visible = true;
                var dPosArr = window.sf3D.dripDrops.geometry.attributes.position.array;
                for (var d = 0; d < dripDropCount; d++) {
                    dPosArr[d * 3 + 1] -= 0.015;
                    if (dPosArr[d * 3 + 1] < 0.52) {
                        dPosArr[d * 3 + 1] = 0.72;
                    }
                }
                window.sf3D.dripDrops.geometry.attributes.position.needsUpdate = true;
            } else {
                window.sf3D.dripDrops.visible = false;
            }
        }

        // Pulsing Sensor LEDs
        if (window.sf3D.sensorLeds.length > 0) {
            var pulseScale = 1.0 + Math.sin(elapsed * 4.5) * 0.2;
            window.sf3D.sensorLeds.forEach(function(led) {
                led.scale.set(pulseScale, pulseScale, pulseScale);
            });
        }

        if (controls) controls.update();
        renderer.render(scene, camera);
    }

    animate();
};

/* ==========================================================================
   CAMERA WALK & D-PAD NAVIGATION FUNCTIONS
   ========================================================================== */

window.sfWalkCamera = function(dir) {
    if (!window.sf3D || !window.sf3D.camera || !window.sf3D.controls) return;
    var camera = window.sf3D.camera;
    var controls = window.sf3D.controls;

    var forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    var side = new THREE.Vector3().crossVectors(camera.up, forward).normalize();

    var step = 3.2;
    if (dir === 'forward') {
        camera.position.addScaledVector(forward, step);
        controls.target.addScaledVector(forward, step);
    } else if (dir === 'backward') {
        camera.position.addScaledVector(forward, -step);
        controls.target.addScaledVector(forward, -step);
    } else if (dir === 'left') {
        camera.position.addScaledVector(side, step);
        controls.target.addScaledVector(side, step);
    } else if (dir === 'right') {
        camera.position.addScaledVector(side, -step);
        controls.target.addScaledVector(side, -step);
    }
    controls.update();
};

window.sfZoomCamera = function(delta) {
    if (!window.sf3D || !window.sf3D.camera || !window.sf3D.controls) return;
    var camera = window.sf3D.camera;
    var controls = window.sf3D.controls;
    var dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    camera.position.addScaledVector(dir, -delta);
    controls.update();
};

window.sfResetCamera = function() {
    if (!window.sf3D || !window.sf3D.camera || !window.sf3D.controls) return;
    window.sf3D.camera.position.set(0, 14, 25);
    window.sf3D.controls.target.set(0, 3.2, 0);
    window.sf3D.controls.update();
    window.sfShowToast('🔄 Đã đặt lại góc nhìn mặc định', 'info');
};

// Keyboard listener for Walking into / around Greenhouse 3D
document.addEventListener('keydown', function(e) {
    var lvl3D = document.getElementById('sf-map-level-greenhouse-3d');
    if (!lvl3D || lvl3D.style.display === 'none') return;
    var tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    var key = e.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') {
        e.preventDefault();
        window.sfWalkCamera('forward');
    } else if (key === 's' || key === 'arrowdown') {
        e.preventDefault();
        window.sfWalkCamera('backward');
    } else if (key === 'a' || key === 'arrowleft') {
        e.preventDefault();
        window.sfWalkCamera('left');
    } else if (key === 'd' || key === 'arrowright') {
        e.preventDefault();
        window.sfWalkCamera('right');
    } else if (key === 'r') {
        e.preventDefault();
        window.sfResetCamera();
    }
});

// Camera Views Preset
window.sfSet3DCamera = function(viewName) {
    if (!window.sf3D || !window.sf3D.camera || !window.sf3D.controls) return;

    var cam = window.sf3D.camera;
    var ctrl = window.sf3D.controls;

    var btnOverview = document.getElementById('sf-cam-overview');
    var btnCrops = document.getElementById('sf-cam-crops');
    var btnCeiling = document.getElementById('sf-cam-ceiling');
    if (btnOverview) btnOverview.classList.remove('active');
    if (btnCrops) btnCrops.classList.remove('active');
    if (btnCeiling) btnCeiling.classList.remove('active');

    if (viewName === 'overview') {
        if (btnOverview) btnOverview.classList.add('active');
        cam.position.set(0, 14, 25);
        ctrl.target.set(0, 3.2, 0);
    } else if (viewName === 'crops') {
        if (btnCrops) btnCrops.classList.add('active');
        cam.position.set(-4.5, 3.2, 6.0);
        ctrl.target.set(-3.2, 1.8, -2.0);
    } else if (viewName === 'ceiling') {
        if (btnCeiling) btnCeiling.classList.add('active');
        cam.position.set(0, 2.8, 7.5);
        ctrl.target.set(0, 5.8, -4.0);
    }
    ctrl.update();
};

window.sfToggle3DRotate = function() {
    if (!window.sf3D || !window.sf3D.controls) return;
    window.sf3D.autoRotate = !window.sf3D.autoRotate;
    window.sf3D.controls.autoRotate = window.sf3D.autoRotate;
    var btn = document.getElementById('sf-cam-rotate');
    if (btn) {
        if (window.sf3D.autoRotate) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }
};

window.sfHighlightDeviceInDrawer = function(deviceKey, deviceName) {
    window.sfOpenZoneDrawer('A');
    window.sfShowToast('👉 Đang chọn thiết bị: ' + deviceName, 'info');

    setTimeout(function() {
        var card = null;
        if (deviceKey === 'quat') {
            card = document.getElementById('dev-badge-fan') ? document.getElementById('dev-badge-fan').closest('.sf-device-card') : null;
        } else if (deviceKey === 'phun_suong') {
            card = document.getElementById('dev-badge-mist') ? document.getElementById('dev-badge-mist').closest('.sf-device-card') : null;
        }

        if (card) {
            card.classList.add('sf-highlighted');
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(function() {
                card.classList.remove('sf-highlighted');
            }, 3000);
        }
    }, 250);
};

window.sfFocusFirstPlant = function(plantId) {
    if (!window.sf3D || !window.sf3D.interactiveObjects) {
        window.sfOpenPlantDrawer({
            id: 'GH01-P05',
            plantName: 'Dưa Lưới Hoàng Kim',
            bedName: 'Luống 01 (Dãy Tây Bắc) • Gốc #05',
            variety: 'Muskmelon Snow White F1',
            moisture: 72,
            temp: 26.5,
            age: 45,
            harvestDays: 20,
            ph: 6.2,
            ec: 1.8,
            lux: 8400,
            brix: 14.2,
            health: '🟢 Rất khỏe mạnh (Tối ưu)'
        });
        return;
    }

    var targetPlant = null;
    for (var i = 0; i < window.sf3D.interactiveObjects.length; i++) {
        var obj = window.sf3D.interactiveObjects[i];
        if (obj.userData && obj.userData.type === 'plant') {
            if (!plantId || obj.userData.id === plantId || obj.userData.id === ('GH01-P' + plantId)) {
                targetPlant = obj.userData;
                break;
            }
        }
    }

    if (targetPlant) {
        window.sfShowToast('🌱 Đang kiểm tra ' + (targetPlant.plantName || 'Cây') + ' #' + targetPlant.id, 'success');
        if (window.sf3D.controls && window.sf3D.camera) {
            var tx = targetPlant.posX || 0;
            var tz = targetPlant.posZ || 0;
            window.sf3D.controls.target.set(tx, 1.8, tz);
            window.sf3D.camera.position.set(tx + (tx > 0 ? -2.2 : 2.2), 2.5, tz + 3.2);
            window.sf3D.controls.update();
        }
        window.sfOpenPlantDrawer(targetPlant);
    } else {
        window.sfOpenPlantDrawer({
            id: 'GH01-P05',
            plantName: 'Dưa Lưới Hoàng Kim',
            bedName: 'Luống 01 (Dãy Tây Bắc) • Gốc #05',
            variety: 'Muskmelon Snow White F1',
            moisture: 72,
            temp: 26.5,
            age: 45,
            harvestDays: 20,
            ph: 6.2,
            ec: 1.8,
            lux: 8400,
            brix: 14.2,
            health: '🟢 Rất khỏe mạnh (Tối ưu)'
        });
    }
};

// Weather Refresh Handler (1-Click Instant Refresh & Toast Feedback)
window.sfRefreshWeather = function(btn) {
    if (!btn) btn = document.getElementById('sf-btn-refresh-weather');
    if (!btn || btn.disabled) return;

    var icon = btn.querySelector('.sf-refresh-icon');
    if (icon) icon.classList.add('spin');
    btn.disabled = true;

    fetch('/smart_farm/api/weather/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({})
    })
    .then(function(res) {
        return res.json();
    })
    .then(function(result) {
        if (result && result.success && result.data) {
            var data = result.data;
            // Update Temp
            var tempEl = document.getElementById('sf-weather-temp-val');
            if (tempEl && data.temperature !== undefined) tempEl.textContent = data.temperature;

            // Update Icon
            var iconEl = document.getElementById('sf-weather-main-icon');
            if (iconEl && data.icon) {
                iconEl.textContent = data.icon;
                if (data.desc) iconEl.setAttribute('title', data.desc);
            }

            // Update Wind
            var windEl = document.getElementById('sf-weather-wind-val');
            if (windEl && data.windspeed !== undefined) windEl.textContent = data.windspeed;

            // Update Humidity
            var humEl = document.getElementById('sf-weather-hum-val');
            if (humEl && data.humidity !== undefined) humEl.textContent = data.humidity;

            // Update Location
            var locEl = document.getElementById('sf-weather-location-val');
            if (locEl && data.location) locEl.textContent = data.location;

            // Update Badge
            var badgeEl = document.getElementById('sf-weather-source-badge');
            if (badgeEl && data.source) {
                if (data.source === 'live') badgeEl.textContent = 'Trực tiếp';
                else if (data.source === 'db') badgeEl.textContent = 'Từ DB';
                else badgeEl.textContent = 'Mẫu';
            }

            // Update Forecast
            var fcListEl = document.getElementById('sf-weather-forecast-list');
            if (fcListEl && Array.isArray(data.forecast) && data.forecast.length > 0) {
                var html = '';
                data.forecast.forEach(function(fc) {
                    html += '<div class="sf-fc-day">' +
                        '<div class="sf-fc-label">' + (fc.day || '') + '</div>' +
                        '<div class="sf-fc-icon" title="' + (fc.desc || '') + '">' + (fc.icon || '🌤️') + '</div>' +
                        '<div class="sf-fc-temp">' + (fc.temp || '') + '</div>' +
                    '</div>';
                });
                fcListEl.innerHTML = html;
            }

            // Update Agri Advice
            var adviceEl = document.getElementById('sf-weather-agri-advice');
            if (data.agri_advice) {
                if (!adviceEl) {
                    var card = btn.closest('.sf-card');
                    if (card) {
                        adviceEl = document.createElement('div');
                        adviceEl.className = 'sf-weather-advice';
                        adviceEl.id = 'sf-weather-agri-advice';
                        card.appendChild(adviceEl);
                    }
                }
                if (adviceEl) adviceEl.textContent = data.agri_advice;
            }

            // Trigger Toast (4 seconds)
            if (typeof window.sfShowToast === 'function') {
                window.sfShowToast({
                    title: 'Thời tiết Hà Nội',
                    message: result.message || 'Đã cập nhật dữ liệu thời tiết mới nhất!',
                    type: 'success',
                    duration: 4000
                });
            }
        } else {
            if (typeof window.sfShowToast === 'function') {
                window.sfShowToast({
                    title: 'Làm mới thời tiết',
                    message: (result && result.message) || 'Không thể cập nhật dữ liệu thời tiết.',
                    type: 'warning',
                    duration: 4000
                });
            }
        }
    })
    .catch(function(err) {
        console.error('Weather refresh error:', err);
        if (typeof window.sfShowToast === 'function') {
            window.sfShowToast({
                title: 'Lỗi mạng',
                message: 'Không thể kết nối đến máy chủ để làm mới thời tiết.',
                type: 'error',
                duration: 4000
            });
        }
    })
    .finally(function() {
        if (icon) icon.classList.remove('spin');
        btn.disabled = false;
    });
};