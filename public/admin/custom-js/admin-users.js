document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.activate, .block');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.dataset.userId; // Assuming userId is stored in a data attribute
            const action = this.classList.contains('block') ? false : true;

            fetch(`/admin/user-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: userId, status: action })
            })
            .then(response => {
                if (response.ok) window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
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