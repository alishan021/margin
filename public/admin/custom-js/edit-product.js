
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('image');
    const selectedFilesPreview = document.getElementById('selected-files-preview');

    fileInput.addEventListener('change', function() {
        selectedFilesPreview.innerHTML = ''; // Clear previous previews

        const files = fileInput.files;
        if (files.length === 0) {
            return; // No files selected
        }else {
            const oldImages = document.querySelector('.image-preview-container-old');
            oldImages.style.display = 'none';
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
});


const form = document.querySelector('form');


form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(form);
    // Send form data to server
    try {
        const response = await fetch(`/admin/products/edit/${ productId }`, {
            method: 'POST',
            body: formData
        });
        const responseData = await response.json();
        if (response.ok) {
            console.log(responseData); // Log server response
            displaySuccess({ message: responseData.message });
            window.location.href = '/admin/products';
            return
        }
        console.error('Error adding product');
        displayError({ error: responseData.error });
    
    } catch (error) {
        console.error('Error adding product:', error);
        displayError({ error: error })
    }
});


const msgPara = document.querySelector('.msg-para');


const displayError = (result) => {
    const msgPara = document.querySelector('.msg-para');
    msgPara.parentElement.className = 'msg-box-error';
    msgPara.innerHTML = result.error;
}



const displaySuccess = (result) => {
    const msgPara = document.querySelector('.msg-para');
    msgPara.parentElement.className = 'msg-box-success';
    msgPara.innerHTML = result.message;
}