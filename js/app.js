/**
 * Main Application Controller
 * Outreach Client Services Portal
 */

class OutreachApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'landing';
        this.currentTheme = localStorage.getItem('theme') || 'futuristic';
        this.currentMode = localStorage.getItem('mode') || 'dark';
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.showLoadingScreen();
        
        // Simulate loading time for dramatic effect
        setTimeout(() => {
            this.hideLoadingScreen();
            this.initializeApp();
        }, 3000);
    }

    setupEventListeners() {
        // Theme selector
        const themeBtn = document.getElementById('themeBtn');
        const themeMenu = document.getElementById('themeMenu');
        
        if (themeBtn && themeMenu) {
            themeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                themeMenu.style.display = themeMenu.style.display === 'block' ? 'none' : 'block';
            });

            // Close theme menu when clicking outside
            document.addEventListener('click', () => {
                themeMenu.style.display = 'none';
            });

            // Theme option selection
            themeMenu.querySelectorAll('.theme-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const theme = e.currentTarget.getAttribute('data-theme');
                    this.changeTheme(theme);
                });
            });

            // Mode toggle listeners
            themeMenu.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        const mode = e.target.value;
                        this.changeMode(mode);
                    }
                });
            });
        }

        // Home button and submenu
        const homeBtn = document.getElementById('homeBtn');
        const submenu = document.getElementById('submenu');
        
        if (homeBtn && submenu) {
            homeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSubmenu();
            });
        }

        // Navigation links
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // Auth buttons
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showAuthForm('login'));
        }

        if (registerBtn) {
            registerBtn.addEventListener('click', () => this.showAuthForm('register'));
        }

        // User menu actions
        document.querySelectorAll('[data-action]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const action = e.currentTarget.getAttribute('data-action');
                this.handleAction(action);
            });
        });

        // Floating action buttons
        const emergencyFab = document.getElementById('emergencyFab');
        const overdoseFab = document.getElementById('overdoseFab');

        if (emergencyFab) {
            emergencyFab.addEventListener('click', () => this.handleEmergency());
        }

        if (overdoseFab) {
            overdoseFab.addEventListener('click', () => this.toggleOverdoseMonitor());
        }

        // AI Chat
        const chatMinimize = document.getElementById('chatMinimize');
        const chatSend = document.getElementById('chatSend');
        const chatInput = document.getElementById('chatInput');

        if (chatMinimize) {
            chatMinimize.addEventListener('click', () => this.toggleAIChat());
        }

        if (chatSend) {
            chatSend.addEventListener('click', () => this.sendAIMessage());
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendAIMessage();
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
            
            // Animate loading progress
            const progress = loadingScreen.querySelector('.loading-progress');
            if (progress) {
                progress.style.animation = 'loadingProgress 2s ease-in-out infinite';
            }
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (loadingScreen && mainApp) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                mainApp.classList.remove('hidden');
                mainApp.style.animation = 'fadeIn 0.5s ease';
            }, 500);
        }
    }

    initializeApp() {
        // Check for saved user session
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUserInterface();
        }

        // Initialize notification system
        this.initNotifications();

        // Start AI chat if user is logged in
        if (this.currentUser) {
            this.initAIChat();
        }

        console.log('Outreach Client Services Portal initialized successfully');
    }

    loadTheme() {
        document.body.setAttribute('data-theme', this.currentTheme);
        document.body.setAttribute('data-mode', this.currentMode);

        // Update theme selector UI
        const themeMenu = document.getElementById('themeMenu');
        if (themeMenu) {
            themeMenu.querySelectorAll('.theme-option').forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('data-theme') === this.currentTheme) {
                    option.classList.add('active');
                    
                    // Set the correct mode radio button
                    const modeRadio = option.querySelector(`input[value="${this.currentMode}"]`);
                    if (modeRadio) {
                        modeRadio.checked = true;
                    }
                }
            });
        }
    }

    changeTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        document.body.setAttribute('data-theme', theme);
        
        this.showNotification(`Theme changed to ${theme.charAt(0).toUpperCase() + theme.slice(1)}`, 'info');
        this.addSparkEffect();
    }

    changeMode(mode) {
        this.currentMode = mode;
        localStorage.setItem('mode', mode);
        document.body.setAttribute('data-mode', mode);
        
        this.showNotification(`Switched to ${mode} mode`, 'info');
    }

    toggleSubmenu() {
        const submenu = document.getElementById('submenu');
        const homeIcon = document.querySelector('.home-icon');
        
        if (submenu) {
            submenu.classList.toggle('active');
            submenu.classList.toggle('hidden');
        }

        if (homeIcon) {
            homeIcon.style.animation = 'energyPulse 0.6s ease-out';
            setTimeout(() => {
                homeIcon.style.animation = '';
            }, 600);
        }
    }

    navigateToPage(page) {
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(pageEl => {
            pageEl.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${page}Page`) || document.getElementById('landingPage');
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.animation = 'fadeInScale 0.5s ease-out';
        }

        this.currentPage = page;
        
        // Update navigation active states
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Hide submenu
        const submenu = document.getElementById('submenu');
        if (submenu) {
            submenu.classList.remove('active');
            submenu.classList.add('hidden');
        }
    }

    showAuthForm(type) {
        const authPage = document.getElementById('authPage');
        if (!authPage) return;

        // Hide all other pages
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });

        // Generate auth form HTML
        authPage.innerHTML = this.generateAuthForm(type);
        authPage.classList.add('active');
        
        // Add event listeners for the new form
        this.setupAuthFormListeners(type);
    }

    generateAuthForm(type) {
        const isLogin = type === 'login';
        const title = isLogin ? 'Login to Portal' : 'Create Account';
        const submitText = isLogin ? 'Login' : 'Register';
        const switchText = isLogin ? "Don't have an account? Register" : "Already have an account? Login";
        const switchType = isLogin ? 'register' : 'login';

        return `
            <div class="container-fluid">
                <div class="row justify-content-center align-items-center min-vh-100">
                    <div class="col-md-6 col-lg-4">
                        <div class="auth-card cyber-border animate-fade-in">
                            <div class="auth-header text-center mb-4">
                                <div class="auth-icon mb-3">
                                    <i class="fas fa-${isLogin ? 'sign-in-alt' : 'user-plus'} fa-3x"></i>
                                </div>
                                <h2 class="auth-title">${title}</h2>
                            </div>
                            
                            <form id="authForm" class="auth-form">
                                ${!isLogin ? `
                                    <div class="mb-3">
                                        <label class="form-label">Full Name</label>
                                        <input type="text" class="form-control cyber-input" name="fullName" required>
                                    </div>
                                ` : ''}
                                
                                <div class="mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control cyber-input" name="email" required>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Password</label>
                                    <input type="password" class="form-control cyber-input" name="password" required>
                                </div>
                                
                                ${!isLogin ? `
                                    <div class="mb-3">
                                        <label class="form-label">Role</label>
                                        <select class="form-select cyber-input" name="role" required>
                                            <option value="">Select your role</option>
                                            <option value="client">Client</option>
                                            <option value="outreach-staff">Outreach Staff</option>
                                            <option value="service-provider">Service Provider</option>
                                            <option value="admin">Administrator</option>
                                        </select>
                                    </div>
                                ` : ''}
                                
                                ${isLogin ? `
                                    <div class="mb-3">
                                        <a href="#" id="forgotPasswordLink" class="text-decoration-none">
                                            <i class="fas fa-key"></i> Forgot Password?
                                        </a>
                                    </div>
                                ` : ''}
                                
                                <button type="submit" class="btn btn-primary w-100 cyber-btn mb-3">
                                    <i class="fas fa-${isLogin ? 'sign-in-alt' : 'user-plus'}"></i> ${submitText}
                                </button>
                                
                                <div class="text-center">
                                    <a href="#" id="switchAuthType" class="text-decoration-none">
                                        ${switchText}
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .auth-card {
                    background: var(--overlay-color);
                    border-radius: 8px;
                    padding: 2rem;
                    backdrop-filter: blur(20px);
                }
                
                .auth-icon {
                    color: var(--accent-primary);
                    text-shadow: 0 0 20px currentColor;
                }
                
                .auth-title {
                    color: var(--accent-primary);
                    font-family: var(--primary-font);
                    text-shadow: 0 0 15px currentColor;
                }
                
                .cyber-input {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border-color);
                    color: var(--text-primary);
                    border-radius: 4px;
                    transition: all 0.3s ease;
                }
                
                .cyber-input:focus {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
                    color: var(--text-primary);
                }
                
                .form-label {
                    color: var(--text-secondary);
                    font-weight: 500;
                }
            </style>
        `;
    }

    setupAuthFormListeners(type) {
        const authForm = document.getElementById('authForm');
        const switchLink = document.getElementById('switchAuthType');
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');

        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAuth(type, new FormData(authForm));
            });
        }

        if (switchLink) {
            switchLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAuthForm(type === 'login' ? 'register' : 'login');
            });
        }

        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPasswordForm();
            });
        }
    }

    handleAuth(type, formData) {
        this.setLoading(true);
        
        // Simulate authentication process
        setTimeout(() => {
            const email = formData.get('email');
            const password = formData.get('password');
            
            if (type === 'login') {
                // Simulate login
                this.currentUser = {
                    id: Date.now(),
                    email: email,
                    name: email.split('@')[0],
                    role: 'client', // Default for demo
                    lastLogin: new Date().toISOString()
                };
            } else {
                // Simulate registration
                this.currentUser = {
                    id: Date.now(),
                    email: email,
                    name: formData.get('fullName'),
                    role: formData.get('role'),
                    createdAt: new Date().toISOString()
                };
            }

            // Save user session
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            this.setLoading(false);
            this.updateUserInterface();
            this.showNotification(`Welcome, ${this.currentUser.name}!`, 'success');
            this.navigateToPage('dashboard');
            this.initAIChat();
            
        }, 2000);
    }

    updateUserInterface() {
        const userName = document.getElementById('userName');
        if (userName && this.currentUser) {
            userName.textContent = this.currentUser.name;
        }

        // Show/hide elements based on authentication
        const authElements = document.querySelectorAll('.auth-required');
        const guestElements = document.querySelectorAll('.guest-only');

        authElements.forEach(el => {
            el.style.display = this.currentUser ? 'block' : 'none';
        });

        guestElements.forEach(el => {
            el.style.display = this.currentUser ? 'none' : 'block';
        });
    }

    handleAction(action) {
        switch (action) {
            case 'profile':
                this.showProfile();
                break;
            case 'settings':
                this.showSettings();
                break;
            case 'logout':
                this.logout();
                break;
            case 'emergency':
                this.handleEmergency();
                break;
            case 'overdose-monitor':
                this.toggleOverdoseMonitor();
                break;
            case 'quick-message':
                this.showQuickMessage();
                break;
            case 'resources':
                this.showResources();
                break;
            default:
                console.log(`Unhandled action: ${action}`);
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUserInterface();
        this.showNotification('Logged out successfully', 'info');
        this.navigateToPage('landing');
    }

    handleEmergency() {
        this.showNotification('Emergency services contacted!', 'danger');
        
        // Simulate emergency protocol
        const emergencyModal = this.createEmergencyModal();
        document.body.appendChild(emergencyModal);
        
        setTimeout(() => {
            document.body.removeChild(emergencyModal);
        }, 5000);
    }

    createEmergencyModal() {
        const modal = document.createElement('div');
        modal.className = 'emergency-modal';
        modal.innerHTML = `
            <div class="emergency-content">
                <div class="emergency-icon">
                    <i class="fas fa-exclamation-triangle fa-5x"></i>
                </div>
                <h2>Emergency Protocol Activated</h2>
                <p>Emergency services have been notified.</p>
                <p>Help is on the way.</p>
                <div class="emergency-timer">
                    <div class="timer-circle">
                        <div class="timer-fill"></div>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(255, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: emergencyFlash 0.5s ease-in-out infinite alternate;
        `;
        
        return modal;
    }

    toggleOverdoseMonitor() {
        const isActive = localStorage.getItem('overdoseMonitorActive') === 'true';
        localStorage.setItem('overdoseMonitorActive', !isActive);
        
        if (!isActive) {
            this.startOverdoseMonitor();
            this.showNotification('Overdose monitor activated - Stay safe!', 'success');
        } else {
            this.stopOverdoseMonitor();
            this.showNotification('Overdose monitor deactivated', 'info');
        }
    }

    startOverdoseMonitor() {
        // Implementation for overdose monitoring
        console.log('Overdose monitor started');
    }

    stopOverdoseMonitor() {
        // Implementation for stopping overdose monitoring
        console.log('Overdose monitor stopped');
    }

    toggleAIChat() {
        const chatBubble = document.getElementById('aiChatBubble');
        if (chatBubble) {
            chatBubble.classList.toggle('minimized');
        }
    }

    sendAIMessage() {
        const chatInput = document.getElementById('chatInput');
        const chatMessages = document.getElementById('chatMessages');
        
        if (chatInput && chatMessages) {
            const message = chatInput.value.trim();
            if (message) {
                this.addChatMessage('user', message);
                chatInput.value = '';
                
                // Simulate AI response
                setTimeout(() => {
                    const response = this.generateAIResponse(message);
                    this.addChatMessage('ai', response);
                }, 1000);
            }
        }
    }

    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            const messageEl = document.createElement('div');
            messageEl.className = `chat-message ${sender}-message`;
            messageEl.innerHTML = `
                <div class="message-content">
                    <strong>${sender === 'user' ? 'You' : 'Safety AI'}:</strong>
                    <p>${message}</p>
                    <small>${new Date().toLocaleTimeString()}</small>
                </div>
            `;
            chatMessages.appendChild(messageEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    generateAIResponse(message) {
        const responses = [
            "I'm here to help keep you safe. How are you feeling right now?",
            "Remember to stay hydrated and in a safe environment.",
            "If you need immediate help, please call emergency services.",
            "I'm monitoring your well-being. Please respond to confirm you're okay.",
            "Your safety is important. Consider having a trusted person nearby."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    initAIChat() {
        setTimeout(() => {
            this.addChatMessage('ai', 'Hello! I\'m your Safety AI assistant. I\'m here to help monitor your well-being. How can I assist you today?');
        }, 1000);
    }

    initNotifications() {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type} animate-slide-in-right`;
        
        const icons = {
            'info': 'fa-info-circle',
            'success': 'fa-check-circle',
            'warning': 'fa-exclamation-triangle',
            'danger': 'fa-times-circle'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icons[type] || icons.info}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('animate-slide-in-right');
                notification.classList.add('animate-slide-out-right');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // Add notification styles if not present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    background: var(--overlay-color);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    backdrop-filter: blur(20px);
                    overflow: hidden;
                }
                
                .notification-content {
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-primary);
                }
                
                .notification-info { border-left: 4px solid var(--accent-primary); }
                .notification-success { border-left: 4px solid var(--success-color); }
                .notification-warning { border-left: 4px solid var(--warning-color); }
                .notification-danger { border-left: 4px solid var(--danger-color); }
                
                .notification-close {
                    margin-left: auto;
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                }
                
                .notification-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-primary);
                }
            `;
            document.head.appendChild(styles);
        }
    }

    addSparkEffect() {
        // Add visual spark effects for theme changes
        const sparks = document.createElement('div');
        sparks.className = 'spark-container';
        sparks.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9998;
        `;

        for (let i = 0; i < 20; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            spark.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--accent-primary);
                border-radius: 50%;
                top: ${Math.random() * 100}vh;
                left: ${Math.random() * 100}vw;
                animation: sparkFall 1s ease-out;
                box-shadow: 0 0 6px var(--accent-primary);
            `;
            sparks.appendChild(spark);
        }

        document.body.appendChild(sparks);
        setTimeout(() => document.body.removeChild(sparks), 1000);
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for quick search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // Implement quick search
        }

        // Escape to close modals/menus
        if (e.key === 'Escape') {
            const submenu = document.getElementById('submenu');
            const themeMenu = document.getElementById('themeMenu');
            
            if (submenu && !submenu.classList.contains('hidden')) {
                submenu.classList.add('hidden');
                submenu.classList.remove('active');
            }
            
            if (themeMenu) {
                themeMenu.style.display = 'none';
            }
        }
    }

    setLoading(isLoading) {
        this.isLoading = isLoading;
        // Update UI to show loading state
        const authForm = document.getElementById('authForm');
        if (authForm) {
            const submitBtn = authForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = isLoading;
                submitBtn.innerHTML = isLoading ? 
                    '<i class="fas fa-spinner fa-spin"></i> Processing...' : 
                    submitBtn.innerHTML;
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.outreachApp = new OutreachApp();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OutreachApp;
}