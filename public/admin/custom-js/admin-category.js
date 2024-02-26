
document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('form');

    form.addEventListener('submit', async (event) => {
        
        try{
            event.preventDefault();
            const category = document.querySelector('#category').value;
            if(!category || category == '' ){
                return displayError({ success: false, message: 'category name is required'});
            }

            const response = await fetch('/admin/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category })
            })
            if(response.ok){
                console.log(response)
                location.reload();
                displaySucess({ message: 'create category'})
            }
            const body = await response.json();
            console.log(body);
            if(body.error){
                return displayError({ success:false, message: body.error});
            }
       }catch(err){
            console.log('error : ' + err );
       }
        
    })



    const delBtns = document.querySelectorAll('.btn-delete');

    delBtns.forEach((button) => {
        button.addEventListener('click', async (event) => {
            try {
                const conform = confirm('do you want to delete the category');
                console.log('confi : ' + conform );
                if(!confi){
                    return conform;
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
                displayError({ message: err })
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
                    return displayError({ message: 'some error 89'})
                }
            })
            .catch(error => {
                console.error('Error:', error);
                return displayError({ message: error });
            });
        });
    });

});




const displayError = (result) => {
    const msgPara = document.querySelector('.msg-para');
    msgPara.parentElement.className = 'display-error';
    msgPara.innerHTML = result.message;
}



const displaySucess = (result) => {
    const msgPara = document.querySelector('.msg-para');
    msgPara.parentElement.className = 'display-success';
    msgPara.innerHTML = result.message;
}