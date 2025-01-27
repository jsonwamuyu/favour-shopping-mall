const { login } = require('./app'); // Adjust path if needed
const { fetchData } = require("./fetchData");

// Mock fetchData and browser-specific features
jest.mock('./fetchData');

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

Object.defineProperty(window, "location", {
  value: {
    href: "",
  },
  writable: true,
});

describe("Login Function Tests", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="login-form">
        <input id="email" value="" />
        <input id="password" value="" />
        <div id="error-message"></div>
      </form>
    `;
  });

  it("should show an error if fields are empty", async () => {
    const event = { preventDefault: jest.fn() };
    await login(event);

    const errorMessage = document.getElementById("error-message").textContent;
    expect(errorMessage).toBe("All fields are required.");
  });

//   it("should log in as admin when valid admin credentials are provided", async () => {
//     fetchData.mockResolvedValueOnce([
//       { email: "admin@example.com", password: "adminpass", role: "admin" },
//     ]);

//     document.getElementById("email").value = "admin@example.com";
//     document.getElementById("password").value = "adminpass";

//     const event = { preventDefault: jest.fn() };
//     await login(event);

//     expect(localStorage.setItem).toHaveBeenCalledWith(
//       "loggedInUser",
//       expect.stringContaining("admin@example.com")
//     );
//     expect(window.location.href).toBe("admin.html");
//   });


  it("should log in as admin when valid admin credentials are provided", async () => {
    // Mocking fetchData to return a valid admin user
    fetchData.mockResolvedValueOnce([
        { email: "admin@example.com", password: "adminpass", role: "admin" },
    ]);

    // Setting input values for email and password
    document.getElementById("email").value = "admin@example.com";
    document.getElementById("password").value = "adminpass";

    const event = { preventDefault: jest.fn() }; // Mocking event
    await login(event); // Call login with the mock event

    // Check if localStorage.setItem was called with correct parameters
    expect(localStorage.setItem).toHaveBeenCalledWith(
        "loggedInUser",
        expect.stringContaining("admin@example.com")
    );

    // Check if redirection happened (if applicable)
    expect(window.location.href).toBe("admin.html");
});


  it("should show error for invalid credentials", async () => {
    fetchData.mockResolvedValueOnce([
      { email: "user@example.com", password: "userpass", role: "user" },
    ]);

    document.getElementById("email").value = "invalid@example.com";
    document.getElementById("password").value = "wrongpass";

    const event = { preventDefault: jest.fn() };
    await login(event);

    const errorMessage = document.getElementById("error-message").textContent;
    expect(errorMessage).toBe("Unexpected error occured. Please try again.");
  });

  it("should handle errors when fetching users", async () => {
    fetchData.mockRejectedValueOnce(new Error("Network Error"));

    document.getElementById("email").value = "admin@example.com";
    document.getElementById("password").value = "adminpass";

    const event = { preventDefault: jest.fn() };
    await login(event);

    const errorMessage = document.getElementById("error-message").textContent;
    expect(errorMessage).toBe("Unexpected error occured. Please try again.");
  });
});
