
const userDetailsForm = document.querySelector('.user-details-form');

userDetailsForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
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
    console.log(data.message);
    if(data.error){
        return failureMessage(data.error);
    }else if(data.success){
        // window.location.href = '/dashboard';
        return successMessage(data.message);
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
            return failureMessage(body.error);
        }else if(body.success){
            successMessage(body.message)
            console.log(body);
            setTimeout(() => window.location.href = '/dashboard', 1000);
        }
    }catch(err){
        console.log(err);
    }
});


const deleteBtn = document.querySelectorAll('.btn-delete')

deleteBtn.forEach( button => {
    button.addEventListener('click', async (event) => {
        try{
            // event.Propagation();
            const addressId = button.getAttribute('data-address-id');
            if(addressId){
                const confi = await confirmIt('are you sure, you want to delete the address', 'Delete');
                console.log(confi.isConfirmed);
                if(!confi.isConfirmed) return;
            }
            const response = await fetch(`/address/${addressId}`,{ method: 'DELETE'})
            const body = await response.json()
            console.log(body);
            if(body.success){
                successMessage(body.message);
                setTimeout(() => window.location.href = '/dashboard', 1000);
            }else {
                console.log(body.error);
                failureMessage(body.error);
            }
        }catch(err){
            console.error(err);
        }
    })
});



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
            
            const confi = await confirmIt('Are you sure you want to edit this address?', 'Edit');
            console.log(confi.isConfirmed);
            if (!confi.isConfirmed) return;

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
                event.preventDefault();
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
                            return failureMessage(bodyupdate.error);
                        }
                        if(bodyupdate.success){
                            successMessage(bodyupdate.message);
                            setTimeout(() => window.location.href = '/dashboard', 1000);
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
    // event.preventDefault();
    tabPane.forEach( item => item.classList.remove('show', 'active'));
    addDiv.classList.add('show', 'active');
    navLinks.forEach( item => item.classList.remove('active'));
    addLink.setAttribute('aria-selected', 'true');
    addLink.classList.add('active');

})



const orderBoxs = document.querySelectorAll('.order-box');

orderBoxs.forEach(orderBox => {
    orderBox.addEventListener('click', async (event) => {
        const orderId = orderBox.getAttribute('data-order-id');
        console.log(orderId);        
        console.log("Order box clicked");
        // const response = await fetch(`/order/${orderId}`);
        // const data = await response.json();
        // console.log(data);
        // if(data.redirectUrl){
        window.location.href = `/order/${orderId}`;
        // }
    });
});



// const hellowAsk = document.querySelector('.hellow-ask');
// hellowAsk.addEventListener('click', (e) => {
//     console.log('hellow');
// })







const alertMessageError = document.getElementById('alertMessageError');
const alertMessageSuccess = document.getElementById('alertMessageSuccess');

function showAlertError(message) {
    alertMessageError.innerText = message;
    alertMessageError.style.display = 'block';
  setTimeout(() => {
    alertMessageError.style.display = 'none';
  }, 3000); 
}


function showAlertSuccess(message) {
    alertMessageSuccess.innerText = message;
    alertMessageSuccess.style.display = 'block';
    setTimeout(() => {
        alertMessageSuccess.styleshow.display = 'none';
    }, 3000); 
}





function confirmIt( message, confirmText ) {
    const result = Swal.fire({
      text: message,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmText,
      position: "top",
      customClass: {
        actions: 'custom-actions-class'
      }
    });
    return result;
  };



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

  




const btnWallet = document.querySelector('.btn-wallet');
btnWallet.addEventListener('click', (event) => {
    console.log('your wallet')
    const amount = document.querySelector('#wallet-amount').value;
    if(amount <= 0 ) failureMessage('Amount must be greater than zero');
    const userId = event.target.getAttribute('data-user-id');
    razorpay( userId, +amount);
})

function razorpay( userId, amount){
    try{

        $(document).ready(function() {
            $.ajax({
          url: "/create/orderId",
          method: "POST",
          data: JSON.stringify({ amount: amount*100 }),
          contentType: "application/json",
          success: function(response) {
            orderId = response.orderId;
            console.log(orderId);
            $("button").show();
      
            var options = {
              "key": "rzp_test_ODVEghJRjenb9A",
              "amount": "200000",
              "currency": "INR",
              "name": "Margin",
              "description": "Test Transaction",
              "image": "https://example.com/your_logo",
              "order_id": orderId,
              "handler": function(response) {
                console.log(response.razorpay_payment_id);
                console.log(response.razorpay_order_id);
                console.log(response.razorpay_signature);
                addWalletAmount( userId, amount);
              },
              "prefill": {
                "name": "Muhammed Alishan",
                "email": "alishan.example@gmail.com",
                "contact": "0000000000"
              },
              "notes": {
                "address": "Razorpay Corporate Office"
              },
              "theme": {
                "color": "#3399cc"
              }
            };
            
            var rzp1 = new Razorpay(options);
    
            rzp1.on('payment.failed', function(response) {
              console.log('payment failed');
              failureMessage('Payment Failed');
              console.log(response.error.code);
              console.log(response.error.description);
              console.log(response.error.source);
              console.log(response.error.step);
              console.log(response.error.reason);
              console.log(response.error.metadata.order_id);
              console.log(response.error.metadata.payment_id);
            });
    
            rzp1.on('payment.error', function (response) {
                alert('payment error');
                console.log('Payment error:', response.error);
            });
    
            rzp1.open();
          }
        });
      });
      return true;
    }catch(err){
        alertMessageError(err);
    }
}



async function addWalletAmount(userId, amount) {
    try {
      const response = await fetch(`/wallet/${userId}/${amount}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const body = await response.json();
      if (body.error) {
        return failureMessage(body.error);
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.log(err);
    }
  }