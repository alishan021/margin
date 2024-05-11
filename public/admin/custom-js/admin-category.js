
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
            console.log(response)
            if(response.ok){
                location.reload();
                successMessage('create category sucessfully');
            }else{
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || 'Failed to create category');
            }
       }catch(error){
            console.error('Error:', error);
            failureMessage(error.message);
       }
        
    })



    const delBtns = document.querySelectorAll('.btn-delete');

    delBtns.forEach((button) => {
        button.addEventListener('click', async (event) => {
            try {
                const conform = await confirmIt('do you want to delete the category', "YES");
                console.log('confi : ' + conform.isConfirmed );
                if(!conform){
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
                console.log('error : ' + err);
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
                console.error('Error:', error);
                return failureMessage( error );
            });
        });
    });



    const editBtn = document.querySelectorAll('.btn-edit');
    editBtn.forEach(button => {
        button.addEventListener('click', function() {
            const updateButton = document.querySelector('.btn-update');
            const categoryId = this.dataset.categoryId;

            console.log(categoryId);

            fetch(`/admin/category/${categoryId}`)
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    return failureMessage(data.error);
                }
                console.log(data);
                const categoryInput = document.querySelector('#category');
                categoryInput.setAttribute('value', data.categoryName );
                updateButton.style.display = 'flex'
                updateButton.innerHTML = 'Update';
            })
            .catch(error => {
                console.error('Error:', error);
                return failureMessage(error);
            });

            updateButton.addEventListener('click', () => {
                const updatedCategory = document.querySelector('#category').value;
                console.log(updatedCategory);
                fetch(`/admin/category/update/${categoryId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ categoryName: updatedCategory })
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
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




const displayError = (message) => {
    const msgPara = document.querySelector('.msg-para');
    msgPara.parentElement.className = 'display-error';
    msgPara.innerHTML = message;
}



const displaySucess = (message) => {
    const msgPara = document.querySelector('.msg-para');
    msgPara.parentElement.className = 'display-success';
    msgPara.innerHTML = message;
}


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