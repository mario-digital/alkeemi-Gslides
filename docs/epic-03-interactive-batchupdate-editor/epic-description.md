# Epic Description

## Existing System Context

**Current relevant functionality:**
- Base split-screen layout implemented with dark theme
- JSON editor and preview panels in place
- Import/export shell structure exists
- Visual element builder from Epic 1 complete
- Preview system from Epic 2 operational

**Technology stack:**
- Next.js 14 with TypeScript
- React 18 with Server Components
- Tailwind CSS with custom neon design tokens
- shadcn/ui components with glass-morphic modifications
- Monaco Editor for JSON editing
- Zod for validation

**Integration points:**
- Existing preview canvas system
- Current import/export infrastructure
- Established validation framework
- Design system components from Epics 1 & 2

## Enhancement Details

**What's being added/changed:**

1. **Interactive Operations List (Left Panel)**
   - Glass-morphic operation cards with neon borders
   - Drag-and-drop reordering with trail effects
   - Color-coded by operation type (create=green, update=cyan, delete=pink)
   - Real-time validation with error pulse animations

2. **Operation Editor Modal**
   - Full-screen glass overlay with backdrop blur
   - Dynamic forms per operation type
   - Coordinate picker with visual grid overlay
   - Auto-complete with glass dropdown panels

3. **Enhanced Preview Integration**
   - Bi-directional selection with cyan glow connections
   - Element highlighting with neon outlines
   - Real-time sync between editor and preview
   - Connection animations between panels

4. **Import/Export Polish**
   - Drag-and-drop zone with neon glow and animated border effects for importing/exporting files
   - Progress feedback during import/export with particle effects and smooth transitions
   - Format toggle allowing users to switch between JSON and Markdown export, with a sliding neon indicator for the active format
   - Success/error states with visual feedback, including animated checkmarks for success and pulse/shake for errors
   
   **On Import:**
   - Dropping or selecting a file immediately attempts to load and parse the batchUpdate structure
   - **If the import is valid:**
     - Operations list (left panel) auto-populates with the imported operations
     - Visual preview (right panel) updates in real time to reflect imported state
     - All fields in operation cards/forms update to match imported data
     - A "success" animation plays, and import is complete
   - **If the import is invalid:**
     - No data is applied or overwritten
     - All errors are shown inline per operation and globally
     - A "failure" animation and error state is displayed in the UI
     - Users are prompted to fix the file and try again—export remains blocked until fixed
   
   **On Export:**
   - Export actions always serialize the current batchUpdate state (from the left panel) to either:
     - JSON (standard batchUpdate API array)
     - Markdown (using the documented export format: header, description, and fenced JSON code block)
   - Export is only allowed when all operations are valid; otherwise, the export button is disabled with visible error state
   - Export success triggers a glowing animation and saves the file using the user-specified filename and format
   - File Import/Export never overwrites user settings or unrelated state

5. **Validation System UI**
   - Inline error highlighting with red pulse
   - Global status bar with glass effect
   - Success particles on validation pass
   - Error shake animations

**How it integrates:**
- Builds on existing preview canvas from Epic 2
- Extends current import/export structure
- Leverages established design system tokens
- Uses existing validation framework with enhanced UI

**Success criteria:**
- All interactions respond within 100ms
- 60 FPS maintained for all animations
- Full WCAG 2.1 AA compliance in dark mode
- Operation creation completed in < 30 seconds
- Zero visual glitches or layout shifts
