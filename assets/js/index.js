const images = [];
const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
];
let currentFile = null;

function getLetter(number) {
  return letters[number];
}

document.getElementById("imageInput").addEventListener("change", function () {
  const input = this;
  if (input.files && input.files[0]) {
    currentFile = input.files[0];

    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.createElement("img");
      preview.src = e.target.result;
      preview.style.maxWidth = "200px";
      preview.id = "current-preview";
      const currentPreview = document.getElementById("current-preview");
      if (currentPreview) {
        currentPreview.remove();
      }
      document.getElementById("current-image").appendChild(preview);
    };
    reader.readAsDataURL(currentFile);
  }
});

function addImage() {
  if (currentFile) {
    images.push(currentFile);

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.width = "100px";
      img.style.height = "100px";
      document.getElementById("previews").appendChild(img);
      adjustGridColumns();
      animateAddImage();
    };
    reader.readAsDataURL(currentFile);

    currentFile = null;
    document.getElementById("imageInput").value = "";
    const currentPreview = document.getElementById("current-preview");
    if (currentPreview) {
      currentPreview.remove();
    }
  } else {
    alert("Please select an image file.");
  }
}

function addSpace() {
  images.push(" ");
  const space = document.createElement("span");
  space.innerHTML = "&nbsp;";
  space.style.width = "100px";
  space.style.height = "100px";
  space.style.display = "inline-block";
  document.getElementById("previews").appendChild(space);
  adjustGridColumns();
  animateAddImage();
}

function removeLastImage() {
  if (images.length > 0) {
    images.pop();
    const previews = document.getElementById("previews");
    previews.removeChild(previews.lastChild);
    adjustGridColumns();
  }
}

function clearAll() {
  images.length = 0;
  const previews = document.getElementById("previews");
  while (previews.firstChild) {
    previews.removeChild(previews.firstChild);
  }
  document.getElementById("result").textContent = "";
  adjustGridColumns();
}

function adjustGridColumns() {
  const previews = document.getElementById("previews");
  const itemCount = previews.childElementCount;
  const columns = Math.min(itemCount, 5);
  previews.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

function predictWord() {
  const formData = new FormData();

  if (images.length === 0) {
    alert("No images added.");
    return;
  }

  images.forEach((item, index) => {
    if (item !== " ") {
      formData.append("files", item);
    } else {
      formData.append(
        "files",
        new Blob([item], { type: "text/plain" }),
        `space-${index}`
      );
    }
  });

  showLoadingOverlay();

  fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      const predictedWord = capitalize(data.predicted_word);
      const correctedWord = data.corrected_word
        ? capitalize(data.corrected_word)
        : null;
      const probability = data.probability;

      let resultText = `Predicted Word: ${predictedWord}`;
      if (correctedWord !== null) {
        resultText += `, Corrected Word: ${correctedWord}`;
      }
      resultText += `, Probability: ${probability.toFixed(2)}%`;

      document.getElementById("result").innerText = resultText;
      hideLoadingOverlay();
      animatePrediction();
    })
    .catch((error) => {
      console.error("Error:", error);
      hideLoadingOverlay();
    });
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function showLoadingOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "loading-overlay";
  overlay.innerHTML = '<div class="spinner"></div>';
  document.body.appendChild(overlay);
}

function hideLoadingOverlay() {
  const overlay = document.querySelector(".loading-overlay");
  if (overlay) {
    document.body.removeChild(overlay);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById("imageInput");
  const previews = document.getElementById("previews");
  const currentImage = document.getElementById("current-image");
  const result = document.getElementById("result");

  imageInput.addEventListener("change", () => {
    currentImage.classList.add("fade-in");
    setTimeout(() => {
      currentImage.classList.remove("fade-in");
    }, 1000);
  });

  window.animateAddImage = function () {
    const images = previews.querySelectorAll("img, span");
    const lastImage = images[images.length - 1];
    if (lastImage) {
      lastImage.classList.add("zoom-in");
      setTimeout(() => {
        lastImage.classList.remove("zoom-in");
      }, 1000);
    }
  };

  window.animatePrediction = function () {
    result.classList.add("fade-in");
    setTimeout(() => {
      result.classList.remove("fade-in");
    }, 1000);
  };

  // Function to load auto correction state
  const autoCorrectionCheckbox = document.getElementById(
    "autoCorrectionCheckbox"
  );
  loadAutoCorrectionState();

  autoCorrectionCheckbox.addEventListener("change", () => {
    toggleAutoCorrection(autoCorrectionCheckbox.checked);
  });
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
