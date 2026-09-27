// =====================================================
// TECHFEST 2026 - MODULE 2 - JAVASCRIPT ENHANCEMENTS
// =====================================================

// Storage Keys
const STORAGE_KEY = "hash26Participants";
const VISITOR_NAME_KEY = "hash26VisitorName";
const THEME_PREF_KEY = "hash26ThemePref";

// Initial seed data if storage is empty
const INITIAL_PARTICIPANTS = [
    {
        id: "REG-1001",
        fullName: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "9876543210",
        dob: "2003-05-14",
        gender: "male",
        college: "MBCET Trivandrum",
        department: "cs",
        year: "3",
        events: ["Hack The Grid", "Algorithmic Art"],
        message: "Excited for the hackathon!",
        registeredAt: new Date(Date.now() - 86400000 * 2).toLocaleString()
    },
    {
        id: "REG-1002",
        fullName: "Priya Sharma",
        email: "priya.s@example.com",
        phone: "9812345678",
        dob: "2004-09-21",
        gender: "female",
        college: "CET Trivandrum",
        department: "it",
        year: "2",
        events: ["Capture The Flag", "Design Sprint"],
        message: "Looking forward to security CTF.",
        registeredAt: new Date(Date.now() - 86400000).toLocaleString()
    }
];

// =====================================================
// PARTICIPANT MANAGER CLASS (ES6+)
// =====================================================

class ParticipantManager {
    constructor() {
        this.participants = this.loadParticipants();
    }

    loadParticipants() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Error parsing participants from storage", e);
            }
        }
        // Seed initial participants if empty
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PARTICIPANTS));
        return INITIAL_PARTICIPANTS;
    }

    saveParticipants() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.participants));
    }

    addParticipant(data) {
        const newParticipant = {
            id: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
            fullName: data.fullName.trim(),
            email: data.email.trim(),
            phone: data.phone.trim(),
            dob: data.dob,
            gender: data.gender,
            college: data.college.trim(),
            department: data.department,
            year: data.year,
            events: data.events || [],
            message: data.message ? data.message.trim() : "",
            registeredAt: new Date().toLocaleString()
        };

        this.participants.unshift(newParticipant);
        this.saveParticipants();
        return newParticipant;
    }

    updateParticipant(id, updatedData) {
        const index = this.participants.findIndex(p => String(p.id) === String(id));
        if (index > -1) {
            this.participants[index] = { ...this.participants[index], ...updatedData };
            this.saveParticipants();
            return this.participants[index];
        }
        return null;
    }

    getParticipant(id) {
        return this.participants.find(p => String(p.id) === String(id));
    }

    getAllParticipants() {
        return this.participants;
    }

    deleteParticipant(id) {
        this.participants = this.participants.filter(p => String(p.id) !== String(id));
        this.saveParticipants();
    }

    clearAll() {
        this.participants = [];
        this.saveParticipants();
    }

    searchParticipants(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return this.participants;

        const departmentNames = {
            cs: "computer science",
            it: "information technology",
            ee: "electrical engineering",
            me: "mechanical engineering",
            des: "design",
            other: "other"
        };

        return this.participants.filter(p => {
            const deptText = (departmentNames[p.department] || p.department || "").toLowerCase();
            const eventsText = (p.events || []).join(" ").toLowerCase();
            return (
                (p.fullName && p.fullName.toLowerCase().includes(term)) ||
                (p.email && p.email.toLowerCase().includes(term)) ||
                (p.phone && p.phone.includes(term)) ||
                (p.college && p.college.toLowerCase().includes(term)) ||
                deptText.includes(term) ||
                eventsText.includes(term) ||
                String(p.id).toLowerCase().includes(term)
            );
        });
    }
}

// Global instance
const participantManager = new ParticipantManager();
window.participantManager = participantManager;

// =====================================================
// REGISTRATION FORM VALIDATION (REGULAR EXPRESSIONS)
// =====================================================

const ValidationRules = {
    fullName: {
        regex: /^[A-Za-z\s]{2,50}$/,
        message: "Full name must contain only letters and spaces (2-50 characters)."
    },
    email: {
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Please enter a valid email address (e.g. user@domain.com)."
    },
    phone: {
        regex: /^(\+91[\-\s]?)?[6-9]\d{9}$/,
        message: "Enter a valid 10-digit phone number (e.g. 9876543210 or +91 9876543210)."
    },
    college: {
        regex: /^.{3,100}$/,
        message: "College/University name must be at least 3 characters long."
    }
};

function setupFormValidation() {
    const form = document.querySelector(".registration-form") || document.getElementById("registrationForm");
    if (!form) return;

    // Attach ID if missing
    if (!form.id) form.id = "registrationForm";

    // Setup inline error containers
    const inputsToValidate = [
        { id: "fullName", rule: ValidationRules.fullName },
        { id: "email", rule: ValidationRules.email },
        { id: "phone", rule: ValidationRules.phone },
        { id: "college", rule: ValidationRules.college }
    ];

    inputsToValidate.forEach(({ id, rule }) => {
        const input = document.getElementById(id);
        if (!input) return;

        createErrorSpan(input);

        input.addEventListener("blur", () => validateField(input, rule));
        input.addEventListener("input", () => {
            if (input.classList.contains("is-invalid")) {
                validateField(input, rule);
            }
        });
    });

    // Select dropdowns validation
    ["department", "year", "dob"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        createErrorSpan(el);
        el.addEventListener("change", () => validateRequiredField(el));
    });

    // Handle Form Submit
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        let isValid = true;
        let firstInvalidField = null;

        // Validate text fields with Regex
        inputsToValidate.forEach(({ id, rule }) => {
            const input = document.getElementById(id);
            if (input) {
                const fieldValid = validateField(input, rule);
                if (!fieldValid) {
                    isValid = false;
                    if (!firstInvalidField) firstInvalidField = input;
                }
            }
        });

        // Validate Selects
        ["department", "year"].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const valid = validateRequiredField(el, "Please select an option.");
                if (!valid) {
                    isValid = false;
                    if (!firstInvalidField) firstInvalidField = el;
                }
            }
        });

        // Validate DOB
        const dobInput = document.getElementById("dob");
        if (dobInput) {
            const valid = validateDob(dobInput);
            if (!valid) {
                isValid = false;
                if (!firstInvalidField) firstInvalidField = dobInput;
            }
        }

        // Validate Gender Radios
        const genderRadios = form.querySelectorAll('input[name="gender"]');
        const genderGroup = form.querySelector('.selection-group') || genderRadios[0]?.closest('.input-field-group');
        let genderChecked = Array.from(genderRadios).some(r => r.checked);
        if (!genderChecked) {
            isValid = false;
            showGroupError(genderGroup, "Please select your gender.");
            if (!firstInvalidField && genderRadios[0]) firstInvalidField = genderRadios[0];
        } else {
            clearGroupError(genderGroup);
        }

        // Validate Events Checkboxes
        const eventBoxes = form.querySelectorAll('input[name="events"]');
        const eventsGroup = eventBoxes[0]?.closest('.input-field-group');
        let eventsChecked = Array.from(eventBoxes).some(cb => cb.checked);
        if (!eventsChecked) {
            isValid = false;
            showGroupError(eventsGroup, "Please select at least one event to participate in.");
            if (!firstInvalidField && eventBoxes[0]) firstInvalidField = eventBoxes[0];
        } else {
            clearGroupError(eventsGroup);
        }

        // Validate Terms Checkbox
        const termsBox = form.querySelector('input[name="terms"]');
        const termsGroup = termsBox?.closest('.terms-agreement-box');
        if (termsBox && !termsBox.checked) {
            isValid = false;
            showGroupError(termsGroup, "You must agree to the Terms & Conditions.");
            if (!firstInvalidField) firstInvalidField = termsBox;
        } else if (termsGroup) {
            clearGroupError(termsGroup);
        }

        if (!isValid) {
            if (firstInvalidField) {
                firstInvalidField.focus();
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Extract Form Data
        const formData = new FormData(form);
        const selectedEvents = Array.from(form.querySelectorAll('input[name="events"]:checked')).map(cb => {
            const label = cb.closest('label')?.textContent.trim() || cb.value;
            return label;
        });

        const newParticipant = {
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            dob: formData.get("dob"),
            gender: formData.get("gender"),
            college: formData.get("college"),
            department: formData.get("department"),
            year: formData.get("year"),
            events: selectedEvents,
            message: formData.get("message")
        };

        // Add to participant manager
        const registered = participantManager.addParticipant(newParticipant);

        // Show Success Feedback Banner
        showSuccessNotification(`Registration Successful! Registration ID: ${registered.id}`);

        // Reset form
        form.reset();
        clearAllValidationErrors(form);

        // Refresh UI components dynamically
        displayParticipantCount();
        displayParticipantList();
        renderParticipantTable();
    });
}

function createErrorSpan(inputElement) {
    let errorSpan = inputElement.parentElement.querySelector(".field-error");
    if (!errorSpan) {
        errorSpan = document.createElement("span");
        errorSpan.className = "field-error";
        errorSpan.style.cssText = "color: #dc3545; font-size: 13px; font-weight: 600; margin-top: 5px; display: none;";
        inputElement.parentElement.appendChild(errorSpan);
    }
    return errorSpan;
}

function validateField(input, rule) {
    const value = input.value.trim();
    const errorSpan = createErrorSpan(input);

    if (!value) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        errorSpan.textContent = "This field is required.";
        errorSpan.style.display = "block";
        return false;
    }

    if (rule && rule.regex && !rule.regex.test(value)) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        errorSpan.textContent = rule.message;
        errorSpan.style.display = "block";
        return false;
    }

    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    errorSpan.textContent = "";
    errorSpan.style.display = "none";
    return true;
}

function validateRequiredField(element, customMsg = "Please select an option.") {
    const value = element.value;
    const errorSpan = createErrorSpan(element);

    if (!value || value === "") {
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
        errorSpan.textContent = customMsg;
        errorSpan.style.display = "block";
        return false;
    }

    element.classList.remove("is-invalid");
    element.classList.add("is-valid");
    errorSpan.textContent = "";
    errorSpan.style.display = "none";
    return true;
}

function validateDob(dobInput) {
    const errorSpan = createErrorSpan(dobInput);
    const value = dobInput.value;

    if (!value) {
        dobInput.classList.add("is-invalid");
        errorSpan.textContent = "Please select your date of birth.";
        errorSpan.style.display = "block";
        return false;
    }

    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (isNaN(birthDate.getTime()) || age < 12 || age > 100) {
        dobInput.classList.add("is-invalid");
        errorSpan.textContent = "Please enter a realistic date of birth (ages 12-100).";
        errorSpan.style.display = "block";
        return false;
    }

    dobInput.classList.remove("is-invalid");
    dobInput.classList.add("is-valid");
    errorSpan.textContent = "";
    errorSpan.style.display = "none";
    return true;
}

function showGroupError(groupContainer, message) {
    if (!groupContainer) return;
    let errorSpan = groupContainer.querySelector(".field-error");
    if (!errorSpan) {
        errorSpan = document.createElement("span");
        errorSpan.className = "field-error";
        errorSpan.style.cssText = "color: #dc3545; font-size: 13px; font-weight: 600; margin-top: 5px; display: block;";
        groupContainer.appendChild(errorSpan);
    }
    errorSpan.textContent = message;
    errorSpan.style.display = "block";
}

function clearGroupError(groupContainer) {
    if (!groupContainer) return;
    const errorSpan = groupContainer.querySelector(".field-error");
    if (errorSpan) {
        errorSpan.textContent = "";
        errorSpan.style.display = "none";
    }
}

function clearAllValidationErrors(form) {
    form.querySelectorAll(".is-invalid, .is-valid").forEach(el => {
        el.classList.remove("is-invalid", "is-valid");
    });
    form.querySelectorAll(".field-error").forEach(el => {
        el.textContent = "";
        el.style.display = "none";
    });
}

function showSuccessNotification(message) {
    const existing = document.getElementById("successToast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "successToast";
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #28a745;
        color: white;
        padding: 16px 24px;
        border-radius: 6px;
        font-family: var(--font-display, sans-serif);
        font-weight: 700;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        animation: toastIn 0.4s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.4s ease";
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// =====================================================
// DYNAMIC PARTICIPANT RENDERING
// =====================================================

function displayParticipantCount() {
    const countElement = document.getElementById("participantCount");
    if (countElement) {
        countElement.textContent = participantManager.getAllParticipants().length;
    }
}

function displayParticipantList(participantsToDisplay = null) {
    const container = document.getElementById("registeredParticipantsList");
    if (!container) return;

    const participants = participantsToDisplay || participantManager.getAllParticipants();

    if (participants.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 25px; color: #666; font-style: italic;">No registered participants match your query.</p>';
        return;
    }

    const deptMap = {
        cs: "Computer Science",
        it: "Information Technology",
        ee: "Electrical Engineering",
        me: "Mechanical Engineering",
        des: "Design",
        other: "Other"
    };

    container.innerHTML = participants.map(p => `
        <div class="participant-card" data-id="${p.id}">
            <div class="participant-info">
                <h4>${escapeHtml(p.fullName)} <small>(${p.id})</small></h4>
                <p><strong>Email:</strong> ${escapeHtml(p.email)} | <strong>Phone:</strong> ${escapeHtml(p.phone)}</p>
                <p><strong>College:</strong> ${escapeHtml(p.college)} | <strong>Dept:</strong> ${deptMap[p.department] || escapeHtml(p.department)} (${p.year} Year)</p>
                <p><strong>Events:</strong> ${Array.isArray(p.events) ? p.events.join(", ") : (p.events || "None")}</p>
                ${p.registeredAt ? `<p><small><strong>Registered:</strong> ${p.registeredAt}</small></p>` : ""}
            </div>
        </div>
    `).join("");
}

// Data table renderer for participant.html page
function renderParticipantTable(searchTerm = "") {
    const tbody = document.getElementById("participantTable");
    if (!tbody) return;

    const participants = searchTerm 
        ? participantManager.searchParticipants(searchTerm)
        : participantManager.getAllParticipants();

    if (participants.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 30px; color: #777;">No participants found.</td></tr>`;
        return;
    }

    const deptMap = {
        cs: "Computer Science",
        it: "Information Technology",
        ee: "Electrical Engineering",
        me: "Mechanical Engineering",
        des: "Design",
        other: "Other"
    };

    tbody.innerHTML = participants.map(p => `
        <tr data-participant-id="${p.id}">
            <td><strong>${escapeHtml(p.fullName)}</strong></td>
            <td>${escapeHtml(p.email)}</td>
            <td>${escapeHtml(p.phone)}</td>
            <td>${escapeHtml(p.dob || "N/A")}</td>
            <td>${escapeHtml(p.gender ? p.gender.toUpperCase() : "N/A")}</td>
            <td>${escapeHtml(p.college)}</td>
            <td>${deptMap[p.department] || escapeHtml(p.department)}</td>
            <td>Year ${escapeHtml(p.year || "N/A")}</td>
            <td>${Array.isArray(p.events) ? p.events.join(", ") : p.events}</td>
            <td>
                <button class="btn-table-action btn-table-edit" onclick="openEditParticipantModal('${p.id}')">Edit</button>
                <button class="btn-table-action btn-table-delete" onclick="handleDeleteParticipant('${p.id}')">Delete</button>
            </td>
        </tr>
    `).join("");
}

// Setup search filter for participant.html
function setupParticipantSearch() {
    const searchInput = document.getElementById("participantSearch");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        renderParticipantTable(e.target.value);
    });
}

// Edit Participant Modal for participant.html & register.html
function openEditParticipantModal(id) {
    const participant = participantManager.getParticipant(id);
    if (!participant) return;

    let modal = document.getElementById("globalEditModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "globalEditModal";
        modal.className = "modal-overlay";
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center;
            z-index: 10000; padding: 20px;
        `;
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-box" style="background: white; padding: 30px; max-width: 550px; width: 100%; border-radius: 8px; border-top: 5px solid var(--highlight, #ED4B00); max-height: 90vh; overflow-y: auto;">
            <h2 style="margin-bottom: 15px; color: var(--dark-primary, #020035);">Edit Participant (${participant.id})</h2>
            <form id="globalEditForm">
                <div style="margin-bottom: 12px;">
                    <label style="display:block; font-weight:bold; margin-bottom:4px;">Full Name</label>
                    <input type="text" id="modalEditName" class="form-input" value="${escapeHtml(participant.fullName)}" required style="width:100%; padding:8px;">
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="display:block; font-weight:bold; margin-bottom:4px;">Email</label>
                    <input type="email" id="modalEditEmail" class="form-input" value="${escapeHtml(participant.email)}" required style="width:100%; padding:8px;">
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="display:block; font-weight:bold; margin-bottom:4px;">Phone</label>
                    <input type="tel" id="modalEditPhone" class="form-input" value="${escapeHtml(participant.phone)}" required style="width:100%; padding:8px;">
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="display:block; font-weight:bold; margin-bottom:4px;">College</label>
                    <input type="text" id="modalEditCollege" class="form-input" value="${escapeHtml(participant.college)}" required style="width:100%; padding:8px;">
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="display:block; font-weight:bold; margin-bottom:4px;">Department</label>
                    <select id="modalEditDept" class="form-input" style="width:100%; padding:8px;">
                        <option value="cs" ${participant.department === 'cs' ? 'selected' : ''}>Computer Science</option>
                        <option value="it" ${participant.department === 'it' ? 'selected' : ''}>Information Technology</option>
                        <option value="ee" ${participant.department === 'ee' ? 'selected' : ''}>Electrical Engineering</option>
                        <option value="me" ${participant.department === 'me' ? 'selected' : ''}>Mechanical Engineering</option>
                        <option value="des" ${participant.department === 'des' ? 'selected' : ''}>Design</option>
                        <option value="other" ${participant.department === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display:block; font-weight:bold; margin-bottom:4px;">Year of Study</label>
                    <select id="modalEditYear" class="form-input" style="width:100%; padding:8px;">
                        <option value="1" ${participant.year === '1' ? 'selected' : ''}>First Year</option>
                        <option value="2" ${participant.year === '2' ? 'selected' : ''}>Second Year</option>
                        <option value="3" ${participant.year === '3' ? 'selected' : ''}>Third Year</option>
                        <option value="4" ${participant.year === '4' ? 'selected' : ''}>Fourth Year</option>
                    </select>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button type="button" class="register-button" onclick="closeGlobalEditModal()" style="background:#666; border-color:#666; padding: 8px 16px;">Cancel</button>
                    <button type="submit" class="register-button" style="padding: 8px 16px;">Save Changes</button>
                </div>
            </form>
        </div>
    `;

    modal.style.display = "flex";

    const editForm = document.getElementById("globalEditForm");
    editForm.onsubmit = (e) => {
        e.preventDefault();
        const updated = {
            fullName: document.getElementById("modalEditName").value.trim(),
            email: document.getElementById("modalEditEmail").value.trim(),
            phone: document.getElementById("modalEditPhone").value.trim(),
            college: document.getElementById("modalEditCollege").value.trim(),
            department: document.getElementById("modalEditDept").value,
            year: document.getElementById("modalEditYear").value
        };

        participantManager.updateParticipant(id, updated);
        closeGlobalEditModal();
        showSuccessNotification(`Participant ${id} updated successfully.`);
        renderParticipantTable();
        displayParticipantList();
        displayParticipantCount();
    };
}

function closeGlobalEditModal() {
    const modal = document.getElementById("globalEditModal");
    if (modal) modal.style.display = "none";
}

function handleDeleteParticipant(id) {
    if (confirm(`Are you sure you want to remove participant ${id}?`)) {
        participantManager.deleteParticipant(id);
        showSuccessNotification(`Participant ${id} deleted.`);
        renderParticipantTable();
        displayParticipantList();
        displayParticipantCount();
    }
}

// Make functions available globally
window.openEditParticipantModal = openEditParticipantModal;
window.closeGlobalEditModal = closeGlobalEditModal;
window.handleDeleteParticipant = handleDeleteParticipant;

// =====================================================
// WELCOME MESSAGE & USER PREFERENCES MANAGER
// =====================================================

class PreferenceManager {
    constructor() {
        this.visitorName = localStorage.getItem(VISITOR_NAME_KEY) || "";
        this.themePref = localStorage.getItem(THEME_PREF_KEY) || "light";
        this.init();
    }

    init() {
        this.applyTheme(this.themePref);
        this.renderHeaderThemeToggle();
        this.renderWelcomeWidget();
    }

    applyTheme(theme) {
        this.themePref = theme;
        localStorage.setItem(THEME_PREF_KEY, theme);
        if (theme === "dark") {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }
    }

    toggleTheme() {
        const nextTheme = this.themePref === "dark" ? "light" : "dark";
        this.applyTheme(nextTheme);
        this.updateToggleIcon();
    }

    setVisitorName(name) {
        if (name && name.trim()) {
            this.visitorName = name.trim();
            localStorage.setItem(VISITOR_NAME_KEY, this.visitorName);
            this.renderWelcomeWidget();
        }
    }

    renderHeaderThemeToggle() {
        const navContainer = document.querySelector(".main-navigation .container nav");
        if (!navContainer || document.getElementById("themeToggleBtn")) return;

        const btn = document.createElement("button");
        btn.id = "themeToggleBtn";
        btn.type = "button";
        btn.title = "Toggle Theme (Light / Dark)";
        btn.style.cssText = `
            background: transparent;
            border: 2px solid var(--dark-primary, #020035);
            color: var(--dark-primary, #020035);
            padding: 5px 10px;
            font-weight: 700;
            cursor: pointer;
            font-family: var(--font-display, sans-serif);
            margin-left: 15px;
            text-transform: uppercase;
            font-size: 13px;
            transition: all 0.2s ease;
        `;
        btn.innerHTML = this.themePref === "dark" ? "☀️ Light" : "🌙 Dark";
        
        btn.addEventListener("click", () => {
            this.toggleTheme();
            btn.innerHTML = this.themePref === "dark" ? "☀️ Light" : "🌙 Dark";
        });

        navContainer.appendChild(btn);
    }

    updateToggleIcon() {
        const btn = document.getElementById("themeToggleBtn");
        if (btn) {
            btn.innerHTML = this.themePref === "dark" ? "☀️ Light" : "🌙 Dark";
        }
    }

    renderWelcomeWidget() {
        let bar = document.getElementById("userPreferenceBanner");
        if (!bar) {
            bar = document.createElement("div");
            bar.id = "userPreferenceBanner";
            bar.style.cssText = `
                background: var(--dark-primary, #020035);
                color: #F2F3F4;
                padding: 8px 16px;
                font-size: 14px;
                font-family: var(--font-primary, sans-serif);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid var(--highlight, #ED4B00);
            `;
            const header = document.querySelector("header.main-navigation");
            if (header) {
                header.parentNode.insertBefore(bar, header);
            } else {
                document.body.insertBefore(bar, document.body.firstChild);
            }
        }

        const nameDisplay = this.visitorName ? `Welcome back, <strong>${escapeHtml(this.visitorName)}</strong>!` : `Welcome to <strong>Hash'26 TechFest</strong>!`;
        
        bar.innerHTML = `
            <div>
                <span>${nameDisplay}</span>
                <button type="button" id="setNameBtn" style="background:none; border:none; color:var(--highlight, #ED4B00); text-decoration:underline; cursor:pointer; margin-left:10px; font-weight:bold;">
                    ${this.visitorName ? "Change Name" : "Set Name"}
                </button>
            </div>
            <div>
                <small style="opacity:0.8;">Festival Date: Oct 15-18, 2026</small>
            </div>
        `;

        document.getElementById("setNameBtn").addEventListener("click", () => {
            const input = prompt("Please enter your name:", this.visitorName);
            if (input !== null) {
                this.setVisitorName(input);
            }
        });
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
// CONTACT FORM VALIDATION & HANDLING
// =====================================================

function setupContactForm() {
    const form = document.getElementById("contactFeedbackForm");
    if (!form) return;

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const subjectInput = document.getElementById("contact-subject");
    const messageInput = document.getElementById("contact-message");

    const nameError = document.getElementById("contactNameError");
    const emailError = document.getElementById("contactEmailError");
    const subjectError = document.getElementById("contactSubjectError");
    const messageError = document.getElementById("contactMessageError");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const clearErrors = () => {
        [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
            if (inp) inp.classList.remove("is-invalid");
        });
        if (nameError) nameError.textContent = "";
        if (emailError) emailError.textContent = "";
        if (subjectError) subjectError.textContent = "";
        if (messageError) messageError.textContent = "";
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        clearErrors();
        let isValid = true;

        if (!nameInput.value.trim()) {
            nameInput.classList.add("is-invalid");
            if (nameError) nameError.textContent = "Please enter your name.";
            isValid = false;
        }

        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            emailInput.classList.add("is-invalid");
            if (emailError) emailError.textContent = "Please enter a valid email address.";
            isValid = false;
        }

        if (!subjectInput.value.trim()) {
            subjectInput.classList.add("is-invalid");
            if (subjectError) subjectError.textContent = "Please enter a subject.";
            isValid = false;
        }

        if (!messageInput.value.trim()) {
            messageInput.classList.add("is-invalid");
            if (messageError) messageError.textContent = "Please write your message.";
            isValid = false;
        }

        if (isValid) {
            alert(`Thank you, ${nameInput.value.trim()}! Your feedback message has been sent successfully.`);
            form.reset();
            clearErrors();
        }
    });

    // Clear field errors on input
    [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
        if (inp) {
            inp.addEventListener("input", () => {
                inp.classList.remove("is-invalid");
                const errSpan = inp.parentElement.querySelector(".field-error");
                if (errSpan) errSpan.textContent = "";
            });
        }
    });
}

// =====================================================
// PAGE LOAD INITIALIZATION
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    // Initialize user preferences & theme
    new PreferenceManager();

    // Initialize registration form validation & handlers
    setupFormValidation();

    // Initialize contact form handler
    setupContactForm();

    // Display participants list on register.html
    displayParticipantCount();
    displayParticipantList();

    // Display participant data table on participant.html
    renderParticipantTable();
    setupParticipantSearch();
});

