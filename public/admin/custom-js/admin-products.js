document.addEventListener('DOMContentLoaded', () => {

    const delBtns = document.querySelectorAll('.btn-delete');

    delBtns.forEach((button) => {
        button.addEventListener('click', async (event) => {
            try {
                const conform = await confirmIt('do you want to delete the product', "YES");
                console.log('confi : ' + conform.isConfirmed );
                if(!conform.isConfirmed) {
                    return conform;
                }
                const productId = button.getAttribute('data-product-id');
                const response = await fetch(`/admin/product/${productId}`,{
                    method: 'DELETE'
                    });
                if(response.ok){
                    const productRow = button.closest('tr');
                    productRow.remove();
                    return successMessage('deleted successfully')
                }
                const body = await response.json();
            } catch (err) {
                console.log('error : ' + err);
                failureMessage( err )
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
                    successMessage((action)? 'list product': 'unlist product')
                } else {
                    return failureMessage('some error 89')
                }
            })
            .catch(error => {
                console.error('Error:', error);
                return failureMessage( error );
            });
        });
    });


        // Add an event listener to handle the "Edit" button click
        document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            console.log('you clicked edit button');
            
            const productId = this.getAttribute('data-product-id');
            console.log(productId);
            if(productId){
                window.location.href = `/admin/products/edit/${productId}`
            }

        });
        });
    
    

})






const displayError = (message) => {
    const msgPara = document.querySelector('.msg-para');
    msgPara.parentElement.className = 'display-error';
    msgPara.innerHTML = message;
}



const displaySucess = (message) => {
    const msgPara = document.querySelector('.msg-para');
    msgPara.parentElement.className = 'display-success';
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