document.addEventListener('DOMContentLoaded', (e) => {
    timerFunc(60);
    successMessage('An OTP is sent to your email')
})

const form = document.querySelector('form');
const msgPara = document.querySelector('.msg-para');
const timer = document.querySelector('.otp-timer');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const otp = document.querySelector('[otp]').value;
    const body = { otp };

    if(isNaN(otp)){
        return failureMessage('otp must be number');
    }

    if(!timerOn) {
        failureMessage('otp time is over. resend the otp')
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
        return response.json()
    })
    .then((data) => {
        if(data.error){
            return failureMessage(data.error)
        }
            window.location.href = '/post-user';
    })
    .catch((err) =>{
        failureMessage(err.error);
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


const resentOTp = document.querySelector('#resend-otp').addEventListener('click', (event) => {
    event.preventDefault();
    if(timerOn) return failureMessage('Try after the time is finished');
    window.location.href = '/signup/otp';

})


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
  