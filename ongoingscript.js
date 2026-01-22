const container = document.getElementById('ongoing-container');
const chatOverlay = document.getElementById('chat-overlay');
const closeChatBtn = document.getElementById('close-chat');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatTitle = document.getElementById('chat-title');

let currentActivityId = null;

// License: MIT
// 1. Load Joined Activities
function loadOngoing() {
    const joined = JSON.parse(localStorage.getItem('joinedActivities')) || [];

    if (joined.length === 0) {
        container.innerHTML = '<p style="padding: 2rem; font-family: InterTight;">No ongoing activities. Go to Invitations to find some!</p>';
        return;
    }

    joined.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('ongoing-card');

        card.innerHTML = `
            <div class="header">
                 <img src="imgs/propicph.png" class="propic" alt="Profile">
                 <div class="info">
                     <h3>${item.host}</h3>
                     <p class="time">${item.time}</p>
                 </div>
            </div>
            <p class="activity">${item.activity}</p>
            <button class="enter-chat-btn">Enter Chat</button>
        `;

        const enterBtn = card.querySelector('.enter-chat-btn');
        enterBtn.addEventListener('click', () => {
            openChat(item);
        });

        container.appendChild(card);
    });
}

// 2. Chat Logic (Moved & Adapted)
function openChat(activityData) {
    currentActivityId = activityData.id;
    chatTitle.textContent = `${activityData.activity} (Host: ${activityData.host})`;
    chatOverlay.classList.add('active');

    // Load chat history for this specific activity
    loadChatHistory(activityData.id);
}

function closeChat() {
    chatOverlay.classList.remove('active');
    currentActivityId = null;
}

function loadChatHistory(id) {
    chatMessages.innerHTML = '';

    // We can simulate persistent chat using localStorage per activity ID
    const history = JSON.parse(localStorage.getItem(`chat_${id}`)) || [];

    if (history.length === 0) {
        addSystemMessage('You joined the group.', false); // Don't save system msg for now or save it ??
    } else {
        history.forEach(msg => {
            if (msg.type === 'system') renderSystemMessage(msg.text);
            else renderUserMessage(msg.text);
        });
    }
}

function saveMessage(id, text, type = 'user') {
    const history = JSON.parse(localStorage.getItem(`chat_${id}`)) || [];
    history.push({ text, type, timestamp: new Date().toISOString() });
    localStorage.setItem(`chat_${id}`, JSON.stringify(history));
}

// Render without saving
function renderSystemMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', 'system');
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
}

function addSystemMessage(text, save = true) {
    renderSystemMessage(text);
    if (save && currentActivityId) saveMessage(currentActivityId, text, 'system');
}

function renderUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', 'sent');
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
}

function addUserMessage(text) {
    renderUserMessage(text);
    if (currentActivityId) saveMessage(currentActivityId, text, 'user');
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event Listeners
closeChatBtn.addEventListener('click', closeChat);

sendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (text) {
        addUserMessage(text);
        chatInput.value = '';
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const text = chatInput.value.trim();
        if (text) {
            addUserMessage(text);
            chatInput.value = '';
        }
    }
});

chatOverlay.addEventListener('click', (e) => {
    if (e.target === chatOverlay) {
        closeChat();
    }
});

// Initialize
window.addEventListener('DOMContentLoaded', loadOngoing);
