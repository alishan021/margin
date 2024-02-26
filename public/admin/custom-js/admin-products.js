document.addEventListener('DOMContentLoaded', () => {

    const delBtns = document.querySelectorAll('.btn-delete');

    delBtns.forEach((button) => {
        button.addEventListener('click', async (event) => {
            try {
                const conform = confirm('do you want to delete the product');
                console.log('confi : ' + conform );
                if(!conform){
                    return conform;
                }
                const productId = button.getAttribute('data-product-id');
                const response = await fetch(`/admin/product/${productId}`,{
                    method: 'DELETE'
                    });
                if(response.ok){
                    const productRow = button.closest('tr');
                    productRow.remove();
                    return displaySucess({ message: 'deleted successfully'})
                }
                const body = await response.json();
            } catch (err) {
                console.log('error : ' + err);
                displayError({ message: err })
            }
        });
    });



    const buttons = document.querySelectorAll('.btn-list, .btn-unlist');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const action = this.classList.contains('btn-unlist') ? false : true;

            fetch(`/admin/product`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId, action })
            })
            .then(response => {
                if (response.ok) {
                    // location.reload();
                    console.log('list unlist success');
                    setTimeout(() => location.reload() , 1000 );
                    displaySucess({ message: (action)? 'list user': 'unlist user'})
                } else {
                    return displayError({ message: 'some error 89'})
                }
            })
            .catch(error => {
                console.error('Error:', error);
                return displayError({ message: error });
            });
        });
    });


           // Add an event listener to handle the "Edit" button click
           document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', function() {
                console.log('you clicked edit button');
                // Extract product information from the corresponding row
                const row = this.closest('tr');
                const name = row.querySelector('.name').textContent;
                const price = row.querySelector('.price').textContent;
                const quantity = row.querySelector('.quantity').textContent;
                // Extract other fields as needed
    
                // Populate the form fields with the extracted information
                document.getElementById('name').value = name;
                document.getElementById('price').value = price;
                document.getElementById('quantity').value = quantity;
                // Populate other form fields as needed
    
                // Show the form and hide other elements
                document.getElementById('product-form').style.display = 'block';
                // Hide other elements as needed
            });
        });
    
    

})






const displayError = (result) => {
    const msgPara = document.querySelector('.msg-para');
    msgPara.parentElement.className = 'display-error';
    msgPara.innerHTML = result.message;
}



const displaySucess = (result) => {
    const msgPara = document.querySelector('.msg-para');
    msgPara.parentElement.className = 'display-success';
    msgPara.innerHTML = result.message;
}