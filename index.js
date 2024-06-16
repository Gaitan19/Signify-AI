function getLetter(number) {
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
  return letters[number];
}

document.getElementById("imageInput").addEventListener("change", function () {
  const input = this;
  const previewsContainer = document.getElementById("previews");
  previewsContainer.innerHTML = ""; // Clear existing previews

  if (input.files) {
    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.maxWidth = "200px";
        previewsContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }
});

function uploadImages() {
  const input = document.getElementById("imageInput");
  if (input.files && input.files.length > 0) {
    const formData = new FormData();
    Array.from(input.files).forEach((file) => {
      formData.append("files", file);
    });

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const predictedWord = data.predicted_classes.map(getLetter).join("");
        document.getElementById(
          "result"
        ).innerText = `Predicted Word: ${predictedWord}`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("Please select image files.");
  }
}
