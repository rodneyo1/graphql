// Authentication related functions

// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Check if user is logged in on protected pages
    if (window.location.pathname.includes('profile.html')) {
        checkAuth();
    }
});

// Function to handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Create base64 encoded credentials
    const credentials = btoa(`${username}:${password}`);
    
    try {
        // Replace with your actual domain
        const domain = 'learn.zone01kisumu.ke';
        const response = await fetch(`https://${domain}/api/auth/signin`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Invalid credentials');
        }
        
        const data = await response.json();
        
        // Store the JWT token
        localStorage.setItem('token', data.token);
        
        // Redirect to profile page
        window.location.href = 'profile.html';
        
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
}

// Function to handle logout
function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Function to check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
    return token;
}

// Function to get user ID from JWT
function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        // JWT tokens are split by dots into three parts
        const payload = token.split('.')[1];
        // Decode the base64 payload
        const decodedPayload = atob(payload);
        // Parse the JSON
        const payloadData = JSON.parse(decodedPayload);
        
        return payloadData.sub || payloadData.id; // Depending on how the JWT is structured
    } catch (error) {
        console.error('Error parsing JWT:', error);
        return null;
    }
}