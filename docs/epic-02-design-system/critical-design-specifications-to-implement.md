# Critical Design Specifications to Implement

## Color Palette (Exact Implementation Required)
```css
--bg-primary: #0a0a0f;        /* Deep space black */
--bg-secondary: #1a1a2e;      /* Darker navy panels */
--bg-tertiary: #16213e;       /* Midnight blue cards */
--primary-neon: #a855f7;      /* Purple primary */
--secondary-neon: #8b5cf6;    /* Violet secondary */
--accent-electric: #06ffa5;   /* Electric green success */
--accent-pink: #ec4899;       /* Hot pink warnings */
--accent-cyan: #22d3ee;       /* Cyan information */
--text-primary: #f8fafc;      /* Almost white */
--text-secondary: #cbd5e1;    /* Light slate */
--text-muted: #64748b;        /* Slate */
--border-glow: #6366f1;       /* Indigo glowing borders */
--success: #10b981;           /* Emerald validation success */
--warning: #f59e0b;           /* Amber notices */
--error: #ef4444;             /* Red errors */
```

## Typography System (Exact Implementation Required)
- **Primary**: Inter (UI elements)
- **Secondary**: JetBrains Mono (code/JSON)  
- **Display**: Outfit (headers)
- **Type Scale**: H1(40px/800), H2(32px/700), H3(24px/600), Body(14px/400), Small(12px/400), Code(13px/400)

## Animation Specifications (Exact Implementation Required)
- **Glow Pulse**: 2s ease-in-out breathing effect
- **Panel Slide**: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- **Validation Flash**: 150ms ease-out color transitions
- **Hover Elevation**: 200ms ease-out lift with glow
- **Neon Border Draw**: 400ms ease-in-out animated borders
- **JSON Syntax Highlight**: 100ms linear color transitions
- **Split Panel Resize**: Continuous glow during drag
- **Element Preview Materialize**: 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275)

## Component Requirements (Exact Implementation Required)
- **Primary Button**: Linear gradient, glow shadow, transform on hover
- **Glass Panel**: Backdrop blur(10px), rgba borders, border-radius 12px
- **Neon Input**: Focus glow, error states, monospace variants
- **Split Screen Divider**: Interactive glow, drag feedback
- **Validation Badge**: Status colors, pulsing states
- **JSON Editor**: Monaco editor, custom dark theme, neon syntax
- **Preview Canvas**: Light background, neon selection overlays

## Performance Requirements (Exact Implementation Required)
- **Page Load**: < 2 seconds first meaningful paint
- **Interaction Response**: < 100ms for all user interactions
- **Animation FPS**: Consistent 60fps for all animations
- **Bundle Size**: < 500KB gzipped main bundle

## Accessibility Requirements (Exact Implementation Required)
- **Color Contrast**: 7:1 ratios for text on dark backgrounds
- **Focus Indicators**: 3px minimum thickness neon outlines
- **Touch Targets**: 44px minimum for all interactive elements
- **Screen Readers**: Comprehensive ARIA labels and live regions
