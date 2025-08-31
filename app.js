// Application State
let currentUser = null;
let familyMembers = [
    {
        id: 1,
        name: "Pradeep Kumar",
        relationship: "Self",
        email: "pradeep@example.com",
        phone: "+91-9876543210",
        investments: 12500000,
        insurance: 50000000,
        dob: "1980-01-15",
        income: 1200000
    },
    {
        id: 2,
        name: "Spouse Kumar",
        relationship: "Spouse",
        email: "spouse@example.com",
        phone: "+91-9876543211",
        investments: 8500000,
        insurance: 30000000,
        dob: "1985-03-22",
        income: 800000
    }
];

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced Family Wealth Dashboard - Initializing...');
    initializeApp();
});

function initializeApp() {
    try {
        // Show landing page initially
        showLandingPage();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize data
        updateOverviewStats();
        renderFamilyMembers();
        
        console.log('✅ Application initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing application:', error);
        showToast('Failed to initialize application', 'error');
    }
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Member form
    const memberForm = document.getElementById('memberForm');
    if (memberForm) {
        memberForm.addEventListener('submit', handleMemberSubmit);
    }
    
    // Navigation buttons
    document.addEventListener('click', (e) => {
        if (e.target.matches('.nav-btn')) {
            const section = e.target.dataset.section;
            if (section) {
                showSection(section);
                
                // Update active nav button
                document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            }
        }
    });
    
    // Modal close on background click
    document.addEventListener('click', (e) => {
        if (e.target.matches('.modal')) {
            e.target.classList.add('hidden');
        }
    });
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    
    console.log('Login attempt:', email);
    
    // Simple validation (replace with real authentication)
    if (email && password) {
        currentUser = { email: email };
        
        // Update user info in dashboard
        const userEmailEl = document.getElementById('userEmail');
        if (userEmailEl) {
            userEmailEl.textContent = email;
        }
        
        showDashboard();
        showToast('Login successful! Welcome to your dashboard.', 'success');
    } else {
        showToast('Please enter email and password', 'error');
    }
}

function handleLogout() {
    currentUser = null;
    showLandingPage();
    showToast('Logged out successfully', 'info');
    
    // Reset forms
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.reset();
    }
}

function showLandingPage() {
    const landingPage = document.getElementById('landingPage');
    const dashboard = document.getElementById('dashboard');
    
    if (landingPage) {
        landingPage.classList.remove('hidden');
        landingPage.style.display = 'flex';
    }
    if (dashboard) {
        dashboard.classList.add('hidden');
        dashboard.style.display = 'none';
    }
}

function showDashboard() {
    const landingPage = document.getElementById('landingPage');
    const dashboard = document.getElementById('dashboard');
    
    if (landingPage) {
        landingPage.classList.add('hidden');
        landingPage.style.display = 'none';
    }
    if (dashboard) {
        dashboard.classList.remove('hidden');
        dashboard.style.display = 'block';
    }
    
    // Show overview section by default
    showSection('overviewSection');
    
    // Update dashboard data
    updateOverviewStats();
    renderFamilyMembers();
}

function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    // Hide all sections
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
    }
    
    // Update data for specific sections
    if (sectionId === 'familySection') {
        renderFamilyMembersDetailed();
    }
}

// Family Member Management Functions
function openAddMemberModal() {
    console.log('Opening add member modal...');
    
    const modal = document.getElementById('memberModal');
    if (modal) {
        // Reset form
        const form = document.getElementById('memberForm');
        if (form) {
            form.reset();
        }
        
        // Show modal
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}

function handleMemberSubmit(event) {
    event.preventDefault();
    saveMember();
}

function saveMember() {
    console.log('Saving member...');
    
    const form = document.getElementById('memberForm');
    if (!form) {
        console.error('Member form not found');
        showToast('Form not found', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(form);
    const memberData = {
        name: formData.get('name') || document.getElementById('memberName')?.value,
        relationship: formData.get('relationship') || document.getElementById('memberRelationship')?.value,
        email: formData.get('email') || document.getElementById('memberEmail')?.value,
        phone: formData.get('phone') || document.getElementById('memberPhone')?.value,
        dob: formData.get('dob') || document.getElementById('memberDob')?.value,
        income: parseFloat(formData.get('income') || document.getElementById('memberIncome')?.value || 0)
    };
    
    // Validate required fields
    if (!memberData.name || !memberData.relationship) {
        showToast('Please fill in required fields (Name and Relationship)', 'error');
        return;
    }
    
    // Add to family members array
    const newMember = {
        id: Date.now(), // Simple ID generation
        ...memberData,
        investments: 0,
        insurance: 0,
        created_at: new Date().toISOString()
    };
    
    familyMembers.push(newMember);
    
    // Close modal and refresh display
    closeModal('memberModal');
    updateOverviewStats();
    renderFamilyMembers();
    renderFamilyMembersDetailed();
    showToast('Family member added successfully!', 'success');
    
    // Reset form
    form.reset();
    
    console.log('Member saved:', newMember);
}

function updateOverviewStats() {
    console.log('Updating overview stats...');
    
    // Calculate totals
    const totalMembers = familyMembers.length;
    const totalInvestments = familyMembers.reduce((sum, member) => sum + (member.investments || 0), 0);
    const totalInsurance = familyMembers.reduce((sum, member) => sum + (member.insurance || 0), 0);
    const netWorth = totalInvestments + totalInsurance;
    
    // Update member count
    const elements = [
        { id: 'totalMembers', value: totalMembers },
        { id: 'familyMemberCount', value: totalMembers },
        { id: 'totalAssets', value: `₹${formatCurrency(totalInvestments)}` },
        { id: 'totalFamilyInvestments', value: `₹${formatCurrency(totalInvestments)}` },
        { id: 'totalInsurance', value: `₹${formatCurrency(totalInsurance)}` },
        { id: 'totalFamilyInsurance', value: `₹${formatCurrency(totalInsurance)}` },
        { id: 'netWorth', value: `₹${formatCurrency(netWorth)}` }
    ];
    
    elements.forEach(({ id, value }) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

function renderFamilyMembers() {
    console.log('Rendering family members...', familyMembers);
    
    const container = document.getElementById('familyMembersGrid');
    if (!container) {
        console.error('Family members grid container not found');
        return;
    }
    
    if (familyMembers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>👥 No family members added yet</h3>
                <p>Click "Add Family Member" to get started with your family wealth management.</p>
                <button onclick="openAddMemberModal()" class="btn btn-primary">+ Add First Member</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = familyMembers.map(member => `
        <div class="member-card">
            <div class="member-header">
                <div class="member-avatar">${getAvatarForRelationship(member.relationship)}</div>
                <div class="member-info">
                    <h4>${member.name}</h4>
                    <p class="relationship">${member.relationship}</p>
                    ${member.email ? `<small class="email">${member.email}</small>` : ''}
                </div>
            </div>
            <div class="member-stats">
                <div class="stat">
                    <label>Investments</label>
                    <value class="positive">₹${formatCurrency(member.investments || 0)}</value>
                </div>
                <div class="stat">
                    <label>Insurance</label>
                    <value class="primary">₹${formatCurrency(member.insurance || 0)}</value>
                </div>
            </div>
            <div class="member-actions">
                <button onclick="editMember(${member.id})" class="btn btn-secondary btn-sm">Edit</button>
                <button onclick="deleteMember(${member.id})" class="btn btn-danger btn-sm">Delete</button>
            </div>
        </div>
    `).join('');
}

function renderFamilyMembersDetailed() {
    console.log('Rendering detailed family members...');
    
    const container = document.getElementById('familyMembersDetailGrid');
    if (!container) return;
    
    if (familyMembers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>👥 No family members found</h3>
                <p>Add family members to see detailed portfolio information.</p>
                <button onclick="openAddMemberModal()" class="btn btn-primary">+ Add Family Member</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = familyMembers.map(member => `
        <div class="family-detail-card">
            <div class="member-header">
                <div class="member-avatar-large">${getAvatarForRelationship(member.relationship)}</div>
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <p class="relationship">${member.relationship}</p>
                    <div class="contact-info">
                        ${member.email ? `<div class="contact-item">📧 ${member.email}</div>` : ''}
                        ${member.phone ? `<div class="contact-item">📱 ${member.phone}</div>` : ''}
                        ${member.dob ? `<div class="contact-item">🎂 ${formatDate(member.dob)}</div>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="financial-summary">
                <div class="financial-stat">
                    <span class="stat-label">Investments</span>
                    <span class="stat-value positive">₹${formatCurrency(member.investments || 0)}</span>
                </div>
                <div class="financial-stat">
                    <span class="stat-label">Insurance</span>
                    <span class="stat-value primary">₹${formatCurrency(member.insurance || 0)}</span>
                </div>
                <div class="financial-stat">
                    <span class="stat-label">Annual Income</span>
                    <span class="stat-value">₹${formatCurrency(member.income || 0)}</span>
                </div>
            </div>
            
            <div class="member-actions">
                <button onclick="editMember(${member.id})" class="btn btn-secondary">✏️ Edit</button>
                <button onclick="viewPortfolio(${member.id})" class="btn btn-primary">📊 Portfolio</button>
                <button onclick="deleteMember(${member.id})" class="btn btn-danger">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

// Utility Functions
function getAvatarForRelationship(relationship) {
    const avatars = {
        'Self': '👨',
        'Spouse': '👩',
        'Father': '👨‍🦳',
        'Mother': '👩‍🦳',
        'Son': '👦',
        'Daughter': '👧',
        'Brother': '👨‍🦱',
        'Sister': '👩‍🦱',
        'Child': '🧒',
        'Parent': '👨‍👩‍👧‍👦',
        'Grandfather': '👴',
        'Grandmother': '👵',
        'Other': '👤'
    };
    return avatars[relationship] || '👤';
}

function formatCurrency(amount) {
    if (amount >= 10000000) { // 1 crore
        return `${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) { // 1 lakh
        return `${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) { // 1 thousand
        return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString('en-IN');
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Member Actions
function editMember(id) {
    console.log('Edit member:', id);
    showToast('Edit functionality coming soon!', 'info');
}

function deleteMember(id) {
    if (!confirm('Are you sure you want to delete this family member?')) {
        return;
    }
    
    familyMembers = familyMembers.filter(member => member.id !== id);
    updateOverviewStats();
    renderFamilyMembers();
    renderFamilyMembersDetailed();
    showToast('Family member deleted successfully', 'success');
}

function viewPortfolio(id) {
    console.log('View portfolio for member:', id);
    showToast('Portfolio view coming soon!', 'info');
}

// Toast Notification System
function showToast(message, type = 'info') {
    console.log(`Toast: ${type.toUpperCase()} - ${message}`);
    
    // Create toast container if it doesn't exist
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    }[type] || 'ℹ️';
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 100);
}

// Error handling
window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error);
    showToast('An error occurred. Please try again.', 'error');
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

console.log('✅ Family Wealth Dashboard - All functions loaded successfully');
