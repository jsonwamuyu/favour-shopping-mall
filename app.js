// Utility to fetch data from db.json
async function fetchData(resource) {
  const response = await fetch(`http://localhost:3000/${resource}`);
  return response.json();
}

// Utility to post data to db.json
async function postData(resource, data) {
  await fetch(`http://localhost:3000/${resource}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// LOGIN

function showError(message) {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';

  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 3000);
}


// Login Logic
async function login(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showError("All fields are required");
    return;
  }

  // Now that we are sure password and email fields are not empty. Fetch all the users from database(LocalStorage or server)
  const users = await fetchData("users");
  const user = users.find(u => u.email === email && u.password === password);

  // If there exist a user with such credentials
  if (user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    window.location.href = user.role === "admin" ? "admin.html" : "index.html"
  } else {
    showError("Inavalid email or password.")
  }
}

// SIGN UP

// Signup Logic
async function signup(event) {
  event.preventDefault();
  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if(!fullname || !email| !password ){
    showError("All fields are required.")
    return;
  }

  const users = await fetchData("users");
  if (users.find(u => u.email === email)) {
    showError("Email already exists");
    return;
  }

  const newUser = { fullname, email, password, role: "user" };
  await postData("users", newUser);
  // alert("Signup successful! Redirecting to login...");
  window.location.href = "login.html";
}

// Add to Cart
async function addToCart(productId) {
  const user = JSON.parse(localStorage.getItem("user"));
  const cart = await fetchData("cart");

  const existingItem = cart.find(item => item.userId === user.id && item.productId === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ userId: user.id, productId, quantity: 1 });
  }

  await postData("cart", cart);
  alert("Item added to cart");
}

// Calculate Cart Total
async function calculateCartTotal() {
  const user = JSON.parse(localStorage.getItem("user"));
  const cart = await fetchData("cart");
  const products = await fetchData("products");

  const userCart = cart.filter(item => item.userId === user.id);
  const total = userCart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + product.price * item.quantity;
  }, 0);

  document.getElementById("cart-total").innerText = `$${total}`;
}
