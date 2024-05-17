
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


async function payAgain(event) {
  console.log('hai');
  const orderId = event.target.dataset.orderId;
  console.log(orderId);
  const response = await fetch(`/failed-payment?orderId=${orderId}`);
  const body = await response.json();
  console.log(body);
  const { rzr_orderId, totalPrice } = body.order;
  console.log(rzr_orderId, totalPrice );
  await razorpay(rzr_orderId, totalPrice, body.order.userId );
}





async function razorpay(orderId, productTotal, userId){
  console.log(productTotal)
  $(document).ready(function() {
    
          var options = {
            "key": "rzp_test_sHq1xf34I99z5x",
            "amount": productTotal*100,
            "currency": "INR",
            "name": "Margin",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": orderId,
            "handler": function(response) {
              console.log(response.razorpay_payment_id);
              console.log(response.razorpay_order_id);
              console.log(response.razorpay_signature);
              const result = rzrPaymentAgain( userId, orderId );
              console.log('result : ' + result);
              if(result) setTimeout(() => window.location.reload(), 1000);
              else return false;
            },
            "prefill": {
              "name": "Muhammed Alishan",
              "email": "alishan.example@gmail.com",
              "contact": "0000000000"
            },
            "notes": {
              "address": "Razorpay Corporate Office"
            },
            "theme": {
              "color": "#3399cc"
            }
          };
    
          var rzp1 = new Razorpay(options);
  
          rzp1.on('payment.failed', async function(response) {
            console.log('payment failed');
            console.log(response.error.code);
            console.log(response.error.description);
            console.log(response.error.source);
            console.log(response.error.step);
            console.log(response.error.reason);
            console.log(response.error.metadata.order_id);
            console.log(response.error.metadata.payment_id);
            failureMessage('Payment failed, try Again');
          });
  
          rzp1.on('payment.error', function (response) {
            console.log('Payment error:', response.error);
          });
  
          rzp1.open();
    });
  }


  
  
async function rzrPaymentAgain( userId, rzr_orderId ) {
  console.log( userId, rzr_orderId );
  const response = await fetch('/payment-pending', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, rzr_orderId })
  });
  const body = await response.json();
  console.log(body);
  if(body.error) {
    failureMessage(body.error);
    return false;
  }
  else successMessage(body.message);
  return true;
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

