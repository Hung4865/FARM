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
    if (counts) {
        var doneStat = document.getElementById('sf-task-stat-done');
        var remainingStat = document.getElementById('sf-task-stat-remaining');
        if (doneStat && counts.task_done !== undefined) {
            doneStat.innerText = '✓ ' + counts.task_done + ' hoàn thành';
        }
        if (remainingStat && counts.task_remaining !== undefined) {
            remainingStat.innerText = counts.task_remaining + ' còn lại';
        }
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

window.sfResolveAlertFromPopover = function() {
    if (!currentAlertId) return;
    var btn = document.getElementById('sf-alert-resolve-btn');
    if (btn) btn.disabled = true;

    fetch('/smart_farm/api/alert/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: currentAlertId })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success) {
            window.sfShowToast(data.message || 'Đã xử lý cảnh báo!', 'success');
            if (currentAlertBeaconEl) {
                currentAlertBeaconEl.remove();
            }
            window.sfHideAlertDetails();
            var dots = document.querySelectorAll('.sf-badge-dot');
            if (data.unresolved_count === 0) {
                dots.forEach(function(dot) { dot.classList.add('sf-dot-idle'); });
            }
        } else {
            window.sfShowToast(data.message || 'Không thể xử lý cảnh báo', 'error');
        }
    })
    .catch(function(err) {
        console.error(err);
        window.sfShowToast('Lỗi kết nối khi xử lý cảnh báo!', 'error');
    })
    .finally(function() {
        if (btn) btn.disabled = false;
    });
};

// 4. Zone Drawer & Device Controls (T013)
window.sfOpenZoneDrawer = function(zoneId) {
    var drawer = document.getElementById('sf-zone-drawer');
    var backdrop = document.getElementById('sf-drawer-backdrop');
    if (!drawer) return;

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
                { id: 'mist', name: 'Hệ thống phun sương làm mát', sub: 'Tự động kích hoạt khi nhiệt độ > 32°C', icon: '💨', defaultState: true },
                { id: 'fan', name: 'Quạt thông gió đối lưu', sub: 'Lưu thông không khí nhà kính', icon: '🌀', defaultState: true },
                { id: 'shade', name: 'Hệ thống mái che tự động', sub: 'Giảm bức xạ nhiệt buổi trưa', icon: '⛺', defaultState: false }
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
                { id: 'drip', name: 'Hệ thống tưới nhỏ giọt ngầm', sub: 'Van tưới điện từ thông minh Zone B', icon: '💧', defaultState: false },
                { id: 'fert', name: 'Hệ thống châm phân bón tự động', sub: 'Bơm định lượng Venturi hòa tan', icon: '🌱', defaultState: false }
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
                { id: 'pump', name: 'Trạm máy bơm cấp nước hồ chứa', sub: 'Công suất 15kW bơm nước lên kênh dẫn', icon: '🌊', defaultState: true },
                { id: 'aerator', name: 'Máy sục khí đáy hồ sinh học', sub: 'Tăng lượng oxy hòa tan trong nước', icon: '🫧', defaultState: true }
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
            var stateText = dev.defaultState ? 'ĐANG CHẠY' : 'ĐANG TẮT';
            var stateClass = dev.defaultState ? 'active' : 'inactive';
            card.innerHTML =
                '<div class="sf-device-info">' +
                    '<div class="sf-device-icon">' + dev.icon + '</div>' +
                    '<div>' +
                        '<div class="sf-device-name">' +
                            dev.name +
                            '<span class="sf-device-status-badge ' + stateClass + '" id="dev-badge-' + dev.id + '">' + stateText + '</span>' +
                        '</div>' +
                        '<div class="sf-device-sub">' + dev.sub + '</div>' +
                    '</div>' +
                '</div>' +
                '<label class="sf-switch">' +
                    '<input type="checkbox" ' + (dev.defaultState ? 'checked' : '') + ' onchange="sfToggleDevice(\'' + zoneId + '\', \'' + dev.id + '\', this)"/>' +
                    '<span class="sf-slider"></span>' +
                '</label>';
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

window.sfCloseZoneDrawer = function() {
    var drawer = document.getElementById('sf-zone-drawer');
    var backdrop = document.getElementById('sf-drawer-backdrop');
    if (drawer) drawer.classList.remove('show');
    if (backdrop) backdrop.classList.remove('show');
    setTimeout(function() {
        if (drawer && !drawer.classList.contains('show')) drawer.style.display = 'none';
        if (backdrop && !backdrop.classList.contains('show')) backdrop.style.display = 'none';
    }, 350);
};

window.sfToggleDevice = function(zone, device, checkboxEl) {
    var isChecked = checkboxEl.checked;
    var badge = document.getElementById('dev-badge-' + device);
    if (badge) {
        badge.textContent = isChecked ? 'ĐANG CHẠY' : 'ĐANG TẮT';
        badge.className = 'sf-device-status-badge ' + (isChecked ? 'active' : 'inactive');
    }
    fetch('/smart_farm/api/zone/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone: zone, device: device, state: isChecked })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success) {
            window.sfShowToast(data.message, 'success');
        } else {
            window.sfShowToast(data.message || 'Lỗi khi điều khiển thiết bị', 'error');
            checkboxEl.checked = !isChecked;
            if (badge) {
                badge.textContent = !isChecked ? 'ĐANG CHẠY' : 'ĐANG TẮT';
                badge.className = 'sf-device-status-badge ' + (!isChecked ? 'active' : 'inactive');
            }
        }
    })
    .catch(function(err) {
        console.error(err);
        window.sfShowToast('Lỗi kết nối khi gửi lệnh điều khiển!', 'error');
        checkboxEl.checked = !isChecked;
        if (badge) {
            badge.textContent = !isChecked ? 'ĐANG CHẠY' : 'ĐANG TẮT';
            badge.className = 'sf-device-status-badge ' + (!isChecked ? 'active' : 'inactive');
        }
    });
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