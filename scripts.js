

// Cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const downloadButton = document.getElementById('download-btn');
let cartTotal = 0;

addToCartButtons.forEach((button) => {
  button.addEventListener('click', addToCart);

addToCartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Find the parent product column of the clicked button
    const productColumn = button.closest('.product-column');

    // Toggle the 'selected' class on the product column
    productColumn.classList.toggle('selected');
  });
});

});

function addToCart(e) {
  const product = e.target.previousElementSibling;
  const designNo = product.querySelector('p').textContent.split(' ')[2];

  // Check if item is already in the cart
  const isInCart = Array.from(cartItemsContainer.children).some((item) => {
    return item.dataset.designNo === designNo;
  });

  if (isInCart) {
    // Remove item from cart
    removeItemFromCart(designNo);
    e.target.textContent = 'Add to Cart';
    e.target.style.backgroundColor = '#333';
  } else {
    // Add item to cart
    const price = getPriceByDesignNo(designNo); // Get the price dynamically based on the design number
    const cartItem = createCartItem(designNo, price);
    cartItemsContainer.appendChild(cartItem);
    e.target.textContent = 'Remove from Cart';
    e.target.style.backgroundColor = 'orange';
  }

  // Calculate and update cart total
  calculateCartTotal();
}

function getPriceByDesignNo(designNo) {
  // Set the price dynamically based on the design number
  // You can implement your logic here to fetch the price from a database or any other data source
  // For demonstration purposes, I'll use a simple mapping
  const priceMapping = {
    '608': 40,
    '609': 30,
    '610': 20,
    '611': 15,
    '612':10,
    '613':10,
    '614':10,
    '615':10,
    '616':10,
    '617':10,
    // Add more design numbers and prices as needed
  };

  return priceMapping[designNo] || 0;
}

function createCartItem(designNo, price) {
  const cartItem = document.createElement('div');
  cartItem.classList.add('cart-item');
  cartItem.dataset.designNo = designNo;

  const itemInfo = document.createElement('p');
  itemInfo.textContent = designNo;

  const quantityInput = document.createElement('input');
  quantityInput.type = 'number';
  quantityInput.value = 1;
  quantityInput.classList.add('Qty-input');
  quantityInput.addEventListener('input', updateCartItemTotal);

  // Create a span element for the suffix
  const suffixSpan = document.createElement('span');
  suffixSpan.textContent = ' pc';

  // Wrap the quantity input and the suffix span in a container
  const quantityContainer = document.createElement('div');
  quantityContainer.classList.add('quantity-container');
  quantityContainer.appendChild(quantityInput);
  quantityContainer.appendChild(suffixSpan);

  const priceElement = document.createElement('p');
  priceElement.classList.add('price');
  priceElement.textContent = `1 Pc: ${price} rs`;

  const weightInput = document.createElement('input');
weightInput.type = 'number';

weightInput.classList.add('weight-input');
weightInput.addEventListener('', updateCartItemTotal);
weightInput.placeholder='weight';

const weightUnitSelect = document.createElement('select');
weightUnitSelect.classList.add('weight-unit-select');

const milliOption = document.createElement('option');
milliOption.value = 'milli';
milliOption.textContent = 'Milli';

const gramOption = document.createElement('option');
gramOption.value = 'gram';
gramOption.textContent = 'Gram';

weightUnitSelect.appendChild(milliOption);
weightUnitSelect.appendChild(gramOption);

const weightContainer = document.createElement('div');
weightContainer.classList.add('weight-container');
weightContainer.appendChild(weightInput);
weightContainer.appendChild(weightUnitSelect);

  const totalElement = document.createElement('p');
  totalElement.classList.add('total');
  totalElement.textContent = `${price} rs`;

  cartItem.appendChild(itemInfo);
  cartItem.appendChild(quantityContainer);
  cartItem.appendChild(priceElement);
  cartItem.appendChild(weightContainer);
  cartItem.appendChild(totalElement);

  return cartItem;
}

function removeItemFromCart(designNo) {
  const cartItems = Array.from(cartItemsContainer.children);
  const itemToRemove = cartItems.find(
    (item) => item.dataset.designNo === designNo
  );
  cartItemsContainer.removeChild(itemToRemove);
}

function updateCartItemTotal(e) {
  const quantity = parseInt(e.target.value);
  const cartItem = e.target.closest('.cart-item');
  const priceElement = cartItem.querySelector('.price');
  const totalElement = cartItem.querySelector('.total');
  const price = parseFloat(priceElement.textContent.split(' ')[2]); // Extract the price from the text

  
  if (isNaN(quantity) || quantity < 1) {
    e.target.value = 1; // Reset the quantity to 1
    quantity = 1; // Update the quantity variable
  }

  const total = price * quantity;
  totalElement.textContent = `${total} rs`;

  calculateCartTotal();
}
// Refresh button functionality
const refreshButton = document.getElementById('refresh-btn');
refreshButton.addEventListener('click', refreshCartPrices);

function refreshCartPrices() {
  // Get all cart items
  const cartItems = Array.from(cartItemsContainer.children);

  // Iterate through each cart item and update the prices
  cartItems.forEach((item) => {
    const quantity = parseInt(item.querySelector('.Qty-input').value);
    const priceElement = item.querySelector('.price');
    const totalElement = item.querySelector('.total');
    const price = parseFloat(priceElement.textContent.split(' ')[2]); // Extract the price from the text

    if (!isNaN(quantity) && quantity >= 1) {
      const total = price * quantity;
      totalElement.textContent = `${total} rs`;
    } else {
      // Reset the quantity to 1 and set the total to the default price
      item.querySelector('.Qty-input').value = 1;
      totalElement.textContent = `${price} rs`;
    }
  });

  // Calculate and update the cart total
  calculateCartTotal();
}




function calculateCartTotal() {
  const cartItems = Array.from(cartItemsContainer.children);
  let total = 0;

  cartItems.forEach((item) => {
    const quantity = parseInt(item.querySelector('.Qty-input').value);
    const price = parseFloat(item.querySelector('.price').textContent.split(' ')[2]); // Extract the price from the text
    
    total += price * quantity;
  });

  document.getElementById('total-amount').textContent = total;
}

// Download screenshot functionality
downloadButton.addEventListener('click', downloadScreenshot);

function downloadScreenshot() {
  const cartPage = document.querySelector('.cart-page');
  // Hide the elements that show price per single piece
  const priceElements = cartPage.querySelectorAll('.price');
  priceElements.forEach((element) => {
    element.classList.add('hide-price');
  });
  
  // Generate the filename with timestamp
  const dateTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
  });
  const filename = `Cart_Screenshot_${dateTime.replace(/:/g, '')}.jpeg`; // Change the extension to .jpeg

  // Add the "Ravi Gold works" heading and timestamp to the cart page
  const headingElement = document.createElement('h2');
headingElement.textContent = 'Ravi Gold works';
cartPage.insertBefore(headingElement, cartPage.firstChild);

const timestampElement = document.createElement('p');
timestampElement.textContent = dateTime;

const lineElement = document.createElement('hr');

cartPage.appendChild(lineElement);
cartPage.appendChild(timestampElement);

  // Use html2canvas to capture the cart page as an image
  html2canvas(cartPage)
    .then((canvas) => {
      // Convert the canvas to a data URL
      const dataURL = canvas.toDataURL('image/jpeg');

      // Create a download link and initiate the download
      const element = document.createElement('a');
      element.setAttribute('href', dataURL);
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      // Remove the "Ravi Gold works" heading and timestamp from the cart page
      cartPage.removeChild(headingElement);
      cartPage.removeChild(timestampElement);
    })
    .catch((error) => {
      console.log('Screenshot capture error:', error);
    });
}




//const dateTime = new Date().toLocaleString('en-IN', {
 // timeZone: 'Asia/Kolkata',
//});