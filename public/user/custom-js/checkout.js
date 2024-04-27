
const checkoutForm = document.querySelector('#checkout-order');
let selectPaymentMethod = 'payment-1';
var formData = {};
var userId;
var originalPrice = productTotal;
let couponApplied = false, confi = false;
var discountPrice = 0;

checkoutForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const landmark = document.querySelector('.landmark');
  const orderNotes = document.querySelector('.order-notes');
  const couponCode = document.querySelector('#checkout-discount-input').value;

    if((couponCode || couponCode !== '') && !couponApplied ){
      console.log(couponCode);
      const responseCoupon = await fetch(`/coupon/check/${couponCode}/${productTotal}`);
      const bodyCoupon = await responseCoupon.json();
      if(!bodyCoupon.status) {
        showAlertError('Coupon code is wrong');
        setTimeout(() => {
          confi = confirm('The coupon you enter is wrong, Do you like to proceed with out coupon');
        }, 1000);
        if(!confi) return;
      }
      if(bodyCoupon.status){
        couponApplied = true;
        discountPrice = originalPrice - bodyCoupon.discountPrice;
        formData.discountPrice = discountPrice ;
        formData.couponApplied = true;
        formData.couponCode = couponCode;
        productTotal = bodyCoupon.discountPrice;
        const confi = confirm(`You got a discount of ${originalPrice - productTotal}, do you like to continue with out coupon`);
        if(!confi) return;
        showAlertSuccess(`you got a discount of ${originalPrice - productTotal}`);
      } 
    }

    userId = event.target.dataset.userId;

    for (const input of event.target.elements) {
        if (input.tagName !== 'INPUT' || !input.name) {
            continue;
        }
        formData[input.name] = input.value;
    }
    formData[landmark.name] = landmark.value;
    formData[orderNotes.name] = orderNotes.value;

    try{
        if(selectPaymentMethod === 'payment-1'){
          console.log('payment number 1 - COD');
          formData.paymentMethod = 'COD';
          checkoutSend(userId, formData)
        }else if(selectPaymentMethod === 'payment-2'){
            console.log('Inside payment method 2');
            formData.paymentMethod = 'razorpay';
            const result = razorpay();
        }else if(selectPaymentMethod === 'payment-3'){
            console.log('Inside payment method 3');
            formData.paymentMethod = 'wallet';
            checkoutSend(userId, formData);
        }else {
            console.log('some problems here');
            showAlertError('select a payment method to continue');
        }
    }catch(err){
        console.log(err);
    }
});
async function checkoutSend(userId, formData) {
  try {
    const response = await fetch(`/checkout/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const body = await response.json();
    if (body.error) {
      return showAlertError(body.error);
    } else {
      window.location.href = '/dashboard';
    }
  } catch (err) {
    console.log(err);
  }
}




const paymentOptions = document.querySelectorAll('[select-payment-method]');
paymentOptions.forEach( option => {
    option.addEventListener('click', (event) => {
        console.log(event);
        selectPaymentMethod = option.id;
        if(selectPaymentMethod == 'payment-1'){
            console.log('cod');
        }else if(selectPaymentMethod == 'payment-2'){
            console.log('bank');
        }else if(selectPaymentMethod == 'payment-3'){
            console.log('wallet');
        }else {
            console.log('please select a payment method');
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
  


function razorpay(){

$(document).ready(function() {
    $.ajax({
      url: "/create/orderId",
      method: "POST",
      data: JSON.stringify({ amount: productTotal*100 }),
      contentType: "application/json",
      success: function(response) {
        orderId = response.orderId;
        console.log(orderId);
        console.log(productTotal);
        $("button").show();
  
        var options = {
          "key": "rzp_test_ODVEghJRjenb9A",
          "amount": "200000",
          "currency": "INR",
          "name": "Margin",
          "description": "Test Transaction",
          "image": "https://example.com/your_logo",
          "order_id": orderId,
          "handler": function(response) {
            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature);
            checkoutSend( userId, formData );
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

        rzp1.on('payment.failed', function(response) {
          alert('payment failed');
          alertMessageError('Payment failed');
          console.log(response.error.code);
          console.log(response.error.description);
          console.log(response.error.source);
          console.log(response.error.step);
          console.log(response.error.reason);
          console.log(response.error.metadata.order_id);
          console.log(response.error.metadata.payment_id);
        });

        rzp1.on('payment.error', function (response) {
          alert('payment error');
          console.log('Payment error:', response.error);
        });

        rzp1.open();
      }
    });
  });
  return true;
}