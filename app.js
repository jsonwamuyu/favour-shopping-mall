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

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showError("All fields are required.");
    return;
  }

  try {
    // Now that we are sure password and email fields are not empty. Fetch all the users from database(LocalStorage or server)
    const users = await fetchData("users");
    const user = users.find(u => u.email === email && u.password === password);

    // If there exist a user with such credentials
    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      if(user.role === "admin") return window.location.href = "admin.html"
      if(user.role === "manager") return window.location.href = "manager.html"
      if(user.role === "employee") return window.location.href = "employee.html"
    } else {
      showError("Inavalid email or password.")
    }

  } catch (error) {
    console.log("An error occured while login")
    showError("Unexpected error occured. Please try again.")
  }
}

// SIGN UP

// Signup Logic
async function signup(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;


  if (!role || !email | !password) {
    showError("All fields are required.")
    return;
  }

  const users = await fetchData("users");
  if (users.find(u => u.email === email)) {
    showError("Email already exists");
    return;
  }

  const newUser = { email, password, role };
  await postData("users", newUser);
  // alert("Signup successful! Redirecting to login...");
  window.location.href = "login.html";
}
