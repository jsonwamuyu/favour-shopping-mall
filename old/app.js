
// 5. app.js
const apiBase = 'http://localhost:3000';

// Fetch Products
async function fetchProducts() {
  try {
    const response = await fetch(`${apiBase}/products`);
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// Display Products
function displayProducts(products) {
  const app = document.getElementById('products');
  app.innerHTML = ""
  app.innerHTML += products.map(product => `

                <div class="product-card">
                    <img src="${product.image}" alt="" srcset=""
                        style="height: 180px; width:200px; border-radius: 0.25rem; object-fit: cover;">
                    <h5>${product.name}</h5>
                    <p>${product.price}</p>
                    <div>
                        <a href="" class="add-to-cart" onclick="addToCart(${product.id})">
                            <ion-icon name="add-outline"></ion-icon>
                            <p>Add to Cart</p>
                        </a>
                    </div>
                </div>

  `).join('');
}

// Add to Cart
async function addToCart(productId) {
  const userId = localStorage.getItem('userId');
  if (!userId) return alert('Please login first.');

  try {
    const response = await fetch(`${apiBase}/carts?userId=${userId}`);
    let cart = await response.json();

    if (!cart.length) {
      cart = { userId, items: [{ productId, quantity: 1 }] };
      await fetch(`${apiBase}/carts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart),
      });
    } else {
      const existingItem = cart.items.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
      await fetch(`${apiBase}/carts/${cart.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart),
      });
    }

    alert('Item added to cart.');
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}

// On Load
fetchProducts();
