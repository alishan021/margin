document.addEventListener('DOMContentLoaded', () => {
    const getOtp = document.querySelector('.get-otp');
    const otpInputBox = document.querySelector('.otp-input-box-none');
    
    getOtp.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.querySelector('[email]').value;
        if(!email){
            return displayError({ error: 'email is required'});
        }
        const body = { email };
        const result = await shareBody(body);
        if(result){
            if(!timerRunning){
                timerFunc(60);
            }
            displayMessage({ message: 'A otp is sent to your email'})
            getOtp.className = 'send-otp';
            otpInputBox.className = 'otp-input-box';
            getOtp.innerHTML = 'submit';
            const btnSubmit = document.querySelector('.send-otp');
            if(!timerOn) {
                displayError({ error: 'otp time is over. resend the otp'})
                return timer.innerHTML = '';
            }
            btnSubmit.addEventListener('click', async () => {
                const otp = document.querySelector('[otp]').value;
                const body2 = { email, otp };
                const result2 = await shareBody2(body2);
                if(!result2){
                    displayError({ error: 'invalid otp'});
                    timerRunning = true;
                }
                if(result2){
                    window.location.href = '/login/new-password';
                }
            }) 
            
            
        }
    })
})


let timerRunning = false;


const timer = document.querySelector('.otp-timer');
const msgPara = document.querySelector('.msg-para');
const msgBox = document.querySelector('msg-box');

const displayError = (result) => {
    msgPara.parentElement.className = 'msg-box-error';
    msgPara.innerHTML = result.error;
}


const displayMessage = (result) => {
    msgPara.parentElement.className = 'msg-box-message';
    msgPara.innerHTML = result.message;
}



const shareBody = async (body) => {
    try {
         const response = await fetch( '/login/forgot-password', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(body)
         });
         const data = await response.json();
 
         if (data.error) {
            const result = { error: data.error }
            displayError( result );
            return false;
         }
        return { success: true };
     }
     catch (err) {
         console.log(err);
         displayError(err);password
     }
 }




const shareBody2 = async (body) => {
    try {

         const response = await fetch('/login/validate-otp', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(body)
         });
         const data = await response.json();
         if (data.error) {
            displayError( data );
            return false;
         }
        return { success: true };
     }
     catch (err) {
         console.log(err);
         displayError(err);
     }
 }


 const resendOtp = document.querySelector('#resend-otp');

 resendOtp.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.querySelector('[email]').value;
    if(!email){
        return displayError({ error: 'email is required' });
    }
    const result = fetch('/resend-otp');
    clearTimeout(timerId);
    displayMessage({ message: 'A otp is sent to your email'})
    timerOn = true;
    timerFunc(60);
 })







let timerOn = true;
let timerId;

function timerFunc(remaining) {
  var m = Math.floor(remaining / 60);
  var s = remaining % 60;

  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;
  timer.innerHTML = m + ':' + s;
  remaining -= 1;

  if(remaining <= 0){
    timerOn = false;
    timerRunning = false;
  }else {
    timerRunning = true;
  }
  
  if(remaining >= 0 && timerOn) {
     timerId = setTimeout(function() {
        timerFunc(remaining);
    }, 1000);
    return;
  }
  
  if(!timerOn){
    displayError({ error: 'otp time is finished, resent otp'});
  }
}
