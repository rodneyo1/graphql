// GraphQL query functions

// Function to execute GraphQL queries
async function executeQuery(query, variables = {}) {
    const token = checkAuth();
    const domain = 'learn.zone01kisumu.ke';
    
    try {
        const response = await fetch(`https://${domain}/api/graphql-engine/v1/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query,
                variables
            })
        });
        
        if (!response.ok) {
            throw new Error('GraphQL query failed');
        }
        
        const data = await response.json();
        
        if (data.errors) {
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
      }
    }
    `;
    
    return executeQuery(query);
}

// Query to get user XP transactions
async function getUserXP() {
    const query = `
    {
      transaction(where: {type: {_eq: "xp"}}, order_by: {createdAt: asc}) {
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
      progress {
        id
        objectId
        grade
        createdAt
        path
      }
    }
    `;
    
    return executeQuery(query);
}

// Query to get user results
async function getUserResults() {
    const query = `
    {
      result {
        id
        objectId
        grade
        createdAt
        path
      }
    }
    `;
    
    return executeQuery(query);
}

// Query to get object details by ID
async function getObjectDetails(objectId) {
    const query = `
    {
      object(where: {id: {_eq: ${objectId}}}) {
        id
        name
        type
      }
    }
    `;
    
    return executeQuery(query);
}