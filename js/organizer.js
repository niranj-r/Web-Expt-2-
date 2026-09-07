// =====================================================
// ORGANIZER DASHBOARD FUNCTIONALITY
// =====================================================

const STORAGE_KEY = "hash26Participants";
const TASKS_KEY = "hash26Tasks";

// =====================================================
// TASK MANAGER CLASS
// =====================================================

class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
    }

    loadTasks() {
        return JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
    }

    saveTasks() {
        localStorage.setItem(TASKS_KEY, JSON.stringify(this.tasks));
    }

    addTask(text) {
        const task = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toLocaleString()
        };
        this.tasks.push(task);
        this.saveTasks();
        return task;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
        }
    }

    getAllTasks() {
        return this.tasks;
    }

    clearAll() {
        this.tasks = [];
        this.saveTasks();
    }
}

// =====================================================
// PARTICIPANT MANAGER CLASS (Dashboard View)
// =====================================================

class DashboardParticipantManager {
    constructor() {
        this.participants = this.loadParticipants();
    }

    loadParticipants() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    saveParticipants() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.participants));
    }

    getAllParticipants() {
        return this.participants;
    }

    getParticipant(id) {
        return this.participants.find(p => p.id === id);
    }

    updateParticipant(id, updatedData) {
        const index = this.participants.findIndex(p => p.id === id);
        if (index > -1) {
            this.participants[index] = { ...this.participants[index], ...updatedData };
            this.saveParticipants();
            return this.participants[index];
        }
    }

    deleteParticipant(id) {
        this.participants = this.participants.filter(p => p.id !== id);
        this.saveParticipants();
    }

    searchParticipants(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return this.participants;

        return this.participants.filter(p =>
            p.fullName?.toLowerCase().includes(term) ||
            p.email?.toLowerCase().includes(term) ||
            String(p.id).includes(term)
        );
    }

    clearAll() {
        if (confirm("Are you sure you want to delete all participants? This cannot be undone.")) {
            this.participants = [];
            this.saveParticipants();
            return true;
        }
        return false;
    }
}

// Global instances
let dashboardParticipantManager = new DashboardParticipantManager();
let taskManager = new TaskManager();

// =====================================================
// DASHBOARD INITIALIZATION
// =====================================================

function initializeDashboard() {
    initializeParticipantDisplay();
    initializeParticipantSearch();
    initializeTaskManager();
    initializeLogout();
    displayParticipantStats();
}

// =====================================================
// PARTICIPANT DISPLAY
// =====================================================

function displayParticipantStats() {
    const countElement = document.getElementById("totalParticipants");
    if (countElement) {
        countElement.textContent = dashboardParticipantManager.getAllParticipants().length;
    }
}

function initializeParticipantDisplay() {
    const container = document.getElementById("participantsList");
    if (!container) return;

    displayParticipants(dashboardParticipantManager.getAllParticipants(), container);
}

function displayParticipants(participants, container) {
    if (participants.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">No participants found.</p>';
        return;
    }

    container.innerHTML = `
        <div class="participants-table-wrapper">
            <table class="participants-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>College</th>
                        <th>ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${participants.map(p => `
                        <tr data-participant-id="${p.id}">
                            <td>${p.fullName || 'N/A'}</td>
                            <td>${p.email || 'N/A'}</td>
                            <td>${p.phone || 'N/A'}</td>
                            <td>${p.college || 'N/A'}</td>
                            <td><small>${p.id}</small></td>
                            <td>
                                <button class="btn-action btn-edit" data-id="${p.id}">Edit</button>
                                <button class="btn-action btn-delete" data-id="${p.id}">Delete</button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;

    // Add event listeners
    container.querySelectorAll(".btn-edit").forEach(btn => {
        btn.addEventListener("click", (e) => editParticipant(e.target.dataset.id));
    });

    container.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", (e) => deleteParticipant(e.target.dataset.id));
    });
}

function editParticipant(id) {
    const participant = dashboardParticipantManager.getParticipant(parseInt(id));
    if (!participant) return;

    // Show edit modal or form
    const editForm = document.getElementById("editParticipantForm");
    if (!editForm) {
        // Create modal if it doesn't exist
        const modal = document.createElement("div");
        modal.id = "editModal";
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <h2>Edit Participant</h2>
                    <form id="editParticipantForm">
                        <input type="hidden" id="editParticipantId">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="editFullName" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="editEmail" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="tel" id="editPhone" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label>College</label>
                            <input type="text" id="editCollege" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label>Department</label>
                            <input type="text" id="editDepartment" class="form-input" required>
                        </div>
                        <div class="modal-buttons">
                            <button type="submit" class="btn-action">Save Changes</button>
                            <button type="button" class="btn-action" onclick="closeEditModal()">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        addModalStyles();
    }

    // Populate form
    document.getElementById("editParticipantId").value = participant.id;
    document.getElementById("editFullName").value = participant.fullName || "";
    document.getElementById("editEmail").value = participant.email || "";
    document.getElementById("editPhone").value = participant.phone || "";
    document.getElementById("editCollege").value = participant.college || "";
    document.getElementById("editDepartment").value = participant.department || "";

    // Show modal
    document.getElementById("editModal").style.display = "flex";

    // Handle form submission
    const form = document.getElementById("editParticipantForm");
    form.onsubmit = (e) => {
        e.preventDefault();
        const updatedData = {
            fullName: document.getElementById("editFullName").value,
            email: document.getElementById("editEmail").value,
            phone: document.getElementById("editPhone").value,
            college: document.getElementById("editCollege").value,
            department: document.getElementById("editDepartment").value
        };

        dashboardParticipantManager.updateParticipant(parseInt(participant.id), updatedData);
        closeEditModal();
        initializeParticipantDisplay();
        displayParticipantStats();
    };
}

function closeEditModal() {
    const modal = document.getElementById("editModal");
    if (modal) modal.style.display = "none";
}

function deleteParticipant(id) {
    if (confirm("Are you sure you want to delete this participant?")) {
        dashboardParticipantManager.deleteParticipant(parseInt(id));
        initializeParticipantDisplay();
        displayParticipantStats();
    }
}

function addModalStyles() {
    const style = document.createElement("style");
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 5000;
        }

        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .modal-content h2 {
            margin-bottom: 20px;
            color: #020035;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #020035;
        }

        .form-input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
        }

        .modal-buttons {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }

        .modal-buttons button {
            flex: 1;
        }

        .participants-table-wrapper {
            overflow-x: auto;
        }

        .participants-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .participants-table th,
        .participants-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        .participants-table th {
            background-color: #020035;
            color: #F2F3F4;
            font-weight: 600;
        }

        .participants-table tr:hover {
            background-color: #f5f5f5;
        }

        .btn-action {
            padding: 8px 16px;
            background-color: #ED4B00;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            transition: background-color 0.3s ease;
            margin-right: 5px;
        }

        .btn-action:hover {
            background-color: #020035;
        }
    `;
    document.head.appendChild(style);
}

// =====================================================
// PARTICIPANT SEARCH
// =====================================================

function initializeParticipantSearch() {
    const searchInput = document.getElementById("participantSearchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value;
        const results = dashboardParticipantManager.searchParticipants(searchTerm);
        const container = document.getElementById("participantsList");
        displayParticipants(results, container);
    });
}

// =====================================================
// TASK MANAGER
// =====================================================

function initializeTaskManager() {
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskInput = document.getElementById("taskInput");

    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", () => {
            if (taskInput.value.trim()) {
                taskManager.addTask(taskInput.value);
                taskInput.value = "";
                displayTasks();
            }
        });
    }

    if (taskInput) {
        taskInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                addTaskBtn?.click();
            }
        });
    }

    displayTasks();
}

function displayTasks() {
    const container = document.getElementById("tasksList");
    if (!container) return;

    const tasks = taskManager.getAllTasks();

    if (tasks.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">No tasks yet. Add one to get started!</p>';
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'task-completed' : ''}">
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="toggleTask(${task.id})">
                <span class="task-text">${task.text}</span>
            </div>
            <button class="btn-delete-task" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `).join("");

    addTaskStyles();
}

function toggleTask(id) {
    taskManager.toggleTask(id);
    displayTasks();
}

function deleteTask(id) {
    taskManager.deleteTask(id);
    displayTasks();
}

function addTaskStyles() {
    if (!document.querySelector("style[data-tasks]")) {
        const style = document.createElement("style");
        style.setAttribute("data-tasks", "true");
        style.textContent = `
            .task-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background: #f9f9f9;
                border-left: 4px solid #ED4B00;
                margin-bottom: 10px;
                border-radius: 4px;
                transition: all 0.3s ease;
            }

            .task-item:hover {
                background: #f0f0f0;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .task-completed {
                opacity: 0.6;
            }

            .task-completed .task-text {
                text-decoration: line-through;
                color: #999;
            }

            .task-content {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
            }

            .task-checkbox {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }

            .task-text {
                font-size: 16px;
                color: #333;
            }

            .btn-delete-task {
                background-color: #dc3545;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
                transition: background-color 0.3s ease;
            }

            .btn-delete-task:hover {
                background-color: #c82333;
            }
        `;
        document.head.appendChild(style);
    }
}

// =====================================================
// LOGOUT
// =====================================================

function initializeLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("organizerLoggedIn");
            alert("You have been logged out successfully.");
            window.location.href = "organizer-login.html";
        });
    }
}

// =====================================================
// CLEAR ALL PARTICIPANTS
// =====================================================

function clearAllParticipants() {
    if (dashboardParticipantManager.clearAll()) {
        initializeParticipantDisplay();
        displayParticipantStats();
        alert("All participants have been cleared.");
    }
}

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    if (!localStorage.getItem("organizerLoggedIn")) {
        window.location.href = "organizer-login.html";
    }

    initializeDashboard();
});
