// Load submission history on page load
document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
});

// Load all submissions from API
async function loadHistory() {
    const loadingEl = document.getElementById('loading');
    const emptyStateEl = document.getElementById('empty-state');
    const submissionsListEl = document.getElementById('submissions-list');
    
    try {
        const response = await fetch('/api/history');
        const data = await response.json();
        
        loadingEl.style.display = 'none';
        
        if (response.ok && data.submissions && data.submissions.length > 0) {
            displaySubmissions(data.submissions);
        } else {
            emptyStateEl.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading history:', error);
        loadingEl.style.display = 'none';
        emptyStateEl.innerHTML = '<p>❌ Error loading submissions. Please try again.</p>';
        emptyStateEl.style.display = 'block';
    }
}

// Display submissions in the list
function displaySubmissions(submissions) {
    const submissionsListEl = document.getElementById('submissions-list');
    submissionsListEl.innerHTML = '';
    
    submissions.forEach((submission, index) => {
        const card = createSubmissionCard(submission, index);
        submissionsListEl.appendChild(card);
    });
}

// Create a submission card element
function createSubmissionCard(submission, index) {
    const card = document.createElement('div');
    card.className = 'submission-card';
    
    // Format date
    const date = new Date(submission.submission_date);
    const formattedDate = date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Calculate total income
    const totalIncome = submission.income_data.reduce((sum, income) => sum + income.amount, 0);
    
    // Create card HTML
    card.innerHTML = `
        <div class="submission-header" onclick="toggleDetails(${index})">
            <div class="submission-info">
                <h3>📋 Submission #${submission.id}</h3>
                <p class="submission-date">📅 ${formattedDate}</p>
                <p><strong>Total Income:</strong> ฿${totalIncome.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                <p><strong>Income Types:</strong> ${submission.income_data.length} type(s)</p>
            </div>
            <div class="toggle-icon" id="toggle-${index}">▼</div>
        </div>
        <div class="submission-details" id="details-${index}">
            ${createIncomeDetails(submission.income_data)}
        </div>
    `;
    
    return card;
}

// Create income details HTML
function createIncomeDetails(incomeData) {
    let html = '<h4>Income Breakdown / รายละเอียดรายได้:</h4>';
    
    incomeData.forEach((income, idx) => {
        html += `
            <div class="income-entry">
                <h4>${idx + 1}. ${income.type}</h4>
                <p><strong>Amount / จำนวนเงิน:</strong> ฿${income.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                ${income.details ? `<p><strong>Details / รายละเอียด:</strong> ${income.details}</p>` : ''}
            </div>
        `;
    });
    
    return html;
}

// Toggle submission details visibility
function toggleDetails(index) {
    const detailsEl = document.getElementById(`details-${index}`);
    const toggleIcon = document.getElementById(`toggle-${index}`);
    
    if (detailsEl.classList.contains('active')) {
        detailsEl.classList.remove('active');
        toggleIcon.classList.remove('expanded');
    } else {
        detailsEl.classList.add('active');
        toggleIcon.classList.add('expanded');
    }
}

// Made with Bob
