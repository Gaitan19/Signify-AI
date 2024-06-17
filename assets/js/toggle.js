let tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Función para cargar el estado inicial de autocorrección
function loadAutoCorrectionState() {
  fetch("http://127.0.0.1:5000/toggle_autocorrection")
    .then((response) => response.json())
    .then((data) => {
      const autoCorrectionCheckbox = document.getElementById(
        "autoCorrectionCheckbox"
      );
      if (autoCorrectionCheckbox) {
        autoCorrectionCheckbox.checked = data.auto_correction;
      } else {
        console.error("autoCorrectionCheckbox not found in DOM");
      }
    })
    .catch((error) => {
      console.error("Error loading auto correction state:", error);
    });
}

// Llama a loadAutoCorrectionState cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  loadAutoCorrectionState();
});

// Función para enviar la solicitud de cambio de estado de autocorrección
function toggleAutoCorrection() {
  const autoCorrectionCheckbox = document.getElementById(
    "autoCorrectionCheckbox"
  );
  fetch("http://127.0.0.1:5000/toggle_autocorrection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ auto_correction: autoCorrectionCheckbox.checked }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (autoCorrectionCheckbox) {
        autoCorrectionCheckbox.checked = data.auto_correction;
      } else {
        console.error("autoCorrectionCheckbox not found in DOM");
      }
    })
    .catch((error) => {
      console.error("Error toggling auto correction:", error);
    });
}
