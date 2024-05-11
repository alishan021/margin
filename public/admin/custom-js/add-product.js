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
                console.log(responseData); // Log server response
                return successMessage(responseData.message);
            }
            console.error('Error adding product');
            failureMessage(responseData.error);
        
        } catch (error) {
            console.error('Error adding product:', error);
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
            console.log(file);
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






const msgPara = document.querySelector('.msg-para'); 

const displayError = (message) => {
    msgPara.parentElement.className = 'msg-box-error';
    msgPara.innerHTML = message;
}

const displaySuccess = (message) => {
    msgPara.parentElement.className = 'msg-box-success';
    msgPara.innerHTML = message;
}

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