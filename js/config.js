// Configuration settings for the application

// API endpoints
const API_CONFIG = {
    // Base domain for API requests
    domain: 'learn.zone01kisumu.ke',
    
    // Authentication endpoint
    authEndpoint: '/api/auth/signin',
    
    // GraphQL endpoint
    graphqlEndpoint: '/api/graphql-engine/v1/graphql'
};

// Get the full URL for an API endpoint
function getApiUrl(endpoint) {
    return `https://${API_CONFIG.domain}${endpoint}`;
}