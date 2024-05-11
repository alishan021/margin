const btnCart = document.querySelectorAll('.btn-add-cart');
// import { showAlert } from "../custom-js/alert-msg";

btnCart.forEach(aElement => {
    aElement.addEventListener('click', async (event) => {
        event.preventDefault();

        // Check if the clicked element is the span inside the <a> tag
        const clickedElement = event.target.tagName.toLowerCase();
        let productId = aElement.getAttribute('data-product-id');
        
        if (clickedElement === 'span') {
            // If the clicked element is the span, get the productId from its parent
            const parentElement = event.target.parentNode;
            productId = parentElement.getAttribute('data-product-id');
        }

        const quantity = document.querySelector('#qty').value;
        console.log('product Id : ' + productId)
        console.log('you clicked cart button', quantity, productId );

        const response = await fetch(`/product/cart/${productId}/${quantity}`, {
            method: 'PATCH'
        });
        const body = await response.json();

        console.log(body);
        if(body.redirect){
            failureMessage(body.error);
            setTimeout(() => window.location.href = body.redirect, 1000)
        }else if(body.success){
            successMessage(body.message)
        }else if(body.error){
            console.log(body);
            failureMessage(body.error);
        }
    });
});



document.querySelectorAll('.btn-wishlist').forEach( item => {
    item.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        const productId = event.currentTarget.getAttribute('data-product-id');
        console.log(productId);
    
        const response = await fetch(`/wishlist/${productId}`, { method: 'POST' });
            const result = await response.json();
            console.log(result);
            if(result.success) successMessage(result.message)
            else if(result.redirect) {
                failureMessage(result.error);
                setTimeout(() => window.location.href = result.redirect, 1000)
            }
            else failureMessage(result.error);
    });   
})








const alertMessageError = document.getElementById('alertMessageError');
const alertMessageSuccess = document.getElementById('alertMessageSuccess');

function showAlertError(message) {
    alertMessageError.innerText = message;
    alertMessageError.style.display = 'block';
  setTimeout(() => {
    alertMessageError.style.display = 'none';
  }, 3000); 
}


function showAlertSuccess(message) {
    alertMessageSuccess.innerText = message;
    alertMessageSuccess.style.display = 'block';
    setTimeout(() => {
        alertMessageSuccess.style.display = 'none';
    }, 3000); 
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
  