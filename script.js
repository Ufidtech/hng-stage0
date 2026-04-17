// ==========================================
// 1. DOM ELEMENTS (All gathered at the top!)
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
const deleteBtn = document.querySelector(
  '[data-testid="test-todo-delete-button"]',
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

// Status & Main Card Elements
const statusCheckbox = document.querySelector(
  '[data-testid="test-todo-complete-toggle"]',
);
const statusLabel = document.querySelector('[data-testid="test-todo-status"]');
const statusSelect = document.querySelector(
  '[data-testid="test-todo-status-control"]',
);
const mainCard = document.querySelector('[data-testid="test-todo-card"]');

// Time Elements
const timeRemainingElement = document.querySelector(
  '[data-testid="test-todo-time-remaining"]',
);
const overdueIndicator = document.querySelector(
  '[data-testid="test-todo-overdue-indicator"]',
);

// ==========================================
// 2. THE EDIT ENGINE ("The Flip-Flop")
// ==========================================

// --- When EDIT is clicked ---
editBtn.addEventListener("click", function () {
  titleInput.value = titleDisplay.textContent.trim();
  descInput.value = descDisplay.textContent.trim();
  dateInput.value = dateDisplay.getAttribute("datetime").split("T")[0];

  const currentPriority = priorityDisplay.textContent
    .replace("Priority: ", "")
    .trim();
  priorityInput.value = currentPriority;

  displayContainer.style.display = "none";
  editForm.style.display = "flex";
  titleInput.focus();
});

// --- When CANCEL is clicked ---
cancelBtn.addEventListener("click", function () {
  editForm.style.display = "none";
  displayContainer.style.display = "flex";
  editBtn.focus();
});

// --- When SAVE is clicked ---
saveBtn.addEventListener("click", function () {
  // Update Display Text
  titleDisplay.textContent = titleInput.value;
  descDisplay.textContent = descInput.value;
  priorityDisplay.textContent = `Priority: ${priorityInput.value}`;

  // Update Dates
  const selectedDate = dateInput.value;
  dateDisplay.setAttribute("datetime", `${selectedDate}T12:00:00`);
  const dateObj = new Date(selectedDate);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  dateDisplay.textContent = `Due ${formattedDate}`;

  // Update Visual Priority Dot
  if (priorityInput.value === "High") {
    priorityDot.textContent = "🔴";
  } else if (priorityInput.value === "Medium") {
    priorityDot.textContent = "🟡";
  } else {
    priorityDot.textContent = "🟢";
  }

  // Sync Status Checkbox with the Dropdown value
  statusLabel.textContent = statusSelect.value;
  if (statusSelect.value === "Done") {
    statusCheckbox.checked = true;
    mainCard.classList.add("is-completed");
  } else {
    statusCheckbox.checked = false;
    mainCard.classList.remove("is-completed");
  }

  // Force the clock to recalculate based on new inputs
  if (typeof updateTimeRemaining === "function") {
    updateTimeRemaining();
  }

  // Flip-Flop back
  editForm.style.display = "none";
  displayContainer.style.display = "flex";
  editBtn.focus();
});

// ==========================================
// 3. THE COLLAPSE ENGINE
// ==========================================
expandToggleBtn.addEventListener("click", function () {
  collapsibleSection.classList.toggle("collapsed-text");
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
    statusLabel.textContent = "Done";
    statusSelect.value = "Done";
    mainCard.classList.add("is-completed");
  } else {
    statusLabel.textContent = "Pending";
    statusSelect.value = "Pending";
    mainCard.classList.remove("is-completed");
  }

  // Force the clock to update instantly when checkbox is clicked
  if (typeof updateTimeRemaining === "function") {
    updateTimeRemaining();
  }
});

// ==========================================
// 5. THE DELETE ENGINE
// ==========================================
deleteBtn.addEventListener("click", function () {
  const isConfirmed = confirm("Are you sure you want to delete this task?");
  if (isConfirmed) {
    mainCard.remove();
  }
});

// ==========================================
// 6. THE TIME ENGINE
// ==========================================
let timeInterval;

function updateTimeRemaining() {
  // If it's done, stop the clock and show "Completed"
  if (statusCheckbox.checked) {
    timeRemainingElement.textContent = "Completed";
    timeRemainingElement.classList.remove("text-danger");
    overdueIndicator.style.display = "none";
    clearInterval(timeInterval);
    return;
  }

  // The Time Math
  const now = new Date().getTime();
  const targetDate = new Date(dateDisplay.getAttribute("datetime")).getTime();
  const diffMs = targetDate - now;

  const isOverdue = diffMs < 0;
  const absDiff = Math.abs(diffMs);

  // Convert milliseconds to readable units
  const mins = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  // Format the granular string
  let timeString = "";
  if (days > 0) {
    timeString = isOverdue ? `Overdue by ${days} days` : `Due in ${days} days`;
  } else if (hours > 0) {
    timeString = isOverdue
      ? `Overdue by ${hours} hours`
      : `Due in ${hours} hours`;
  } else {
    timeString = isOverdue
      ? `Overdue by ${mins} minutes`
      : `Due in ${mins} minutes`;
  }

  // Update the UI
  timeRemainingElement.textContent = timeString;

  if (isOverdue) {
    overdueIndicator.style.display = "inline-block";
    timeRemainingElement.classList.add("text-danger");
  } else {
    overdueIndicator.style.display = "none";
    timeRemainingElement.classList.remove("text-danger");
  }
}

// Start the clock immediately, then tick every 60 seconds
updateTimeRemaining();
timeInterval = setInterval(updateTimeRemaining, 60000);
