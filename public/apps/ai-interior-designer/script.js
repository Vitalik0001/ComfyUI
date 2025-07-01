async function uploadAndProcess() {
  const imageUpload1 = document.getElementById("imageUpload1");
  const imageUpload2 = document.getElementById("imageUpload2");
  const uploadImageButton1 = document.getElementById("uploadImageButton1");
  const uploadImageButton2 = document.getElementById("uploadImageButton2");
  const processImagesButton = document.getElementById("processImagesButton");
  const downloadImageButton = document.getElementById("downloadImageButton");
  const imageContainer = document.getElementById("imageContainer");
  const loader = document.getElementById("loader");
  const backButton = document.getElementById('backButton');

  const preview1 = document.getElementById("preview1");
  const preview2 = document.getElementById("preview2");

  backButton.addEventListener('click', () => {
    window.history.back();
  });

  uploadImageButton1.onclick = () => imageUpload1.click();
  uploadImageButton2.onclick = () => imageUpload2.click();

  imageUpload1.onchange = () => {
    const file = imageUpload1.files[0];
    if (file) preview1.src = URL.createObjectURL(file);
  };

  imageUpload2.onchange = () => {
    const file = imageUpload2.files[0];
    if (file) preview2.src = URL.createObjectURL(file);
  };

  processImagesButton.onclick = async () => {
    const file1 = imageUpload1.files[0];
    const file2 = imageUpload2.files[0];
    const promptText = document.getElementById("queryInput").value;

    if (!file1 || !file2) {
      alert("Please upload both images.");
      return;
    }

    const formData = new FormData();
    formData.append("image1", file1);
    formData.append("image2", file2);
    formData.append("prompt", promptText);

    loader.classList.remove("hidden");
    imageContainer.innerHTML = "";
    downloadImageButton.disabled = true;

    try {
      const response = await fetch("http://localhost:3001/api/ai-interior-designer/image-upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);

        const imgElement = document.createElement("img");
        imgElement.src = objectURL;
        imgElement.style.maxWidth = "100%";
        imgElement.dataset.blob = "true";

        imageContainer.appendChild(imgElement);
        downloadImageButton.disabled = false;
      } else {
        console.error("Upload failed, status:", response.status);
      }
    } catch (err) {
      console.error("Error uploading images:", err);
    } finally {
      loader.classList.add("hidden");
    }
  };

  downloadImageButton.onclick = () => {
    const img = imageContainer.querySelector("img");
    if (!img || !img.src.startsWith("blob:")) return;

    fetch(img.src)
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "result.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
  };
}

window.addEventListener("load", uploadAndProcess);
