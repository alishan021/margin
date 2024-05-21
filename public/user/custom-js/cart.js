const cartItemNum = document.querySelectorAll('.quantityInput');

cartItemNum.forEach( item => {
    item.addEventListener('input', async (event) => {
        const nums = item.value;
        const productId = event.target.dataset.productId;
        const userId = event.target.dataset.userId;
        const response = await fetch(`/cart/product/${userId}/${productId}/${nums}`,{
            method: 'PATCH'
        })
        const body = await response.json();
        if(body.success) successMessage(body.message);
        else if(body.error){
            failureMessage(body.error);
            event.target.max = body.productQuantity;
        } 
    });
});




document.querySelectorAll('.remove-col').forEach(tdElement => {
    tdElement.addEventListener('click', async (event) => {
        // Check if the clicked element or any of its parents have the data-product-id attribute
        const productId = event.target.closest('.btn-remove').dataset.productId;
        const response = await fetch(`/cart/delete/${productId}`, {
            method: 'PATCH'
        })
        const body = await response.json();
        if(body.success){
            successMessage(body.message);
            setTimeout(() => window.location.reload() , 2000);
        }else if(body.error) failureMessage(body.error);
    });
});




const radioButtons = document.querySelectorAll('[select-address]');

radioButtons.forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
            // const selectedAddress = event.target.value;
            let addressId = event.target.dataset.addressId;
            if(!addressId || addressId === '') addressId = "new";
            fetch(`/address/preffered/${addressId}`)
                .then((response) => response.json())
                .then(body => {
                    if(body.success) successMessage(body.success);
                    else if(body.error) failureMessage(body.error);
                })
                .catch( err => console.log(err))
        }
    });
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
  