/**
 * Messaging System
 * Direct and group messaging with real-time notifications
 */

class MessagingSystem {
    constructor() {
        this.conversations = [];
        this.activeConversation = null;
        this.currentUser = null;
        this.messageNotifications = [];
        this.typingIndicators = new Map();
        
        this.init();
    }

    init() {
        this.loadConversations();
        this.setupEventListeners();
        this.initializeDemoData();
    }

    loadConversations() {
        const saved = localStorage.getItem('conversations');
        if (saved) {
            this.conversations = JSON.parse(saved);
        }
    }

    saveConversations() {
        localStorage.setItem('conversations', JSON.stringify(this.conversations));
    }

    initializeDemoData() {
        if (this.conversations.length === 0) {
            this.conversations = [
                {
                    id: 'conv-1',
                    type: 'direct',
                    name: 'Sarah (Outreach Worker)',
                    participants: ['user', 'sarah-outreach'],
                    lastMessage: {
                        id: 'msg-1',
                        sender: 'sarah-outreach',
                        content: 'Hi! Just checking in to see how you\'re doing today. Do you need any supplies or support?',
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                        read: false
                    },
                    messages: [
                        {
                            id: 'msg-1',
                            sender: 'sarah-outreach',
                            content: 'Hi! Just checking in to see how you\'re doing today. Do you need any supplies or support?',
                            timestamp: new Date(Date.now() - 3600000).toISOString(),
                            read: false,
                            type: 'text'
                        }
                    ],
                    avatar: '👩‍⚕️'
                },
                {
                    id: 'conv-2',
                    type: 'group',
                    name: 'Evening Support Group',
                    participants: ['user', 'mike-peer', 'jane-counselor', 'alex-peer'],
                    lastMessage: {
                        id: 'msg-2',
                        sender: 'mike-peer',
                        content: 'Thanks everyone for the support today. Really needed to hear that.',
                        timestamp: new Date(Date.now() - 7200000).toISOString(),
                        read: true
                    },
                    messages: [
                        {
                            id: 'msg-2-1',
                            sender: 'jane-counselor',
                            content: 'Remember, you\'re all stronger than you think. Each day is a new opportunity.',
                            timestamp: new Date(Date.now() - 10800000).toISOString(),
                            read: true,
                            type: 'text'
                        },
                        {
                            id: 'msg-2',
                            sender: 'mike-peer',
                            content: 'Thanks everyone for the support today. Really needed to hear that.',
                            timestamp: new Date(Date.now() - 7200000).toISOString(),
                            read: true,
                            type: 'text'
                        }
                    ],
                    avatar: '👥'
                },
                {
                    id: 'conv-3',
                    type: 'direct',
                    name: 'Crisis Support Line',
                    participants: ['user', 'crisis-support'],
                    lastMessage: {
                        id: 'msg-3',
                        sender: 'crisis-support',
                        content: 'This line is available 24/7. Don\'t hesitate to reach out if you need immediate support.',
                        timestamp: new Date(Date.now() - 86400000).toISOString(),
                        read: true
                    },
                    messages: [
                        {
                            id: 'msg-3',
                            sender: 'crisis-support',
                            content: 'This line is available 24/7. Don\'t hesitate to reach out if you need immediate support.',
                            timestamp: new Date(Date.now() - 86400000).toISOString(),
                            read: true,
                            type: 'text'
                        }
                    ],
                    avatar: '🆘',
                    priority: 'high'
                }
            ];
            this.saveConversations();
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="view-messaging"]')) {
                this.renderMessagingPage();
            }
        });
    }

    renderMessagingPage() {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        // Hide all other pages
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });

        // Create or get messaging page
        let messagingPage = document.getElementById('messagingPage');
        if (!messagingPage) {
            messagingPage = document.createElement('div');
            messagingPage.id = 'messagingPage';
            messagingPage.className = 'page-content';
            mainContent.appendChild(messagingPage);
        }

        messagingPage.innerHTML = this.generateMessagingHTML();
        messagingPage.classList.add('active');

        this.setupMessagingPageListeners();
        this.updateUnreadCounts();
    }

    generateMessagingHTML() {
        return `
            <div class="messaging-interface">
                <div class="messaging-header">
                    <div class="container-fluid">
                        <div class="row align-items-center">
                            <div class="col-md-6">
                                <h1 class="messaging-title">
                                    <i class="fas fa-comments"></i>
                                    SECURE MESSAGING
                                </h1>
                                <div class="messaging-subtitle">End-to-end encrypted communications</div>
                            </div>
                            <div class="col-md-6 text-end">
                                <button class="btn btn-primary cyber-btn" id="newConversationBtn">
                                    <i class="fas fa-plus"></i> NEW MESSAGE
                                </button>
                                <button class="btn btn-outline-primary cyber-btn" id="groupChatBtn">
                                    <i class="fas fa-users"></i> GROUP CHAT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="messaging-container">
                    <div class="conversations-panel">
                        <div class="conversations-header">
                            <h3>Conversations</h3>
                            <div class="search-conversations">
                                <input type="text" placeholder="Search conversations..." id="conversationSearch">
                                <i class="fas fa-search"></i>
                            </div>
                        </div>
                        
                        <div class="conversations-list" id="conversationsList">
                            ${this.renderConversationsList()}
                        </div>
                    </div>

                    <div class="chat-panel">
                        <div class="chat-header" id="chatHeader">
                            <div class="chat-info">
                                <div class="avatar-container">
                                    <span class="avatar">💬</span>
                                    <div class="status-indicator"></div>
                                </div>
                                <div class="chat-details">
                                    <h4>Select a conversation</h4>
                                    <span class="status">Choose someone to start messaging</span>
                                </div>
                            </div>
                            <div class="chat-actions">
                                <button class="chat-action-btn" title="Voice Call">
                                    <i class="fas fa-phone"></i>
                                </button>
                                <button class="chat-action-btn" title="Video Call">
                                    <i class="fas fa-video"></i>
                                </button>
                                <button class="chat-action-btn" title="More Options">
                                    <i class="fas fa-ellipsis-v"></i>
                                </button>
                            </div>
                        </div>

                        <div class="chat-messages" id="chatMessages">
                            <div class="welcome-message">
                                <div class="welcome-icon">
                                    <i class="fas fa-comments fa-3x"></i>
                                </div>
                                <h3>Welcome to Secure Messaging</h3>
                                <p>Your conversations are protected with end-to-end encryption. Select a conversation to start chatting.</p>
                                <div class="security-badges">
                                    <span class="badge security-badge">
                                        <i class="fas fa-lock"></i> Encrypted
                                    </span>
                                    <span class="badge security-badge">
                                        <i class="fas fa-shield-alt"></i> Secure
                                    </span>
                                    <span class="badge security-badge">
                                        <i class="fas fa-user-secret"></i> Private
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="typing-indicator" id="typingIndicator">
                            <div class="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span class="typing-text">Someone is typing...</span>
                        </div>

                        <div class="message-input-container" id="messageInputContainer">
                            <div class="message-input-wrapper">
                                <button class="attachment-btn" title="Attach File">
                                    <i class="fas fa-paperclip"></i>
                                </button>
                                <input type="text" 
                                       class="message-input" 
                                       id="messageInput" 
                                       placeholder="Type your message..." 
                                       disabled>
                                <button class="emoji-btn" title="Add Emoji">
                                    <i class="fas fa-smile"></i>
                                </button>
                                <button class="send-btn" id="sendBtn" disabled>
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Emergency Contact Modal -->
                <div class="modal fade" id="emergencyModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content cyber-modal">
                            <div class="modal-header">
                                <h5 class="modal-title">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    Emergency Contact
                                </h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="alert alert-danger">
                                    <strong>Emergency services will be contacted immediately.</strong>
                                </div>
                                <p>Are you experiencing a medical emergency?</p>
                                <div class="emergency-actions">
                                    <button class="btn btn-danger" onclick="messaging.callEmergency()">
                                        <i class="fas fa-phone"></i> Call 911
                                    </button>
                                    <button class="btn btn-warning" onclick="messaging.contactCrisis()">
                                        <i class="fas fa-life-ring"></i> Crisis Line
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .messaging-interface {
                    min-height: 100vh;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                }

                .messaging-header {
                    background: rgba(0, 0, 0, 0.9);
                    border-bottom: 2px solid var(--accent-primary);
                    padding: 1.5rem 0;
                }

                .messaging-title {
                    font-family: var(--primary-font);
                    font-size: 1.8rem;
                    color: var(--accent-primary);
                    margin: 0;
                    text-shadow: 0 0 20px var(--accent-primary);
                }

                .messaging-subtitle {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    margin-top: 0.5rem;
                }

                .messaging-container {
                    display: flex;
                    height: calc(100vh - 120px);
                }

                .conversations-panel {
                    width: 350px;
                    background: rgba(0, 0, 0, 0.8);
                    border-right: 2px solid var(--border-color);
                    display: flex;
                    flex-direction: column;
                }

                .conversations-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border-color);
                }

                .conversations-header h3 {
                    margin: 0 0 1rem 0;
                    color: var(--accent-primary);
                    font-family: var(--primary-font);
                }

                .search-conversations {
                    position: relative;
                }

                .search-conversations input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border-color);
                    color: var(--text-primary);
                    padding: 0.5rem 2rem 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.9rem;
                }

                .search-conversations i {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }

                .conversations-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 0;
                }

                .conversation-item {
                    display: flex;
                    align-items: center;
                    padding: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    position: relative;
                }

                .conversation-item:hover,
                .conversation-item.active {
                    background: rgba(0, 212, 255, 0.1);
                    border-left: 4px solid var(--accent-primary);
                }

                .conversation-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: var(--accent-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    margin-right: 1rem;
                    position: relative;
                }

                .priority-indicator {
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 16px;
                    height: 16px;
                    background: var(--danger-color);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                    color: white;
                }

                .conversation-details {
                    flex: 1;
                    min-width: 0;
                }

                .conversation-name {
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 0.25rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .conversation-time {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .conversation-preview {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .unread-badge {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    background: var(--accent-primary);
                    color: black;
                    font-size: 0.7rem;
                    padding: 0.2rem 0.4rem;
                    border-radius: 10px;
                    min-width: 18px;
                    text-align: center;
                }

                .chat-panel {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: rgba(0, 0, 0, 0.5);
                }

                .chat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    background: rgba(0, 0, 0, 0.8);
                    border-bottom: 1px solid var(--border-color);
                }

                .chat-info {
                    display: flex;
                    align-items: center;
                }

                .avatar-container {
                    position: relative;
                    margin-right: 1rem;
                }

                .avatar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: var(--accent-primary);
                    border-radius: 50%;
                    font-size: 1.2rem;
                }

                .status-indicator {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 12px;
                    height: 12px;
                    background: var(--success-color);
                    border: 2px solid var(--bg-secondary);
                    border-radius: 50%;
                }

                .status-indicator.offline {
                    background: var(--text-muted);
                }

                .chat-details h4 {
                    margin: 0;
                    color: var(--text-primary);
                    font-size: 1.1rem;
                }

                .status {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                }

                .chat-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .chat-action-btn {
                    width: 40px;
                    height: 40px;
                    border: none;
                    background: rgba(0, 212, 255, 0.1);
                    color: var(--accent-primary);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .chat-action-btn:hover {
                    background: rgba(0, 212, 255, 0.2);
                    box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
                }

                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .welcome-message {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    text-align: center;
                    color: var(--text-secondary);
                }

                .welcome-icon {
                    color: var(--accent-primary);
                    margin-bottom: 2rem;
                    opacity: 0.7;
                }

                .welcome-message h3 {
                    color: var(--accent-primary);
                    margin-bottom: 1rem;
                    font-family: var(--primary-font);
                }

                .security-badges {
                    margin-top: 2rem;
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .security-badge {
                    background: rgba(0, 212, 255, 0.1);
                    color: var(--accent-primary);
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    border: 1px solid var(--accent-primary);
                    font-size: 0.8rem;
                }

                .message-bubble {
                    max-width: 70%;
                    padding: 0.75rem 1rem;
                    border-radius: 18px;
                    position: relative;
                    word-wrap: break-word;
                }

                .message-bubble.sent {
                    background: linear-gradient(135deg, var(--accent-primary), var(--secondary-color));
                    color: black;
                    align-self: flex-end;
                    margin-left: auto;
                }

                .message-bubble.received {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-primary);
                    align-self: flex-start;
                }

                .message-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 0.25rem;
                    font-size: 0.7rem;
                    opacity: 0.7;
                }

                .message-time {
                    color: inherit;
                }

                .message-status {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .typing-indicator {
                    padding: 0.5rem 1rem;
                    display: none;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-muted);
                }

                .typing-dots {
                    display: flex;
                    gap: 0.2rem;
                }

                .typing-dots span {
                    width: 6px;
                    height: 6px;
                    background: var(--accent-primary);
                    border-radius: 50%;
                    animation: typingDot 1.4s infinite;
                }

                .typing-dots span:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .typing-dots span:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes typingDot {
                    0%, 60%, 100% {
                        transform: scale(1);
                        opacity: 0.7;
                    }
                    30% {
                        transform: scale(1.2);
                        opacity: 1;
                    }
                }

                .message-input-container {
                    padding: 1rem 1.5rem;
                    background: rgba(0, 0, 0, 0.8);
                    border-top: 1px solid var(--border-color);
                }

                .message-input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border-color);
                    border-radius: 25px;
                    padding: 0.5rem;
                    transition: all 0.3s ease;
                }

                .message-input-wrapper:focus-within {
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
                }

                .message-input {
                    flex: 1;
                    background: none;
                    border: none;
                    color: var(--text-primary);
                    padding: 0.5rem;
                    font-size: 0.9rem;
                    outline: none;
                }

                .message-input::placeholder {
                    color: var(--text-muted);
                }

                .attachment-btn,
                .emoji-btn,
                .send-btn {
                    width: 36px;
                    height: 36px;
                    border: none;
                    background: rgba(0, 212, 255, 0.1);
                    color: var(--accent-primary);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .attachment-btn:hover,
                .emoji-btn:hover,
                .send-btn:hover {
                    background: var(--accent-primary);
                    color: black;
                    transform: scale(1.1);
                }

                .send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .cyber-modal {
                    background: var(--overlay-color);
                    border: 2px solid var(--accent-primary);
                    color: var(--text-primary);
                }

                .emergency-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-top: 1rem;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .messaging-container {
                        flex-direction: column;
                        height: auto;
                    }
                    
                    .conversations-panel {
                        width: 100%;
                        max-height: 300px;
                    }
                    
                    .chat-panel {
                        height: calc(100vh - 420px);
                        min-height: 400px;
                    }
                }
            </style>
        `;
    }

    renderConversationsList() {
        return this.conversations.map(conv => {
            const unreadCount = conv.messages.filter(msg => !msg.read && msg.sender !== 'user').length;
            const timeAgo = this.formatTimeAgo(conv.lastMessage.timestamp);
            
            return `
                <div class="conversation-item" data-conversation-id="${conv.id}">
                    <div class="conversation-avatar">
                        ${conv.avatar}
                        ${conv.priority === 'high' ? '<div class="priority-indicator">!</div>' : ''}
                    </div>
                    <div class="conversation-details">
                        <div class="conversation-name">
                            <span>${conv.name}</span>
                            <span class="conversation-time">${timeAgo}</span>
                        </div>
                        <div class="conversation-preview">${conv.lastMessage.content}</div>
                    </div>
                    ${unreadCount > 0 ? `<div class="unread-badge">${unreadCount}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    setupMessagingPageListeners() {
        // Conversation selection
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const conversationId = e.currentTarget.getAttribute('data-conversation-id');
                this.selectConversation(conversationId);
            });
        });

        // Message input
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');

        if (messageInput) {
            messageInput.addEventListener('input', (e) => {
                const hasText = e.target.value.trim().length > 0;
                sendBtn.disabled = !hasText;
                
                // Simulate typing indicator
                if (hasText && this.activeConversation) {
                    this.showTypingIndicator();
                }
            });

            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // New conversation
        const newConvBtn = document.getElementById('newConversationBtn');
        if (newConvBtn) {
            newConvBtn.addEventListener('click', () => this.showNewConversationModal());
        }

        // Group chat
        const groupChatBtn = document.getElementById('groupChatBtn');
        if (groupChatBtn) {
            groupChatBtn.addEventListener('click', () => this.showGroupChatModal());
        }

        // Search conversations
        const searchInput = document.getElementById('conversationSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchConversations(e.target.value));
        }
    }

    selectConversation(conversationId) {
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (!conversation) return;

        this.activeConversation = conversation;

        // Update UI
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelector(`[data-conversation-id="${conversationId}"]`).classList.add('active');

        // Update chat header
        this.updateChatHeader(conversation);

        // Load messages
        this.loadMessages(conversation);

        // Mark as read
        this.markConversationAsRead(conversationId);

        // Enable input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.disabled = false;
            messageInput.focus();
        }
    }

    updateChatHeader(conversation) {
        const chatHeader = document.getElementById('chatHeader');
        if (!chatHeader) return;

        const isGroup = conversation.type === 'group';
        const participantCount = isGroup ? conversation.participants.length : 2;
        
        chatHeader.innerHTML = `
            <div class="chat-info">
                <div class="avatar-container">
                    <span class="avatar">${conversation.avatar}</span>
                    <div class="status-indicator ${Math.random() > 0.5 ? '' : 'offline'}"></div>
                </div>
                <div class="chat-details">
                    <h4>${conversation.name}</h4>
                    <span class="status">
                        ${isGroup ? `${participantCount} participants` : 'Online'}
                    </span>
                </div>
            </div>
            <div class="chat-actions">
                <button class="chat-action-btn" title="Voice Call" onclick="messaging.startCall('voice')">
                    <i class="fas fa-phone"></i>
                </button>
                <button class="chat-action-btn" title="Video Call" onclick="messaging.startCall('video')">
                    <i class="fas fa-video"></i>
                </button>
                ${conversation.priority === 'high' ? `
                    <button class="chat-action-btn" title="Emergency" onclick="messaging.showEmergencyModal()">
                        <i class="fas fa-exclamation-triangle"></i>
                    </button>
                ` : ''}
                <button class="chat-action-btn" title="More Options" onclick="messaging.showChatOptions()">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        `;
    }

    loadMessages(conversation) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messagesHTML = conversation.messages.map(message => {
            const isOwn = message.sender === 'user';
            const time = this.formatTime(message.timestamp);
            
            return `
                <div class="message-bubble ${isOwn ? 'sent' : 'received'}">
                    <div class="message-content">${message.content}</div>
                    <div class="message-info">
                        <span class="message-time">${time}</span>
                        ${isOwn ? `
                            <div class="message-status">
                                <i class="fas fa-check${message.read ? '-double' : ''}" 
                                   style="color: ${message.read ? 'var(--accent-primary)' : 'var(--text-muted)'}"></i>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        chatMessages.innerHTML = messagesHTML;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        
        if (!messageInput || !this.activeConversation) return;

        const content = messageInput.value.trim();
        if (!content) return;

        const message = {
            id: 'msg-' + Date.now(),
            sender: 'user',
            content: content,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'text'
        };

        // Add to conversation
        this.activeConversation.messages.push(message);
        this.activeConversation.lastMessage = message;

        // Update UI
        this.loadMessages(this.activeConversation);
        this.updateConversationsList();

        // Clear input
        messageInput.value = '';
        sendBtn.disabled = true;

        // Save
        this.saveConversations();

        // Simulate response (for demo)
        setTimeout(() => {
            this.simulateResponse();
        }, 2000);
    }

    simulateResponse() {
        if (!this.activeConversation) return;

        const responses = [
            "Thanks for reaching out! I'll get back to you shortly.",
            "I understand. Let me help you with that.",
            "That's important information. How are you feeling right now?",
            "I'm here to support you. What do you need?",
            "Stay safe. We're here if you need anything.",
            "Thank you for sharing that with me."
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage = {
            id: 'msg-' + Date.now(),
            sender: this.activeConversation.participants.find(p => p !== 'user'),
            content: response,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'text'
        };

        this.activeConversation.messages.push(responseMessage);
        this.activeConversation.lastMessage = responseMessage;

        this.loadMessages(this.activeConversation);
        this.updateConversationsList();
        this.saveConversations();

        // Show notification
        this.showMessageNotification(this.activeConversation.name, response);
    }

    markConversationAsRead(conversationId) {
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (conversation) {
            conversation.messages.forEach(msg => {
                if (msg.sender !== 'user') {
                    msg.read = true;
                }
            });
            this.saveConversations();
            this.updateUnreadCounts();
        }
    }

    updateConversationsList() {
        const conversationsList = document.getElementById('conversationsList');
        if (conversationsList) {
            conversationsList.innerHTML = this.renderConversationsList();
            this.setupConversationListeners();
        }
    }

    setupConversationListeners() {
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const conversationId = e.currentTarget.getAttribute('data-conversation-id');
                this.selectConversation(conversationId);
            });
        });
    }

    updateUnreadCounts() {
        const totalUnread = this.conversations.reduce((total, conv) => {
            return total + conv.messages.filter(msg => !msg.read && msg.sender !== 'user').length;
        }, 0);

        // Update navbar badge
        const messagesBadge = document.getElementById('messagesBadge');
        if (messagesBadge) {
            if (totalUnread > 0) {
                messagesBadge.textContent = totalUnread;
                messagesBadge.style.display = 'inline';
            } else {
                messagesBadge.style.display = 'none';
            }
        }
    }

    showMessageNotification(senderName, message) {
        if (window.outreachApp) {
            window.outreachApp.showNotification(`${senderName}: ${message}`, 'info');
        }

        // Browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`New message from ${senderName}`, {
                body: message,
                icon: '/favicon.ico'
            });
        }
    }

    startCall(type) {
        if (!this.activeConversation) return;
        
        const callType = type === 'video' ? 'Video' : 'Voice';
        window.outreachApp.showNotification(`${callType} call started with ${this.activeConversation.name}`, 'info');
    }

    showEmergencyModal() {
        const modal = new bootstrap.Modal(document.getElementById('emergencyModal'));
        modal.show();
    }

    callEmergency() {
        window.outreachApp.showNotification('Emergency services contacted - 911', 'danger');
    }

    contactCrisis() {
        window.outreachApp.showNotification('Crisis support line contacted', 'warning');
    }

    showChatOptions() {
        window.outreachApp.showNotification('Chat options menu', 'info');
    }

    searchConversations(query) {
        const items = document.querySelectorAll('.conversation-item');
        items.forEach(item => {
            const name = item.querySelector('.conversation-name span').textContent.toLowerCase();
            const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();
            
            if (name.includes(query.toLowerCase()) || preview.includes(query.toLowerCase())) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.style.display = 'flex';
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 3000);
        }
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'now';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    }

    showNewConversationModal() {
        // Implementation for new conversation modal
        window.outreachApp.showNotification('New conversation feature coming soon', 'info');
    }

    showGroupChatModal() {
        // Implementation for group chat modal
        window.outreachApp.showNotification('Group chat feature coming soon', 'info');
    }
}

// Initialize messaging system
const messaging = new MessagingSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MessagingSystem;
}