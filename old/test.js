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
  
  // Login Logic
  async function login(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const users = await fetchData("users");
    const user = users.find(u => u.email === email && u.password === password);
  
    if (!user) {
      alert("Invalid credentials");
      return;
    }
  
    // Save session and redirect
    localStorage.setItem("user", JSON.stringify(user));
    if (user.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "index.html";
    }
  }
  
  // Signup Logic
  async function signup(event) {
    event.preventDefault();
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const users = await fetchData("users");
    if (users.find(u => u.email === email)) {
      alert("Email already exists");
      return;
    }
  
    const newUser = { fullname, email, password, role: "user" };
    await postData("users", newUser);
    alert("Signup successful! Redirecting to login...");
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
  
    document.getElementById("cart-total").innerText = `Total: $${total}`;
  }
  