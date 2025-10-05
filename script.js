// PM Standards Hub - Main JavaScript File

// Global variables and configuration
const CONFIG = {
    standards: {
        pmbok: {
            name: 'PMBOK Guide 7th Edition',
            color: '#3498db',
            chapters: 12,
            domains: 8
        },
        prince2: {
            name: 'PRINCE2 2023',
            color: '#e74c3c',
            principles: 7,
            themes: 7
        },
        iso: {
            name: 'ISO 21500/21502',
            color: '#27ae60',
            groups: 10,
            processes: 39
        }
    },
    comparisonTopics: [
        'risk-management',
        'stakeholder-engagement',
        'quality-management',
        'scope-management',
        'time-management',
        'cost-management',
        'communication',
        'project-lifecycle'
    ]
};

// Application state
let appState = {
    selectedScenario: null,
    currentComparisonTopic: null,
    searchResults: [],
    bookmarks: JSON.parse(localStorage.getItem('pmStandardsBookmarks')) || [],
    darkMode: localStorage.getItem('darkMode') === 'true' || false
};

// Comparison data structure
const comparisonData = {
    'risk-management': {
        pmbok: {
            title: 'Risk Management',
            content: `
                <h4>Risk Management Performance Domain</h4>
                <p><span class="highlight-similar">Risk identification, assessment, and response planning</span> are core activities.</p>
                <ul>
                    <li>Risk identification techniques</li>
                    <li>Qualitative and quantitative risk analysis</li>
                    <li>Risk response strategies (avoid, mitigate, transfer, accept)</li>
                    <li>Risk monitoring and control</li>
                </ul>
                <p><strong>Key Focus:</strong> Proactive risk management throughout project lifecycle</p>
                <div class="deep-link" onclick="window.open('/topic/risk_management', '_blank')">
                    <i class="fas fa-external-link-alt"></i> View Related Texts
                </div>
            `
        },
        prince2: {
            title: 'Risk Theme',
            content: `
                <h4>Risk Management Theme</h4>
                <p><span class="highlight-similar">Risk identification and assessment</span> with <span class="highlight-different">product-based approach</span>.</p>
                <ul>
                    <li>Risk register maintenance</li>
                    <li>Risk budget allocation</li>
                    <li>Risk escalation procedures</li>
                    <li>Risk management strategy</li>
                </ul>
                <p><strong>Key Focus:</strong> Business-driven risk management with clear governance</p>
                <div class="deep-link" onclick="window.open('/topic/risk_management', '_blank')">
                    <i class="fas fa-external-link-alt"></i> View Related Texts
                </div>
            `
        },
        iso: {
            title: 'Risk Management',
            content: `
                <h4>Risk Management Processes</h4>
                <p><span class="highlight-similar">Systematic risk management approach</span> with <span class="highlight-unique">international standardization</span>.</p>
                <ul>
                    <li>Risk management planning</li>
                    <li>Risk identification and analysis</li>
                    <li>Risk response planning</li>
                    <li>Risk monitoring and control</li>
                </ul>
                <p><strong>Key Focus:</strong> Generic framework applicable to any project type</p>
                <div class="deep-link" onclick="window.open('/topic/risk_management', '_blank')">
                    <i class="fas fa-external-link-alt"></i> View Related Texts
                </div>
            `
        }
    },
    'stakeholder-engagement': {
        pmbok: {
            title: 'Stakeholder Engagement',
            content: `
                <h4>Stakeholder Engagement Performance Domain</h4>
                <p><span class="highlight-similar">Stakeholder identification and engagement</span> throughout project lifecycle.</p>
                <ul>
                    <li>Stakeholder identification and analysis</li>
                    <li>Stakeholder engagement planning</li>
                    <li>Stakeholder communication</li>
                    <li>Stakeholder relationship management</li>
                </ul>
                <p><strong>Key Focus:</strong> Continuous stakeholder engagement and satisfaction</p>
                <div class="deep-link" onclick="window.open('/topic/stakeholder_management', '_blank')">
                    <i class="fas fa-external-link-alt"></i> View Related Texts
                </div>
            `
        },
        prince2: {
            title: 'Organization Theme',
            content: `
                <h4>Organization Theme</h4>
                <p><span class="highlight-similar">Stakeholder management</span> with <span class="highlight-different">defined roles and responsibilities</span>.</p>
                <ul>
                    <li>Project board structure</li>
                    <li>Role definitions (Executive, Senior User, Senior Supplier)</li>
                    <li>Communication management strategy</li>
                    <li>Stakeholder analysis</li>
                </ul>
                <p><strong>Key Focus:</strong> Clear governance structure and accountability</p>
                <div class="deep-link" onclick="window.open('/topic/stakeholder_management', '_blank')">
                    <i class="fas fa-external-link-alt"></i> View Related Texts
                </div>
            `
        },
        iso: {
            title: 'Stakeholder Management',
            content: `
                <h4>Stakeholder Management Processes</h4>
                <p><span class="highlight-similar">Stakeholder identification and engagement</span> with <span class="highlight-unique">process-based approach</span>.</p>
                <ul>
                    <li>Stakeholder identification</li>
                    <li>Stakeholder analysis</li>
                    <li>Stakeholder engagement planning</li>
                    <li>Stakeholder communication</li>
                </ul>
                <p><strong>Key Focus:</strong> Systematic stakeholder management processes</p>
                <div class="deep-link" onclick="window.open('/topic/stakeholder_management', '_blank')">
                    <i class="fas fa-external-link-alt"></i> View Related Texts
                </div>
            `
        }
    }
};

// Process generation templates
const processTemplates = {
    'software-development': {
        title: 'Agile Software Development Process',
        description: 'Tailored process combining agile principles with PM standards',
        steps: [
            {
                title: 'Project Initiation',
                description: 'Define project vision, assemble team, establish agile principles (PMBOK: Project Integration Management)',
                standards: ['pmbok', 'prince2', 'iso'],
                duration: '1-2 weeks'
            },
            {
                title: 'Sprint Planning',
                description: 'Plan iterations, define user stories, estimate effort (PRINCE2: Planning Theme)',
                standards: ['prince2', 'pmbok'],
                duration: '1-2 days per sprint'
            },
            {
                title: 'Development Cycles',
                description: 'Implement features, conduct reviews, manage changes (ISO: Implementation processes)',
                standards: ['iso', 'pmbok'],
                duration: '2-4 weeks per sprint'
            },
            {
                title: 'Quality Assurance',
                description: 'Continuous testing, code reviews, automated quality gates (All standards: Quality Management)',
                standards: ['pmbok', 'prince2', 'iso'],
                duration: 'Continuous'
            },
            {
                title: 'Stakeholder Engagement',
                description: 'Regular demos, feedback collection, communication (All standards: Stakeholder Management)',
                standards: ['pmbok', 'prince2', 'iso'],
                duration: 'Continuous'
            }
        ]
    },
    'construction': {
        title: 'Traditional Construction Process',
        description: 'Sequential construction project with traditional project management',
        steps: [
            {
                title: 'Project Planning',
                description: 'Site analysis, permits, resource planning (PMBOK: Project Planning)',
                standards: ['pmbok', 'iso'],
                duration: '2-4 weeks'
            },
            {
                title: 'Design Phase',
                description: 'Architectural design, engineering, approvals (PRINCE2: Design Stage)',
                standards: ['prince2', 'pmbok'],
                duration: '4-8 weeks'
            },
            {
                title: 'Procurement',
                description: 'Contractor selection, material sourcing (ISO: Procurement processes)',
                standards: ['iso', 'pmbok'],
                duration: '2-3 weeks'
            },
            {
                title: 'Construction',
                description: 'Sequential building phases, quality control (All standards: Implementation)',
                standards: ['pmbok', 'prince2', 'iso'],
                duration: '12-24 weeks'
            },
            {
                title: 'Handover',
                description: 'Final inspections, documentation, client acceptance (All standards: Project Closure)',
                standards: ['pmbok', 'prince2', 'iso'],
                duration: '1-2 weeks'
            }
        ]
    },
    'research': {
        title: 'Research Project Process',
        description: 'Academic or scientific research with uncertain outcomes',
        steps: [
            {
                title: 'Research Design',
                description: 'Hypothesis formulation, methodology selection (PMBOK: Scope Management)',
                standards: ['pmbok', 'iso'],
                duration: '2-4 weeks'
            },
            {
                title: 'Literature Review',
                description: 'Background research, gap analysis (PRINCE2: Business Case)',
                standards: ['prince2', 'pmbok'],
                duration: '4-6 weeks'
            },
            {
                title: 'Data Collection',
                description: 'Experiments, surveys, observations (ISO: Implementation processes)',
                standards: ['iso', 'pmbok'],
                duration: '8-16 weeks'
            },
            {
                title: 'Analysis',
                description: 'Data processing, statistical analysis, interpretation (All standards: Quality Management)',
                standards: ['pmbok', 'prince2', 'iso'],
                duration: '4-8 weeks'
            },
            {
                title: 'Publication',
                description: 'Report writing, peer review, dissemination (All standards: Communication Management)',
                standards: ['pmbok', 'prince2', 'iso'],
                duration: '4-6 weeks'
            }
        ]
    },
    'event-planning': {
        title: 'Event Planning Process',
        description: 'Time-critical event with multiple stakeholders',
        steps: [
            {
                title: 'Event Conceptualization',
                description: 'Define objectives, target audience, budget (PMBOK: Project Initiation)',
                standards: ['pmbok', 'prince2'],
                duration: '1-2 weeks'
            },
            {
                title: 'Venue & Logistics',
                description: 'Site selection, vendor management, timeline (PRINCE2: Planning Theme)',
                standards: ['prince2', 'pmbok'],
                duration: '2-3 weeks'
            },
            {
                title: 'Marketing & Promotion',
                description: 'Branding, advertising, registration (ISO: Communication processes)',
                standards: ['iso', 'pmbok'],
                duration: '3-4 weeks'
            },
            {
                title: 'Event Execution',
                description: 'Day-of coordination, problem solving (All standards: Implementation)',
                standards: ['pmbok', 'prince2', 'iso'],
                duration: '1-3 days'
            },
            {
                title: 'Post-Event',
                description: 'Feedback collection, financial reconciliation (All standards: Project Closure)',
                standards: ['pmbok', 'prince2', 'iso'],
                duration: '1-2 weeks'
            }
        ]
    }
};

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function saveBookmark(standard, section, title) {
    const bookmark = {
        id: Date.now(),
        standard: standard,
        section: section,
        title: title,
        timestamp: new Date().toISOString()
    };
    
    appState.bookmarks.push(bookmark);
    localStorage.setItem('pmStandardsBookmarks', JSON.stringify(appState.bookmarks));
    showNotification('Bookmark saved successfully!', 'success');
}

function loadBookmarks() {
    const bookmarksContainer = document.getElementById('bookmarksContainer');
    if (!bookmarksContainer) return;
    
    if (appState.bookmarks.length === 0) {
        bookmarksContainer.style.display = 'none';
        return;
    }
    
    let html = '<h4>Your Bookmarks</h4><ul class="bookmark-list">';
    appState.bookmarks.forEach(bookmark => {
        html += `
            <li class="bookmark-item">
                <div class="bookmark-content">
                    <strong>${bookmark.title}</strong>
                    <span class="bookmark-standard">${CONFIG.standards[bookmark.standard].name}</span>
                    <span class="bookmark-date">${new Date(bookmark.timestamp).toLocaleDateString()}</span>
                </div>
                <button onclick="removeBookmark(${bookmark.id})" class="remove-bookmark">
                    <i class="fas fa-times"></i>
                </button>
            </li>
        `;
    });
    html += '</ul>';
    
    bookmarksContainer.innerHTML = html;
    bookmarksContainer.style.display = 'block';
}

function removeBookmark(bookmarkId) {
    appState.bookmarks = appState.bookmarks.filter(b => b.id !== bookmarkId);
    localStorage.setItem('pmStandardsBookmarks', JSON.stringify(appState.bookmarks));
    loadBookmarks();
    showNotification('Bookmark removed', 'info');
}

// Main application functions
function openStandard(standard) {
    showNotification(`Opening ${CONFIG.standards[standard].name} viewer...`, 'info');
    
    // In a real implementation, this would open a detailed viewer
    // For now, we'll simulate the action
    setTimeout(() => {
        showNotification(`${CONFIG.standards[standard].name} loaded successfully!`, 'success');
    }, 1000);
}

function compareTopic(topic) {
    appState.currentComparisonTopic = topic;
    const comparisonView = document.getElementById('comparisonView');
    comparisonView.style.display = 'grid';
    
    // Add animation
    comparisonView.classList.add('fade-in');
    
    // Load comparison data
    if (comparisonData[topic]) {
        document.getElementById('pmbokContent').innerHTML = comparisonData[topic].pmbok.content;
        document.getElementById('prince2Content').innerHTML = comparisonData[topic].prince2.content;
        document.getElementById('isoContent').innerHTML = comparisonData[topic].iso.content;
    } else {
        // Default content for topics not yet implemented
        const defaultContent = `
            <h4>${topic.replace('-', ' ').toUpperCase()}</h4>
            <p>Comparison data for this topic is being developed. This would show:</p>
            <ul>
                <li>Similar approaches across standards</li>
                <li>Key differences in methodology</li>
                <li>Unique elements of each standard</li>
                <li>Deep links to specific sections</li>
            </ul>
            <div class="deep-link" onclick="window.open('/topic/${topic.replace('-', '_')}', '_blank')">
                <i class="fas fa-external-link-alt"></i> View Related Texts
            </div>
        `;
        document.getElementById('pmbokContent').innerHTML = defaultContent;
        document.getElementById('prince2Content').innerHTML = defaultContent;
        document.getElementById('isoContent').innerHTML = defaultContent;
    }
    
    showNotification(`Comparing ${topic.replace('-', ' ')} across all standards`, 'info');
}

function navigateToSection(standard, section) {
    showNotification(`Navigating to ${CONFIG.standards[standard].name} - ${section}`, 'info');
    
    // In a real implementation, this would navigate to the specific section
    // For now, we'll simulate the navigation
    setTimeout(() => {
        showNotification(`Section loaded: ${section}`, 'success');
    }, 500);
}

function selectScenario(scenario, evt) {
    appState.selectedScenario = scenario;
    
    // Remove previous selections
    document.querySelectorAll('.scenario-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    if (evt && evt.target) {
        const card = evt.target.closest('.scenario-card');
        if (card) {
            card.classList.add('selected');
        }
    }
    
    // Enable generate button
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = false;
    
    showNotification(`Selected scenario: ${scenario.replace('-', ' ')}`, 'info');
}

function generateProcess() {
    if (!appState.selectedScenario) {
        showNotification('Please select a project scenario first.', 'error');
        return;
    }
    
    const generatedProcess = document.getElementById('generatedProcess');
    generatedProcess.style.display = 'block';
    generatedProcess.classList.add('fade-in');
    
    const process = processTemplates[appState.selectedScenario];
    let html = `
        <h3>${process.title}</h3>
        <p class="process-description">${process.description}</p>
        <div class="process-steps">
    `;
    
    process.steps.forEach((step, index) => {
        const standardsBadges = step.standards.map(std => 
            `<span class="standard-badge ${std}">${CONFIG.standards[std].name}</span>`
        ).join(' ');
        
        html += `
            <div class="process-step">
                <div class="step-header">
                    <h5>Step ${index + 1}: ${step.title}</h5>
                    <span class="step-duration">${step.duration}</span>
                </div>
                <p>${step.description}</p>
                <div class="step-standards">
                    ${standardsBadges}
                </div>
            </div>
        `;
    });
    
    html += `
        </div>
        <div class="process-recommendations">
            <h5><i class="fas fa-lightbulb"></i> Evidence-Based Recommendations:</h5>
            <ul>
                <li>Combines best practices from PMBOK, PRINCE2, and ISO standards</li>
                <li>Tailored to ${appState.selectedScenario.replace('-', ' ')} project characteristics</li>
                <li>Includes risk management and quality assurance at each step</li>
                <li>Emphasizes stakeholder engagement throughout the process</li>
                <li>Adaptable based on project size and complexity</li>
            </ul>
        </div>
        <div class="process-actions">
            <button onclick="exportProcess()" class="action-button">
                <i class="fas fa-download"></i> Export Process
            </button>
            <button onclick="saveProcessTemplate()" class="action-button">
                <i class="fas fa-save"></i> Save Template
            </button>
        </div>
    `;
    
    generatedProcess.innerHTML = html;
    showNotification('Process generated successfully!', 'success');
}

function exportProcess() {
    const process = processTemplates[appState.selectedScenario];
    const exportData = {
        title: process.title,
        description: process.description,
        scenario: appState.selectedScenario,
        steps: process.steps,
        generatedAt: new Date().toISOString(),
        standards: ['pmbok', 'prince2', 'iso']
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${process.title.replace(/\s+/g, '_')}_Process.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Process exported successfully!', 'success');
}

function saveProcessTemplate() {
    const process = processTemplates[appState.selectedScenario];
    const template = {
        id: Date.now(),
        title: process.title,
        scenario: appState.selectedScenario,
        savedAt: new Date().toISOString()
    };
    
    let savedTemplates = JSON.parse(localStorage.getItem('pmProcessTemplates')) || [];
    savedTemplates.push(template);
    localStorage.setItem('pmProcessTemplates', JSON.stringify(savedTemplates));
    
    showNotification('Process template saved!', 'success');
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length > 2) {
            searchTimeout = setTimeout(() => {
                performSearch(searchTerm);
            }, 300);
        } else {
            clearSearchResults();
        }
    });

    document.addEventListener('click', function(e) {
        const results = document.getElementById('searchResults');
        const input = document.getElementById('searchInput');
        if (!results) return;
        if (e.target !== results && !results.contains(e.target) && e.target !== input) {
            clearSearchResults();
        }
    });
}

function performSearch(searchTerm) {
    const mockResults = [
        { standard: 'pmbok', section: 'risk-management', title: 'Risk Management Performance Domain', relevance: 95 },
        { standard: 'prince2', section: 'risk-theme', title: 'Risk Management Theme', relevance: 90 },
        { standard: 'iso', section: 'risk-processes', title: 'Risk Management Processes', relevance: 85 },
        { standard: 'pmbok', section: 'stakeholder-engagement', title: 'Stakeholder Engagement', relevance: 80 },
        { standard: 'prince2', section: 'organization-theme', title: 'Organization Theme', relevance: 75 },
        { standard: 'iso', section: 'quality', title: 'Quality Management Guidance', relevance: 70 },
        { standard: 'pmbok', section: 'quality', title: 'Quality Management', relevance: 68 }
    ];
    
    const filteredResults = mockResults.filter(result => {
        const hay = `${result.title} ${result.section} ${result.standard}`.toLowerCase();
        return hay.includes(searchTerm);
    });
    
    appState.searchResults = filteredResults;
    displaySearchResults(filteredResults);
}

function displaySearchResults(results) {
    const container = document.getElementById('searchResults');
    if (!container) return;
    
    if (!results || results.length === 0) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    results.slice(0, 12).forEach(r => {
        const stdName = CONFIG.standards[r.standard].name;
        html += `
            <div class="search-result-item" onclick="onResultClick('${r.standard}','${r.section}')">
                <div class="search-result-title">${r.title}</div>
                <div class="search-result-meta">${stdName}</div>
            </div>
        `;
    });
    container.innerHTML = html;
    container.style.display = 'block';
}

function clearSearchResults() {
    const container = document.getElementById('searchResults');
    if (!container) return;
    container.style.display = 'none';
    container.innerHTML = '';
}

function onResultClick(standard, section) {
    const sectionToTopic = {
        'risk-management': 'risk-management',
        'risk-theme': 'risk-management',
        'risk-processes': 'risk-management',
        'stakeholder-engagement': 'stakeholder-engagement',
        'organization-theme': 'stakeholder-engagement',
        'stakeholder-processes': 'stakeholder-engagement',
        'quality': 'quality-management'
    };
    const topic = sectionToTopic[section];
    if (topic) {
        compareTopic(topic);
    }
    navigateToSection(standard, section);
    clearSearchResults();
}

// Application initialization
function initializeApp() {
    console.log('PM Standards Hub initialized');
    
    // Initialize search
    initializeSearch();
    
    // Load bookmarks
    loadBookmarks();
    
    // Add interactive animations
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'k':
                    e.preventDefault();
                    document.getElementById('searchInput').focus();
                    break;
                case 'b':
                    e.preventDefault();
                    // Toggle bookmarks panel
                    const panel = document.getElementById('bookmarksContainer');
                    if (panel) {
                        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
                        if (panel.style.display === 'block') {
                            loadBookmarks();
                        }
                    }
                    break;
            }
        }
    });
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Welcome to PM Standards Hub! Use Ctrl+K to search quickly.', 'info');
    }, 1000);
    
    // Initialize dark mode
    initializeDarkMode();
}

// Dark Mode Functions
function initializeDarkMode() {
    // Apply saved theme on page load
    if (appState.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeToggleIcon(true);
    }
}

function toggleTheme() {
    appState.darkMode = !appState.darkMode;
    
    if (appState.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('darkMode', 'false');
    }
    
    updateThemeToggleIcon(appState.darkMode);
    
    // Show notification
    const mode = appState.darkMode ? 'Dark' : 'Light';
    showNotification(`${mode} mode activated`, 'info');
}

function updateThemeToggleIcon(isDark) {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
        const icon = toggle.querySelector('i');
        const text = toggle.querySelector('span');
        
        if (isDark) {
            icon.className = 'fas fa-sun';
            text.textContent = 'Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Dark Mode';
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for global access
window.openStandard = openStandard;
window.compareTopic = compareTopic;
window.selectScenario = selectScenario;
window.generateProcess = generateProcess;
window.navigateToSection = navigateToSection;
window.exportProcess = exportProcess;
window.saveProcessTemplate = saveProcessTemplate;
window.removeBookmark = removeBookmark;
window.onResultClick = onResultClick;
window.toggleTheme = toggleTheme;
