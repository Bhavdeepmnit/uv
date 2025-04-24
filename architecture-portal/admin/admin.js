// DOM Elements
const submissionsGrid = document.getElementById('submissionsGrid');
const filterStatus = document.getElementById('filterStatus');
const searchInput = document.getElementById('searchInput');

// Mock data (replace with API calls in production)
const submissions = [
    {
        id: 1,
        clientName: "John Doe",
        buildingType: "Residential House",
        stylePreferences: ["Modern", "Minimalist"],
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
        stylePreferences: ["Industrial", "Chic"],
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
        stylePreferences: ["Contemporary", "Professional"],
        vibeDescription: "Professional yet creative space that fosters collaboration",
        budgetRange: "$500,000+",
        timeline: "12 months",
        status: "completed",
        createdAt: "2023-04-22T09:15:00Z"
    }
];

// Load submissions on page load
document.addEventListener('DOMContentLoaded', () => {
    renderSubmissions();
});

// Filter submissions
filterStatus.addEventListener('change', () => {
    renderSubmissions();
});

searchInput.addEventListener('input', () => {
    renderSubmissions();
});

// Render submissions to the grid
function renderSubmissions() {
    const statusFilter = filterStatus.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredSubmissions = submissions.filter(sub => {
        const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
        const matchesSearch = searchTerm === '' || 
            sub.clientName.toLowerCase().includes(searchTerm) || 
            sub.buildingType.toLowerCase().includes(searchTerm);
        return matchesStatus && matchesSearch;
    });
    
    if (filteredSubmissions.length === 0) {
        submissionsGrid.innerHTML = '<p class="no-results">No submissions match your criteria.</p>';
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
                <button class="btn primary small">View Details</button>
                <button class="btn secondary small">Edit Status</button>
            </div>
        </div>
    `).join('');
}