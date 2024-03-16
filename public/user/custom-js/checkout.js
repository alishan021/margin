
const checkoutForm = document.querySelector('#checkout-order');

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
            return displayError(body);
        }else {
            window.location.href = '/dashboard';
        }
    }catch(err){
        console.log(err);
    }
});





const radioButtons = document.querySelectorAll('[select-payment-method]');

radioButtons.forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
            // const selectedAddress = event.target.value;
            const addressId = event.target.dataset.addressId;
            fetch(`/address/preffered/${addressId}`)
                .then((response) => response.json())
                .then(data => console.log(data))
                .catch( err => console.log(err))
        }
    });
});






const msgPara = document.querySelector('.msg-para');

const displayError = (result) => {
    msgPara.style.color = 'red';
    msgPara.innerHTML = result.error;
}


const displayMessage = (result) => {
    msgPara.innerHTML = result.message;
}