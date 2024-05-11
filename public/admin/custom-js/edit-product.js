
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('image');
    const selectedFilesPreview = document.getElementById('selected-files-preview');

    fileInput.addEventListener('change', function() {
        // console.log(event)
        selectedFilesPreview.innerHTML = '';

        const files = fileInput.files;
        if (files.length === 0) {
            return;
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
            }

            selectedFilesPreview.appendChild(filePreview);
        }
    });
});


const form = document.querySelector('form');


const productId = form.getAttribute('data-product-id');
console.log(productId);
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(form);
    console.log(productId);
    // Send form data to server
    try {
        const response = await fetch(`/admin/products/edit/${ productId }`, {
            method: 'POST',
            body: formData
        });
        const responseData = await response.json();
        if (response.ok) {
            console.log(responseData); // Log server response
            successMessage({ message: responseData.message });
            window.location.href = '/admin/products';
            return
        }
        console.error('Error adding product');
        failureMessage(responseData.error);
    
    } catch (error) {
        console.error('Error adding product:', error);
        failureMessage(error)
    }
});



const imgDeleteButtons = document.querySelectorAll('.img-delete-btn');
imgDeleteButtons.forEach( button => {
    button.addEventListener('click', async (e) => {
        const confi = confirm('Do you want to delete the image', "YES");
        if(!confi.isConfirmed) return ;
        const imageUrl = button.getAttribute('data-image-url');
        const productId = button.getAttribute('data-product-id');
        console.log(imageUrl)
        console.log(productId);

        const response = await fetch(`/admin/products/delete-image?imageUrl=${imageUrl}&productId=${productId}`, { method: 'DELETE' });
        const result = await response.json();
        console.log(result);
        if (result.success) {
            const imagePreviewDiv = button.closest('.image-preview-div');
            if (imagePreviewDiv) {
                imagePreviewDiv.remove();
                successMessage(result.message);
            }
        } else {
            failureMessage(result.error);
        }
        // console.log(response);
    })
});


document.querySelector('#image').addEventListener('click', () => console.log('image input clicked'));



const msgPara = document.querySelector('.msg-para');

const displayError = (message) => {
    const msgPara = document.querySelector('.msg-para');
    msgPara.parentElement.className = 'msg-box-error';
    msgPara.innerHTML = message;
}



const displaySuccess = (message) => {
    const msgPara = document.querySelector('.msg-para');
    msgPara.parentElement.className = 'msg-box-success';
    msgPara.innerHTML = message;
}



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



  function confirmIt( message, confirmText ) {
    const result = Swal.fire({
      text: message,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmText || "OK",
      position: "top",
      customClass: {
        actions: 'custom-actions-class'
      }
    });
    return result;
  };