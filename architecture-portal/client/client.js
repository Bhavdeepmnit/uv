// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');

// Login functionality
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        loginError.classList.add('hidden');
        
        // Get form values
        const email = loginEmail.value.trim();
        const password = loginPassword.value;
        
        // Basic validation
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        try {
            // In a real app, you would call your backend API here
            // const response = await fetch('/api/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email, password })
            // });
            // const data = await response.json();
            
            // Mock authentication (replace with real API call)
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Successful login
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                showError('Invalid email or password');
            }
        } catch (error) {
            showError('Login failed. Please try again.');
            console.error('Login error:', error);
        }
    });
}

function showError(message) {
    loginError.textContent = message;
    loginError.classList.remove('hidden');
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('currentUser')) {
        window.location.href = 'dashboard.html';
    }
});