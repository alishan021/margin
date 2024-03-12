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




// document.addEventListener('DOMContentLoaded', (event) => {
//     console.log('hai hellow');
// 	const user = <%= user %>;
// 	console.log(user);
// })


const navLinks = document.querySelectorAll('.nav-link');
const editDiv = document.querySelector('[edit-div]');
const editButtons = document.querySelectorAll('.btn-edit');
const tabPane = document.querySelectorAll('.tab-pane');
const editLink = document.querySelector('[edit-link]');
const editAddress = document.querySelector('[address-edit]');

editButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
        try {
            const addressId = button.getAttribute('data-address-id');
            const index = button.getAttribute('data-index');
            console.log(addressId);
            
            const confi = confirm('Are you sure you want to edit this address?');
            if (!confi) return;

            tabPane.forEach( item => item.classList.remove('show', 'active'));
            editDiv.classList.add('show', 'active');
            navLinks.forEach( item => item.classList.remove('active'));
            editLink.setAttribute('aria-selected', 'true');
            editLink.classList.add('active')

            const response = await fetch(`/address/edit/${addressId}`);
            
            // Parse JSON response
            const body = await response.json();
            console.log(body);
            for (const key in body) {
                if (body.hasOwnProperty(key)) {
                    const value = body[key];
                    const inputElement = document.getElementById(key);
                    if (inputElement) {
                        inputElement.value = value;
                    }
                }
            }
            const landmark = document.querySelector('#landmark');
            landmark.value = body.landmark;

            editAddress.addEventListener('submit', async (event) => {
                try{
                    const formData = {};
                    const userId = event.target.dataset.userId;

                    for (const input of event.target.elements) {
                        if (input.tagName !== 'INPUT' || !input.name) {
                            continue;
                        }
                        formData[input.name] = input.value;
                    }
                    formData[landmark.name] = landmark.value;
                
                        console.log('haii diidi didiid diid')
                        const responseUpdate = await fetch(`/address/update/${addressId}/${userId}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(formData)
                        })
                        const bodyupdate = await responseUpdate.json()
                        console.log(bodyupdate)
                        if(bodyupdate.error){
                            return displayError(bodyupdate);
                        }else {
                            window.location.href = '/dashboard#tab-address';
                        }
                }catch(err){
                    console.log(err);
                }
            })

        } catch (err) {
            console.log(err);
        }
    });
});



const addAddress = document.querySelector('.add-address-link');
const addLink = document.querySelector('add-link');
const addDiv = document.querySelector('[add-div]');

addAddress.addEventListener('click', (event) => {
    console.log('haiiiii')
    // event.preventDefault();
    tabPane.forEach( item => item.classList.remove('show', 'active'));
    addDiv.classList.add('show', 'active');
    navLinks.forEach( item => item.classList.remove('active'));
    addLink.setAttribute('aria-selected', 'true');
    addLink.classList.add('active');

})





const msgPara = document.querySelector('.msg-para');

const displayError = (result) => {
    msgPara.style.color = 'red';
    msgPara.innerHTML = result.error;
}


const displayMessage = (result) => {
    msgPara.innerHTML = result.message;
}






document.addEventListener('DOMContentLoaded', (event) => {
    console.log(window.location.hash);
})