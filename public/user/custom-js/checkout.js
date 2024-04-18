
const checkoutForm = document.querySelector('#checkout-order');
let selectPaymentMethod = 'payment-1';

checkoutForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {};
    const landmark = document.querySelector('.landmark');
    const orderNotes = document.querySelector('.order-notes');
    const userId = event.target.dataset.userId;

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
            const response = await fetch(`/checkout/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const body = await response.json()
            console.log(body)
            if(body.error){
                return showAlertError(body.error);
            }else {
                window.location.href = '/dashboard';
            }
        }else if(selectPaymentMethod === 'payment-2' || selectPaymentMethod === 'payment-3'){
            console.log('not available now');
        }else {
            console.log('some problems here');
        }
    }catch(err){
        console.log(err);
    }
});





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
            console.log('card');
        }else {
            console.log('please select a payment method');
        }
    });
});

// if (event.target.checked) {
    // const addressId = event.target.dataset.addressId;
    // fetch(`/address/preffered/${addressId}`)
        // .then((response) => response.json())
        // .then(data => console.log(data))
        // .catch( err => console.log(err))
// }






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
  


var orderId ;
$(document).ready(function(){
    var settings = {
  "url": "/create/orderId",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Content-Type": "application/json"
  },
  "data": JSON.stringify({
    "amount": productTotal,
  }),
};

//creates new orderId everytime
$.ajax(settings).done(function (response) {

  orderId=response.orderId;
  console.log(orderId);
  console.log(productTotal);
  $("button").show();
});
});


document.getElementById('rzp-button1').onclick = function(e){
    var options = {
        "key": "rzp_test_ODVEghJRjenb9A", // Enter the Key ID generated from the Dashboard
        "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Acme Corp",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": "order_IluGWxBm9U8zJ8", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature)
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };


    $.ajax(settings).done(function (response) {

        alert(JSON.stringify(response));
    });

    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
    });

    rzp1.open();
    e.preventDefault();

}