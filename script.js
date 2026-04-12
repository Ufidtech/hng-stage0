// ==========================================
// STEP 1: Select Your Elements
// ==========================================
const checkbox = document.querySelector(
  '[data-testid="test-todo-complete-toggle"]',
);
const title = document.querySelector('[data-testid="test-todo-title"]'); // grab 'test-todo-title'
const statusLabel = document.querySelector('[data-testid="test-todo-status"]'); // grab 'test-todo-status'
const editButton = document.querySelector(
  '[data-testid="test-todo-edit-button"]',
); // grab 'test-todo-edit-button'
const deleteButton = document.querySelector(
  '[data-testid="test-todo-delete-button"]',
); // grab 'test-todo-delete-button'

// ==========================================
// STEP 2: The Checkbox Toggle Logic
// ==========================================
checkbox.addEventListener("change", function () {
  // Check if the box is currently checked
  if (checkbox.checked === true) {
    // 1. Cross out the title
    title.style.textDecoration = "line-through";

    // 2. Change the label text to "Done"
    statusLabel.textContent = "Done";
  } else {
    // 1. Remove the cross-out (set textDecoration to "none")
    title.style.textDecoration = "none";
    // 2. Change the label text back to "In Progress"
    statusLabel.textContent = "In progress";
  }
});

// ==========================================
// STEP 3: The Action Buttons
// ==========================================

// Add a click listener for the Edit button
editButton.addEventListener("click", function () {
  alert("Edit clicked!");
});

// Add a click listener for the Delete button (make it trigger an alert)

deleteButton.addEventListener("click", function () {
  alert("Delete clicked!!");
});
