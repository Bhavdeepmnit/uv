// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const submissionForm = document.getElementById('submissionForm');

// Mock user data (in a real app, this would come from your backend)
const users = [
    { email: 'client@example.com', password: 'password123', name: 'John Doe' }
];

// Login Functionality
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Check if user exists
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid email or password');
        }
    });
}

// Registration Functionality
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const phone = document.getElementById('phone').value;
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
            alert('User already exists with this email');
            return;
        }
        
        // Add new user
        const newUser = { name, email, password, phone };
        users.push(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        alert('Registration successful!');
        window.location.href = 'dashboard.html';
    });
}

// Submission Form Functionality
if (submissionForm) {
    submissionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const buildingType = document.getElementById('buildingType').value;
        const stylePreferences = document.getElementById('stylePreferences').value;
        const vibeDescription = document.getElementById('vibeDescription').value;
        const budgetRange = document.getElementById('budgetRange').value;
        const timeline = document.getElementById('timeline').value;
        
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            alert('Please login first');
            window.location.href = 'login.html';
            return;
        }
        
        // Create submission object
        const submission = {
            userId: currentUser.email,
            buildingType,
            stylePreferences,
            vibeDescription,
            budgetRange,
            timeline,
            status: 'new',
            createdAt: new Date().toISOString()
        };
        
        // Save to localStorage (in a real app, this would go to your backend)
        let submissions = JSON.parse(localStorage.getItem('submissions')) || [];
        submissions.push(submission);
        localStorage.setItem('submissions', JSON.stringify(submissions));
        
        alert('Your design brief has been submitted successfully!');
        window.location.href = 'dashboard.html';
    });
}

// Dashboard Functionality
if (document.querySelector('.dashboard')) {
    document.addEventListener('DOMContentLoaded', () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
        
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        // Display user's submissions
        const userSubmissions = submissions.filter(sub => sub.userId === currentUser.email);
        const submissionsContainer = document.getElementById('submissionsContainer');
        
        if (userSubmissions.length === 0) {
            submissionsContainer.innerHTML = `
                <div class="empty-state">
                    <p>You haven't submitted any design briefs yet.</p>
                    <a href="submission-form.html" class="btn">Create New Submission</a>
                </div>
            `;
        } else {
            submissionsContainer.innerHTML = userSubmissions.map(sub => `
                <div class="submission-card">
                    <h3>${sub.buildingType} Project</h3>
                    <p><strong>Style:</strong> ${sub.stylePreferences}</p>
                    <p><strong>Status:</strong> <span class="status-badge">${sub.status}</span></p>
                    <p><strong>Submitted:</strong> ${new Date(sub.createdAt).toLocaleDateString()}</p>
                    <a href="#" class="btn secondary">View Details</a>
                </div>
            `).join('');
        }
    });
}

// File Upload Functionality
const fileUpload = document.querySelector('.file-upload');
const fileInput = document.getElementById('fileInput');

if (fileUpload && fileInput) {
    fileUpload.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            fileUpload.innerHTML = `
                <p>File selected: ${fileName}</p>
                <p>Click to change</p>
            `;
        }
    });
}