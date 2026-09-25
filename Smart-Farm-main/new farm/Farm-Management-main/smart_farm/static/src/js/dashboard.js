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