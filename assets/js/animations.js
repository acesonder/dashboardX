// OutreachX - Animation System
// Advanced animations and effects

class AnimationSystem {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.effects = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupClickEffects();
        this.bindEvents();
    }

    bindEvents() {
        // Listen for reduced motion preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
            if (this.isReducedMotion) {
                this.disableAnimations();
            } else {
                this.enableAnimations();
            }
        });

        // Custom animation events
        document.addEventListener('triggerAnimation', (e) => {
            this.triggerAnimation(e.detail.element, e.detail.animation, e.detail.options);
        });

        document.addEventListener('stopAnimation', (e) => {
            this.stopAnimation(e.detail.element, e.detail.animation);
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateOnScroll(entry.target);
                }
            });
        }, options);

        // Observe elements that should animate on scroll
        this.observeScrollElements();
    }

    observeScrollElements() {
        const elements = document.querySelectorAll(
            '.service-card, .hud-panel, .hero-content, .section-header'
        );
        
        elements.forEach(el => {
            if (!el.dataset.animated) {
                this.scrollObserver.observe(el);
            }
        });
    }

    animateOnScroll(element) {
        if (this.isReducedMotion) return;

        const animationType = element.dataset.animation || this.getDefaultAnimation(element);
        const delay = element.dataset.animationDelay || 0;
        
        setTimeout(() => {
            this.triggerAnimation(element, animationType);
            element.dataset.animated = 'true';
        }, delay);
    }

    getDefaultAnimation(element) {
        if (element.classList.contains('service-card')) return 'fadeInUp';
        if (element.classList.contains('hud-panel')) return 'slideInLeft';
        if (element.classList.contains('hero-content')) return 'fadeInLeft';
        if (element.classList.contains('section-header')) return 'fadeInDown';
        return 'fadeIn';
    }

    setupScrollAnimations() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateScrollAnimations() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;

        // Parallax effects
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        // Fade elements based on scroll position
        const fadeElements = document.querySelectorAll('[data-fade-scroll]');
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top;
            const elementHeight = rect.height;
            
            let opacity = 1;
            if (elementTop < 0) {
                opacity = Math.max(0, 1 + (elementTop / elementHeight));
            } else if (elementTop > windowHeight) {
                opacity = 0;
            }
            
            el.style.opacity = opacity;
        });
    }

    setupHoverEffects() {
        // Glow effect on hover
        const glowElements = document.querySelectorAll('.hud-btn, .service-card, .hud-nav-link');
        glowElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (!this.isReducedMotion) {
                    this.addGlowEffect(el);
                }
            });

            el.addEventListener('mouseleave', () => {
                this.removeGlowEffect(el);
            });
        });

        // Lift effect on hover
        const liftElements = document.querySelectorAll('.service-card');
        liftElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (!this.isReducedMotion) {
                    this.triggerAnimation(el, 'lift');
                }
            });

            el.addEventListener('mouseleave', () => {
                this.triggerAnimation(el, 'unlift');
            });
        });
    }

    setupClickEffects() {
        // Ripple effect on click
        document.addEventListener('click', (e) => {
            const element = e.target.closest('.hud-btn, .theme-option');
            if (element && !this.isReducedMotion) {
                this.createRippleEffect(element, e);
            }
        });

        // Shockwave effect on important buttons
        document.addEventListener('click', (e) => {
            const element = e.target.closest('.hud-btn-primary');
            if (element && !this.isReducedMotion) {
                this.createShockwaveEffect(element, e);
            }
        });
    }

    triggerAnimation(element, animation, options = {}) {
        if (this.isReducedMotion) return;

        const animationId = `${animation}-${Date.now()}`;
        const config = {
            duration: options.duration || 600,
            easing: options.easing || 'ease-out',
            delay: options.delay || 0,
            ...options
        };

        switch (animation) {
            case 'fadeIn':
                this.fadeIn(element, config);
                break;
            case 'fadeInUp':
                this.fadeInUp(element, config);
                break;
            case 'fadeInDown':
                this.fadeInDown(element, config);
                break;
            case 'fadeInLeft':
                this.fadeInLeft(element, config);
                break;
            case 'slideInLeft':
                this.slideInLeft(element, config);
                break;
            case 'slideInRight':
                this.slideInRight(element, config);
                break;
            case 'zoomIn':
                this.zoomIn(element, config);
                break;
            case 'lift':
                this.liftElement(element, config);
                break;
            case 'unlift':
                this.unliftElement(element, config);
                break;
            case 'pulse':
                this.pulseElement(element, config);
                break;
            case 'shake':
                this.shakeElement(element, config);
                break;
            case 'glitch':
                this.glitchElement(element, config);
                break;
        }

        this.animations.set(animationId, { element, animation, config });
    }

    fadeIn(element, config) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${config.duration}ms ${config.easing}`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, config.delay);
    }

    fadeInUp(element, config) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all ${config.duration}ms ${config.easing}`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, config.delay);
    }

    fadeInDown(element, config) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-30px)';
        element.style.transition = `all ${config.duration}ms ${config.easing}`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, config.delay);
    }

    fadeInLeft(element, config) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
        element.style.transition = `all ${config.duration}ms ${config.easing}`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, config.delay);
    }

    slideInLeft(element, config) {
        element.style.transform = 'translateX(-100%)';
        element.style.transition = `transform ${config.duration}ms ${config.easing}`;
        
        setTimeout(() => {
            element.style.transform = 'translateX(0)';
        }, config.delay);
    }

    slideInRight(element, config) {
        element.style.transform = 'translateX(100%)';
        element.style.transition = `transform ${config.duration}ms ${config.easing}`;
        
        setTimeout(() => {
            element.style.transform = 'translateX(0)';
        }, config.delay);
    }

    zoomIn(element, config) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = `all ${config.duration}ms ${config.easing}`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, config.delay);
    }

    liftElement(element, config) {
        element.style.transition = `transform ${config.duration}ms ${config.easing}`;
        element.style.transform = 'translateY(-10px) scale(1.02)';
        
        // Add enhanced glow
        element.style.boxShadow = '0 15px 35px rgba(0, 255, 255, 0.4)';
    }

    unliftElement(element, config) {
        element.style.transition = `transform ${config.duration}ms ${config.easing}`;
        element.style.transform = 'translateY(0) scale(1)';
        element.style.boxShadow = '';
    }

    pulseElement(element, config) {
        const keyframes = [
            { transform: 'scale(1)', opacity: '1' },
            { transform: 'scale(1.05)', opacity: '0.8' },
            { transform: 'scale(1)', opacity: '1' }
        ];

        element.animate(keyframes, {
            duration: config.duration,
            easing: config.easing,
            iterations: config.iterations || 1
        });
    }

    shakeElement(element, config) {
        const keyframes = [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(0)' }
        ];

        element.animate(keyframes, {
            duration: config.duration || 500,
            easing: config.easing
        });
    }

    glitchElement(element, config) {
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+{}|:<>?[]\\;\'\".,/~`';
        let glitchCount = 0;
        const maxGlitches = 5;
        
        const glitchInterval = setInterval(() => {
            if (glitchCount >= maxGlitches) {
                element.textContent = originalText;
                clearInterval(glitchInterval);
                return;
            }
            
            let glitchedText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.3) {
                    glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchedText += originalText[i];
                }
            }
            
            element.textContent = glitchedText;
            glitchCount++;
        }, 50);
    }

    addGlowEffect(element) {
        const currentTheme = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#00ffff';
        element.style.transition = 'box-shadow 0.3s ease';
        element.style.boxShadow = `0 0 20px ${currentTheme}`;
    }

    removeGlowEffect(element) {
        element.style.boxShadow = '';
    }

    createRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createShockwaveEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const shockwave = document.createElement('div');
        shockwave.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: 10px;
            height: 10px;
            border: 3px solid var(--primary-color, #00ffff);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: shockwave 0.6s ease-out;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(shockwave);
        
        setTimeout(() => {
            shockwave.remove();
        }, 600);
    }

    createParticleExplosion(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const angle = (i / count) * Math.PI * 2;
            const velocity = 50 + Math.random() * 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: var(--primary-color, #00ffff);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
            `;
            
            document.body.appendChild(particle);
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                { 
                    transform: `translate(${vx}px, ${vy}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).addEventListener('finish', () => {
                particle.remove();
            });
        }
    }

    stopAnimation(element, animation) {
        // Clear transitions and transforms
        element.style.transition = '';
        element.style.transform = '';
        element.style.opacity = '';
        element.style.boxShadow = '';
    }

    disableAnimations() {
        // Add CSS class to disable all animations
        document.body.classList.add('no-animations');
    }

    enableAnimations() {
        document.body.classList.remove('no-animations');
    }

    // Utility function to chain animations
    chainAnimations(element, animations) {
        return animations.reduce((promise, animation) => {
            return promise.then(() => {
                return new Promise(resolve => {
                    this.triggerAnimation(element, animation.type, animation.options);
                    setTimeout(resolve, animation.options?.duration || 600);
                });
            });
        }, Promise.resolve());
    }

    // Stagger animations for multiple elements
    staggerAnimations(elements, animation, staggerDelay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.triggerAnimation(element, animation, { delay: 0 });
            }, index * staggerDelay);
        });
    }
}

// CSS for animation effects
const animationCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes shockwave {
    to {
        transform: translate(-50%, -50%) scale(20);
        opacity: 0;
    }
}

.no-animations * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transition-delay: 0.01ms !important;
}

.glitch-text {
    position: relative;
    color: var(--primary-color, #00ffff);
}

.glitch-text::before,
.glitch-text::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.glitch-text::before {
    animation: glitch-anim-1 0.5s infinite;
    color: #ff0000;
    z-index: -1;
}

.glitch-text::after {
    animation: glitch-anim-2 0.5s infinite;
    color: #0000ff;
    z-index: -2;
}

@keyframes glitch-anim-1 {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
}

@keyframes glitch-anim-2 {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(2px, -2px); }
    40% { transform: translate(2px, 2px); }
    60% { transform: translate(-2px, -2px); }
    80% { transform: translate(-2px, 2px); }
}
`;

// Inject animation CSS
const animationStyleSheet = document.createElement('style');
animationStyleSheet.textContent = animationCSS;
document.head.appendChild(animationStyleSheet);

// Initialize animation system
const animationSystem = new AnimationSystem();

// Global animation functions
function triggerAnimation(element, animation, options) {
    animationSystem.triggerAnimation(element, animation, options);
}

function createShockwave(element, event) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    animationSystem.createShockwaveEffect(element, { clientX: x, clientY: y });
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationSystem;
}