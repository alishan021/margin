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
                return displaySuccess({ message: responseData.message });
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
    msgPara.parentElement.className = 'msg-box-error';
    msgPara.innerHTML = result.error;
}

const displaySuccess = (result) => {
    msgPara.parentElement.className = 'msg-box-success';
    msgPara.innerHTML = result.message;
}

});
