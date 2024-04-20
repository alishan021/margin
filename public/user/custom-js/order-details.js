
const cancelOrder = document.querySelector('.btn-cancel-order');
const returnOrder = document.querySelector('.btn-return-order');



// Cancel the order
if(cancelOrder){

    cancelOrder.addEventListener('click', async ( event ) => {
        const orderId = cancelOrder.parentElement.getAttribute('data-order-id');
    const confi = confirm('Are you sure that you want to cancel the order?');
    if(confi){
        const response = await fetch(`/order/cancel/${orderId}`, {
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
            document.querySelector('.btn-cancel-order').style.display = "none";
        }
    }
  });
}

if(returnOrder){

    returnOrder.addEventListener('click', async (event) => {
        const orderId = returnOrder.parentElement.getAttribute('data-order-id');
        console.log(orderId);
        const confi = confirm('Are you sure that you want to return the order? \nThen your money will added to your wallet');
    if(confi){
        const response = await fetch(`/order/return/${orderId}`, {
            method: 'PATCH',
        });
        const body = await response.json();
        console.log(body);
        if(body.error) showAlertError(body.error);
        else if(body.success) showAlertSuccess(body.success);
        if(!body.error){
            returnOrder.style.display = 'none'
            document.querySelector('.btn-return-order').style.display = "none";
        }
    }
  })
}





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
  