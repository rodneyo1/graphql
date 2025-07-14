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
    
    // Calculate cumulative XP in MB (divided by 1,000,000)
    let cumulativeXP = 0;
    const dataPoints = sortedTransactions.map(transaction => {
        cumulativeXP += transaction.amount;
        return {
            date: new Date(transaction.createdAt),
            xp: cumulativeXP / 1000000 // Convert to MB
        };
    });
    
    // Define scales
    const minDate = dataPoints[0].date;
    const maxDate = dataPoints[dataPoints.length - 1].date;
    const maxXP = dataPoints[dataPoints.length - 1].xp;
    
    // X scale (time)
    const xScale = (date) => {
        return (date - minDate) / (maxDate - minDate) * graphWidth;
    };
    
    // Y scale (XP)
    const yScale = (xp) => {
        return graphHeight - (xp / maxXP) * graphHeight;
    };
    
    // Create X axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    xAxis.setAttribute('transform', `translate(0,${graphHeight})`);
    g.appendChild(xAxis);
    
    // X axis line
    const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxisLine.setAttribute('x1', 0);
    xAxisLine.setAttribute('y1', 0);
    xAxisLine.setAttribute('x2', graphWidth);
    xAxisLine.setAttribute('y2', 0);
    xAxisLine.setAttribute('stroke', '#000');
    xAxis.appendChild(xAxisLine);
    
    // X axis ticks
    const xTicks = 5;
    for (let i = 0; i <= xTicks; i++) {
        const tickDate = new Date(minDate.getTime() + (maxDate.getTime() - minDate.getTime()) * (i / xTicks));
        const x = xScale(tickDate);
        
        // Tick line
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tick.setAttribute('x1', x);
        tick.setAttribute('y1', 0);
        tick.setAttribute('x2', x);
        tick.setAttribute('y2', 5);
        tick.setAttribute('stroke', '#000');
        xAxis.appendChild(tick);
        
        // Tick label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', 20);
        label.setAttribute('text-anchor', 'middle');
        label.textContent = tickDate.toLocaleDateString();
        label.setAttribute('font-size', '10px');
        xAxis.appendChild(label);
    }
    
    // Create Y axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.appendChild(yAxis);
    
    // Y axis line
    const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxisLine.setAttribute('x1', 0);
    yAxisLine.setAttribute('y1', 0);
    yAxisLine.setAttribute('x2', 0);
    yAxisLine.setAttribute('y2', graphHeight);
    yAxisLine.setAttribute('stroke', '#000');
    yAxis.appendChild(yAxisLine);
    
    // Y axis ticks
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
        const tickXP = maxXP * (i / yTicks);
        const y = yScale(tickXP);
        
        // Tick line
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tick.setAttribute('x1', -5);
        tick.setAttribute('y1', y);
        tick.setAttribute('x2', 0);
        tick.setAttribute('y2', y);
        tick.setAttribute('stroke', '#000');
        yAxis.appendChild(tick);
        
        // Tick label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', -10);
        label.setAttribute('y', y + 4);
        label.setAttribute('text-anchor', 'end');
        label.textContent = tickXP.toFixed(2); // Format to 2 decimal places
        label.setAttribute('font-size', '10px');
        yAxis.appendChild(label);
    }
    
    // Create line path
    let pathData = `M ${xScale(dataPoints[0].date)} ${yScale(dataPoints[0].xp)}`;
    for (let i = 1; i < dataPoints.length; i++) {
        pathData += ` L ${xScale(dataPoints[i].date)} ${yScale(dataPoints[i].xp)}`;
    }
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#4285f4');
    path.setAttribute('stroke-width', '2');
    g.appendChild(path);
    
    // Add axis labels
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', graphWidth / 2);
    xLabel.setAttribute('y', graphHeight + 35);
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.textContent = 'Date';
    g.appendChild(xLabel);
    
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('transform', `translate(-40,${graphHeight / 2}) rotate(-90)`);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.textContent = 'XP (MB)'; // Updated label to show units
    g.appendChild(yLabel);
}

// Generate project pass/fail ratio graph (pie chart)
function generateProjectRatioGraph(data) {
    const svgContainer = document.getElementById('project-ratio-graph');
    
    // Clear any existing content
    svgContainer.innerHTML = '';
    
    // Set dimensions
    const width = svgContainer.clientWidth;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 40;
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svgContainer.appendChild(svg);
    
    // Create group for the pie chart
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${width / 2},${height / 2})`);
    svg.appendChild(g);
    
    // Process data
    if (!data || !data.results || data.results.length === 0) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('text-anchor', 'middle');
        text.textContent = 'No project data available';
        g.appendChild(text);
        return;
    }
    
    const results = data.results;
    const passCount = results.filter(result => result.grade > 1).length;
    const failCount = results.filter(result => result.grade <= 1).length;
    
    // Calculate angles for pie slices
    const total = passCount + failCount;
    const passAngle = (passCount / total) * 2 * Math.PI;
    const failAngle = (failCount / total) * 2 * Math.PI;
    
    // Create pie slices
    if (passCount > 0) {
        const passSlice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const passPath = describeArc(0, 0, radius, 0, passAngle);
        passSlice.setAttribute('d', passPath);
        passSlice.setAttribute('fill', '#4CAF50');
        g.appendChild(passSlice);
    }
    
    if (failCount > 0) {
        const failSlice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const failPath = describeArc(0, 0, radius, passAngle, passAngle + failAngle);
        failSlice.setAttribute('d', failPath);
        failSlice.setAttribute('fill', '#F44336');
        g.appendChild(failSlice);
    }
    
    // Add legend
    const legendG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    legendG.setAttribute('transform', `translate(${radius + 20},-${radius})`);
    g.appendChild(legendG);
    
    // Pass legend item
    const passRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    passRect.setAttribute('width', 15);
    passRect.setAttribute('height', 15);
    passRect.setAttribute('fill', '#4CAF50');
    legendG.appendChild(passRect);
    
    const passText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    passText.setAttribute('x', 20);
    passText.setAttribute('y', 12);
    passText.textContent = `Pass (${passCount})`;
    legendG.appendChild(passText);
    
    // Fail legend item
    const failRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    failRect.setAttribute('width', 15);
    failRect.setAttribute('height', 15);
    failRect.setAttribute('y', 20);
    failRect.setAttribute('fill', '#F44336');
    legendG.appendChild(failRect);
    
    const failText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    failText.setAttribute('x', 20);
    failText.setAttribute('y', 32);
    failText.textContent = `Fail (${failCount})`;
    legendG.appendChild(failText);
}

// Helper function to create arc path for pie chart
function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
    
    return [
        "M", x, y,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
    ].join(" ");
}

// Helper function to convert polar coordinates to cartesian
function polarToCartesian(centerX, centerY, radius, angleInRadians) {
    return {
        x: centerX + (radius * Math.cos(angleInRadians - Math.PI / 2)),
        y: centerY + (radius * Math.sin(angleInRadians - Math.PI / 2))
    };
}
