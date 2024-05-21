
document.querySelectorAll('.btn-remove').forEach( button => {
    button.addEventListener('click', async (event) => {
        const productId = button.getAttribute('data-product-id');
        const response = await fetch(`/wishlist/remove/${productId}`, { method: 'DELETE' });
        const result = await response.json();
        if(result.success){
            successMessage(result.message)
            setTimeout(() => window.location.reload(), 3000);
        } 
        else failureMessage(result.error);
    })
});
  



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
  