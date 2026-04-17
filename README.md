# HNG Stage 1a - Advanced Todo Card

This repository contains the Stage 1a submission for the HNG Frontend Wizard track. It builds upon the static Stage 0 Todo Card, transforming it into an interactive, stateful, and fully responsive component using Vanilla JavaScript and CSS.

## Live Demo
[Insert Your Live Hosted URL Here]

---

## What Changed from Stage 0
The static card has been upgraded with four distinct JavaScript "engines":
1. **Edit Engine:** Added an inline edit form that toggles seamlessly with the display view (CRUD update logic).
2. **Collapse Engine:** Implemented a "Show More/Less" toggle for long descriptions using CSS line-clamping.
3. **Status Engine:** Synchronized the "Done" checkbox with a new status dropdown, instantly applying visual strike-throughs and muted styling.
4. **Time Engine:** Built a dynamic clock using `setInterval` that calculates the exact time remaining, updates every 60 seconds, and triggers an "Overdue" badge if the deadline passes.

## New Design Decisions
* **The "Flip-Flop" Form:** Instead of opening a modal, the Edit Form swaps places with the display content, keeping the user contextually grounded.
* **CSS Line Clamping:** Used `-webkit-line-clamp` to handle long descriptions natively in CSS, preventing layout breaks while ensuring a smooth transition.
* **Dynamic Visual Indicators:** Priority states are now handled visually with conditional emojis (🔴, 🟡, 🟢), and Overdue states trigger bold, red text alerts for immediate user recognition.
* **Mobile-First Responsiveness:** The edit form inputs span 100% width on mobile for easy tapping, while adjusting neatly on desktop breakpoints. Touch targets were optimized to `min-height: 44px` for coarse pointers.

## Known Limitations
* **Static Tags:** Currently, the tags ("Work", "Urgent") are static display elements and cannot be edited via the inline form (as per Stage 1a requirements).
* **Volatile State:** Because this component does not yet implement `localStorage` or a backend API, refreshing the page resets the card to its default HTML state. Deleted cards require a page refresh to restore.
* **Status Reversion:** Unchecking the "Done" checkbox automatically reverts the status to "Pending".

## Accessibility Notes (a11y)
Accessibility was a primary focus in this stage:
* **Focus Management:** When the Edit form is closed (via Save or Cancel), JavaScript actively returns focus (`.focus()`) to the Edit button to maintain logical keyboard flow.
* **ARIA Live Regions:** The time remaining element uses `aria-live="polite"` so screen readers can announce when the ticking clock updates without interrupting the user.
* **Expand/Collapse Context:** The "Show More" toggle strictly utilizes `aria-expanded` and `aria-controls` mapped to the description wrapper's ID.
* **Form Labels:** Every input and select dropdown in the Edit form is explicitly tied to a `<label>` via `id` and `for` attributes.
