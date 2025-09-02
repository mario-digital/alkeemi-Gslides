# Component Library / Design System

## Design System Approach

Custom design system built on shadcn/ui foundation with dark mode neon aesthetic. Components feature glass-morphism effects, glowing borders, and smooth animations for a premium technical interface.

## Core Components

### Primary Button
**Purpose:** Main actions like Export, Save, Create Element

**Variants:** Primary (neon purple), Secondary (violet), Danger (red), Success (green)

**States:** Default, Hover (glow effect), Active, Disabled, Loading

**Usage Guidelines:** 
```css
background: linear-gradient(135deg, #a855f7, #8b5cf6);
border: 1px solid #a855f7;
box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
transition: all 0.3s ease;

&:hover {
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
  transform: translateY(-2px);
}
```

### Glass Panel
**Purpose:** Container for editor panels, property panels, dialogs

**Variants:** Primary, Secondary, Floating

**States:** Default, Focus, Error

**Usage Guidelines:**
```css
background: rgba(26, 26, 46, 0.8);
border: 1px solid rgba(168, 85, 247, 0.2);
backdrop-filter: blur(10px);
border-radius: 12px;
```

### Neon Input
**Purpose:** Text inputs, JSON editor, property fields

**Variants:** Default, Code (monospace), Number, Search

**States:** Default, Focus (neon glow), Error, Disabled

**Usage Guidelines:**
```css
background: rgba(16, 33, 62, 0.6);
border: 1px solid rgba(99, 102, 241, 0.3);
color: #f8fafc;

&:focus {
  border-color: #a855f7;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
}
```

### Split Screen Divider
**Purpose:** Resizable divider between editor and preview panels

**Variants:** Vertical (main), Horizontal (secondary)

**States:** Default, Dragging (enhanced glow), Hover

**Usage Guidelines:** Animated neon purple line with interactive glow effects

### Validation Badge
**Purpose:** Show real-time validation status

**Variants:** Success (green), Warning (amber), Error (red), Info (cyan)

**States:** Static, Pulsing (for active validation), Dismissed

**Usage Guidelines:** Floating badges with glow effects matching validation state

### JSON Editor
**Purpose:** Syntax-highlighted JSON editing with dark theme

**Variants:** Full editor, Inline editor, Read-only viewer

**States:** Default, Focus, Error highlighting, Success highlighting

**Usage Guidelines:** Monaco Editor with custom dark theme and neon syntax highlighting

### Preview Canvas
**Purpose:** Visual representation of Google Slides elements

**Variants:** Full canvas, Thumbnail, Selection overlay

**States:** Default, Element selected (neon outline), Validation error overlay

**Usage Guidelines:** Clean light background to simulate Google Slides with neon selection indicators
