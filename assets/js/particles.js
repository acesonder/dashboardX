// OutreachX - Particle System
// Advanced particle effects for cyberpunk atmosphere

class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.particles = [];
        this.options = {
            count: options.count || 50,
            speed: options.speed || 1,
            size: options.size || 2,
            color: options.color || '#00ffff',
            opacity: options.opacity || 0.7,
            connections: options.connections || false,
            mouse: options.mouse || false,
            ...options
        };
        
        this.mouse = { x: 0, y: 0 };
        this.animationFrame = null;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.resize();
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.count; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height, this.options));
        }
    }

    bindEvents() {
        if (this.options.mouse) {
            this.container.addEventListener('mousemove', (e) => {
                const rect = this.container.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
        }

        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            particle.update(this.canvas.width, this.canvas.height, this.mouse);
            particle.draw(this.ctx);
            
            // Remove dead particles
            if (particle.isDead()) {
                this.particles[index] = new Particle(this.canvas.width, this.canvas.height, this.options);
            }
        });
        
        // Draw connections
        if (this.options.connections) {
            this.drawConnections();
        }
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        const maxDistance = 100;
        this.ctx.strokeStyle = this.options.color;
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (maxDistance - distance) / maxDistance;
                    this.ctx.globalAlpha = opacity * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            }
        }
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    }

    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.createParticles();
    }
}

class Particle {
    constructor(width, height, options) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * options.speed;
        this.vy = (Math.random() - 0.5) * options.speed;
        this.size = Math.random() * options.size + 1;
        this.maxSize = this.size;
        this.color = options.color;
        this.opacity = Math.random() * options.opacity + 0.3;
        this.life = 1;
        this.decay = Math.random() * 0.005 + 0.001;
        
        // Special effects
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.originalX = this.x;
        this.originalY = this.y;
    }

    update(width, height, mouse) {
        // Basic movement
        this.x += this.vx;
        this.y += this.vy;
        
        // Mouse interaction
        if (mouse && mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.vx += (dx / distance) * force * 0.1;
                this.vy += (dy / distance) * force * 0.1;
            }
        }
        
        // Boundary collision
        if (this.x <= 0 || this.x >= width) {
            this.vx *= -0.8;
            this.x = Math.max(0, Math.min(width, this.x));
        }
        if (this.y <= 0 || this.y >= height) {
            this.vy *= -0.8;
            this.y = Math.max(0, Math.min(height, this.y));
        }
        
        // Pulse effect
        this.pulsePhase += 0.05;
        this.size = this.maxSize + Math.sin(this.pulsePhase) * 0.5;
        
        // Life decay
        this.life -= this.decay;
        this.opacity = this.life * 0.7;
        
        // Velocity damping
        this.vx *= 0.99;
        this.vy *= 0.99;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        // Draw particle with glow effect
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 2
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw core
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

// Specialized particle effects
class CircuitParticleSystem extends ParticleSystem {
    constructor(container, options = {}) {
        super(container, {
            count: 30,
            speed: 0.5,
            size: 1,
            color: '#00ffff',
            connections: true,
            ...options
        });
    }

    drawConnections() {
        super.drawConnections();
        
        // Add circuit-like paths
        this.ctx.strokeStyle = this.options.color;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.3;
        
        // Draw grid lines
        const gridSize = 50;
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }
}

class MatrixParticleSystem extends ParticleSystem {
    constructor(container, options = {}) {
        super(container, {
            count: 20,
            speed: 2,
            size: 12,
            color: '#00ff00',
            ...options
        });
        
        this.characters = '01アカサタナハマヤラワ'.split('');
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.count; i++) {
            this.particles.push(new MatrixParticle(this.canvas.width, this.canvas.height, this.options, this.characters));
        }
    }
}

class MatrixParticle extends Particle {
    constructor(width, height, options, characters) {
        super(width, height, options);
        this.characters = characters;
        this.currentChar = this.getRandomCharacter();
        this.charChangeRate = 0.1;
        this.trail = [];
        this.maxTrailLength = 10;
    }

    getRandomCharacter() {
        return this.characters[Math.floor(Math.random() * this.characters.length)];
    }

    update(width, height, mouse) {
        super.update(width, height, mouse);
        
        // Change character randomly
        if (Math.random() < this.charChangeRate) {
            this.currentChar = this.getRandomCharacter();
        }
        
        // Update trail
        this.trail.push({ x: this.x, y: this.y, opacity: this.opacity });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Draw trail
        this.trail.forEach((point, index) => {
            const trailOpacity = (index / this.trail.length) * point.opacity * 0.5;
            ctx.globalAlpha = trailOpacity;
            ctx.fillStyle = this.color;
            ctx.font = `${this.size}px monospace`;
            ctx.fillText(this.currentChar, point.x, point.y);
        });
        
        // Draw main character
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px monospace`;
        ctx.fillText(this.currentChar, this.x, this.y);
        
        ctx.restore();
    }
}

// Initialize particle systems based on theme
function initParticleSystem() {
    const particleContainer = document.getElementById('particles');
    if (!particleContainer) return;

    const currentTheme = document.body.className.match(/theme-(\w+)/);
    if (!currentTheme) return;

    const theme = currentTheme[1];
    let particleSystem;

    switch (theme) {
        case 'futuristic':
            particleSystem = new CircuitParticleSystem(particleContainer, {
                color: '#00ffff',
                count: 40,
                mouse: true
            });
            break;
        case 'hacker':
            particleSystem = new MatrixParticleSystem(particleContainer, {
                color: '#00ff00',
                count: 25
            });
            break;
        case 'steampunk':
            particleSystem = new ParticleSystem(particleContainer, {
                color: '#ff8800',
                count: 30,
                speed: 0.3,
                size: 3
            });
            break;
        default:
            particleSystem = new ParticleSystem(particleContainer);
    }

    // Store reference for cleanup
    if (window.currentParticleSystem) {
        window.currentParticleSystem.destroy();
    }
    window.currentParticleSystem = particleSystem;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticleSystem);
} else {
    initParticleSystem();
}

// Re-initialize on theme change
document.addEventListener('themeChanged', initParticleSystem);

// Export classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleSystem, CircuitParticleSystem, MatrixParticleSystem };
}