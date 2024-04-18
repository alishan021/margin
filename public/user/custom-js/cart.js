const cartItemNum = document.querySelectorAll('.quantityInput');

cartItemNum.forEach( item => {
    item.addEventListener('input', async (event) => {
        const nums = item.value;
        const productId = event.target.dataset.productId;
        const userId = event.target.dataset.userId;
        console.log(nums);
        console.log(productId);
        console.log(userId);
        const response = await fetch(`/cart/product/${userId}/${productId}/${nums}`,{
            method: 'PATCH'
        })
        const body = await response.json();
        console.log(body);
        if(body.success) showAlertSuccess(body.message);
        else if(body.error) showAlertError(body.error);
    })
})




document.querySelectorAll('.remove-col').forEach(tdElement => {
    tdElement.addEventListener('click', async (event) => {
        // Check if the clicked element or any of its parents have the data-product-id attribute
        const productId = event.target.closest('.btn-remove').dataset.productId;
        console.log(productId);
        const response = await fetch(`/cart/delete/${productId}`, {
            method: 'PATCH'
        })
        const body = await response.json();
        console.log(body);
        if(body.success){
            showAlertSuccess(body.message);
            setTimeout(() => window.location.reload() , 2000);
        }else if(body.error) showAlertError(body.error);
    });
});





const radioButtons = document.querySelectorAll('[select-address]');

radioButtons.forEach(radio => {
    radio.addEventListener('change', (event) => {
        console.log('hidisiidis')
        if (event.target.checked) {
            // const selectedAddress = event.target.value;
            if(event.target.dataset.addressId = "") return;
            const addressId = event.target.dataset.addressId;
            fetch(`/address/preffered/${addressId}`)
                .then((response) => response.json())
                .then(body => {
                    if(body.success) showAlertSuccess(body.success);
                    else if(body.error) showAlertError(body.error);
                })
                .catch( err => console.log(err))
        }
    });
});








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
  