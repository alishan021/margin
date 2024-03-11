const btnCart = document.querySelectorAll('.btn-add-cart');

btnCart.forEach(aElement => {
    aElement.addEventListener('click', async (event) => {
        event.preventDefault();

        // Check if the clicked element is the span inside the <a> tag
        const clickedElement = event.target.tagName.toLowerCase();
        let productId = aElement.getAttribute('data-product-id');
        
        if (clickedElement === 'span') {
            // If the clicked element is the span, get the productId from its parent
            const parentElement = event.target.parentNode;
            productId = parentElement.getAttribute('data-product-id');
        }

        const quantity = document.querySelector('#qty').value;
        console.log('product Id : ' + productId)
        console.log('you clicked cart button', quantity, productId );

        const response = await fetch(`/product/cart/${productId}/${quantity}`, {
            method: 'PATCH'
        });
        const body = await response.json();

        console.log(body);
        if(body.redirect){
            window.location.href = body.redirect;
        }
        if(body.error){
            console.log(body);
        }
    });
});
