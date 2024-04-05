
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
  