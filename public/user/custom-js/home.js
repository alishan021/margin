
const btnCarts = document.querySelectorAll('.btn-cart');
btnCarts.forEach(( btnCart ) => {
    btnCart.addEventListener('click', async (event) => {
        event.preventDefault()
        console.log('jaiii')
        const productId = btnCart.getAttribute('data-product-id');
        const response = await fetch(`/cart/${productId}`, { method: 'PATCH'});
        const body = await response.json();
        console.log()
        if(body.error) {
            failureMessage(body.error);
            if(body.redirect) setTimeout(() => window.location.href = '/login', 1000);
        }
        else successMessage(body.message);
    })
});




const btnWishlists = document.querySelectorAll('.btn-wishlist');
btnWishlists.forEach(( btnWishlist ) => {
    btnWishlist.addEventListener('click', async (event) => {
        event.preventDefault()
        console.log('faiii')
        const productId = btnWishlist.getAttribute('data-product-id');
        const response = await fetch(`/wishlist/${productId}`, { method: 'POST'});
        const body = await response.json();
        if(body.error) {
            failureMessage(body.error);
            if(body.redirect) setTimeout(() => window.location.href = '/login', 1000);
        }
        else successMessage(body.message);
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
  