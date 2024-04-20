const cartButtons = document.querySelectorAll('.cart-button');

cartButtons.forEach( btnCart => {
    btnCart.addEventListener('click', async (event) => {
        const productId = event.currentTarget.dataset.productId;
        console.log(productId);
        const response = await fetch(`/cart/${productId}`, {
            method: 'PATCH',
        })
        console.log(response)
        const body = await response.json();
        console.log(body);
        if(body.rdt){
            console.log('redirect me');
            window.location.href = `/${body.rdt}`;
        }
        if(body.error){
            console.log(body.error);
            showAlertError(body.error);
        }
        if(body.message){
            showAlertSuccess(body.message);
        }
    })
})

let userSelectOption;
document.querySelector('#sortby').addEventListener('change', async (event) => {
    userSelectOption = event.target.value;
    console.log(userSelectOption);

    // window.location.href = `/product-list/${userSelectOption}`;
})



// const categorys = document.querySelectorAll('.filter-item');
// let categorySelected = [];
// categorys.forEach( category =>{
//         category.addEventListener('click',(event) => {
//             const productScript = document.getElementById('product-data');
//             console.log(productScript);
//         })
// })


const categories = document.querySelector('.filter-items');
const categoryItems = [];

categories.addEventListener('change', (event) => {
  if(event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
		if(event.target.checked) {
            categoryItems.push(event.target.dataset.categoryId);
        } else {
			categoryItems.splice(categoryItems.indexOf(event.target.dataset.categoryId), 1);
        }
        console.log(categoryItems);
    }
})

 // Initialize the noUiSlider
var slider = document.getElementById('slider');
	noUiSlider.create(slider, {
	  start: [0, 8000], // Initial values
	  connect: true,
	  range: {
	    'min': 0,
	    'max': 10000
	  }
});
let minPrice, maxPrice;
slider.noUiSlider.on('change', function(values, handle) {
  console.log('Selected values:', values);
	const priceRange = document.querySelector('#filter-price-range');
	minPrice = parseInt(values[0]), maxPrice = parseInt(values[1])
	priceRange.innerHTML = `$${minPrice} - $${maxPrice}`;
  
  // sendDataToBackend(values);
});

slider.noUiSlider.on('slide', function( values, handle){
  document.querySelector('.min-price').innerHTML = parseInt(values[0]);
  document.querySelector('.max-price').innerHTML = parseInt(values[1]);
})



const productItem = document.querySelector('.product-item');
document.querySelector('#btn-filter').addEventListener('click', async () => {
  const productSerach = document.querySelector('.product-serach').value;
  
  const response = await fetch(`/filter?sort=${userSelectOption}&search=${productSerach}&category=${categoryItems}&min=${minPrice}&max=${maxPrice}`);
  const body = await response.json();
  console.log(body);
  productItem.textContent = '';
  renderFiltered(body.data)
});


function renderFiltered(data) {
  const productContainer = document.querySelector('.product-item');
  productContainer.innerHTML = ''; // Clear previous content

  data.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = "col-6 col-md-4 col-lg-4";

      productDiv.innerHTML = `
          <div class="product product-7 text-center">
              <figure class="product-media bg-white">
                  <span class="product-label label-new">New</span>
                  <a href="/product/${product._id}">
                      <img src="/products/${product.images[0]}" alt="Product image" class="product-image px-5 py-5">
                  </a>

                  <div class="product-action-vertical">
                      <a href="#" class="btn-product-icon btn-wishlist btn-expandable"><span>add to wishlist</span></a>
                  </div>

                  <div class="product-action cart-button" data-product-id="${product._id}">
                      ${product.quantity > 0 ? 
                          `<p class="btn-product btn-cart"><span>add to cart</span></p>` :
                          `<p class="btn-product" style="background-color: #cc333363;"><span class="text-danger font-weight-bold">Out of stock</span></p>`
                      }
                  </div>
              </figure>
              <div class="product-body">
                  <h3 class="product-title"><a href="/product">${product.name}</a></h3>
                  <div class="product-price">$${product.price}</div>
              </div>
          </div>
      `;

      productContainer.appendChild(productDiv);
  });
}



const wishlistButtons = document.querySelectorAll('.btn-wishlist');
wishlistButtons.forEach(( button ) => {
    button.addEventListener('click', async () => {
        console.log('button wishlist');
        const productId = button.getAttribute('data-product-id');
        const response = await fetch(`/wishlist/${productId}`, { method: 'POST' });
        const result = await response.json();
        console.log(result);
        if(result.success) showAlertSuccess(result.message);
        else if(result.redirect) {
            showAlertError(result.error);
            setTimeout(() => window.location.href = result.redirect, 1000)
        }
        else showAlertError(result.error);
    })
})











const alertMessageError = document.getElementById('alertMessageError');
const alertMessageSuccess = document.getElementById('alertMessageSuccess');

function showAlertError(message) {
    alertMessageError.innerText = message;
    alertMessageError.style.display = 'block';
  setTimeout(() => {
    alertMessageError.style.display = 'none';
  }, 3000); 
}


function showAlertSuccess(message) {
    alertMessageSuccess.innerText = message;
    alertMessageSuccess.style.display = 'block';
    setTimeout(() => {
        alertMessageSuccess.style.display = 'none';
    }, 3000); 
}
  