
document.addEventListener('DOMContentLoaded', () => {

    console.log('inside new-password');

    const form = document.querySelector('form');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        console.log('inside new-password form');

        const password = document.querySelector('[password]').value;
        const passwordre = document.querySelector('[passwordre]').value;
        
        const body = { password, passwordre };

        if(!password || !passwordre ){
            return displayError({ error: 'all fields are required!'});
        }
        if( password.length < 6 || passwordre.length < 6 ){
            return displayError({ error: 'password must be greaterthan 6'});
        }
        if( password !== passwordre ){
            return displayError({ error: 'password is not matching!'});
        }

        const sendBodyResult = await sendbody(body);
        if(sendBodyResult){
            displaySucess({ message: 'password is change successfully'});
            setTimeout(()=> {
                window.location.href = '/';
            },1000);
        }
    })
})



const msgPara = document.querySelector('.msg-para');

const displayError = (result) => {
    msgPara.parentElement.className = 'msg-box-error';
    msgPara.innerHTML = result.error;
}

const displaySucess = (result) => {
    msgPara.parentElement.className = 'msg-box-success';
    msgPara.innerHTML = result.message;
}



const sendbody = async (reqBody) => {
    try{
        const response = await fetch('/login/new-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        });
        console.log(response);
        if(response.ok){
            const body = await response.json();
            if(body.error){
                return displayError(body);
            }
            return true;
        }
    }
    catch(err){
        console.log('error : ' + err );
    }
}