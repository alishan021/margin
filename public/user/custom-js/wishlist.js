
const removeProduct = document.querySelectorAll('.remove-col');
removeProduct.forEach( button => {
    button.addEventListener('click', async () => {
        console.log('button remove');
        const productId = button.getAttribute('data-product-id');
        const response = await fetch(`/product/remove/${productId}`, { method: 'DELETE' });
        const result = await response.json();
        console.log(result);
        if(result.success) showAlertSuccess(result.message)
        else showAlertError(result.error);
    })
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
  