# Copilot Instructions for dashboardX

## Project Overview

dashboardX is a futuristic cyberpunk-themed dashboard application inspired by Watch Dogs/CTOS aesthetic. The project serves as an "Outreach Client Services Portal" with customizable widgets, sci-fi visual effects, animations, and a modular architecture for easy widget development. The application features a dark theme with cyan blue (#00d4ff) accents and includes components like messaging, harm reduction services, case management, and AI safety monitoring.

## Project Structure

```
dashboardX/
├── index.html          # Main application entry point
├── css/
│   ├── main.css        # Core styles and layout
│   ├── themes.css      # Theme definitions
│   └── animations.css  # Animation effects and keyframes
├── js/
│   ├── app.js          # Main application logic and OutreachApp class
│   ├── auth.js         # Authentication system
│   ├── messaging.js    # Messaging/chat functionality  
│   ├── supplies.js     # Supply management system
│   ├── ai-chat.js      # AI chat integration
│   ├── dashboard.js    # Dashboard-specific functionality
│   ├── notifications.js # Notification system
│   └── themes.js       # Theme management
└── README.md           # Project documentation
```

## Development Guidelines

### Application Architecture
The application uses a class-based architecture with the main `OutreachApp` class controlling navigation, theming, and core functionality. Each major feature (messaging, supplies, authentication) is implemented as a separate class module.

### Current Application Features
- **Landing Page**: Hero section with service overview and safety information
- **Authentication**: Login/register forms with cyberpunk styling
- **Dashboard**: Multi-section interface with navigation and theme controls
- **Messaging System**: Secure messaging with conversation management
- **Supply Ordering**: Harm reduction supplies with CTOS-style interface
- **AI Safety Monitor**: Chat interface for safety assistance
- **Theme System**: Multiple themes with dark/light mode support
- **Responsive Design**: Mobile and desktop compatibility

### Widget Development Pattern
- Create widgets as modular components in separate files
- Widgets should support configurable options: colors, sizes, animations, effects, location
- Save widget configurations to localStorage or similar persistence
- Follow the CTOS/cyberpunk aesthetic with blue outlines and futuristic elements

### Styling Conventions
- Use CSS custom properties (variables) defined in themes.css
- Apply the `.cyber-border` class for futuristic outlines
- Use animations from animations.css for consistent effects
- Support multiple widget sizes: small, medium, large
- Include hover effects and transitions for interactivity

### JavaScript Patterns
- Use ES6+ classes for component organization
- Implement proper error handling and validation
- Follow the existing naming conventions (camelCase for methods, PascalCase for classes)
- Use event delegation for dynamic content
- Maintain state in class properties and localStorage

### Visual Effects Standards
- Blue (#00d4ff) primary accent color for outlines and highlights
- Animated elements should use transform and opacity for performance
- Include particle effects, sparks, and circuit-like animations
- Glitch effects for loading states and transitions
- Grid-based layouts with hexagonal elements where appropriate

### Widget Requirements
When creating new widgets:

1. **Clock Widget**
   - Support 3 sizes (small, medium, large)
   - Blue outline similar to CTOS interface
   - Date and time display
   - Configurable position (top-right corner default)

2. **Weather Widgets**
   - Two instances: Cobourg, Ontario and Melfort, SK
   - Size options affect information depth:
     - Small: current temperature and condition icon
     - Medium: 3-day forecast
     - Large: 5-day forecast
   - Use sci-fi styled boxes and labels

3. **General Widget Features**
   - Drag-and-drop positioning
   - Resizable corners with visual feedback
   - Settings panel for customization
   - Export/import configuration
   - Animation controls (spark effects, circuit animations)

### Code Quality
- Use semantic HTML5 elements
- Maintain accessibility with proper ARIA labels
- Write self-documenting code with clear variable names
- Include JSDoc comments for complex functions
- Follow DRY principles and create reusable utilities

### File Organization
- Keep CSS organized by component/feature
- Use consistent indentation (4 spaces)
- Group related functions in classes
- Import/export modules properly when adding new files

### Testing Considerations
- Test widget functionality across different screen sizes
- Verify animations perform well on lower-end devices
- Ensure widgets work with different data sources
- Test configuration persistence across browser sessions

### Performance Guidelines
- Use CSS transforms for animations (hardware acceleration)
- Debounce resize events and user inputs
- Lazy load widgets that aren't immediately visible
- Optimize image assets and use appropriate formats
- Minimize DOM manipulation during animations

## Examples and References

### Color Palette
```css
--primary-color: #00d4ff;     /* Cyan blue for accents */
--secondary-color: #1a1a2e;   /* Dark blue background */
--accent-color: #16213e;      /* Medium blue */
--warning-color: #ffaa00;     /* Orange for alerts */
--success-color: #00ff88;     /* Green for success states */
--text-primary: #ffffff;      /* White text */
--text-secondary: #a0a0a0;    /* Gray text */
```

### Animation Examples
```css
/* Cyber glow effect */
.cyber-glow {
    box-shadow: 0 0 10px var(--primary-color);
    transition: box-shadow 0.3s ease;
}

/* Pulse animation */
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}
```

When implementing features, prioritize the cyberpunk aesthetic, modular design, and user configurability. Always consider how new additions fit within the existing CTOS-inspired theme and maintain consistency with the established patterns.