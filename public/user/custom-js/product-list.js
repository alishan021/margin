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
    })
})