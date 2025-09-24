// OutreachX - Authentication System
// Role-based access control and security

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.loginAttempts = 0;
        this.maxLoginAttempts = 5;
        this.users = this.loadUsers();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkExistingSession();
        this.startSessionTimer();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Logout functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.logout-btn')) {
                this.logout();
            }
        });
    }

    loadUsers() {
        // Load users from localStorage (in production, this would be server-side)
        const storedUsers = localStorage.getItem('outreachx_users');
        if (storedUsers) {
            return JSON.parse(storedUsers);
        }
        
        // Default demo users
        const defaultUsers = [
            {
                id: 'demo-admin',
                username: 'admin',
                email: 'admin@outreachx.com',
                password: this.hashPassword('admin123'),
                role: 'admin',
                profile: {
                    firstName: 'System',
                    lastName: 'Administrator',
                    avatar: '',
                    permissions: ['all']
                },
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isActive: true
            },
            {
                id: 'demo-staff',
                username: 'staff',
                email: 'staff@outreachx.com',
                password: this.hashPassword('staff123'),
                role: 'staff',
                profile: {
                    firstName: 'Outreach',
                    lastName: 'Staff',
                    avatar: '',
                    permissions: ['messaging', 'case_management', 'incident_reporting', 'supplies']
                },
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isActive: true
            },
            {
                id: 'demo-client',
                username: 'client',
                email: 'client@outreachx.com',
                password: this.hashPassword('client123'),
                role: 'client',
                profile: {
                    firstName: 'Test',
                    lastName: 'Client',
                    avatar: '',
                    permissions: ['messaging', 'supplies', 'ai_chat']
                },
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isActive: true
            }
        ];
        
        this.saveUsers(defaultUsers);
        return defaultUsers;
    }

    saveUsers(users = this.users) {
        localStorage.setItem('outreachx_users', JSON.stringify(users));
    }

    hashPassword(password) {
        // Simple hash for demo (use proper encryption in production)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    async handleLogin() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            this.showAuthError('Please fill in all fields');
            return;
        }

        // Check login attempts
        if (this.loginAttempts >= this.maxLoginAttempts) {
            this.showAuthError('Too many login attempts. Please try again later.');
            return;
        }

        // Find user
        const user = this.users.find(u => 
            u.username === username && u.password === this.hashPassword(password)
        );

        if (!user) {
            this.loginAttempts++;
            this.showAuthError('Invalid username or password');
            this.addScanLine(document.getElementById('loginForm'));
            return;
        }

        if (!user.isActive) {
            this.showAuthError('Account is deactivated. Please contact support.');
            return;
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        this.saveUsers();

        // Create session
        this.createSession(user);
        this.showAuthSuccess('Login successful! Redirecting...');
        
        setTimeout(() => {
            this.redirectToDashboard(user.role);
        }, 1500);
    }

    async handleRegister() {
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole').value;

        if (!username || !email || !password || !role) {
            this.showAuthError('Please fill in all fields');
            return;
        }

        // Validate username uniqueness
        if (this.users.find(u => u.username === username)) {
            this.showAuthError('Username already exists');
            return;
        }

        // Validate email uniqueness
        if (this.users.find(u => u.email === email)) {
            this.showAuthError('Email already registered');
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            this.showAuthError('Password must be at least 6 characters');
            return;
        }

        // Create new user
        const newUser = {
            id: this.generateUserId(),
            username,
            email,
            password: this.hashPassword(password),
            role,
            profile: {
                firstName: '',
                lastName: '',
                avatar: '',
                permissions: this.getRolePermissions(role)
            },
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true
        };

        this.users.push(newUser);
        this.saveUsers();

        this.showAuthSuccess('Account created successfully! You can now login.');
        
        // Switch to login tab
        setTimeout(() => {
            document.getElementById('login-tab').click();
        }, 2000);
    }

    createSession(user) {
        const session = {
            userId: user.id,
            username: user.username,
            role: user.role,
            permissions: user.profile.permissions,
            loginTime: new Date().toISOString(),
            expiresAt: new Date(Date.now() + this.sessionTimeout).toISOString()
        };

        localStorage.setItem('outreachx_session', JSON.stringify(session));
        this.currentUser = user;
        
        // Reset login attempts
        this.loginAttempts = 0;
    }

    checkExistingSession() {
        const session = localStorage.getItem('outreachx_session');
        if (!session) return;

        const sessionData = JSON.parse(session);
        const now = new Date();
        const expiresAt = new Date(sessionData.expiresAt);

        if (now < expiresAt) {
            // Session is still valid
            const user = this.users.find(u => u.id === sessionData.userId);
            if (user && user.isActive) {
                this.currentUser = user;
                return true;
            }
        }

        // Session expired or invalid
        this.logout();
        return false;
    }

    startSessionTimer() {
        setInterval(() => {
            if (this.currentUser && !this.checkExistingSession()) {
                outreachX.showNotification('Session expired. Please login again.', 'warning');
                this.logout();
            }
        }, 60000); // Check every minute
    }

    logout() {
        localStorage.removeItem('outreachx_session');
        this.currentUser = null;
        window.location.href = 'index.html';
    }

    redirectToDashboard(role) {
        // Close the modal first
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            const modal = bootstrap.Modal.getInstance(loginModal);
            if (modal) modal.hide();
        }

        // Redirect based on role
        const dashboardUrls = {
            'admin': 'admin-dashboard.html',
            'staff': 'staff-dashboard.html',
            'provider': 'provider-dashboard.html',
            'client': 'client-dashboard.html'
        };

        setTimeout(() => {
            window.location.href = dashboardUrls[role] || 'dashboard.html';
        }, 500);
    }

    getRolePermissions(role) {
        const permissions = {
            'admin': ['all'],
            'staff': ['messaging', 'case_management', 'incident_reporting', 'supplies', 'assessments'],
            'provider': ['messaging', 'case_management', 'referrals'],
            'client': ['messaging', 'supplies', 'ai_chat', 'assessments']
        };

        return permissions[role] || ['messaging'];
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;
        
        const permissions = this.currentUser.profile.permissions;
        return permissions.includes('all') || permissions.includes(permission);
    }

    showAuthError(message) {
        this.showAuthMessage(message, 'error');
    }

    showAuthSuccess(message) {
        this.showAuthMessage(message, 'success');
    }

    showAuthMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.auth-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message alert alert-${type === 'error' ? 'danger' : 'success'} mt-3`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
            ${message}
        `;

        // Insert message
        const activeForm = document.querySelector('.tab-pane.active form');
        if (activeForm) {
            activeForm.appendChild(messageDiv);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    addScanLine(element) {
        const scanLine = document.createElement('div');
        scanLine.className = 'scan-line';
        element.style.position = 'relative';
        element.appendChild(scanLine);

        setTimeout(() => {
            scanLine.remove();
        }, 3000);
    }

    generateUserId() {
        return 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Demo functions for testing
    getDemoCredentials() {
        return {
            admin: { username: 'admin', password: 'admin123' },
            staff: { username: 'staff', password: 'staff123' },
            client: { username: 'client', password: 'client123' }
        };
    }
}

// Two-Factor Authentication (2FA) System
class TwoFactorAuth {
    constructor(authSystem) {
        this.authSystem = authSystem;
        this.codes = new Map();
    }

    generateCode(userId) {
        const code = Math.random().toString(36).substr(2, 6).toUpperCase();
        this.codes.set(userId, {
            code,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
        });
        return code;
    }

    verifyCode(userId, inputCode) {
        const stored = this.codes.get(userId);
        if (!stored) return false;
        
        if (Date.now() > stored.expiresAt) {
            this.codes.delete(userId);
            return false;
        }

        if (stored.code === inputCode.toUpperCase()) {
            this.codes.delete(userId);
            return true;
        }

        return false;
    }

    sendCode(user, method = 'email') {
        const code = this.generateCode(user.id);
        
        // In production, send via email/SMS
        console.log(`2FA Code for ${user.username}: ${code}`);
        outreachX.showNotification(`2FA code sent to your ${method}`, 'info');
        
        return code;
    }
}

// Security Monitor
class SecurityMonitor {
    constructor(authSystem) {
        this.authSystem = authSystem;
        this.failedAttempts = new Map();
        this.suspiciousActivity = [];
    }

    logSecurityEvent(event, userId = null, details = {}) {
        const securityEvent = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            event,
            userId,
            userAgent: navigator.userAgent,
            ip: 'localhost', // In production, get real IP
            details
        };

        this.suspiciousActivity.push(securityEvent);
        
        // Keep only last 100 events
        if (this.suspiciousActivity.length > 100) {
            this.suspiciousActivity.shift();
        }

        // Check for suspicious patterns
        this.analyzeSecurity(securityEvent);
    }

    analyzeSecurity(event) {
        // Check for brute force attacks
        if (event.event === 'login_failed') {
            const attempts = this.failedAttempts.get(event.details.username) || 0;
            this.failedAttempts.set(event.details.username, attempts + 1);
            
            if (attempts >= 5) {
                this.triggerSecurityAlert('potential_brute_force', event);
            }
        }

        // Reset failed attempts on successful login
        if (event.event === 'login_success') {
            this.failedAttempts.delete(event.userId);
        }
    }

    triggerSecurityAlert(type, event) {
        console.warn('Security Alert:', type, event);
        outreachX.showNotification('Security alert triggered. Administrators notified.', 'warning');
    }
}

// Initialize authentication system
const authSystem = new AuthSystem();
const twoFactorAuth = new TwoFactorAuth(authSystem);
const securityMonitor = new SecurityMonitor(authSystem);

// Global authentication functions
function getCurrentUser() {
    return authSystem.currentUser;
}

function hasPermission(permission) {
    return authSystem.hasPermission(permission);
}

function requireAuth(redirectUrl = 'index.html') {
    if (!authSystem.checkExistingSession()) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthSystem, TwoFactorAuth, SecurityMonitor };
}