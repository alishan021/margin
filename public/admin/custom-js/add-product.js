// add-product.js

document.addEventListener('DOMContentLoaded', function() {

    const form = document.querySelector('form');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Create FormData object to easily gather form data
        const formData = new FormData(form);

        // Send form data to server
        try {
            const response = await fetch('/admin/products/add', {
                method: 'POST',
                body: formData
            });

            const responseData = await response.json();
            if (response.ok) {
                return successMessage(responseData.message);
            }
            failureMessage(responseData.error);
        
        } catch (error) {
            failureMessage(error)
        }
    });




    const fileInput = document.getElementById('image');
    const selectedFilesPreview = document.getElementById('selected-files-preview');

    fileInput.addEventListener('change', function() {
        selectedFilesPreview.innerHTML = ''; // Clear previous previews

        const files = fileInput.files;
        if (files.length === 0) {
            return; // No files selected
        }

        // Display thumbnails
        for (let i = 0; i < files.length; i++) {

            const file = files[i];
            const filePreview = document.createElement('div');
            filePreview.classList.add('file-preview');

            // Display thumbnail
            if (file.type.startsWith('image/')) {
                const fileThumbnail = document.createElement('img');
                fileThumbnail.src = URL.createObjectURL(file);
                fileThumbnail.alt = 'File Thumbnail';
                fileThumbnail.classList.add('file-thumbnail');
                filePreview.appendChild(fileThumbnail);
                fileThumbnail.style.maxWidth = '100px';
                fileThumbnail.style.maxHeight = '100px'; 
            }

            selectedFilesPreview.appendChild(filePreview);
        }
    });
});




function successMessage(message) {
    Swal.fire({
      text: message,
      position: 'top',
      timer: 2000,
      background: 'green',
      color: 'white',
      showConfirmButton: false
    });
    return;
  }
  
  
  function failureMessage(message) {
    Swal.fire({
      text: message,
      position: 'top',
      timer: 2000,
      background: 'red',
      color: 'white',
      showConfirmButton: false
    });
    return;
  }