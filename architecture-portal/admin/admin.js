// DOM Elements
const submissionsGrid = document.getElementById('submissionsGrid');
const filterStatus = document.getElementById('filterStatus');
const searchInput = document.getElementById('searchInput');
const exportBtn = document.getElementById('exportBtn');

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

// Format date to readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Render submissions to the grid
function renderSubmissions(filteredSubmissions = submissions) {
    if (filteredSubmissions.length === 0) {
        submissionsGrid.innerHTML = '<p class="no-results">No submissions match your criteria.</p>';
        return;
    }
    
    submissionsGrid.innerHTML = filteredSubmissions.map(sub => `
        <div class="submission-card" data-id="${sub.id}">
            <h3>${sub.buildingType}</h3>
            <div class="submission-meta">
                <span>${sub.clientName}</span>
                <span>${formatDate(sub.createdAt)}</span>
            </div>
            <div class="style-preferences">
                ${sub.stylePreferences.map(style => `<span class="style-tag">${style}</span>`).join('')}
            </div>
            <p>${sub.vibeDescription.substring(0, 100)}...</p>
            <div class="submission-details">
                <span><strong>Budget:</strong> ${sub.budgetRange}</span>
                <span><strong>Timeline:</strong> ${sub.timeline}</span>
            </div>
            <div class="submission-status status-${sub.status}">
                ${sub.status.replace('-', ' ').toUpperCase()}
            </div>
            <div class="submission-actions">
                <button class="btn primary small view-details">View Details</button>
                <button class="btn secondary small edit-status">Edit Status</button>
            </div>
        </div>
    `).join('');
}

// Filter submissions based on status and search term
function filterSubmissions() {
    const statusFilter = filterStatus.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    return submissions.filter(sub => {
        const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
        const matchesSearch = searchTerm === '' || 
            sub.clientName.toLowerCase().includes(searchTerm) || 
            sub.buildingType.toLowerCase().includes(searchTerm) ||
            sub.vibeDescription.toLowerCase().includes(searchTerm);
        return matchesStatus && matchesSearch;
    });
}

// Export data function
function exportData() {
    const filteredSubmissions = filterSubmissions();
    const dataStr = JSON.stringify(filteredSubmissions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'submissions-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Event Listeners
function setupEventListeners() {
    // Filter and search events
    filterStatus.addEventListener('change', () => {
        renderSubmissions(filterSubmissions());
    });
    
    searchInput.addEventListener('input', () => {
        renderSubmissions(filterSubmissions());
    });
    
    // Export button event
    exportBtn.addEventListener('click', exportData);
    
    // Event delegation for dynamic elements
    submissionsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.submission-card');
        if (!card) return;
        
        const submissionId = card.dataset.id;
        
        if (e.target.classList.contains('view-details')) {
            // Handle view details
            const submission = submissions.find(sub => sub.id == submissionId);
            alert(`Viewing details for: ${submission.clientName}\n\n${JSON.stringify(submission, null, 2)}`);
        }
        
        if (e.target.classList.contains('edit-status')) {
            // Handle edit status
            const newStatus = prompt('Enter new status (new/in-progress/completed):');
            if (newStatus && ['new', 'in-progress', 'completed'].includes(newStatus)) {
                const submission = submissions.find(sub => sub.id == submissionId);
                if (submission) {
                    submission.status = newStatus;
                    renderSubmissions(filterSubmissions());
                }
            }
        }
    });
}

// Initialize the application
function init() {
    renderSubmissions();
    setupEventListeners();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);