document.addEventListener('DOMContentLoaded', () => {
    const getOtp = document.querySelector('.get-otp');
    const otpInputBox = document.querySelector('.otp-input-box-none');

    getOtp.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.querySelector('[email]').value;
        if(!email){
            return displayError({ message: 'email is required'});
        }
        const body = { email };
        const result = await shareBody(body);
        if(result){
            displayMessage({ message: 'A otp is sent to your email'})
            getOtp.className = 'send-otp';
            otpInputBox.className = 'otp-input-box';
            getOtp.innerHTML = 'submit';
            const btnSubmit = document.querySelector('.send-otp');
            btnSubmit.addEventListener('click', async () => {
                const otp = document.querySelector('[otp]').value;
                const body2 = { email, otp };
                const result2 = await shareBody2(body2);
                if(result2){
                    window.location.href = '/login/new-password';
                }
            }) 
            

        }
    })
})



const msgPara = document.querySelector('.msg-para');
const msgBox = document.querySelector('msg-box');

const displayError = (result) => {
    msgPara.parentElement.className = 'msg-box-error';
    msgPara.innerHTML = result.message;
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
            const result = { message: data.error }
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
         console.log('sharebody 2');
         if (data.error) {
            const result = { message: data.error }
            displayError( result );
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
    console.log('Inside the link');
    const email = document.querySelector('[email]').value;
    if(!email){
        return displayError({ message: 'email is required' });
    }
    const result = fetch('/resend-otp');
 })