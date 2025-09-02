# Alkemy GSlide Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Eliminate tedious, error-prone manual Google Slides API JSON coding
- Enable rapid prototyping and iteration of Google Slides layouts
- Provide real-time visual preview of batchUpdate configurations 
- Make slide automation accessible to non-technical creators (PMs, designers)
- Reduce development time for Google Slides automation projects
- Improve accuracy by reducing batchUpdate API errors due to malformed JSON

### Background Context

Currently, creating or customizing Google Slides via API (batchUpdate requests) requires advanced familiarity with JSON syntax, object structure, and the Slides API. This manual process is time-consuming, error-prone, and creates a steep learning curve that excludes non-technical team members from contributing to slide automation projects.

The market lacks a visual builder tool that bridges this gap between technical API requirements and user-friendly creation workflows. Alkemy GSlide addresses this critical need by providing an intuitive interface for composing, previewing, and exporting structured batchUpdate objects, making slide automation fast and accessible to both developers and business stakeholders.

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-09-02 | v1.0 | Initial PRD Creation | John (PM Agent) |

## Requirements

### Functional Requirements

**FR1:** The application shall provide a split-screen UI with left panel for interactive form/fields and right panel for real-time visual preview

**FR2:** The left panel shall support adding and editing slide elements including rectangles, text boxes, images, and all key Google Slides elements

**FR3:** The left panel shall provide style controls for color, border, font, bold, italics, alignment, size, and positioning

**FR4:** The right panel shall display real-time visual preview simulating Google Slides output as users make changes

**FR5:** The application shall export composed configurations as valid batchUpdate JSON ready for Google Slides API

**FR6:** The application shall export configurations as Markdown (.md) files with user-chosen filename via save dialog

**FR7:** The application shall import existing batchUpdate JSON files for visual editing and modification  

**FR8:** The application shall process all user data client-side without requiring sign-in or account creation

**FR9:** The application shall support responsive design for desktop usage

### Non-Functional Requirements

**NFR1:** The visual preview shall closely match final Google Slides output for accuracy validation

**NFR2:** The application shall provide intuitive, minimal, modern UI using Next.js with Tailwind CSS for rapid iteration

**NFR3:** Export and import features shall work seamlessly without data loss or corruption

**NFR4:** The application shall be accessible to non-developers without prior Google Slides API knowledge

**NFR5:** No vendor lock-in - the application shall not require external service dependencies for core functionality

---

*Document in progress - additional sections to be completed during interactive review process*