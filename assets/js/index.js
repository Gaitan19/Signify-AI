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
      const predictedWord = data.predicted_word;
      const correctedWord = data.corrected_word;
      const probability = data.probability;
      document.getElementById(
        "result"
      ).innerText = `Predicted Word: ${predictedWord}, Corrected Word: ${correctedWord}, Probability: ${probability.toFixed(
        2
      )}%`;
      hideLoadingOverlay();
      animatePrediction();
    })
    .catch((error) => {
      console.error("Error:", error);
      hideLoadingOverlay();
    });
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
});
