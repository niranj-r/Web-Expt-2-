// =====================================================
// TECHFEST 2026 - ORGANIZER DASHBOARD & TASK MANAGER
// =====================================================

const PARTICIPANTS_KEY = "hash26Participants";
const TASKS_KEY = "hash26Tasks";

// =====================================================
// TASK MANAGER CLASS (ES6+)
// =====================================================

class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = "all";
    }

    loadTasks() {
        const stored = localStorage.getItem(TASKS_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Error loading tasks", e);
            }
        }
        // Seed sample tasks if empty
        const defaultTasks = [
            { id: 1, text: "Verify event stage AV equipment setup", completed: true, createdAt: new Date().toLocaleDateString() },
            { id: 2, text: "Confirm CTF server hosting credentials", completed: false, createdAt: new Date().toLocaleDateString() },
            { id: 3, text: "Distribute participant identity badges", completed: false, createdAt: new Date().toLocaleDateString() }
        ];
        localStorage.setItem(TASKS_KEY, JSON.stringify(defaultTasks));
        return defaultTasks;
    }

    saveTasks() {
        localStorage.setItem(TASKS_KEY, JSON.stringify(this.tasks));
    }

    addTask(text) {
        const cleanText = text.trim();
        if (!cleanText) return null;

        const task = {
            id: Date.now(),
            text: cleanText,
            completed: false,
            createdAt: new Date().toLocaleDateString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        return task;
    }

    toggleTask(id) {
        const task = this.tasks.find(t => String(t.id) === String(id));
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => String(t.id) !== String(id));
        this.saveTasks();
    }

    getTasks(filter = "all") {
        if (filter === "pending") return this.tasks.filter(t => !t.completed);
        if (filter === "completed") return this.tasks.filter(t => t.completed);
        return this.tasks;
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(t => !t.completed);
        this.saveTasks();
    }
}

// =====================================================
// DASHBOARD PARTICIPANT MANAGER
// =====================================================

class DashboardParticipantManager {
    constructor() {
        this.participants = this.loadParticipants();
    }

    loadParticipants() {
        const stored = localStorage.getItem(PARTICIPANTS_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Error loading participants", e);
            }
        }
        return [];
    }

    saveParticipants() {
        localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(this.participants));
    }

    getAllParticipants() {
        this.participants = this.loadParticipants();
        return this.participants;
    }

    getParticipant(id) {
        return this.getAllParticipants().find(p => String(p.id) === String(id));
    }

    updateParticipant(id, updatedData) {
        this.getAllParticipants();
        const index = this.participants.findIndex(p => String(p.id) === String(id));
        if (index > -1) {
            this.participants[index] = { ...this.participants[index], ...updatedData };
            this.saveParticipants();
            return this.participants[index];
        }
        return null;
    }

    deleteParticipant(id) {
        this.getAllParticipants();
        this.participants = this.participants.filter(p => String(p.id) !== String(id));
        this.saveParticipants();
    }

    searchParticipants(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        const all = this.getAllParticipants();
        if (!term) return all;

        return all.filter(p =>
            (p.fullName && p.fullName.toLowerCase().includes(term)) ||
            (p.email && p.email.toLowerCase().includes(term)) ||
            (p.phone && p.phone.includes(term)) ||
            (p.college && p.college.toLowerCase().includes(term)) ||
            String(p.id).toLowerCase().includes(term)
        );
    }

    clearAll() {
        if (confirm("Are you sure you want to delete ALL participants? This cannot be undone.")) {
            this.participants = [];
            this.saveParticipants();
            return true;
        }
        return false;
    }
}

// Instances
const taskManager = new TaskManager();
const dashboardParticipantManager = new DashboardParticipantManager();

// =====================================================
// DASHBOARD INITIALIZATION
// =====================================================

function initializeDashboard() {
    renderParticipantStats();
    renderParticipantsList();
    setupParticipantSearch();
    setupTaskManagerUI();
    setupLogoutButton();
}

function renderParticipantStats() {
    const totalEl = document.getElementById("totalParticipants");
    if (totalEl) {
        totalEl.textContent = dashboardParticipantManager.getAllParticipants().length;
    }
}

function renderParticipantsList(customList = null) {
    const container = document.getElementById("participantsList");
    if (!container) return;

    const participants = customList !== null ? customList : dashboardParticipantManager.getAllParticipants();

    if (participants.length === 0) {
        container.innerHTML = `<p style="text-align: center; padding: 25px; color: #777;">No participants registered.</p>`;
        return;
    }

    container.innerHTML = `
        <div class="participants-table-wrapper" style="overflow-x: auto;">
            <table class="participants-table" style="width:100%; border-collapse: collapse; margin-top:10px;">
                <thead>
                    <tr style="background: var(--dark-primary, #020035); color: white;">
                        <th style="padding:10px; text-align:left;">ID</th>
                        <th style="padding:10px; text-align:left;">Name</th>
                        <th style="padding:10px; text-align:left;">Email</th>
                        <th style="padding:10px; text-align:left;">Phone</th>
                        <th style="padding:10px; text-align:left;">College</th>
                        <th style="padding:10px; text-align:center;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${participants.map(p => `
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding:10px;"><small><strong>${escapeHtml(p.id)}</strong></small></td>
                            <td style="padding:10px;">${escapeHtml(p.fullName)}</td>
                            <td style="padding:10px;">${escapeHtml(p.email)}</td>
                            <td style="padding:10px;">${escapeHtml(p.phone)}</td>
                            <td style="padding:10px;">${escapeHtml(p.college)}</td>
                            <td style="padding:10px; text-align:center; white-space:nowrap;">
                                <button class="btn-action btn-edit" onclick="editDashboardParticipant('${p.id}')">Edit</button>
                                <button class="btn-action btn-delete" onclick="deleteDashboardParticipant('${p.id}')" style="background:#dc3545;">Delete</button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function setupParticipantSearch() {
    const input = document.getElementById("participantSearchInput");
    if (!input) return;

    input.addEventListener("input", (e) => {
        const results = dashboardParticipantManager.searchParticipants(e.target.value);
        renderParticipantsList(results);
    });
}

function editDashboardParticipant(id) {
    const p = dashboardParticipantManager.getParticipant(id);
    if (!p) return;

    let modal = document.getElementById("organizerEditModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "organizerEditModal";
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center;
            z-index: 10000; padding: 20px;
        `;
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div style="background: white; padding: 25px; max-width: 500px; width: 100%; border-radius: 8px; border-top: 5px solid var(--highlight, #ED4B00);">
            <h2 style="margin-bottom: 15px; color: var(--dark-primary, #020035);">Edit Participant Details</h2>
            <form id="orgEditForm">
                <div style="margin-bottom: 10px;">
                    <label style="display:block; font-weight:bold; margin-bottom:4px;">Full Name</label>
                    <input type="text" id="orgEditName" class="form-input" value="${escapeHtml(p.fullName)}" required style="width:100%; padding:8px;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display:block; font-weight:bold; margin-bottom:4px;">Email</label>
                    <input type="email" id="orgEditEmail" class="form-input" value="${escapeHtml(p.email)}" required style="width:100%; padding:8px;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display:block; font-weight:bold; margin-bottom:4px;">Phone</label>
                    <input type="tel" id="orgEditPhone" class="form-input" value="${escapeHtml(p.phone)}" required style="width:100%; padding:8px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display:block; font-weight:bold; margin-bottom:4px;">College</label>
                    <input type="text" id="orgEditCollege" class="form-input" value="${escapeHtml(p.college)}" required style="width:100%; padding:8px;">
                </div>
                <div style="display:flex; justify-content:flex-end; gap:10px;">
                    <button type="button" class="btn-action" onclick="closeOrgEditModal()" style="background:#666;">Cancel</button>
                    <button type="submit" class="btn-action">Save Changes</button>
                </div>
            </form>
        </div>
    `;

    modal.style.display = "flex";

    document.getElementById("orgEditForm").onsubmit = (e) => {
        e.preventDefault();
        const updated = {
            fullName: document.getElementById("orgEditName").value.trim(),
            email: document.getElementById("orgEditEmail").value.trim(),
            phone: document.getElementById("orgEditPhone").value.trim(),
            college: document.getElementById("orgEditCollege").value.trim()
        };
        dashboardParticipantManager.updateParticipant(id, updated);
        closeOrgEditModal();
        renderParticipantsList();
        renderParticipantStats();
    };
}

function closeOrgEditModal() {
    const modal = document.getElementById("organizerEditModal");
    if (modal) modal.style.display = "none";
}

function deleteDashboardParticipant(id) {
    if (confirm(`Delete participant ${id}?`)) {
        dashboardParticipantManager.deleteParticipant(id);
        renderParticipantsList();
        renderParticipantStats();
    }
}

function clearAllParticipants() {
    if (dashboardParticipantManager.clearAll()) {
        renderParticipantsList();
        renderParticipantStats();
    }
}

// Make functions globally available
window.editDashboardParticipant = editDashboardParticipant;
window.closeOrgEditModal = closeOrgEditModal;
window.deleteDashboardParticipant = deleteDashboardParticipant;
window.clearAllParticipants = clearAllParticipants;

// =====================================================
// TASK MANAGER UI & HANDLERS
// =====================================================

function setupTaskManagerUI() {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");

    if (addTaskBtn && taskInput) {
        const handleAddTask = () => {
            const text = taskInput.value.trim();
            if (text) {
                taskManager.addTask(text);
                taskInput.value = "";
                renderTasks();
            }
        };

        addTaskBtn.onclick = handleAddTask;

        taskInput.onkeypress = (e) => {
            if (e.key === "Enter") handleAddTask();
        };
    }

    renderTasks();
}

function renderTasks(filter = "all") {
    const container = document.getElementById("tasksList");
    if (!container) return;

    const tasks = taskManager.getTasks(filter);

    // Filter Buttons Bar
    let filterBar = document.getElementById("taskFilterBar");
    if (!filterBar) {
        filterBar = document.createElement("div");
        filterBar.id = "taskFilterBar";
        filterBar.style.cssText = "display: flex; gap: 8px; margin-bottom: 12px; align-items: center;";
        container.parentNode.insertBefore(filterBar, container);
    }

    filterBar.innerHTML = `
        <button type="button" class="btn-task-filter ${filter === 'all' ? 'active' : ''}" onclick="filterTasks('all')">All (${taskManager.getTasks('all').length})</button>
        <button type="button" class="btn-task-filter ${filter === 'pending' ? 'active' : ''}" onclick="filterTasks('pending')">Pending (${taskManager.getTasks('pending').length})</button>
        <button type="button" class="btn-task-filter ${filter === 'completed' ? 'active' : ''}" onclick="filterTasks('completed')">Completed (${taskManager.getTasks('completed').length})</button>
        ${taskManager.getTasks('completed').length > 0 ? `<button type="button" class="btn-task-filter" style="margin-left:auto; background:#dc3545; color:white;" onclick="clearCompletedTasks()">Clear Completed</button>` : ''}
    `;

    if (tasks.length === 0) {
        container.innerHTML = `<p style="text-align: center; padding: 20px; color: #777; font-style: italic;">No tasks found.</p>`;
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'task-completed' : ''}" style="
            display: flex; justify-content: space-between; align-items: center;
            padding: 12px 15px; margin-bottom: 8px; background: #f9f9f9;
            border-left: 4px solid ${task.completed ? '#28a745' : 'var(--highlight, #ED4B00)'};
            border-radius: 4px; transition: all 0.2s ease;
        ">
            <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="toggleTaskHandler('${task.id}')"
                       style="width: 18px; height: 18px; cursor: pointer;">
                <span class="task-text" style="font-size: 15px; ${task.completed ? 'text-decoration: line-through; color: #888;' : 'color: #222; font-weight: 500;'}">
                    ${escapeHtml(task.text)}
                </span>
            </div>
            <button onclick="deleteTaskHandler('${task.id}')" style="
                background: #dc3545; color: white; border: none; padding: 5px 10px;
                border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold;
            ">Delete</button>
        </div>
    `).join("");
}

function filterTasks(filter) {
    taskManager.currentFilter = filter;
    renderTasks(filter);
}

function toggleTaskHandler(id) {
    taskManager.toggleTask(id);
    renderTasks(taskManager.currentFilter);
}

function deleteTaskHandler(id) {
    taskManager.deleteTask(id);
    renderTasks(taskManager.currentFilter);
}

function clearCompletedTasks() {
    taskManager.clearCompleted();
    renderTasks(taskManager.currentFilter);
}

window.filterTasks = filterTasks;
window.toggleTaskHandler = toggleTaskHandler;
window.deleteTaskHandler = deleteTaskHandler;
window.clearCompletedTasks = clearCompletedTasks;

// =====================================================
// LOGOUT HANDLER
// =====================================================

function setupLogoutButton() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem("organizerLoggedIn");
            localStorage.removeItem("organizerUsername");
            alert("Logged out successfully.");
            window.location.href = "organizer.html";
        };
    }
}

// Utility: HTML Sanitizer
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    // Auth check for dashboard
    if (window.location.pathname.includes("organizer-dashboard.html")) {
        if (!localStorage.getItem("organizerLoggedIn")) {
            window.location.href = "organizer.html";
            return;
        }
    }

    initializeDashboard();
});
