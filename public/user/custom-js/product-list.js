const cartButtons = document.querySelectorAll('.cart-button');

cartButtons.forEach( btnCart => {
    btnCart.addEventListener('click', async (event) => {
        const productId = event.currentTarget.dataset.productId;
        console.log(productId);
        const response = await fetch(`/cart/${productId}`, {
            method: 'PATCH',
        })
        console.log(response)
        const body = await response.json();
        console.log(body);
        if(body.rdt){
            console.log('redirect me');
            window.location.href = `/${body.rdt}`;
        }
        if(body.error){
            console.log(body.error);
            showAlertError(body.error);
        }
        if(body.message){
            showAlertSuccess(body.message);
        }
    })
})


// document.querySelector('#sortby').addEventListener('change', async (event) => {
//     let userSelectOption = event.target.value;
//     console.log(userSelectOption);

//     window.location.href = `/product-list/${userSelectOption}`;
// })



// const categorys = document.querySelectorAll('.filter-item');
// let categorySelected = [];
// categorys.forEach( category =>{
//         category.addEventListener('click',(event) => {
//             const productScript = document.getElementById('product-data');
//             console.log(productScript);
//         })
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
        alertMessageSuccess.style.display = 'none';
    }, 3000); 
}
  