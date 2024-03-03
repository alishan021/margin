
document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('form');

    form.addEventListener('submit', async (event) => {
        
        try{
            event.preventDefault();
            const category = document.querySelector('#category').value;
            if(!category || category == '' ){
                return displayError({ success: false, error: 'category name is required'});
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
                displaySucess({ message: 'create category sucessfully'});
            }else{
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || 'Failed to create category');
            }
       }catch(error){
            console.error('Error:', error);
            displayError({ success: false, error: error.message });
       }
        
    })



    const delBtns = document.querySelectorAll('.btn-delete');

    delBtns.forEach((button) => {
        button.addEventListener('click', async (event) => {
            try {
                const conform = confirm('do you want to delete the category');
                console.log('confi : ' + conform );
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
                    return displaySucess({ message: 'deleted successfully'})
                }
                const body = await response.json();
            } catch (err) {
                console.log('error : ' + err);
                displayError({ error: err })
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
                    displaySucess({ message: (action)? 'list user': 'unlist user'})
                } else {
                    return displayError({ error: 'some error 89'})
                }
            })
            .catch(error => {
                console.error('Error:', error);
                return displayError({ error: error });
            });
        });
    });



    const editBtn = document.querySelectorAll('.btn-edit');
    editBtn.forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.dataset.categoryId;

            console.log(categoryId);
            const updateButton = document.querySelector('.btn-update');

            fetch(`/admin/category/${categoryId}`)
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    return displayError({ error: data.error });
                }
                console.log(data);
                const categoryInput = document.querySelector('#category');
                categoryInput.setAttribute('value', data.categoryName );
                updateButton.style.display = 'flex'
                updateButton.innerHTML = 'Update';
            })
            .catch(error => {
                console.error('Error:', error);
                return displayError({ error: error });
            });

            updateButton.addEventListener('click', () => {
                const updatedCategory = document.querySelector('#category').value;
                fetch(`/admin/category/update/${categoryId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ categoryName: updatedCategory })
                })
                .then((response => response.json()))
                .then(data => {
                    if(data.error){
                        displayError({ error: data.error })
                    }
                    return displaySucess({ message: 'product updated successfully' });
                })
            })
        });
    });

});




const displayError = (result) => {
    const msgPara = document.querySelector('.msg-para');
    msgPara.parentElement.className = 'display-error';
    msgPara.innerHTML = result.error;
}



const displaySucess = (result) => {
    const msgPara = document.querySelector('.msg-para');
    msgPara.parentElement.className = 'display-success';
    msgPara.innerHTML = result.message;
}