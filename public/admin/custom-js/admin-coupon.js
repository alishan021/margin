
const deleteCouponBtns = document.querySelectorAll('#coupon-remove');
deleteCouponBtns.forEach(( button ) => {
    button.addEventListener('click', async (event) => {
        const confi = await confirmIt('Are you sure you want to delete the coupon', 'YES');
        if(!confi.isConfirmed) return;
        const couponId = event.target.getAttribute('data-coupon-id');
        const response = await fetch(`/admin/coupon/delete/${couponId}`, { method: 'DELETE' });
        const body = await response.json();
        if(body.success) window.location.reload();
        else failureMessage(body.error);
    })
});


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


  function confirmIt( message, confirmText ) {
    const result = Swal.fire({
      text: message,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmText || "OK",
      position: "top",
      customClass: {
        actions: 'custom-actions-class'
      }
    });
    return result;
  };