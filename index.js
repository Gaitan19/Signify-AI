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
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById("preview");
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(input.files[0]);
  }
});

function uploadImage() {
  const input = document.getElementById("imageInput");
  if (input.files && input.files[0]) {
    const formData = new FormData();
    formData.append("file", input.files[0]);

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById(
          "result"
        ).innerText = `Predicted Class: ${getLetter(
          data.predicted_class
        )}, Accuracy: ${data.accuracy.toFixed(2)}%`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("Please select an image file.");
  }
}
