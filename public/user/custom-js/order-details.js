
const cancelOrderAll = document.querySelectorAll('.btn-item-cancel');
const returnOrderAll = document.querySelectorAll('.btn-item-return');



cancelOrderAll.forEach( cancelOrder => {

    // Cancel the order
    if(cancelOrder){

    cancelOrder.addEventListener('click', async ( event ) => {
        const productId = cancelOrder.parentElement.getAttribute('data-product-id');
        const orderId = cancelOrder.parentElement.getAttribute('data-order-id');
        const confi = await confirmIt('Are you sure that you want to cancel the order?', 'Yes');
        console.log(confi);
        console.log(confi.isConfirmed);

        console.log(productId);
        if(confi.isConfirmed){
            const response = await fetch(`/order/cancel/${orderId}/${productId}`, {
                method: 'PATCH',
                })
            const body = await response.json();
            console.log(body);
            if(body.error) failureMessage(body.error);
            else if(body.success) {
              successMessage(body.success);
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
      const confi = await confirmIt('Are you sure that you want to return the product? \nThen your money will added to your wallet');
      console.log(confi.isConfirmed);
      if (confi.isConfirmed) {
        const response = await fetch(`/order/return/${orderId}/${productId}`, {
          method: 'PATCH',
        });
        const body = await response.json();
        console.log(body);

        if (body.error) {
          failureMessage(body.error);
        } else if (body.message) {
          successMessage(body.message);
          returnOrder.style.display = 'none';
          window.location.reload();
        }
      }
    });
  }
});




const btnInvoice = document.querySelector('#btn-invoice'); 
btnInvoice.addEventListener('click', async (event) => {
  const orderId = event.target.getAttribute('data-order-id');
  console.log(orderId);
  const response = await fetch(`/order/invoice/${orderId}`);

  if(response.ok) {
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${orderId}-invoice.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

  }else {
    const body = await response.json();
    console.log(body);
  }
});


const removeCouponBtn = document.querySelector('#btn-remove-coupon');
removeCouponBtn.addEventListener('click', async (event) => {
  console.log('inside remove coupon');
  const orderId = event.target.getAttribute('data-order-id');
  const response = await fetch(`/remove-coupon?orderId=${orderId}`);
  const body = await response.json();
  console.log(body);
  if(body.error) failureMessage(body.error);
  if(body.success) {
    successMessage(body.message);
    setTimeout(() => window.location.reload() , 1000);
  }
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
  



function confirmIt( message ) {
  const result = Swal.fire({
    text: message,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "OK",
    position: "top",
    customClass: {
      actions: 'custom-actions-class'
    }
  });
  return result;
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
