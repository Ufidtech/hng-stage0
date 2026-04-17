// ==========================================
// 1. DOM ELEMENTS
// ==========================================

// Containers
const displayContainer = document.querySelector(".todo-card-display");
const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');

// Buttons
const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
const cancelBtn = document.querySelector(
  '[data-testid="test-todo-cancel-button"]',
);

// Display Elements (Where the text currently lives)
const titleDisplay = document.querySelector('[data-testid="test-todo-title"]');
const descDisplay = document.querySelector(
  '[data-testid="test-todo-description"]',
);
const priorityDisplay = document.querySelector(
  '[data-testid="test-todo-priority"]',
);
const priorityDot = document.querySelector(
  '[data-testid="test-todo-priority-indicator"]',
);
const dateDisplay = document.querySelector(
  '[data-testid="test-todo-due-date"]',
);

// Input Elements (Where the user types)
const titleInput = document.querySelector(
  '[data-testid="test-todo-edit-title-input"]',
);
const descInput = document.querySelector(
  '[data-testid="test-todo-edit-description-input"]',
);
const priorityInput = document.querySelector(
  '[data-testid="test-todo-edit-priority-select"]',
);
const dateInput = document.querySelector(
  '[data-testid="test-todo-edit-due-date-input"]',
);

// Collapse Elements
const expandToggleBtn = document.querySelector(
  '[data-testid="test-todo-expand-toggle"]',
);
const collapsibleSection = document.querySelector(
  '[data-testid="test-todo-collapsible-section"]',
);

// Status Elements
const statusCheckbox = document.querySelector(
  '[data-testid="test-todo-complete-toggle"]',
);
const statusLabel = document.querySelector('[data-testid="test-todo-status"]');
const statusSelect = document.querySelector(
  '[data-testid="test-todo-status-control"]',
);
const mainCard = document.querySelector('[data-testid="test-todo-card"]'); // Needed to trigger the CSS strike-through
const deleteBtn = document.querySelector(
  '[data-testid="test-todo-delete-button"]',
);

// ==========================================
// 2. THE EDIT ENGINE ("The Flip-Flop")
// ==========================================

// --- When EDIT is clicked ---
editBtn.addEventListener("click", function () {
  // 1. Pre-fill the inputs with the current text from the card
  titleInput.value = titleDisplay.textContent.trim();
  descInput.value = descDisplay.textContent.trim();

  // To get the exact date format the input needs (YYYY-MM-DD), we read the datetime attribute
  // We split at 'T' just in case the datetime is formatted as "2026-04-20T12:00:00"
  dateInput.value = dateDisplay.getAttribute("datetime").split("T")[0];

  // The priority text says "Priority: High", so we strip out "Priority: " to match the select dropdown
  const currentPriority = priorityDisplay.textContent
    .replace("Priority: ", "")
    .trim();
  priorityInput.value = currentPriority;

  // 2. Flip-Flop: Hide display, show form
  displayContainer.style.display = "none";
  editForm.style.display = "flex";

  // 3. Accessibility bonus: shift focus to the title input
  titleInput.focus();
});

// --- When CANCEL is clicked ---
cancelBtn.addEventListener("click", function () {
  // Flip-Flop back without saving anything
  editForm.style.display = "none";
  displayContainer.style.display = "flex";

  // Accessibility bonus: return focus to the edit button
  editBtn.focus();
});

// --- When SAVE is clicked ---
saveBtn.addEventListener("click", function () {
  // 1. Take what the user typed and push it back to the display elements
  titleDisplay.textContent = titleInput.value;
  descDisplay.textContent = descInput.value;
  priorityDisplay.textContent = `Priority: ${priorityInput.value}`;

  // Update the date attribute AND the display text
  const selectedDate = dateInput.value; // format: YYYY-MM-DD
  dateDisplay.setAttribute("datetime", `${selectedDate}T12:00:00`);

  // Convert "2026-12-31" to something nicer like "Due Dec 31, 2026"
  const dateObj = new Date(selectedDate);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  dateDisplay.textContent = `Due ${formattedDate}`;

  // Update the visual priority dot based on selection
  if (priorityInput.value === "High") {
    priorityDot.textContent = "🔴";
  } else if (priorityInput.value === "Medium") {
    priorityDot.textContent = "🟡";
  } else {
    priorityDot.textContent = "🟢";
  }

  // 2. Flip-Flop back
  editForm.style.display = "none";
  displayContainer.style.display = "flex";

  // Accessibility bonus: return focus to the edit button
  editBtn.focus();
});

// ==========================================
// 3. THE COLLAPSE ENGINE
// ==========================================
expandToggleBtn.addEventListener("click", function () {
  // Toggle the CSS class
  collapsibleSection.classList.toggle("collapsed-text");

  // Check the state and update text + accessibility
  const isCollapsed = collapsibleSection.classList.contains("collapsed-text");

  if (isCollapsed) {
    expandToggleBtn.textContent = "Show More";
    expandToggleBtn.setAttribute("aria-expanded", "false");
  } else {
    expandToggleBtn.textContent = "Show Less";
    expandToggleBtn.setAttribute("aria-expanded", "true");
  }
});

// ==========================================
// 4. THE STATUS ENGINE
// ==========================================
statusCheckbox.addEventListener("change", function () {
  if (statusCheckbox.checked) {
    // Checkbox is checked: Mark as Done
    statusLabel.textContent = "Done";
    statusSelect.value = "Done"; // Syncs the dropdown inside the edit form
    mainCard.classList.add("is-completed"); // Triggers your CSS strike-through
  } else {
    // Checkbox is unchecked: Revert to Pending
    statusLabel.textContent = "Pending";
    statusSelect.value = "Pending";
    mainCard.classList.remove("is-completed");
  }
});

// --- ADD THIS TO YOUR EXISTING SAVE BUTTON LOGIC ---
// Sync the checkbox and UI with whatever status was selected in the dropdown
statusLabel.textContent = statusSelect.value;

if (statusSelect.value === "Done") {
  statusCheckbox.checked = true;
  mainCard.classList.add("is-completed");
} else {
  statusCheckbox.checked = false;
  mainCard.classList.remove("is-completed");
}

// ==========================================
// 5. THE DELETE ENGINE
// ==========================================
deleteBtn.addEventListener("click", function () {
  // Show a browser confirmation popup
  const isConfirmed = confirm("Are you sure you want to delete this task?");

  // If they click "OK", wipe the card from the screen
  if (isConfirmed) {
    mainCard.remove();
  }
});
