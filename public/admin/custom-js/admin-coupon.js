
const deleteCouponBtns = document.querySelectorAll('#coupon-remove');
deleteCouponBtns.forEach(( button ) => {
    button.addEventListener('click', async (event) => {
        const confi = confirm('Are you sure you want to delete the coupon');
        if(!confi) return;
        const couponId = event.target.getAttribute('data-coupon-id');
        console.log(couponId);
        const response = await fetch(`/admin/coupon/delete/${couponId}`, { method: 'DELETE' });
        const body = await response.json();
        console.log(body) 
        if(body.success) window.location.reload();
        else displayError(body.error);
    })
})




const msgPara = document.querySelector('.msg-para'); 

const displayError = (result) => {
    msgPara.parentElement.className = 'msg-box-error';
    msgPara.innerHTML = result;
}

const displaySuccess = (result) => {
    msgPara.parentElement.className = 'msg-box-success';
    msgPara.innerHTML = result;
}
