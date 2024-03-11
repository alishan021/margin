const userDetailsForm = document.querySelector('.user-details-form');

userDetailsForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    
    const formDetils = $('.user-details-form').serialize();

    console.log(formDetils)

    const response = await fetch('/dashboard/user-details', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        //  'Content-Type': 'application/json'
        },
        body: formDetils
    })
    const data = await response.json();
    console.log(data);
    if(data.error){
        return displayError(data);
    }else {
        // window.location.href = '/dashboard';
        return displayMessage(data);
    }
});



const addressForm = document.querySelector('[address-add]');

addressForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {};
    const landmark = document.querySelector('.landmark');
    const userId = event.target.dataset.userId;

    for (const input of event.target.elements) {
        if (input.tagName !== 'INPUT' || !input.name) {
            continue;
        }
        formData[input.name] = input.value;
    }
    formData[landmark.name] = landmark.value;
    try{
        console.log('haii diidi didiid diid')
        const response = await fetch(`/address/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const body = await response.json()
        console.log(body)
        if(body.error){
            return displayError(data);
        }else {
            window.location.href = '/dashboard';
        }
    }catch(err){
        console.log(err);
    }
});


const deleteBtn = document.querySelectorAll('.btn-delete')

deleteBtn.forEach( button => {
    button.addEventListener('click', async (event) => {
        try{
            event.stopImmediatePropagation()
            const addressId = button.getAttribute('data-address-id');
            if(addressId){
                const confi = confirm('are you sure, you want to delete the address');
                if(!confi) return;
            }
            const response = await fetch(`/address/${addressId}`,{ method: 'DELETE'})
            const body = await response.json()
            console.log(body);
            if(body.success){
                window.location.reload();
            }else {
                console.log(body.error);
            }
        }catch(err){
            console.error(err);
        }
    })
});




const msgPara = document.querySelector('.msg-para');

const displayError = (result) => {
    msgPara.style.color = 'red';
    msgPara.innerHTML = result.error;
}


const displayMessage = (result) => {
    msgPara.innerHTML = result.message;
}