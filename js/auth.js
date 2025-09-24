/**
 * Authentication System
 * Handle login, registration, and user management
 */

class AuthSystem {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.sessionToken = null;
        
        this.init();
    }

    init() {
        this.loadUsers();
        this.checkSession();
    }

    loadUsers() {
        const savedUsers = localStorage.getItem('registeredUsers');
        if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        } else {
            // Initialize with demo users
            this.users = [
                {
                    id: 'demo-client-1',
                    email: 'client@demo.com',
                    password: 'demo123',
                    name: 'Demo Client',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    profile: {
                        emergencyContact: '+1-555-0123',
                        medicalInfo: 'No known allergies',
                        preferences: {
                            theme: 'futuristic',
                            notifications: true
                        }
                    }
                },
                {
                    id: 'demo-outreach-1',
                    email: 'outreach@demo.com',
                    password: 'demo123',
                    name: 'Sarah Johnson',
                    role: 'outreach-staff',
                    createdAt: new Date().toISOString(),
                    profile: {
                        department: 'Street Outreach',
                        certification: 'Certified Peer Support Specialist',
                        workSchedule: 'Monday-Friday, 9AM-5PM'
                    }
                }
            ];
            this.saveUsers();
        }
    }

    saveUsers() {
        localStorage.setItem('registeredUsers', JSON.stringify(this.users));
    }

    checkSession() {
        const savedSession = localStorage.getItem('userSession');
        if (savedSession) {
            const session = JSON.parse(savedSession);
            if (this.isValidSession(session)) {
                this.currentUser = session.user;
                this.sessionToken = session.token;
                return true;
            } else {
                this.clearSession();
            }
        }
        return false;
    }

    isValidSession(session) {
        // Check if session is less than 24 hours old
        const sessionAge = Date.now() - new Date(session.createdAt).getTime();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        return sessionAge < maxAge && session.user && session.token;
    }

    async login(email, password) {
        try {
            // Simulate network delay
            await this.delay(1500);

            const user = this.users.find(u => 
                u.email.toLowerCase() === email.toLowerCase() && 
                u.password === password
            );

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Update last login
            user.lastLogin = new Date().toISOString();
            this.saveUsers();

            // Create session
            this.currentUser = user;
            this.sessionToken = this.generateToken();
            
            const session = {
                user: user,
                token: this.sessionToken,
                createdAt: new Date().toISOString()
            };

            localStorage.setItem('userSession', JSON.stringify(session));

            // Remove password from current user object for security
            this.currentUser = { ...user };
            delete this.currentUser.password;

            return {
                success: true,
                user: this.currentUser,
                message: 'Login successful'
            };

        } catch (error) {
            return {
                success: false,
                message: error.message || 'Login failed'
            };
        }
    }

    async register(userData) {
        try {
            // Simulate network delay
            await this.delay(2000);

            // Validate required fields
            const required = ['email', 'password', 'fullName', 'role'];
            for (const field of required) {
                if (!userData[field] || userData[field].trim() === '') {
                    throw new Error(`${field} is required`);
                }
            }

            // Validate email format
            if (!this.isValidEmail(userData.email)) {
                throw new Error('Please enter a valid email address');
            }

            // Check if email already exists
            if (this.users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
                throw new Error('An account with this email already exists');
            }

            // Validate password strength
            if (!this.isValidPassword(userData.password)) {
                throw new Error('Password must be at least 6 characters long');
            }

            // Create new user
            const newUser = {
                id: 'user-' + Date.now(),
                email: userData.email.toLowerCase(),
                password: userData.password, // In real app, this should be hashed
                name: userData.fullName,
                role: userData.role,
                createdAt: new Date().toISOString(),
                profile: this.createDefaultProfile(userData.role)
            };

            this.users.push(newUser);
            this.saveUsers();

            // Auto-login after registration
            const loginResult = await this.login(userData.email, userData.password);
            
            return {
                success: true,
                user: this.currentUser,
                message: 'Registration successful'
            };

        } catch (error) {
            return {
                success: false,
                message: error.message || 'Registration failed'
            };
        }
    }

    async resetPassword(email) {
        try {
            await this.delay(1000);

            const user = this.users.find(u => 
                u.email.toLowerCase() === email.toLowerCase()
            );

            if (!user) {
                // Don't reveal whether email exists for security
                return {
                    success: true,
                    message: 'If an account exists with this email, password reset instructions have been sent'
                };
            }

            // In a real app, send email with reset token
            console.log(`Password reset requested for: ${email}`);

            return {
                success: true,
                message: 'Password reset instructions sent to your email'
            };

        } catch (error) {
            return {
                success: false,
                message: 'Failed to send reset instructions'
            };
        }
    }

    logout() {
        this.currentUser = null;
        this.sessionToken = null;
        this.clearSession();
        
        return {
            success: true,
            message: 'Logged out successfully'
        };
    }

    clearSession() {
        localStorage.removeItem('userSession');
    }

    updateProfile(updates) {
        if (!this.currentUser) {
            return {
                success: false,
                message: 'Not authenticated'
            };
        }

        try {
            // Find and update user
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            // Update allowed fields
            const allowedFields = ['name', 'profile'];
            for (const field of allowedFields) {
                if (updates[field] !== undefined) {
                    if (field === 'profile') {
                        this.users[userIndex].profile = {
                            ...this.users[userIndex].profile,
                            ...updates.profile
                        };
                    } else {
                        this.users[userIndex][field] = updates[field];
                    }
                }
            }

            this.saveUsers();

            // Update current user (without password)
            this.currentUser = { ...this.users[userIndex] };
            delete this.currentUser.password;

            // Update session
            const session = JSON.parse(localStorage.getItem('userSession'));
            if (session) {
                session.user = this.currentUser;
                localStorage.setItem('userSession', JSON.stringify(session));
            }

            return {
                success: true,
                user: this.currentUser,
                message: 'Profile updated successfully'
            };

        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to update profile'
            };
        }
    }

    changePassword(currentPassword, newPassword) {
        if (!this.currentUser) {
            return {
                success: false,
                message: 'Not authenticated'
            };
        }

        try {
            const user = this.users.find(u => u.id === this.currentUser.id);
            if (!user || user.password !== currentPassword) {
                throw new Error('Current password is incorrect');
            }

            if (!this.isValidPassword(newPassword)) {
                throw new Error('New password must be at least 6 characters long');
            }

            user.password = newPassword; // In real app, hash this
            this.saveUsers();

            return {
                success: true,
                message: 'Password changed successfully'
            };

        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to change password'
            };
        }
    }

    getRoleCapabilities(role) {
        const capabilities = {
            'client': [
                'view-dashboard',
                'use-messaging',
                'order-supplies',
                'complete-assessments',
                'view-documents',
                'use-ai-chat'
            ],
            'outreach-staff': [
                'view-dashboard',
                'use-messaging',
                'order-supplies',
                'complete-assessments',
                'view-documents',
                'use-ai-chat',
                'case-management',
                'incident-reporting',
                'view-client-data'
            ],
            'service-provider': [
                'view-dashboard',
                'use-messaging',
                'case-management',
                'incident-reporting',
                'view-client-data',
                'manage-referrals',
                'view-reports'
            ],
            'admin': [
                'view-dashboard',
                'use-messaging',
                'case-management',
                'incident-reporting',
                'view-client-data',
                'manage-referrals',
                'view-reports',
                'user-management',
                'system-configuration',
                'view-analytics'
            ]
        };

        return capabilities[role] || capabilities['client'];
    }

    hasPermission(capability) {
        if (!this.currentUser) return false;
        
        const userCapabilities = this.getRoleCapabilities(this.currentUser.role);
        return userCapabilities.includes(capability);
    }

    createDefaultProfile(role) {
        const baseProfile = {
            preferences: {
                theme: 'futuristic',
                mode: 'dark',
                notifications: true,
                language: 'en'
            }
        };

        switch (role) {
            case 'client':
                return {
                    ...baseProfile,
                    emergencyContact: '',
                    medicalInfo: '',
                    consentForms: {
                        dataSharing: false,
                        communication: false,
                        treatment: false
                    }
                };

            case 'outreach-staff':
                return {
                    ...baseProfile,
                    department: '',
                    certification: '',
                    workSchedule: '',
                    caseload: []
                };

            case 'service-provider':
                return {
                    ...baseProfile,
                    organization: '',
                    license: '',
                    specialties: [],
                    availability: ''
                };

            case 'admin':
                return {
                    ...baseProfile,
                    accessLevel: 'full',
                    permissions: this.getRoleCapabilities('admin')
                };

            default:
                return baseProfile;
        }
    }

    generateToken() {
        return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPassword(password) {
        return password && password.length >= 6;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Admin functions
    getAllUsers() {
        if (!this.hasPermission('user-management')) {
            return {
                success: false,
                message: 'Access denied'
            };
        }

        return {
            success: true,
            users: this.users.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            })
        };
    }

    updateUserRole(userId, newRole) {
        if (!this.hasPermission('user-management')) {
            return {
                success: false,
                message: 'Access denied'
            };
        }

        try {
            const user = this.users.find(u => u.id === userId);
            if (!user) {
                throw new Error('User not found');
            }

            user.role = newRole;
            user.profile = {
                ...user.profile,
                ...this.createDefaultProfile(newRole)
            };

            this.saveUsers();

            return {
                success: true,
                message: 'User role updated successfully'
            };

        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to update user role'
            };
        }
    }

    deleteUser(userId) {
        if (!this.hasPermission('user-management')) {
            return {
                success: false,
                message: 'Access denied'
            };
        }

        try {
            if (userId === this.currentUser?.id) {
                throw new Error('Cannot delete your own account');
            }

            const userIndex = this.users.findIndex(u => u.id === userId);
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            this.users.splice(userIndex, 1);
            this.saveUsers();

            return {
                success: true,
                message: 'User deleted successfully'
            };

        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to delete user'
            };
        }
    }

    // Get user statistics
    getUserStats() {
        if (!this.hasPermission('view-analytics')) {
            return {
                success: false,
                message: 'Access denied'
            };
        }

        const stats = {
            totalUsers: this.users.length,
            roleDistribution: {},
            recentRegistrations: 0,
            activeUsers: 0
        };

        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        this.users.forEach(user => {
            // Role distribution
            stats.roleDistribution[user.role] = (stats.roleDistribution[user.role] || 0) + 1;

            // Recent registrations (last week)
            if (new Date(user.createdAt) > oneWeekAgo) {
                stats.recentRegistrations++;
            }

            // Active users (logged in within last day)
            if (user.lastLogin && new Date(user.lastLogin) > oneDayAgo) {
                stats.activeUsers++;
            }
        });

        return {
            success: true,
            stats
        };
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}