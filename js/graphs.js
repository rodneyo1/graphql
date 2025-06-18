// SVG graph generation functions

// Generate XP over time graph
function generateXPGraph(transactions) {
    const svgContainer = document.getElementById('xp-graph');
    
    // Clear any existing content
    svgContainer.innerHTML = '';
    
    // Set dimensions
    const width = svgContainer.clientWidth;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svgContainer.appendChild(svg);
    
    // Create group for the graph
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svg.appendChild(g);
    
    // Process data
    if (!transactions || transactions.length === 0) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', graphWidth / 2);
        text.setAttribute('y', graphHeight / 2);
        text.setAttribute('text-anchor', 'middle');
        text.textContent = 'No XP data available';
        g.appendChild(text);
        return;
    }
    
    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
    );
    
    // Calculate cumulative XP
    let cumulativeXP = 0;
    const dataPoints = sortedTransactions.map(transaction => {
        cumulativeXP += transaction.amount;
        return {
            date: new Date(transaction.createdAt),
            xp: cumulativeXP
        };
    });
    
    // Define scales
    const xScale = (date) => {
        const minDate = dataPoints[0].date;
        const maxDate = data