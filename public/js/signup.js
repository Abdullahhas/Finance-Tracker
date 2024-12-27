document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
  
    // Validate Name (must be at least 3 characters)
    if (name.length < 3) {
      alert("Name must be at least 3 characters long.");
      return;
    }
  
    // Validate Email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    // Validate Password (min 6 characters, includes a number and special char)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      alert("Password must be at least 6 characters long and contain at least one letter, one number, and one special character.");
      return;
    }
  
    // Confirm Password
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    // Proceed with the form submission if all validations pass
    this.submit(); // Normally, you would send the data to the backend here
  });
  