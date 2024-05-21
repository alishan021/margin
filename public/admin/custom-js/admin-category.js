
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.querySelector('form');

    form.addEventListener('submit', async (event) => {
        
        try{
            event.preventDefault();
            const category = document.querySelector('#category').value;
            if(!category || category == '' ){
                return failureMessage('category name is required');
            }

            const response = await fetch('/admin/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category })
            })
            if(response.ok){
                location.reload();
                successMessage('create category sucessfully');
            }else{
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || 'Failed to create category');
            }
       }catch(error){
            failureMessage(error.message);
       }
        
    })



    const delBtns = document.querySelectorAll('.btn-delete');

    delBtns.forEach((button) => {
        button.addEventListener('click', async (event) => {
            try {
                const conform = await confirmIt('do you want to delete the category', "YES");
                if(!conform.isConfirmed) {
                    return ;
                }
                const categoryId = button.getAttribute('data-category-id');
                const response = await fetch(`/admin/category/${categoryId}`,{
                    method: 'DELETE'
                    });
                if(response.ok){
                    const categoryRow = button.closest('tr');
                    categoryRow.remove();
                    return successMessage('deleted successfully')
                }
                const body = await response.json();
            } catch (err) {
                failureMessage( err )
            }
        });
    });



    const buttons = document.querySelectorAll('.btn-list, .btn-unlist');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.dataset.categoryId;
            const action = this.classList.contains('btn-unlist') ? false : true;

            fetch(`/admin/category`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ categoryId, action })
            })
            .then(response => {
                if (response.ok) {
                    location.reload();
                    successMessage((action)? 'list user': 'unlist user')
                } else {
                    return failureMessage('some error 89')
                }
            })
            .catch(error => {
                return failureMessage( error );
            });
        });
    });



    const editBtn = document.querySelectorAll('.btn-edit');
    editBtn.forEach(button => {
        button.addEventListener('click', function() {
            const updateButton = document.querySelector('.btn-update');
            const categoryId = this.dataset.categoryId;


            fetch(`/admin/category/${categoryId}`)
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    return failureMessage(data.error);
                }
                const categoryInput = document.querySelector('#category');
                categoryInput.setAttribute('value', data.categoryName );
                updateButton.style.display = 'flex'
                updateButton.innerHTML = 'Update';
            })
            .catch(error => {
                return failureMessage(error);
            });

            updateButton.addEventListener('click', () => {
                const updatedCategory = document.querySelector('#category').value;
                fetch(`/admin/category/update/${categoryId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ categoryName: updatedCategory })
                })
                .then(response => response.json())
                .then(data => {
                    if(data.error){
                        return failureMessage(data)
                    }else if(data.success){
                        successMessage('product updated successfully');
                        setTimeout(() => window.location.reload(), 1000 );
                    }else {
                        return failureMessage('something unknown')
                    }
                })
            })
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