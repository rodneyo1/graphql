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
    
    // Clear previous error messages
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    
    // Create base64 encoded credentials
    const credentials = btoa(`${username}:${password}`);
    
    try {
        // Replace with your actual domain
        const domain = 'learn.zone01kisumu.ke';
        
        console.log('Attempting to authenticate with:', domain);
        
        const response = await fetch(`https://${domain}/api/auth/signin`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });
        
        // Log the response status
        console.log('Authentication response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Authentication failed with status: ${response.status}`);
        }
        
        // Get the response text
        const token = await response.text();
        console.log('Token received:', token.substring(0, 20) + '...');
        
        // Check if the response is a valid JWT token (should have 3 parts separated by dots)
        if (token && token.split('.').length === 3) {
            // Store the token directly
            localStorage.setItem('token', token);
            
            // Redirect to profile page
            window.location.href = 'profile.html';
        } else {
            console.error('Invalid token format:', token);
            throw new Error('Invalid token format received from server');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
}

// Function to handle logout
function handleLogout() {
    // Clear all authentication data
    localStorage.removeItem('token');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Function to clear invalid tokens
function clearInvalidToken() {
    const token = localStorage.getItem('token');
    if (token && token.split('.').length !== 3) {
        localStorage.removeItem('token');
    }
}

// Check for invalid tokens when the page loads
document.addEventListener('DOMContentLoaded', function() {
    clearInvalidToken();
    
    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Setup login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Check if user is logged in on protected pages
    if (window.location.pathname.includes('profile.html')) {
        checkAuth();
    }
});

// Function to check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('token');
    
    // Check if token exists and has the correct format (3 parts separated by dots)
    if (!token || token.split('.').length !== 3) {
        // Invalid token, redirect to login
        window.location.href = 'login.html';
        return null;
    }
    
    return token;
}

// Function to get user ID from JWT
function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) return null;
    
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
