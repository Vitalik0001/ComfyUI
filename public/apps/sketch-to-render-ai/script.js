async function uploadAndProcess() {
  const fileInput = document.getElementById("imageUpload");
  const uploadButton = document.getElementById("uploadImageButton");
  const processButton = document.getElementById("processImageButton");
  const imageContainer = document.getElementById("imageContainer");
  const loader = document.getElementById("loader");
  const downloadButton = document.getElementById("downloadImageButton");
  const preview = document.getElementById("preview");
  const backButton = document.getElementById('backButton');

  let selectedFile = null;

  backButton.addEventListener('click', () => {
    window.history.back();
  });

  uploadButton.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    selectedFile = fileInput.files[0];
    if (selectedFile) {
      preview.src = URL.createObjectURL(selectedFile);
    }
  });

  processButton.addEventListener("click", async () => {
    if (!selectedFile) {
      alert("Please upload an image first.");
      return;
    }

    const promptText = document.getElementById("queryInput").value;
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("prompt", promptText);

    loader.classList.remove("hidden");
    imageContainer.innerHTML = "";
    downloadButton.disabled = true;

    try {
      const response = await fetch("http://localhost:3001/api/sketch-to-render-ai/image-upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);

        const imgElement = document.createElement("img");
        imgElement.src = objectURL;
        imgElement.style.maxWidth = "1920px";
        imgElement.dataset.blob = "true";

        imageContainer.appendChild(imgElement);
        downloadButton.disabled = false;
      } else {
        console.error("Response status:", response.status);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      loader.classList.add("hidden");
    }
  });
}

function downloadLatestBlobImage() {
  const imageContainer = document.getElementById("imageContainer");
  const imgElement = imageContainer.querySelector("img");

  if (!imgElement || !imgElement.src.startsWith("blob:")) {
    console.error("No blob image found to download.");
    return;
  }

  fetch(imgElement.src)
    .then(response => response.blob())
    .then(blob => {
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "downloaded-image.png";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    })
    .catch(err => {
      console.error("Failed to download image:", err);
    });
}

window.addEventListener("load", () => {
  uploadAndProcess();
  document.getElementById("downloadImageButton")
    .addEventListener("click", downloadLatestBlobImage);
});
