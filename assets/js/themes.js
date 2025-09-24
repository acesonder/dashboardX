// OutreachX - Theme System
// Dynamic theme switching with advanced effects

class ThemeSystem {
    constructor() {
        this.themes = {
            futuristic: {
                name: 'Futuristic',
                primary: '#00ffff',
                secondary: '#0080ff',
                accent: '#ff6600',
                background: '#0a0a0f',
                text: '#ffffff',
                effects: ['neon-glow', 'circuit-lines', 'holographic']
            },
            steampunk: {
                name: 'Steampunk',
                primary: '#ff8800',
                secondary: '#cc6600',
                accent: '#ffaa00',
                background: '#2a1810',
                text: '#f5e6d3',
                effects: ['brass-glow', 'steam-particles', 'gear-rotation']
            },
            hacker: {
                name: 'Hacker',
                primary: '#00ff00',
                secondary: '#88ff00',
                accent: '#ffff00',
                background: '#001100',
                text: '#00ff00',
                effects: ['matrix-rain', 'terminal-glow', 'data-stream']
            }
        };

        this.currentTheme = localStorage.getItem('outreachx_theme') || 'futuristic';
        this.isDarkMode = localStorage.getItem('outreachx_dark_mode') !== 'false';
        this.effectsEnabled = localStorage.getItem('outreachx_effects') !== 'false';
        
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEffects();
        this.createThemeInterface();
        this.bindEvents();
    }

    bindEvents() {
        // Theme selector events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-option')) {
                const theme = e.target.closest('.theme-option').dataset.theme;
                this.setTheme(theme);
            }

            if (e.target.closest('.mode-toggle')) {
                this.toggleMode();
            }

            if (e.target.closest('.effects-toggle')) {
                this.toggleEffects();
            }
        });

        // Keyboard shortcuts for themes
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch(e.key) {
                    case '1':
                        this.setTheme('futuristic');
                        e.preventDefault();
                        break;
                    case '2':
                        this.setTheme('steampunk');
                        e.preventDefault();
                        break;
                    case '3':
                        this.setTheme('hacker');
                        e.preventDefault();
                        break;
                    case 'm':
                        this.toggleMode();
                        e.preventDefault();
                        break;
                }
            }
        });
    }

    setTheme(themeName) {
        if (!this.themes[themeName]) return;

        this.currentTheme = themeName;
        localStorage.setItem('outreachx_theme', themeName);
        
        this.applyTheme();
        this.triggerThemeChangeEffect();
        
        if (typeof outreachX !== 'undefined') {
            outreachX.showNotification(`Theme changed to ${this.themes[themeName].name}`, 'success');
        }
    }

    toggleMode() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('outreachx_dark_mode', this.isDarkMode);
        
        this.applyTheme();
        
        if (typeof outreachX !== 'undefined') {
            outreachX.showNotification(
                `Switched to ${this.isDarkMode ? 'Dark' : 'Light'} mode`, 
                'success'
            );
        }
    }

    toggleEffects() {
        this.effectsEnabled = !this.effectsEnabled;
        localStorage.setItem('outreachx_effects', this.effectsEnabled);
        
        this.setupEffects();
        
        if (typeof outreachX !== 'undefined') {
            outreachX.showNotification(
                `Effects ${this.effectsEnabled ? 'enabled' : 'disabled'}`, 
                'info'
            );
        }
    }

    applyTheme() {
        const theme = this.themes[this.currentTheme];
        const root = document.documentElement;
        const body = document.body;

        // Remove existing theme classes
        body.className = body.className.replace(/theme-\w+/g, '');
        body.classList.add(`theme-${this.currentTheme}`);
        
        if (!this.isDarkMode) {
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
        }

        // Set CSS custom properties
        root.style.setProperty('--theme-primary', theme.primary);
        root.style.setProperty('--theme-secondary', theme.secondary);
        root.style.setProperty('--theme-accent', theme.accent);
        root.style.setProperty('--theme-background', theme.background);
        root.style.setProperty('--theme-text', theme.text);

        // Apply light mode adjustments
        if (!this.isDarkMode) {
            this.applyLightModeAdjustments(theme);
        }

        // Update theme selector UI
        this.updateThemeSelector();
    }

    applyLightModeAdjustments(theme) {
        const root = document.documentElement;
        
        // Lighten background colors
        const lightBg = this.lightenColor(theme.background, 90);
        const lighterBg = this.lightenColor(theme.background, 95);
        
        root.style.setProperty('--theme-background', lightBg);
        root.style.setProperty('--theme-background-secondary', lighterBg);
        
        // Darken text for readability
        root.style.setProperty('--theme-text', '#1a1a1a');
        root.style.setProperty('--theme-text-secondary', '#4a4a4a');
    }

    lightenColor(color, percent) {
        // Convert hex to RGB, lighten, and convert back
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const lightenAmount = percent / 100;
        const newR = Math.round(r + (255 - r) * lightenAmount);
        const newG = Math.round(g + (255 - g) * lightenAmount);
        const newB = Math.round(b + (255 - b) * lightenAmount);
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }

    setupEffects() {
        // Clear existing effects
        this.clearEffects();
        
        if (!this.effectsEnabled) return;

        const theme = this.themes[this.currentTheme];
        
        // Apply theme-specific effects
        theme.effects.forEach(effect => {
            switch(effect) {
                case 'neon-glow':
                    this.addNeonGlowEffect();
                    break;
                case 'circuit-lines':
                    this.addCircuitLinesEffect();
                    break;
                case 'holographic':
                    this.addHolographicEffect();
                    break;
                case 'brass-glow':
                    this.addBrassGlowEffect();
                    break;
                case 'steam-particles':
                    this.addSteamParticlesEffect();
                    break;
                case 'gear-rotation':
                    this.addGearRotationEffect();
                    break;
                case 'matrix-rain':
                    this.addMatrixRainEffect();
                    break;
                case 'terminal-glow':
                    this.addTerminalGlowEffect();
                    break;
                case 'data-stream':
                    this.addDataStreamEffect();
                    break;
            }
        });
    }

    clearEffects() {
        // Remove existing effect elements
        const effectElements = document.querySelectorAll('.theme-effect');
        effectElements.forEach(el => el.remove());
        
        // Remove effect classes
        document.querySelectorAll('.has-effect').forEach(el => {
            el.classList.remove('has-effect');
        });
    }

    addNeonGlowEffect() {
        const panels = document.querySelectorAll('.hud-panel');
        panels.forEach(panel => {
            panel.classList.add('neon-glow-effect');
        });
    }

    addCircuitLinesEffect() {
        const container = document.createElement('div');
        container.className = 'theme-effect circuit-lines-container';
        container.innerHTML = `
            <svg class="circuit-lines" viewBox="0 0 1920 1080">
                <path class="circuit-path" d="M0,200 L400,200 L400,400 L800,400 L800,600 L1200,600" 
                      stroke="var(--theme-primary)" stroke-width="2" fill="none" opacity="0.3"/>
                <path class="circuit-path" d="M1920,300 L1500,300 L1500,500 L1100,500 L1100,700 L700,700" 
                      stroke="var(--theme-secondary)" stroke-width="2" fill="none" opacity="0.3"/>
                <circle class="circuit-node" cx="400" cy="200" r="4" fill="var(--theme-primary)"/>
                <circle class="circuit-node" cx="800" cy="400" r="4" fill="var(--theme-primary)"/>
                <circle class="circuit-node" cx="1200" cy="600" r="4" fill="var(--theme-primary)"/>
            </svg>
        `;
        
        document.body.appendChild(container);
        
        // Animate circuit paths
        const paths = container.querySelectorAll('.circuit-path');
        paths.forEach((path, index) => {
            path.style.animation = `circuitFlow ${3 + index}s infinite linear`;
        });
    }

    addHolographicEffect() {
        const panels = document.querySelectorAll('.hud-panel');
        panels.forEach(panel => {
            const hologram = document.createElement('div');
            hologram.className = 'theme-effect holographic-overlay';
            panel.style.position = 'relative';
            panel.appendChild(hologram);
        });
    }

    addBrassGlowEffect() {
        // Add warm glow to steampunk elements
        const style = document.createElement('style');
        style.className = 'theme-effect';
        style.textContent = `
            .theme-steampunk .hud-panel {
                box-shadow: 0 0 20px rgba(255, 136, 0, 0.3);
            }
            .theme-steampunk .hud-btn {
                box-shadow: inset 0 0 10px rgba(255, 170, 0, 0.2);
            }
        `;
        document.head.appendChild(style);
    }

    addSteamParticlesEffect() {
        const container = document.createElement('div');
        container.className = 'theme-effect steam-particles-container';
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'steam-particle';
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: rgba(255, 136, 0, 0.6);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                bottom: -10px;
                animation: steamRise ${5 + Math.random() * 3}s infinite linear;
                animation-delay: ${Math.random() * 2}s;
                z-index: -1;
            `;
            container.appendChild(particle);
        }
        
        document.body.appendChild(container);
    }

    addGearRotationEffect() {
        const gears = document.querySelectorAll('.service-icon');
        gears.forEach(gear => {
            gear.style.animation = 'gearSpin 10s infinite linear';
        });
    }

    addMatrixRainEffect() {
        const container = document.createElement('div');
        container.className = 'theme-effect matrix-rain-container';
        
        const chars = '01アカサタナハマヤラワ';
        
        for (let i = 0; i < 50; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                top: -100vh;
                color: var(--theme-primary);
                font-family: 'Courier New', monospace;
                font-size: 14px;
                opacity: 0.7;
                animation: matrixDrop ${2 + Math.random() * 3}s infinite linear;
                animation-delay: ${Math.random() * 2}s;
                z-index: -1;
            `;
            
            // Add random characters
            for (let j = 0; j < 20; j++) {
                const char = document.createElement('div');
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
                char.style.opacity = Math.random();
                column.appendChild(char);
            }
            
            container.appendChild(column);
        }
        
        document.body.appendChild(container);
    }

    addTerminalGlowEffect() {
        const panels = document.querySelectorAll('.hud-panel');
        panels.forEach(panel => {
            panel.style.textShadow = '0 0 5px var(--theme-primary)';
        });
    }

    addDataStreamEffect() {
        const container = document.createElement('div');
        container.className = 'theme-effect data-stream-container';
        
        const dataStrings = [
            '10110100101', '11100010011', '01010101110',
            '11001100110', '00110011001', '10101010101'
        ];
        
        dataStrings.forEach((data, index) => {
            const stream = document.createElement('div');
            stream.className = 'data-stream';
            stream.textContent = data;
            stream.style.cssText = `
                position: fixed;
                top: ${Math.random() * 80}%;
                right: -200px;
                color: var(--theme-primary);
                font-family: 'Courier New', monospace;
                font-size: 12px;
                opacity: 0.5;
                animation: dataFlow ${4 + Math.random() * 2}s infinite linear;
                animation-delay: ${index * 0.5}s;
                z-index: -1;
            `;
            container.appendChild(stream);
        });
        
        document.body.appendChild(container);
    }

    createThemeInterface() {
        const existingSelector = document.querySelector('.advanced-theme-selector');
        if (existingSelector) return;

        const selector = document.createElement('div');
        selector.className = 'advanced-theme-selector';
        selector.innerHTML = `
            <div class="theme-controls">
                <div class="theme-grid">
                    ${Object.entries(this.themes).map(([key, theme]) => `
                        <div class="theme-option" data-theme="${key}">
                            <div class="theme-preview" style="background: ${theme.primary}"></div>
                            <span class="theme-name">${theme.name}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="theme-toggles">
                    <button class="mode-toggle hud-btn hud-btn-secondary">
                        <i class="fas fa-${this.isDarkMode ? 'sun' : 'moon'}"></i>
                        ${this.isDarkMode ? 'Light' : 'Dark'} Mode
                    </button>
                    <button class="effects-toggle hud-btn hud-btn-secondary">
                        <i class="fas fa-magic"></i>
                        Effects ${this.effectsEnabled ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>
        `;

        // Add to existing theme selector or create new one
        const existingThemeSelector = document.querySelector('.theme-options');
        if (existingThemeSelector) {
            existingThemeSelector.appendChild(selector);
        }
    }

    updateThemeSelector() {
        const options = document.querySelectorAll('.theme-option');
        options.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === this.currentTheme);
        });

        const modeToggle = document.querySelector('.mode-toggle');
        if (modeToggle) {
            modeToggle.innerHTML = `
                <i class="fas fa-${this.isDarkMode ? 'sun' : 'moon'}"></i>
                ${this.isDarkMode ? 'Light' : 'Dark'} Mode
            `;
        }

        const effectsToggle = document.querySelector('.effects-toggle');
        if (effectsToggle) {
            effectsToggle.innerHTML = `
                <i class="fas fa-magic"></i>
                Effects ${this.effectsEnabled ? 'ON' : 'OFF'}
            `;
        }
    }

    triggerThemeChangeEffect() {
        // Create a fullscreen flash effect
        const flash = document.createElement('div');
        flash.className = 'theme-change-flash';
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--theme-primary);
            opacity: 0;
            z-index: 9999;
            pointer-events: none;
            animation: themeChangeFlash 0.3s ease-out;
        `;
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, 300);
    }

    exportThemeSettings() {
        return {
            theme: this.currentTheme,
            darkMode: this.isDarkMode,
            effects: this.effectsEnabled,
            timestamp: new Date().toISOString()
        };
    }

    importThemeSettings(settings) {
        if (settings.theme && this.themes[settings.theme]) {
            this.currentTheme = settings.theme;
        }
        if (typeof settings.darkMode === 'boolean') {
            this.isDarkMode = settings.darkMode;
        }
        if (typeof settings.effects === 'boolean') {
            this.effectsEnabled = settings.effects;
        }
        
        this.applyTheme();
        this.setupEffects();
        
        if (typeof outreachX !== 'undefined') {
            outreachX.showNotification('Theme settings imported', 'success');
        }
    }
}

// Additional theme-related animations
const themeAnimations = `
@keyframes circuitFlow {
    0% { stroke-dasharray: 0, 100; }
    100% { stroke-dasharray: 100, 0; }
}

@keyframes steamRise {
    0% { transform: translateY(0) scale(1); opacity: 0.6; }
    50% { opacity: 0.8; }
    100% { transform: translateY(-100vh) scale(0); opacity: 0; }
}

@keyframes gearSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes matrixDrop {
    0% { transform: translateY(-100vh); }
    100% { transform: translateY(100vh); }
}

@keyframes dataFlow {
    0% { transform: translateX(100vw); }
    100% { transform: translateX(-200px); }
}

@keyframes themeChangeFlash {
    0% { opacity: 0; }
    50% { opacity: 0.3; }
    100% { opacity: 0; }
}

.holographic-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%);
    animation: holographicScan 3s infinite;
    pointer-events: none;
}

@keyframes holographicScan {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}
`;

// Inject theme animations
const styleSheet = document.createElement('style');
styleSheet.textContent = themeAnimations;
document.head.appendChild(styleSheet);

// Initialize theme system
const themeSystem = new ThemeSystem();

// Global theme functions
function setTheme(theme) {
    themeSystem.setTheme(theme);
}

function toggleThemeMode() {
    themeSystem.toggleMode();
}

function toggleThemeEffects() {
    themeSystem.toggleEffects();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSystem;
}