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
