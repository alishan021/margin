
const orderStatusAll = document.querySelectorAll('.order-status');

orderStatusAll.forEach(( orderStatus ) => {

    orderStatus.addEventListener('change', async (event) => {

        const orderId = orderStatus.getAttribute('data-order-id');
        const selectedOption = orderStatus.options[orderStatus.selectedIndex];
        const newOrderStatus = selectedOption.value;

        console.log(orderId);
        console.log(newOrderStatus);

        let orderStatusValue = false, returnedValue = false, orderValidValue = false;

        if(newOrderStatus === 'arrive') { orderStatusValue = false, returnedValue = false, orderValidValue = true }
        else if(newOrderStatus === 'deliver') { orderStatusValue = true, returnedValue = false, orderValidValue = false }
        else if(newOrderStatus === 'cancel') { orderStatusValue = false, returnedValue = false, orderValidValue = false }
        else if(newOrderStatus === 'return') { orderStatusValue = false, returnedValue = true, orderValidValue = false }

        const data = { 
            orderStatus: orderStatusValue, 
            returned : returnedValue, 
            orderValid : orderValidValue, 
            orderId, 
        };

        console.log(data);

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
    