// add-product.js

document.addEventListener('DOMContentLoaded', function() {

    const form = document.querySelector('form');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Create FormData object to easily gather form data
        const formData = new FormData(form);

        // Convert FormData to JSON object
        const data = {};
        formData.forEach((value, key) => {
            if (data[key]) {
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]]; // Convert to array if not already
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        });
        console.log('data : ' + data );

        // Send form data to server
        try {
            const response = await fetch('/admin/products/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData); // Log server response
                // Perform any additional actions on successful response
            } else {
                console.error('Error adding product');
                // Handle error response
            }
        } catch (error) {
            console.error('Error adding product:', error);
            // Handle fetch error
        }
    });


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
