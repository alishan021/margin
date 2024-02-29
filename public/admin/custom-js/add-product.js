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





    //     // Add an event listener to handle the "Edit" button click
    // document.querySelectorAll('.btn-edit').forEach(button => {
    //     button.addEventListener('click', function() {
    //         console.log('you clicked edit button');
    //         // Extract product information from the corresponding row
    //         const row = this.closest('tr');
    //         const name = row.querySelector('.name').textContent;
    //         const price = row.querySelector('.price').textContent;
    //         const quantity = row.querySelector('.quantity').textContent;
    //         // Extract other fields as needed

    //         // Populate the form fields with the extracted information
    //         document.getElementById('name').value = name;
    //         document.getElementById('price').value = price;
    //         document.getElementById('quantity').value = quantity;
    //         // Populate other form fields as needed

    //         // Show the form and hide other elements
    //         document.getElementById('product-form').style.display = 'block';
    //         // Hide other elements as needed
    //     });
    // });


});
