
const orderStatusAll = document.querySelectorAll('.order-status');

orderStatusAll.forEach(( orderStatus ) => {

    orderStatus.addEventListener('change', async (event) => {

        const orderId = orderStatus.getAttribute('data-order-id');
        const selectedOption = orderStatus.options[orderStatus.selectedIndex];
        const newOrderStatus = selectedOption.value;
        const newOrderStatusText = selectedOption.textContent;

        console.log(orderId);
        console.log(newOrderStatusText);

        const data = { orderStatus: newOrderStatus, orderId, newOrderStatusText };

        const response = await fetch('/admin/order-status', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        const body = await response.json();
        if(body) window.location.reload();
        console.log(body);
    });
    
})
    