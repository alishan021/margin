
const cancelOrderAll = document.querySelectorAll('.btn-item-cancel');
const returnOrderAll = document.querySelectorAll('.btn-item-return');



cancelOrderAll.forEach( cancelOrder => {

    // Cancel the order
    if(cancelOrder){

    cancelOrder.addEventListener('click', async ( event ) => {
        const productId = cancelOrder.parentElement.getAttribute('data-product-id');
        const orderId = cancelOrder.parentElement.getAttribute('data-order-id');
        const confi = confirm('Are you sure that you want to cancel the order?');
        console.log(productId);
        if(confi){
            const response = await fetch(`/order/cancel/${orderId}/${productId}`, {
                method: 'PATCH',
                })
            const body = await response.json();
            console.log(body);
            if(body.error) showAlertError(body.error);
            else if(body.success) {
                showAlertSuccess(body.success);
                window.location.reload();
            } 
            if(!body.error){
                cancelOrder.style.display = 'none'
                document.querySelector('.btn-item-cancel').style.display = "none";
            }
        }
      });
    }
});


returnOrderAll.forEach((returnOrder) => {
  if (returnOrder) {
    returnOrder.addEventListener('click', async (event) => {
      const parentDiv = returnOrder.closest('.item-order-status');
      const productId = parentDiv.getAttribute('data-product-id');
      const orderId = parentDiv.getAttribute('data-order-id');
      const confi = confirm('Are you sure that you want to return the product? \nThen your money will added to your wallet');

      if (confi) {
        const response = await fetch(`/order/return/${orderId}/${productId}`, {
          method: 'PATCH',
        });
        const body = await response.json();
        console.log(body);

        if (body.error) {
          showAlertError(body.error);
        } else if (body.message) {
          showAlertSuccess(body.message);
          returnOrder.style.display = 'none';
          window.location.reload();
        }
      }
    });
  }
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
  