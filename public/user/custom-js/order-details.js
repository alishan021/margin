
const cancelOrder = document.querySelector('.cancel-order');

cancelOrder.addEventListener('click', async ( event ) => {
    const orderId = cancelOrder.getAttribute('data-order-id');
    const confi = confirm('Are you sure that you want to cancel the order?');
    if(confi){
        const response = await fetch(`/order/cancel/${orderId}`, {
            method: 'PATCH',
            })
        const body = await response.json();
        console.log(body);
        if(body.error) showAlertError(body.error);
        else if(body.success) showAlertSuccess(body.success);
        if(!body.error){
            cancelOrder.style.display = 'none'
            document.querySelector('.btn-cancel-order').style.display = "none";
        }
    }
})


document.addEventListener('DOMContentLoaded', () => {
    console.log('hai')
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
  