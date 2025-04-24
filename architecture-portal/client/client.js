// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const submissionForm = document.getElementById('submissionForm');
const logoutBtn = document.getElementById('logoutBtn');
const submissionsContainer = document.getElementById('submissionsContainer');
const fileInput = document.getElementById('fileInput');

// Mock database (replace with actual API calls in production)
let users = JSON.parse(localStorage.getItem('users')) || [];
let submissions = JSON.parse(localStorage.getItem('submissions')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard.html') || 
        window.location.pathname.includes('submission-form.html')) {
        if (!currentUser) {
            window.location.href = 'login.html';
        }
    }
    
    if (window.location.pathname.includes('dashboard.html')) {
        loadSubmissions();
    }
});

// Login functionality
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid email or password');
        }
    });
}

// Registration functionality
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = registerForm.name.value;
        const email = registerForm.email.value;
        const password = registerForm.password.value;
        const phone = registerForm.phone.value;
        
        if (users.some(u => u.email === email)) {
            alert('User already exists with this email');
            return;
        }
        
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            phone
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        window.location.href = 'dashboard.html';
    });
}

// Submission form functionality
if (submissionForm) {
    submissionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        const buildingType = submissionForm.buildingType.value;
        const stylePreferences = Array.from(document.querySelectorAll('input[name^="style"]:checked'))
            .map(el => el.name);
        const vibeDescription = submissionForm.vibeDescription.value;
        const budgetRange = submissionForm.budgetRange.value;
        const timeline = submissionForm.timeline.value;
        
        const newSubmission = {
            id: Date.now(),
            userId: currentUser.id,
            buildingType,
            stylePreferences,
            vibeDescription,
            budgetRange,
            timeline,
            files: [], // In a real app, you would upload files to a server
            status: 'new',
            createdAt: new Date().toISOString()
        };
        
        submissions.push(newSubmission);
        localStorage.setItem('submissions', JSON.stringify(submissions));
        
        window.location.href = 'dashboard.html';
    });
}

// File upload handling
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const fileUploadBox = document.querySelector('.file-upload-box');
            fileUploadBox.innerHTML = `
                <p>${files.length} file(s) selected</p>
                <p>Click to change</p>
            `;
        }
    });
}

// Logout functionality
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

// Load submissions for dashboard
function loadSubmissions() {
    if (!currentUser) return;
    
    const userSubmissions = submissions.filter(sub => sub.userId === currentUser.id);
    
    if (userSubmissions.length === 0) {
        submissionsContainer.innerHTML = `
            <div class="empty-state">
                <p>You haven't submitted any designs yet.</p>
                <a href="submission-form.html" class="btn primary">Create Your First Submission</a>
            </div>
        `;
        return;
    }
    
    submissionsContainer.innerHTML = userSubmissions.map(sub => `
        <div class="submission-card">
            <h3>${sub.buildingType} Project</h3>
            <p><strong>Status:</strong> ${sub.status}</p>
            <p><strong>Submitted:</strong> ${new Date(sub.createdAt).toLocaleDateString()}</p>
            <div class="submission-actions">
                <a href="#" class="btn secondary">View Details</a>
            </div>
        </div>
    `).join('');
}