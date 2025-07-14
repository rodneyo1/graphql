// GraphQL query functions

// Function to execute GraphQL queries
async function executeQuery(query, variables = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        throw new Error('Not authenticated');
    }
    
    // Clean the token (remove any quotes or whitespace)
    const cleanToken = token.replace(/^"|"$/g, '').trim();
    
    // Get domain and endpoint from API_CONFIG if available, otherwise use defaults
    const domain = typeof API_CONFIG !== 'undefined' ? API_CONFIG.domain : 'learn.zone01kisumu.ke';
    const graphqlEndpoint = typeof API_CONFIG !== 'undefined' ? API_CONFIG.graphqlEndpoint : '/api/graphql-engine/v1/graphql';
    
    try {
        const response = await fetch(`https://${domain}${graphqlEndpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cleanToken}`
            },
            body: JSON.stringify({
                query,
                variables
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('GraphQL response error:', errorText);
            throw new Error(`GraphQL query failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            throw new Error(data.errors[0].message);
        }
        
        return data.data;
    } catch (error) {
        console.error('GraphQL Error:', error);
        throw error;
    }
}

// Query to get user information
async function getUserInfo() {
    const query = `
    {
      user {
        id
        login
        email
        firstName
        lastName
      }
    }
    `;
    
    return executeQuery(query);
}

// Query to get user XP transactions
async function getUserXP() {
    const query = `
    {
      transaction(where: {type: {_eq: "xp"}, _and: [{eventId: {_eq: 75} }] }, order_by: {createdAt: asc}) {
        id
        amount
        createdAt
        path
      }
    }
    `;
    
    return executeQuery(query);
}

// Query to get user progress
async function getUserProgress() {
    const query = `
    {
            progress(where: {eventId: {_eq: 75}}) {
                id
                userId
                objectId
                grade
                createdAt
                updatedAt
                path
            }
        }
    `;
    
    return executeQuery(query);
}

async function getUserProjectResults() {
    const query = `
    {
        result(where: {eventId: {_eq: 75}}) {
            id
            type
            grade
            objectId
        }
    }
    `;
    
    return executeQuery(query);
}

// Query to get user results
async function getUserResults() {
    const query = `
    {
            result  (where: {eventId: {_eq: 75}}) {
                id
                objectId
                userId
                grade
                type
                createdAt
                updatedAt
                path
            }
        }
    `;
    
    return executeQuery(query);
}

// Query to get object details by ID
async function getObjectDetails(objectId) {
    const query = `
    query GetObject($id: Int!) {
      object(where: {id: {_eq: $id}}) {
        id
        name
        type
      }
    }
    `;
    
    return executeQuery(query, { id: objectId });
}

