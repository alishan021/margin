const cartItemNum = document.querySelectorAll('.quantityInput');

cartItemNum.forEach( item => {
    item.addEventListener('input', async (event) => {
        const nums = item.value;
        const productId = event.target.dataset.productId;
        const userId = event.target.dataset.userId;
        console.log(nums);
        console.log(productId);
        console.log(userId);
        const response = await fetch(`/cart/product/${userId}/${productId}/${nums}`,{
            method: 'PATCH'
        })
        const body = await response.json();
        console.log(body);
    })
})




document.querySelectorAll('.remove-col').forEach(tdElement => {
    tdElement.addEventListener('click', async (event) => {
        // Check if the clicked element or any of its parents have the data-product-id attribute
        const productId = event.target.closest('.btn-remove').dataset.productId;
        console.log(productId);
        const response = await fetch(`/cart/delete/${productId}`, {
            method: 'PATCH'
        })
        const body = await response.json();
        console.log(body);
        if(body.success){
            window.location.reload();
        }
    });
});    