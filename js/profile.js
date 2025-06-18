// Profile page logic

document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    const token = checkAuth();
    if (!token) return;
    
    try {
        // Load user data
        await loadUserInfo();
        
        // Load XP data
        await loadXPData();
        
        // Load progress data
        await loadProgressData();
        
    } catch (error) {
        console.error('Error loading profile data:', error);
        alert('Failed to load profile data. Please try again later.');
    }
});

// Load and display user information
async function loadUserInfo() {
    try {
        const userData = await getUserInfo();
        const userDataContainer = document.getElementById('user-data');
        const userName = document.getElementById('username'); 

        if (userData && userData.user && userData.user.length > 0) {
            const user = userData.user[0];
            userName.innerText=user.firstName +'\'s Profile'
            userDataContainer.innerHTML = `
                <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Username:</strong> ${user.login}</p>
            `;
        } else {
            userDataContainer.innerHTML = '<p>No user data available</p>';
        }
    } catch (error) {
        console.error('Error loading user info:', error);
        document.getElementById('user-data').innerHTML = '<p>Failed to load user data</p>';
    }
}

// Load and display XP data
async function loadXPData() {
    try {
        const xpData = await getUserXP();
        const xpDataContainer = document.getElementById('xp-data');
        
        if (xpData && xpData.transaction && xpData.transaction.length > 0) {
            // Calculate total XP
            let totalXP = xpData.transaction.reduce((sum, transaction) => sum + transaction.amount, 0);
            totalXP = totalXP/1000000;
            
            // Display XP info
            xpDataContainer.innerHTML = `
                <p><strong>Total XP:</strong> ${totalXP.toLocaleString()} MB </p>
                <p><strong>Transactions:</strong> ${xpData.transaction.length}</p>
            `;
            
            // Generate XP graph
            generateXPGraph(xpData.transaction);
        } else {
            xpDataContainer.innerHTML = '<p>No XP data available</p>';
            document.getElementById('xp-graph').innerHTML = 'No XP data available';
        }
    } catch (error) {
        console.error('Error loading XP data:', error);
        document.getElementById('xp-data').innerHTML = '<p>Failed to load XP data</p>';
    }
}

// Load and display progress data
async function loadProgressData() {
    const progressDataContainer = document.getElementById('progress-data');
    
    try {
        // First try to get progress data
        let progressData = await getUserProgress();
    
        console.log("Progress data received:", progressData);
        
        // Then try to get results data
        let resultsData;
        try {
            resultsData = await getUserResults();
            console.log("Results data received:", resultsData);
        } catch (resultsError) {
            console.error("Error fetching results (continuing with progress only):", resultsError);
        }
        
        // Process progress data
        if (progressData && progressData.progress && progressData.progress.length > 0) {
            // Count completed projects
            const completedProjects = progressData.progress.filter(p => p.grade > 0).length;
            
            // Display progress info
            progressDataContainer.innerHTML = `
                <p><strong>Completed Projects:</strong> ${completedProjects}</p>
                <p><strong>Total Projects:</strong> ${progressData.progress.length}</p>
            `;
            
            // Generate project ratio graph if we have results data
            if (resultsData && resultsData.result && resultsData.result.length > 0) {
                generateProjectRatioGraph({ results: resultsData.result });
            } else {
                // Use progress data for the graph if results data is not available
                generateProjectRatioGraph({ results: progressData.progress });
            }
        } else {
            progressDataContainer.innerHTML = '<p>No progress data available</p>';
            document.getElementById('project-ratio-graph').innerHTML = 'No project data available';
        }
    } catch (error) {
        console.error('Error loading progress data:', error);
        progressDataContainer.innerHTML = '<p>Failed to load progress data</p>';
        
        // Add more detailed error information for debugging
        if (error.message) {
            const errorDetails = document.createElement('p');
            errorDetails.style.color = 'red';
            errorDetails.style.fontSize = '12px';
            errorDetails.textContent = `Error: ${error.message}`;
            progressDataContainer.appendChild(errorDetails);
        }
    }
}
