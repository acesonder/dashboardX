// OutreachX - Dashboard System
// Advanced dashboard functionality with real-time features

class DashboardSystem {
    constructor() {
        this.currentPage = 'dashboard';
        this.checkInTimer = null;
        this.lastCheckIn = new Date();
        this.checkInInterval = 30 * 60 * 1000; // 30 minutes
        this.isEmergencyMode = false;
        this.notifications = [];
        this.messages = [];
        this.aiResponses = [
            "I'm here to help! How are you feeling today?",
            "Remember to stay hydrated and take care of yourself.",
            "It's important to check in regularly. I'm glad you're staying connected.",
            "If you need immediate help, don't hesitate to contact emergency services.",
            "You're doing great by staying in touch. Keep up the good work!",
            "Is there anything specific you'd like to talk about or any concerns you have?"
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startCheckInTimer();
        this.updateCurrentTime();
        this.loadUserData();
        this.initializeRealTimeFeatures();
        this.setupKeyboardShortcuts();
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.sidebar-nav .nav-link, .action-btn');
            if (navLink) {
                const page = navLink.dataset.page;
                if (page) {
                    e.preventDefault();
                    this.navigateToPage(page);
                }
            }

            // Safety buttons
            if (e.target.closest('#checkInBtn, .check-in')) {
                this.handleCheckIn();
            }

            if (e.target.closest('#emergencyBtn, .emergency')) {
                this.handleEmergency();
            }

            // Message sending
            if (e.target.closest('#sendMessageBtn')) {
                this.sendMessage();
            }

            if (e.target.closest('#sendAiMessageBtn')) {
                this.sendAiMessage();
            }

            // Refresh button
            if (e.target.closest('#refreshBtn')) {
                this.refreshDashboard();
            }
        });

        // Enter key for message inputs
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (e.target.id === 'messageInput') {
                    this.sendMessage();
                } else if (e.target.id === 'aiMessageInput') {
                    this.sendAiMessage();
                }
            }
        });

        // Auto-save form data
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('auto-save')) {
                this.autoSaveData(e.target);
            }
        });
    }

    navigateToPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageName + '-page');
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;
            
            // Update navigation
            document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`[data-page="${pageName}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
            
            // Page-specific initialization
            this.initializePage(pageName);
        }
    }

    initializePage(pageName) {
        switch (pageName) {
            case 'dashboard':
                this.refreshDashboardWidgets();
                break;
            case 'messaging':
                this.initializeMessaging();
                break;
            case 'ai-chat':
                this.initializeAiChat();
                break;
            case 'supplies':
                this.loadSuppliesData();
                break;
            case 'assessments':
                this.loadAssessments();
                break;
            case 'appointments':
                this.loadAppointments();
                break;
        }
    }

    refreshDashboard() {
        // Show refresh animation
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            const icon = refreshBtn.querySelector('i');
            icon.style.animation = 'spin 1s linear';
            setTimeout(() => {
                icon.style.animation = '';
            }, 1000);
        }

        // Refresh all widgets
        this.refreshDashboardWidgets();
        this.showNotification('Dashboard refreshed', 'success');
    }

    refreshDashboardWidgets() {
        // Update time
        this.updateCurrentTime();
        
        // Simulate data updates
        this.updateStatusWidget();
        this.updateMessagesWidget();
        this.updateSuppliesWidget();
        this.updateSafetyWidget();
    }

    updateCurrentTime() {
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            const dateString = now.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
            timeElement.textContent = `${timeString} • ${dateString}`;
        }
    }

    updateStatusWidget() {
        // Simulate status updates
        const statusItems = document.querySelectorAll('.status-item .status-recent');
        statusItems.forEach(item => {
            if (item.textContent.includes('min ago')) {
                const minutes = Math.floor(Math.random() * 5) + 1;
                item.textContent = `${minutes} min ago`;
            }
        });
    }

    updateMessagesWidget() {
        // Add timestamp updates or new message simulation
        const messageItems = document.querySelectorAll('.message-time');
        messageItems.forEach(item => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            // Update if it's a recent message
            if (item.textContent.includes('min ago')) {
                const randomMinutes = Math.floor(Math.random() * 30) + 1;
                item.textContent = randomMinutes === 1 ? '1 min ago' : `${randomMinutes} min ago`;
            }
        });
    }

    updateSuppliesWidget() {
        // Update supply order statuses
        const processingOrders = document.querySelectorAll('.order-status.processing');
        processingOrders.forEach(status => {
            // Randomly simulate status changes
            if (Math.random() < 0.1) { // 10% chance
                status.className = 'order-status ready';
                status.innerHTML = '<i class="fas fa-check-circle"></i><span>Ready for Pickup</span>';
                this.showNotification('Supply order is ready for pickup!', 'success');
            }
        });
    }

    updateSafetyWidget() {
        // Update last check-in time
        const timeSinceLastCheck = Math.floor((new Date() - this.lastCheckIn) / 1000 / 60);
        const timeDisplay = document.querySelector('.stat-value');
        if (timeDisplay && timeDisplay.textContent.includes(':')) {
            const minutes = String(timeSinceLastCheck % 60).padStart(2, '0');
            const hours = String(Math.floor(timeSinceLastCheck / 60)).padStart(2, '0');
            timeDisplay.textContent = `${hours}:${minutes}`;
        }
    }

    startCheckInTimer() {
        // Check-in reminder
        this.checkInTimer = setInterval(() => {
            const timeSinceLastCheck = new Date() - this.lastCheckIn;
            
            if (timeSinceLastCheck > this.checkInInterval) {
                this.showCheckInReminder();
            }
        }, 60000); // Check every minute
    }

    showCheckInReminder() {
        this.showNotification('Safety Check-in Reminder', 'warning');
        
        // Create a more prominent reminder
        const reminder = document.createElement('div');
        reminder.className = 'check-in-reminder';
        reminder.innerHTML = `
            <div class="reminder-content">
                <i class="fas fa-heartbeat"></i>
                <h4>Safety Check-in Reminder</h4>
                <p>It's been a while since your last check-in. Please let us know you're safe.</p>
                <div class="reminder-actions">
                    <button class="btn hud-btn hud-btn-primary check-in">
                        <i class="fas fa-heart"></i> I'm Safe
                    </button>
                    <button class="btn hud-btn hud-btn-secondary dismiss-reminder">
                        <i class="fas fa-times"></i> Dismiss
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(reminder);
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (reminder.parentElement) {
                reminder.remove();
            }
        }, 30000);
        
        // Handle dismiss
        reminder.querySelector('.dismiss-reminder').addEventListener('click', () => {
            reminder.remove();
        });
    }

    handleCheckIn() {
        this.lastCheckIn = new Date();
        this.showNotification('Check-in recorded. Stay safe!', 'success');
        
        // Update UI
        this.updateSafetyWidget();
        
        // Add visual feedback
        const checkInBtns = document.querySelectorAll('.check-in');
        checkInBtns.forEach(btn => {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
        
        // Remove any check-in reminders
        const reminders = document.querySelectorAll('.check-in-reminder');
        reminders.forEach(reminder => reminder.remove());
    }

    handleEmergency() {
        this.isEmergencyMode = true;
        
        // Show emergency modal
        const emergencyModal = new bootstrap.Modal(document.getElementById('emergencyModal'));
        emergencyModal.show();
        
        // Log emergency activation
        console.log('Emergency mode activated');
        
        // In a real application, this would:
        // 1. Immediately contact emergency services
        // 2. Notify emergency contacts
        // 3. Send location data
        // 4. Start continuous monitoring
        
        this.showNotification('Emergency services have been notified', 'error');
    }

    initializeMessaging() {
        // Load conversations
        this.loadConversations();
        
        // Set up real-time messaging simulation
        this.simulateIncomingMessages();
    }

    loadConversations() {
        // This would normally fetch from server
        const conversations = [
            {
                id: 1,
                name: 'Sarah (Outreach Staff)',
                avatar: 'fas fa-user-nurse',
                preview: 'Hi! Just checking in...',
                time: '5 min',
                unread: 2,
                messages: [
                    { sender: 'Sarah', content: 'Hi! Just checking in. How are you doing today?', time: '14:32', received: true },
                    { sender: 'Sarah', content: 'Remember, I\'m here if you need anything at all.', time: '14:33', received: true }
                ]
            },
            {
                id: 2,
                name: 'AI Safety Assistant',
                avatar: 'fas fa-robot',
                preview: 'Reminder: Stay hydrated...',
                time: '1 hour',
                unread: 0,
                messages: [
                    { sender: 'AI Assistant', content: 'Reminder: Stay hydrated and don\'t use alone.', time: '13:30', received: true }
                ]
            }
        ];
        
        // Update UI would happen here
    }

    simulateIncomingMessages() {
        // Simulate periodic incoming messages
        setInterval(() => {
            if (Math.random() < 0.1 && this.currentPage === 'messaging') { // 10% chance
                this.receiveMessage('Sarah (Outreach Staff)', this.getRandomSupportMessage());
            }
        }, 30000); // Every 30 seconds
    }

    getRandomSupportMessage() {
        const messages = [
            'Just wanted to check in and see how you\'re doing.',
            'Remember that I\'m always here if you need to talk.',
            'How has your day been so far?',
            'Don\'t forget to take care of yourself today.',
            'Is there anything you need help with right now?'
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const chatMessages = document.getElementById('chatMessages');
        
        if (!messageInput || !chatMessages) return;
        
        const messageText = messageInput.value.trim();
        if (!messageText) return;
        
        // Add message to chat
        const messageEl = document.createElement('div');
        messageEl.className = 'message sent';
        messageEl.innerHTML = `
            <div class="message-content">${messageText}</div>
            <div class="message-time">${new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false})}</div>
        `;
        
        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Clear input
        messageInput.value = '';
        
        // Simulate response after delay
        setTimeout(() => {
            this.receiveMessage('Sarah (Outreach Staff)', 'Thanks for reaching out! I got your message.');
        }, 2000 + Math.random() * 3000);
    }

    receiveMessage(sender, content) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageEl = document.createElement('div');
        messageEl.className = 'message received';
        messageEl.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false})}</div>
        `;
        
        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Show notification if not on messaging page
        if (this.currentPage !== 'messaging') {
            this.showNotification(`New message from ${sender}`, 'info');
        }
    }

    initializeAiChat() {
        // Load AI chat history
        this.loadAiChatHistory();
        
        // Start AI check-in reminders
        this.startAiCheckIns();
    }

    loadAiChatHistory() {
        const aiChatMessages = document.getElementById('aiChatMessages');
        if (!aiChatMessages) return;
        
        // Add welcome message if empty
        if (aiChatMessages.children.length <= 1) {
            setTimeout(() => {
                this.receiveAiMessage('Hello! I\'m your AI Safety Assistant. I\'m here to help monitor your wellbeing and provide support when you need it.');
            }, 1000);
        }
    }

    startAiCheckIns() {
        // Periodic AI check-ins
        setInterval(() => {
            if (Math.random() < 0.2) { // 20% chance
                const response = this.aiResponses[Math.floor(Math.random() * this.aiResponses.length)];
                this.receiveAiMessage(response);
            }
        }, 120000); // Every 2 minutes
    }

    sendAiMessage() {
        const aiMessageInput = document.getElementById('aiMessageInput');
        const aiChatMessages = document.getElementById('aiChatMessages');
        
        if (!aiMessageInput || !aiChatMessages) return;
        
        const messageText = aiMessageInput.value.trim();
        if (!messageText) return;
        
        // Add user message
        const messageEl = document.createElement('div');
        messageEl.className = 'message sent';
        messageEl.innerHTML = `
            <div class="message-content">${messageText}</div>
            <div class="message-time">${new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false})}</div>
        `;
        
        aiChatMessages.appendChild(messageEl);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        
        // Clear input
        aiMessageInput.value = '';
        
        // Generate AI response
        setTimeout(() => {
            const response = this.generateAiResponse(messageText);
            this.receiveAiMessage(response);
        }, 1000 + Math.random() * 2000);
    }

    generateAiResponse(userMessage) {
        const lowercaseMessage = userMessage.toLowerCase();
        
        // Keyword-based responses
        if (lowercaseMessage.includes('help') || lowercaseMessage.includes('emergency')) {
            return 'I\'m here to help you. If this is an emergency, please contact emergency services immediately or use the emergency button. For non-emergency support, I can connect you with our staff.';
        } else if (lowercaseMessage.includes('safe') || lowercaseMessage.includes('okay') || lowercaseMessage.includes('good')) {
            return 'I\'m glad to hear you\'re doing well! Remember to check in regularly and stay connected with our support network.';
        } else if (lowercaseMessage.includes('bad') || lowercaseMessage.includes('not good') || lowercaseMessage.includes('struggling')) {
            return 'I\'m sorry to hear you\'re having a difficult time. Would you like me to connect you with a staff member who can provide more support?';
        } else if (lowercaseMessage.includes('supplies') || lowercaseMessage.includes('need')) {
            return 'I can help you with harm reduction supplies. You can place an order through the supplies section, or I can notify our staff about your needs.';
        } else {
            // Random supportive response
            return this.aiResponses[Math.floor(Math.random() * this.aiResponses.length)];
        }
    }

    receiveAiMessage(content) {
        const aiChatMessages = document.getElementById('aiChatMessages');
        if (!aiChatMessages) return;
        
        const messageEl = document.createElement('div');
        messageEl.className = 'message ai-message';
        messageEl.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false})}</div>
        `;
        
        aiChatMessages.appendChild(messageEl);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        
        // Show notification if not on AI chat page
        if (this.currentPage !== 'ai-chat') {
            this.showNotification('New message from AI Assistant', 'info');
        }
    }

    loadUserData() {
        // Load user-specific data from localStorage or server
        const userData = JSON.parse(localStorage.getItem('outreachx_user_data') || '{}');
        
        // Update UI with user data
        this.updateUserInterface(userData);
    }

    updateUserInterface(userData) {
        // Update user name
        const userNameEl = document.querySelector('.user-name');
        if (userNameEl && userData.name) {
            userNameEl.textContent = userData.name;
        }
        
        // Update other personalized elements
        const welcomeMessage = document.querySelector('.welcome-widget p');
        if (welcomeMessage && userData.name) {
            welcomeMessage.textContent = `Welcome back, ${userData.name.split(' ')[0]}! Stay safe and connected. Our team is here to support you 24/7.`;
        }
    }

    autoSaveData(element) {
        // Auto-save form data
        const data = {
            [element.name]: element.value,
            timestamp: new Date().toISOString()
        };
        
        let existingData = JSON.parse(localStorage.getItem('outreachx_form_data') || '{}');
        existingData = { ...existingData, ...data };
        
        localStorage.setItem('outreachx_form_data', JSON.stringify(existingData));
    }

    initializeRealTimeFeatures() {
        // Start real-time clock
        setInterval(() => {
            this.updateCurrentTime();
        }, 1000);
        
        // Start periodic data refresh
        setInterval(() => {
            if (this.currentPage === 'dashboard') {
                this.refreshDashboardWidgets();
            }
        }, 30000); // Every 30 seconds
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + number keys for navigation
            if (e.altKey) {
                switch(e.key) {
                    case '1':
                        this.navigateToPage('dashboard');
                        e.preventDefault();
                        break;
                    case '2':
                        this.navigateToPage('messaging');
                        e.preventDefault();
                        break;
                    case '3':
                        this.navigateToPage('supplies');
                        e.preventDefault();
                        break;
                    case '4':
                        this.navigateToPage('ai-chat');
                        e.preventDefault();
                        break;
                }
            }
            
            // Emergency shortcuts
            if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                this.handleEmergency();
                e.preventDefault();
            }
            
            // Check-in shortcut
            if (e.ctrlKey && e.key === ' ') {
                this.handleCheckIn();
                e.preventDefault();
            }
        });
    }

    showNotification(message, type = 'info') {
        if (typeof outreachX !== 'undefined') {
            outreachX.showNotification(message, type);
        } else {
            // Fallback notification
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // Public API methods
    getCurrentPage() {
        return this.currentPage;
    }

    getLastCheckIn() {
        return this.lastCheckIn;
    }

    isInEmergencyMode() {
        return this.isEmergencyMode;
    }

    // Cleanup method
    destroy() {
        if (this.checkInTimer) {
            clearInterval(this.checkInTimer);
        }
        
        // Remove event listeners
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('keypress', this.handleKeypress);
        document.removeEventListener('keydown', this.handleKeydown);
    }
}

// CSS for dashboard-specific animations
const dashboardCSS = `
.check-in-reminder {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--panel-bg);
    border: 2px solid var(--warning-color);
    border-radius: var(--border-radius);
    backdrop-filter: blur(20px);
    z-index: 9999;
    max-width: 400px;
    box-shadow: 0 0 30px rgba(255, 170, 0, 0.4);
    animation: reminderPulse 1s ease-in-out infinite alternate;
}

.reminder-content {
    padding: 30px;
    text-align: center;
}

.reminder-content i {
    font-size: 3rem;
    color: var(--warning-color);
    margin-bottom: 20px;
    animation: heartbeat 1.5s infinite;
}

.reminder-content h4 {
    color: var(--warning-color);
    font-family: var(--font-primary);
    margin-bottom: 15px;
    font-weight: 700;
}

.reminder-content p {
    color: var(--text-secondary);
    margin-bottom: 25px;
    line-height: 1.5;
}

.reminder-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
}

@keyframes reminderPulse {
    from { box-shadow: 0 0 30px rgba(255, 170, 0, 0.4); }
    to { box-shadow: 0 0 40px rgba(255, 170, 0, 0.6); }
}

@keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.widget:hover .stat-value {
    color: var(--secondary-color);
    text-shadow: 0 0 10px var(--primary-color);
}

.conversation-item.active {
    position: relative;
}

.conversation-item.active:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--primary-color);
}

.ai-message .message-content {
    background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(0, 128, 255, 0.05));
    padding: 15px;
    border-radius: 12px;
    border: 1px solid rgba(0, 255, 255, 0.2);
}

.safety-btn-large:hover {
    transform: scale(1.05);
}

.safety-btn-large.check-in {
    border-color: var(--success-color);
    color: var(--success-color);
}

.safety-btn-large.check-in:hover {
    background: var(--success-color);
    color: var(--darker-bg);
    box-shadow: 0 0 30px rgba(0, 255, 136, 0.4);
}

.safety-btn-large.emergency {
    border-color: var(--danger-color);
    color: var(--danger-color);
}

.safety-btn-large.emergency:hover {
    background: var(--danger-color);
    color: var(--darker-bg);
    box-shadow: 0 0 30px rgba(255, 68, 68, 0.4);
}

.message.sent {
    animation: messageSent 0.3s ease;
}

.message.received {
    animation: messageReceived 0.3s ease;
}

@keyframes messageSent {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes messageReceived {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
`;

// Inject dashboard-specific CSS
const dashboardStyleSheet = document.createElement('style');
dashboardStyleSheet.textContent = dashboardCSS;
document.head.appendChild(dashboardStyleSheet);

// Initialize dashboard system when DOM is ready
let dashboardSystem;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        dashboardSystem = new DashboardSystem();
    });
} else {
    dashboardSystem = new DashboardSystem();
}

// Global dashboard functions
function navigateToPage(page) {
    if (dashboardSystem) {
        dashboardSystem.navigateToPage(page);
    }
}

function handleCheckIn() {
    if (dashboardSystem) {
        dashboardSystem.handleCheckIn();
    }
}

function handleEmergency() {
    if (dashboardSystem) {
        dashboardSystem.handleEmergency();
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardSystem;
}