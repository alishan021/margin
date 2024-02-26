
const form = document.querySelector('form');
const msgBox = document.querySelector('.msg-box');

form.addEventListener('submit', (event) => {
    console.log('inside otp form');
    event.preventDefault();
    
    const otp = document.querySelector('[otp]').value;
    const body = { otp };

    if(isNaN(otp)){
        return displayError({ message: 'otp must be number'});
    }

    fetch('/signup/otp/validate', {
        method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(body)
    })
    .then((response) => response.json())
    .then((data) => {
        if(data.error){
            return displayError({ message: data.error })
        }
            window.location.href = '/post-user';
    })
})




const displayError = (result) => {
    msgBox.className.className = 'msg-box-error'
    msgBox.innerHTML = result.message;
}