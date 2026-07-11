/**
 * toast.js  (ES module)
 * Owner: Shashank Mishra
 * Short success/error messages triggered from crud.js consumers (eventForm.js,
 * deleteModal.js) after add/edit/delete actions resolve.
 */

function getContainer() {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  return container;
}

export function show(message, type) {
  const container = getContainer();
  const toast = document.createElement("div");
  toast.className = `toast toast-${type || "success"}`;
  toast.setAttribute("role", "status");

  const icon = type === "error" ? "\u2715" : "\u2713";
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-message"></span>`;
  toast.querySelector(".toast-message").textContent = message;

  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("is-visible"));

  setTimeout(() => {
    toast.classList.remove("is-visible");
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}
