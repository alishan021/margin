document.addEventListener('DOMContentLoaded', (e) => {
    timerFunc(60);
})

const form = document.querySelector('form');
const msgPara = document.querySelector('.msg-para');
const timer = document.querySelector('.otp-timer');

form.addEventListener('submit', (event) => {
    console.log('inside otp form');
    event.preventDefault();
    
    const otp = document.querySelector('[otp]').value;
    const body = { otp };

    if(isNaN(otp)){
        return displayError({ error: 'otp must be number'});
    }

    if(!timerOn) {
        console.log('timerOn is false');
        displayError({ error: 'otp time is over. resend the otp'})
        return timer.innerHTML = '';
    }

    fetch('/signup/otp/validate', {
        method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(body)
    })
    .then((response) =>{
        console.log(response);
        return response.json()
    })
    .then((data) => {
        console.log(data);
        if(data.error){
            return displayError(data)
        }
            window.location.href = '/post-user';
    })
    .catch((err) =>{
        console.log('some error in /singup/otp/validate')
        displayError({ error: err.error });
    })
})




const displayError = (result) => {
    msgPara.parentElement.className = 'msg-box-error'
    msgPara.style.color = 'red';
    msgPara.innerHTML = result.error;
}




let timerOn = true;

function timerFunc(remaining) {
  var m = Math.floor(remaining / 60);
  var s = remaining % 60;
  
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;
  timer.innerHTML = m + ':' + s;
  remaining -= 1;

  if(remaining <= 0){
    timerOn = false;
  }
  
  if(remaining >= 0 && timerOn) {
    setTimeout(function() {
        timerFunc(remaining);
    }, 1000);
    return;
  }
  
  // Do timeout stuff here
  const confi = confirmIt('Timeout for otp, resend the otp');
  if(confi){
    window.location.href = '/signup/otp'
  }
}
