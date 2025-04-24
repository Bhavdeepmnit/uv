document.addEventListener('DOMContentLoaded', () => {
    // Mock data - in a real app, this would come from your backend API
    const submissions = [
        {
            id: 1,
            clientName: "John Doe",
            buildingType: "Residential House",
            stylePreferences: "Modern Minimalist",
            vibeDescription: "Clean lines, open spaces, lots of natural light",
            budgetRange: "$200,000 - $300,000",
            timeline: "6-8 months",
            status: "new",
            createdAt: "2023-05-15T10:30:00Z"
        },
        {
            id: 2,
            clientName: "Jane Smith",
            buildingType: "Cafe",
            stylePreferences: "Industrial Chic",
            vibeDescription: "Warm industrial with exposed brick and wood accents",
            budgetRange: "$80,000 - $120,000",
            timeline: "3-4 months",
            status: "in-progress",
            createdAt: "2023-05-10T14:45:00Z"
        },
        {
            id: 3,
            clientName: "Acme Corp",
            buildingType: "Office Space",
            stylePreferences: "Contemporary Professional",
            vibeDescription: "Professional yet creative space that fosters collaboration",
            budgetRange: "$500,000+",
            timeline: "12 months",
            status: "completed",
            createdAt: "2023-04-22T09:15:00Z"
        }
    ];

    // Render submissions
    function renderSubmissions(filter = 'all', searchTerm = '') {
        const filteredSubmissions = submissions.filter(sub => {
            const matchesStatus = filter === 'all' || sub.status === filter;
            const matchesSearch = searchTerm === '' || 
                sub.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                sub.buildingType.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        });

        const submissionsGrid = document.getElementById('submissionsGrid');
        
        if (filteredSubmissions.length === 0) {
            submissionsGrid.innerHTML = '<p>No submissions match your criteria.</p>';
            return;
        }

        submissionsGrid.innerHTML = filteredSubmissions.map(sub => `
            <div class="submission-card">
                <h3>${sub.buildingType}</h3>
                <div class="submission-meta">
                    <span>${sub.clientName}</span>
                    <span>${new Date(sub.createdAt).toLocaleDateString()}</span>
                </div>
                <p>${sub.vibeDescription.substring(0, 100)}...</p>
                <div class="submission-status status-${sub.status.replace(' ', '-')}">
                    ${sub.status.replace('-', ' ').toUpperCase()}
                </div>
                <div class="submission-actions">
                    <button class="btn small">View Details</button>
                    <button class="btn secondary small">Edit Status</button>
                </div>
            </div>
        `).join('');
    }

    // Initial render
    renderSubmissions();

    // Filter event listeners
    document.getElementById('filterStatus').addEventListener('change', (e) => {
        const searchTerm = document.getElementById('searchInput').value;
        renderSubmissions(e.target.value, searchTerm);
    });

    document.getElementById('searchInput').addEventListener('input', (e) => {
        const filter = document.getElementById('filterStatus').value;
        renderSubmissions(filter, e.target.value);
    });

    // In a real app, you would have:
    // - Authentication check
    // - API calls to fetch real data
    // - More detailed view functionality
    // - Status update functionality
});
