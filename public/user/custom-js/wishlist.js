
document.querySelectorAll('.btn-remove').forEach( button => {
    button.addEventListener('click', async (event) => {
        console.log('button remove');
        const productId = button.getAttribute('data-product-id');
        const response = await fetch(`/wishlist/remove/${productId}`, { method: 'DELETE' });
        const result = await response.json();
        console.log(result);
        if(result.success){
            showAlertSuccess(result.message)
            setTimeout(() => window.location.reload(), 3000);
        } 
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
  