/**
 * AI Chat System
 * Safety monitoring and assistance chat
 */

class AIChatSystem {
    constructor() {
        this.isActive = false;
        this.isMinimized = false;
        this.currentSession = null;
        this.checkInInterval = null;
        this.responses = this.initializeResponses();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    initializeResponses() {
        return {
            greetings: [
                "Hello! I'm your Safety AI assistant. How can I help keep you safe today?",
                "Hi there! I'm here to support your well-being. What's on your mind?",
                "Welcome! I'm your personal safety companion. How are you feeling right now?"
            ],
            checkIn: [
                "Hi! This is a safety check-in. Please respond to let me know you're okay.",
                "Safety check: How are you doing right now?",
                "Just checking in on you. Please respond when you see this.",
                "Time for your safety ping! Please confirm you're alright."
            ],
            safety: [
                "Your safety is my priority. Are you in a safe location?",
                "Do you have someone nearby who can help if needed?",
                "Remember to stay hydrated and in a comfortable environment.",
                "If you feel unwell, don't hesitate to seek help immediately."
            ],
            emergency: [
                "This seems urgent. Do you need emergency assistance?",
                "I'm concerned about your safety. Should I contact emergency services?",
                "If this is an emergency, please call 911 immediately.",
                "I can help coordinate emergency response if needed."
            ],
            support: [
                "I'm here to listen. Tell me what's happening.",
                "You're not alone. I'm here to support you.",
                "That sounds difficult. How can I help?",
                "Remember that asking for help is a sign of strength."
            ]
        };
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeChatBubble();
        });
    }

    initializeChatBubble() {
        const chatBubble = document.getElementById('aiChatBubble');
        if (chatBubble && window.outreachApp && window.outreachApp.currentUser) {
            this.isActive = true;
            this.startSafetySession();
            
            // Initial greeting after a delay
            setTimeout(() => {
                this.sendMessage(this.getRandomResponse('greetings'), 'ai');
            }, 2000);
        }
    }

    startSafetySession() {
        this.currentSession = {
            id: 'session-' + Date.now(),
            startTime: new Date(),
            lastResponse: new Date(),
            checkInsMissed: 0,
            riskLevel: 'low'
        };

        // Start regular check-ins every 15 minutes
        this.checkInInterval = setInterval(() => {
            this.performSafetyCheckIn();
        }, 15 * 60 * 1000); // 15 minutes

        console.log('AI Safety session started');
    }

    performSafetyCheckIn() {
        if (!this.isActive) return;

        const timeSinceLastResponse = Date.now() - this.currentSession.lastResponse;
        const minutesSinceResponse = timeSinceLastResponse / (1000 * 60);

        if (minutesSinceResponse > 20) { // No response for 20+ minutes
            this.currentSession.checkInsMissed++;
            this.escalateSafetyAlert();
        }

        this.sendMessage(this.getRandomResponse('checkIn'), 'ai');
        this.showNotification('Safety check-in required', 'warning');
    }

    escalateSafetyAlert() {
        const missedCheckins = this.currentSession.checkInsMissed;
        
        if (missedCheckins === 1) {
            this.currentSession.riskLevel = 'medium';
            this.sendMessage("I haven't heard from you in a while. Please respond to confirm you're safe.", 'ai');
            this.showNotification('Safety Alert: Please respond', 'warning');
            
        } else if (missedCheckins === 2) {
            this.currentSession.riskLevel = 'high';
            this.sendMessage("URGENT: Multiple check-ins missed. Attempting to contact emergency contact.", 'ai');
            this.showNotification('URGENT: Emergency contact being notified', 'danger');
            this.contactEmergencyContact();
            
        } else if (missedCheckins >= 3) {
            this.currentSession.riskLevel = 'critical';
            this.sendMessage("CRITICAL: Contacting emergency services due to no response.", 'ai');
            this.showNotification('CRITICAL: Emergency services contacted', 'danger');
            this.contactEmergencyServices();
        }
    }

    contactEmergencyContact() {
        // Simulate emergency contact notification
        console.log('Emergency contact notified');
        
        // In a real implementation, this would:
        // 1. Get user's emergency contacts from profile
        // 2. Send SMS/call to emergency contact
        // 3. Send location data if available
        // 4. Log the incident
        
        setTimeout(() => {
            this.sendMessage("Emergency contact has been notified of your situation.", 'ai');
        }, 3000);
    }

    contactEmergencyServices() {
        // Simulate emergency services notification
        console.log('Emergency services contacted');
        
        // In a real implementation, this would:
        // 1. Contact local emergency services
        // 2. Provide user's location
        // 3. Give relevant medical information
        // 4. Stay on line until help arrives
        
        setTimeout(() => {
            this.sendMessage("Emergency services have been contacted and are responding to your location.", 'ai');
        }, 2000);
    }

    processUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        this.currentSession.lastResponse = new Date();
        this.currentSession.checkInsMissed = 0; // Reset missed check-ins
        
        let response = '';
        
        // Emergency keywords
        if (this.containsEmergencyKeywords(lowerMessage)) {
            this.currentSession.riskLevel = 'high';
            response = this.getRandomResponse('emergency');
            this.showEmergencyPrompt();
            
        // Safety/health concerns
        } else if (this.containsSafetyKeywords(lowerMessage)) {
            response = this.getRandomResponse('safety');
            
        // Positive responses
        } else if (this.containsPositiveKeywords(lowerMessage)) {
            this.currentSession.riskLevel = 'low';
            response = "That's great to hear! I'm glad you're doing well. Remember to stay safe and reach out if you need anything.";
            
        // General support
        } else {
            response = this.getRandomResponse('support');
        }

        return response;
    }

    containsEmergencyKeywords(message) {
        const emergencyWords = [
            'help', 'emergency', 'overdose', 'can\'t breathe', 'chest pain',
            'unconscious', 'bleeding', 'hurt', 'pain', 'sick', 'nauseous',
            'dizzy', 'confused', 'trouble breathing', 'heart racing'
        ];
        
        return emergencyWords.some(word => message.includes(word));
    }

    containsSafetyKeywords(message) {
        const safetyWords = [
            'alone', 'scared', 'worried', 'anxious', 'unsafe', 'dangerous',
            'using', 'high', 'drunk', 'substances', 'drugs', 'medication'
        ];
        
        return safetyWords.some(word => message.includes(word));
    }

    containsPositiveKeywords(message) {
        const positiveWords = [
            'good', 'fine', 'okay', 'safe', 'better', 'well', 'great',
            'thanks', 'yes', 'alright', 'stable'
        ];
        
        return positiveWords.some(word => message.includes(word));
    }

    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    sendMessage(content, sender = 'ai') {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${sender}-message animate-slide-in-up`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const senderName = sender === 'ai' ? 'Safety AI' : 'You';
        const avatar = sender === 'ai' ? '🤖' : '👤';
        
        messageEl.innerHTML = `
            <div class="message-header">
                <span class="message-avatar">${avatar}</span>
                <strong class="message-sender">${senderName}</strong>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${content}</div>
        `;
        
        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add message styles if not present
        this.ensureMessageStyles();

        // Save to session storage
        this.saveMessage(content, sender);
    }

    saveMessage(content, sender) {
        const messages = JSON.parse(localStorage.getItem('aiChatMessages') || '[]');
        messages.push({
            content,
            sender,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 messages
        if (messages.length > 50) {
            messages.splice(0, messages.length - 50);
        }
        
        localStorage.setItem('aiChatMessages', JSON.stringify(messages));
    }

    loadPreviousMessages() {
        const messages = JSON.parse(localStorage.getItem('aiChatMessages') || '[]');
        const chatMessages = document.getElementById('chatMessages');
        
        if (chatMessages) {
            chatMessages.innerHTML = '';
            messages.forEach(msg => {
                this.sendMessage(msg.content, msg.sender);
            });
        }
    }

    showEmergencyPrompt() {
        const emergencyModal = document.createElement('div');
        emergencyModal.className = 'emergency-prompt-modal';
        emergencyModal.innerHTML = `
            <div class="emergency-prompt-content">
                <div class="emergency-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Emergency Detected</h3>
                <p>It sounds like you might need immediate help. What would you like to do?</p>
                <div class="emergency-actions">
                    <button class="btn btn-danger" onclick="aiChat.call911()">
                        <i class="fas fa-phone"></i> Call 911
                    </button>
                    <button class="btn btn-warning" onclick="aiChat.contactSupport()">
                        <i class="fas fa-life-ring"></i> Crisis Support
                    </button>
                    <button class="btn btn-primary" onclick="aiChat.confirmSafe()">
                        <i class="fas fa-check"></i> I'm Safe
                    </button>
                </div>
                <button class="close-emergency" onclick="aiChat.closeEmergencyPrompt()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(emergencyModal);

        // Style the modal
        emergencyModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s ease;
        `;

        setTimeout(() => {
            if (document.body.contains(emergencyModal)) {
                document.body.removeChild(emergencyModal);
                this.sendMessage("Emergency prompt timed out. Please respond if you need help.", 'ai');
            }
        }, 30000); // Auto-close after 30 seconds
    }

    call911() {
        this.closeEmergencyPrompt();
        this.sendMessage("Understood. Please call 911 immediately for emergency assistance.", 'ai');
        window.outreachApp.showNotification('Call 911 for emergency assistance', 'danger');
    }

    contactSupport() {
        this.closeEmergencyPrompt();
        this.sendMessage("I'll help you contact crisis support. Stay with me.", 'ai');
        window.outreachApp.showNotification('Crisis support being contacted', 'warning');
    }

    confirmSafe() {
        this.closeEmergencyPrompt();
        this.currentSession.riskLevel = 'low';
        this.sendMessage("I'm glad you're safe. I'll continue monitoring. Don't hesitate to reach out if you need help.", 'ai');
        window.outreachApp.showNotification('Safety confirmed', 'success');
    }

    closeEmergencyPrompt() {
        const modal = document.querySelector('.emergency-prompt-modal');
        if (modal) {
            document.body.removeChild(modal);
        }
    }

    toggleChat() {
        const chatBubble = document.getElementById('aiChatBubble');
        if (chatBubble) {
            this.isMinimized = !this.isMinimized;
            chatBubble.classList.toggle('minimized', this.isMinimized);
        }
    }

    showNotification(message, type) {
        if (window.outreachApp) {
            window.outreachApp.showNotification(message, type);
        }
    }

    ensureMessageStyles() {
        if (!document.querySelector('#ai-chat-styles')) {
            const styles = document.createElement('style');
            styles.id = 'ai-chat-styles';
            styles.textContent = `
                .chat-message {
                    margin-bottom: 1rem;
                    padding: 0.75rem;
                    border-radius: 8px;
                    max-width: 100%;
                }
                
                .ai-message {
                    background: rgba(0, 212, 255, 0.1);
                    border-left: 3px solid var(--accent-primary);
                }
                
                .user-message {
                    background: rgba(255, 107, 53, 0.1);
                    border-left: 3px solid var(--secondary-color);
                    margin-left: 2rem;
                }
                
                .message-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                    font-size: 0.8rem;
                    opacity: 0.8;
                }
                
                .message-avatar {
                    font-size: 1rem;
                }
                
                .message-sender {
                    color: var(--accent-primary);
                }
                
                .message-time {
                    color: var(--text-muted);
                    margin-left: auto;
                }
                
                .message-content {
                    line-height: 1.4;
                    color: var(--text-primary);
                }
                
                .emergency-prompt-content {
                    background: var(--overlay-color);
                    border: 3px solid var(--danger-color);
                    border-radius: 12px;
                    padding: 2rem;
                    text-align: center;
                    max-width: 500px;
                    position: relative;
                }
                
                .emergency-icon {
                    font-size: 3rem;
                    color: var(--danger-color);
                    margin-bottom: 1rem;
                    animation: pulse 1s infinite;
                }
                
                .emergency-prompt-content h3 {
                    color: var(--danger-color);
                    margin-bottom: 1rem;
                    font-family: var(--primary-font);
                }
                
                .emergency-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-top: 1.5rem;
                    flex-wrap: wrap;
                }
                
                .close-emergency {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: color 0.3s ease;
                }
                
                .close-emergency:hover {
                    color: var(--text-primary);
                }
            `;
            document.head.appendChild(styles);
        }
    }

    destroy() {
        if (this.checkInInterval) {
            clearInterval(this.checkInInterval);
        }
        this.isActive = false;
        console.log('AI Safety session ended');
    }
}

// Initialize AI chat system
const aiChat = new AIChatSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIChatSystem;
}