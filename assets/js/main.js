// OutreachX - Main JavaScript
// Watch Dogs / Cyberpunk inspired functionality

class OutreachX {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'futuristic';
        this.isLightMode = localStorage.getItem('lightMode') === 'true';
        this.notifications = [];
        this.particles = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.showLoadingScreen();
        this.createParticleSystem();
        this.initializeAnimations();
        this.setupScrollEffects();
    }

    setupEventListeners() {
        // Loading complete
        window.addEventListener('load', () => {
            setTimeout(() => this.hideLoadingScreen(), 1000);
        });

        // Theme toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('#themeToggle')) {
                this.toggleThemeSelector();
            }
            
            if (e.target.closest('.theme-option')) {
                const theme = e.target.closest('.theme-option').dataset.theme;
                this.setTheme(theme);
            }
        });

        // Smooth scrolling
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            }
        });

        // Button press effects
        document.addEventListener('mousedown', (e) => {
            if (e.target.closest('.hud-btn')) {
                e.target.closest('.hud-btn').classList.add('btn-press');
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (e.target.closest('.hud-btn')) {
                setTimeout(() => {
                    e.target.closest('.hud-btn').classList.remove('btn-press');
                }, 100);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Mouse effects
        document.addEventListener('mousemove', (e) => {
            this.updateMouseEffects(e.clientX, e.clientY);
        });
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            // Simulate loading progress
            const progressBar = loadingScreen.querySelector('.loading-progress');
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                if (progressBar) {
                    progressBar.style.width = progress + '%';
                }
            }, 200);
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 800);
        }
        this.animatePageElements();
    }

    animatePageElements() {
        // Animate elements on page load
        const elements = document.querySelectorAll('.hud-panel, .service-card, .hud-nav-link');
        elements.forEach((el, index) => {
            el.style.animationDelay = (index * 0.1) + 's';
            el.classList.add('hud-appear');
        });
    }

    initializeTheme() {
        document.body.className = `theme-${this.currentTheme}${this.isLightMode ? ' light' : ''}`;
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeSelector();
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        document.body.className = `theme-${theme}${this.isLightMode ? ' light' : ''}`;
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeSelector();
        this.showNotification(`Theme changed to ${theme}`, 'success');
        this.createShockwave(event.target);
    }

    toggleTheme() {
        this.isLightMode = !this.isLightMode;
        localStorage.setItem('lightMode', this.isLightMode);
        document.body.classList.toggle('light', this.isLightMode);
        this.showNotification(`Switched to ${this.isLightMode ? 'light' : 'dark'} mode`, 'success');
    }

    toggleThemeSelector() {
        const themeOptions = document.getElementById('themeOptions');
        if (themeOptions) {
            themeOptions.classList.toggle('show');
        }
    }

    updateThemeSelector() {
        const options = document.querySelectorAll('.theme-option');
        options.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === this.currentTheme);
        });
    }

    scrollToSection(targetId) {
        const element = document.getElementById(targetId);
        if (element) {
            const headerHeight = document.querySelector('.hud-navbar').offsetHeight;
            const elementPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    createParticleSystem() {
        const particleContainer = document.getElementById('particles');
        if (!particleContainer) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random position and animation
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            particleContainer.appendChild(particle);
            
            // Add floating motion
            this.animateParticle(particle);
        }
    }

    animateParticle(particle) {
        const animation = particle.animate([
            { 
                transform: 'translate(0px, 0px)',
                opacity: Math.random() * 0.5 + 0.3
            },
            { 
                transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`,
                opacity: Math.random() * 0.8 + 0.2
            },
            { 
                transform: 'translate(0px, 0px)',
                opacity: Math.random() * 0.5 + 0.3
            }
        ], {
            duration: Math.random() * 6000 + 4000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
    }

    createShockwave(element) {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const shockwave = document.createElement('div');
        shockwave.classList.add('shockwave');
        shockwave.style.position = 'fixed';
        shockwave.style.left = rect.left + rect.width / 2 + 'px';
        shockwave.style.top = rect.top + rect.height / 2 + 'px';
        shockwave.style.transform = 'translate(-50%, -50%)';
        shockwave.style.pointerEvents = 'none';
        shockwave.style.zIndex = '9999';
        
        document.body.appendChild(shockwave);
        
        setTimeout(() => {
            shockwave.remove();
        }, 600);
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        if (!container) return;

        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
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
                notification.style.animation = 'slideOutNotification 0.4s ease forwards';
                setTimeout(() => notification.remove(), 400);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-triangle',
            'warning': 'exclamation-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    initializeAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe service cards
        document.querySelectorAll('.service-card').forEach(card => {
            observer.observe(card);
        });
    }

    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const navbar = document.querySelector('.hud-navbar');
            
            if (navbar) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }

    updateMouseEffects(x, y) {
        // Update particle positions based on mouse
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            const rect = particle.getBoundingClientRect();
            const distance = Math.sqrt(
                Math.pow(x - (rect.left + rect.width / 2), 2) +
                Math.pow(y - (rect.top + rect.height / 2), 2)
            );
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.style.transform = `translate(${(x - rect.left) * force * 0.1}px, ${(y - rect.top) * force * 0.1}px)`;
            }
        });
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        });
    }

    // Utility functions
    generateId() {
        return 'id-' + Math.random().toString(36).substr(2, 9);
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString();
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the application
const outreachX = new OutreachX();

// Global utility functions
function scrollToSection(targetId) {
    outreachX.scrollToSection(targetId);
}

function showForgotPassword() {
    outreachX.showNotification('Password reset functionality coming soon!', 'info');
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OutreachX;
}