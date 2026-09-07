// =====================================================
// TECHFEST 2026 - MODULE 2 - JAVASCRIPT ENHANCEMENTS
// =====================================================

// =====================================================
// GLOBAL STATE & STORAGE KEYS
// =====================================================

const STORAGE_KEY = "hash26Participants";
const TASKS_KEY = "hash26Tasks";
const VISITOR_NAME_KEY = "visitorName";

// =====================================================
// PARTICIPANT MANAGER CLASS
// =====================================================

class ParticipantManager {
    constructor() {
        this.participants = this.loadParticipants();
    }

    loadParticipants() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    saveParticipants() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.participants));
    }

    addParticipant(participant) {
        participant.id = participant.id || Date.now();
        const existingIndex = this.participants.findIndex(p => p.id === participant.id);
        
        if (existingIndex > -1) {
            this.participants[existingIndex] = participant;
        } else {
            this.participants.push(participant);
        }
        
        this.saveParticipants();
        return participant;
    }

    getParticipant(id) {
        return this.participants.find(p => p.id === id);
    }

    getAllParticipants() {
        return this.participants;
    }

    deleteParticipant(id) {
        this.participants = this.participants.filter(p => p.id !== id);
        this.saveParticipants();
    }

    clearAll() {
        this.participants = [];
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
}

// Global participant manager instance
let participantManager = new ParticipantManager();
// =====================================================
// PARTICIPANT DISPLAY (WORKS WITH EXISTING SCRIPT.JS)
// =====================================================

function displayParticipantCount() {
    const countElement = document.getElementById("participantCount");
    if (countElement) {
        countElement.textContent = participantManager.getAllParticipants().length;
    }
}

function displayParticipantList() {
    const container = document.getElementById("registeredParticipantsList");
    if (!container) return;

    const participants = participantManager.getAllParticipants();

    if (participants.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">No participants registered yet.</p>';
        return;
    }

    container.innerHTML = participants.map(p => `
        <div class="participant-card">
            <div class="participant-info">
                <h4>${p.fullName || 'N/A'}</h4>
                <p><strong>Email:</strong> ${p.email || 'N/A'}</p>
                <p><strong>Phone:</strong> ${p.phone || 'N/A'}</p>
                <p><strong>Registration ID:</strong> ${p.id}</p>
                <p><strong>College:</strong> ${p.college || 'N/A'}</p>
                <p><strong>Department:</strong> ${p.department || 'N/A'}</p>
                <p><strong>Events:</strong> ${p.events?.join(", ") || "None"}</p>
                ${p.registeredAt ? `<p><small><strong>Registered:</strong> ${p.registeredAt}</small></p>` : ""}
            </div>
        </div>
    `).join("");
}

// =====================================================
// WELCOME MESSAGE
// =====================================================

function initializeWelcomeMessage() {
    const existingName = sessionStorage.getItem(VISITOR_NAME_KEY);
    
    if (existingName) {
        displayWelcomeMessage(existingName);
    } else {
        const name = prompt("Welcome to Hash'26! What's your name?");
        if (name && name.trim()) {
            sessionStorage.setItem(VISITOR_NAME_KEY, name.trim());
            displayWelcomeMessage(name.trim());
        }
    }
}

function displayWelcomeMessage(name) {
    const existingMessage = document.getElementById("welcomeMessage");
    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement("div");
    message.id = "welcomeMessage";
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ED4B00;
        color: #F2F3F4;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.5s ease-in-out;
    `;
    message.textContent = `Welcome, ${name}!`;

    document.body.appendChild(message);

    // Add animation
    const style = document.createElement("style");
    if (!document.querySelector("style[data-animation='slideIn']")) {
        style.setAttribute("data-animation", "slideIn");
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// =====================================================
// INITIALIZATION ON PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    // Display participants if on registration page
    if (document.querySelector(".registration-form")) {
        displayParticipantCount();
        displayParticipantList();
        
        // Hook into existing form submission to update display
        const form = document.querySelector(".registration-form");
        if (form) {
            const originalOnsubmit = form.onsubmit;
            form.addEventListener("submit", () => {
                setTimeout(() => {
                    displayParticipantCount();
                    displayParticipantList();
                }, 100);
            });
        }
    }
    
    // Initialize welcome message on all pages
    initializeWelcomeMessage();
});
