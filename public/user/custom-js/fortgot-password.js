document.addEventListener('DOMContentLoaded', () => {
    const getOtp = document.querySelector('.get-otp');
    const otpInputBox = document.querySelector('.otp-input-box-none');
    
    getOtp.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.querySelector('[email]').value;
        if(!email){
            return failureMessage('email is required');
        }
        const body = { email };
        const result = await shareBody(body);
        if(result){
            if(!timerRunning){
                timerFunc(60);
            }
            successMessage('A otp is sent to your email')
            getOtp.className = 'send-otp';
            otpInputBox.className = 'otp-input-box';
            getOtp.innerHTML = 'submit';
            const btnSubmit = document.querySelector('.send-otp');
            if(!timerOn) {
                failureMessage('otp time is over. resend the otp')
                return timer.innerHTML = '';
            }
            btnSubmit.addEventListener('click', async () => {
                const otp = document.querySelector('[otp]').value;
                const body2 = { email, otp };
                const result2 = await shareBody2(body2);
                if(!result2){
                    failureMessage('invalid otp');
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
            failureMessage( result.error );
            return false;
         }
        return { success: true };
     }
     catch (err) {
         console.log(err);
         failureMessage(err);password
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
            failureMessage( data.error );
            return false;
         }
        return { success: true };
     }
     catch (err) {
         console.log(err);
         failureMessage(err.message);
     }
 }


 const resendOtp = document.querySelector('#resend-otp');

 resendOtp.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.querySelector('[email]').value;
    if(!email){
        return failureMessage('email is required');
    }
    if(timerOn){
        return failureMessage('Try after the time finished')
    }
    const result = fetch('/resend-otp');
    clearTimeout(timerId);
    successMessage('A otp is sent to your email')
    timerOn = true;
    timerFunc(60);
 })


//  const resendOTP = document.querySelector('#resend-otp').addEventListener('click', async (event) => {
//     event.preventDefault();
//     if(remaining > 1){
//         failureMessage('Time is not finished');
//     }else {
//         window.location.href = '/resend-otp';
//     }
//  })





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
    failureMessage('otp time is finished, resent otp');
  }
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
  