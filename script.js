// Global variables
let warningCount = 0;
const MAX_WARNINGS = 3;
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
let savedPages = JSON.parse(localStorage.getItem('savedPages')) || [];
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || null;

// Abusive words detection
const abusiveWords = [
    'abuse', 'hate', 'kill', 'stupid', 'idiot', 'dumb', 'sucks', 'trash',
    'cringe', 'disgusting', 'vulgarity', 'offensive', 'bad', 'worst'
];

// ===== AUTHENTICATION FUNCTIONS =====
function handleGoogleAuth() {
    console.log('Google Auth initiated');
    userProfile = {
        name: 'Google User',
        email: 'user@gmail.com',
        provider: 'google'
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    showWelcomePage();
}

function handleFacebookAuth() {
    console.log('Facebook Auth initiated');
    userProfile = {
        name: 'Facebook User',
        email: 'user@facebook.com',
        provider: 'facebook'
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    showWelcomePage();
}

function handleGuestAuth() {
    console.log('Guest Auth initiated');
    userProfile = {
        name: 'Guest User',
        email: 'guest@joyeduai.com',
        provider: 'guest'
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    showWelcomePage();
}

function showSignup() {
    alert('Create Account Page - Enter your details to create a new account');
    // In a real app, this would show a signup form
}

// ===== PAGE NAVIGATION =====
function showWelcomePage() {
    hidePage('auth-page');
    showPage('welcome-page');
    setTimeout(() => {
        goToDashboard();
    }, 2000);
}

function goToDashboard() {
    hidePage('welcome-page');
    showPage('dashboard-page');
    displayRecentSearches();
}

function showPage(pageId) {
    document.getElementById(pageId).classList.add('active');
}

function hidePage(pageId) {
    document.getElementById(pageId).classList.remove('active');
}

// ===== SIDEBAR MENU =====
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

function viewRecent() {
    toggleMenu();
    displayRecentSearches();
    alert('Showing Recently Searched topics');
}

function viewCourses() {
    toggleMenu();
    alert('My Courses - Access your enrolled courses here');
}

function viewSaved() {
    toggleMenu();
    displaySavedPages();
}

function viewProfile() {
    toggleMenu();
    if (userProfile) {
        alert(`Profile:\nName: ${userProfile.name}\nEmail: ${userProfile.email}\nProvider: ${userProfile.provider}`);
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        userProfile = null;
        warningCount = 0;
        hidePage('dashboard-page');
        showPage('auth-page');
    }
}

// ===== SEARCH FUNCTIONALITY =====
function handleSearch(event) {
    if (event.key === 'Enter') {
        const searchTerm = document.getElementById('search-input').value.trim();
        if (searchTerm) {
            searchTopic(searchTerm);
        }
    }
}

function searchTopic(topic) {
    // Check for abusive content
    if (containsAbusiveContent(topic)) {
        showWarning();
        return;
    }

    // Check if education-related
    if (!isEducationRelated(topic)) {
        alert('⚠️ This topic is not education-related. Please search for educational topics only.');
        return;
    }

    // Add to recent searches
    if (!recentSearches.includes(topic)) {
        recentSearches.unshift(topic);
        if (recentSearches.length > 10) {
            recentSearches.pop();
        }
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }

    // Display topic details
    const message = `Great! Learning about ${topic}. Let me fetch educational resources for you...`;
    addBotMessage(message);
    document.getElementById('search-input').value = '';
    displayRecentSearches();
}

function displayRecentSearches() {
    const recentList = document.getElementById('recent-list');
    recentList.innerHTML = '';

    if (recentSearches.length === 0) {
        recentList.innerHTML = '<p class="empty-state">No recent searches yet</p>';
        return;
    }

    recentSearches.forEach(search => {
        const div = document.createElement('div');
        div.className = 'recent-item';
        div.innerHTML = `
            <span onclick="searchTopic('${search}')" style="cursor: pointer; flex: 1;">📌 ${search}</span>
            <button class="save-btn" onclick="savePage('${search}')">💾 Save</button>
        `;
        recentList.appendChild(div);
    });
}

// ===== CONTENT MODERATION =====
function containsAbusiveContent(text) {
    const lowerText = text.toLowerCase();
    return abusiveWords.some(word => lowerText.includes(word));
}

function isEducationRelated(topic) {
    const educationKeywords = [
        'math', 'science', 'history', 'english', 'language', 'physics', 'chemistry',
        'biology', 'geography', 'literature', 'grammar', 'algebra', 'geometry',
        'social', 'economics', 'coding', 'programming', 'python', 'javascript',
        'education', 'learn', 'study', 'essay', 'exam', 'quiz', 'course'
    ];
    const lowerTopic = topic.toLowerCase();
    return educationKeywords.some(keyword => lowerTopic.includes(keyword));
}

function showWarning() {
    warningCount++;
    const warningMessage = document.getElementById('warning-message');

    if (warningCount < MAX_WARNINGS) {
        warningMessage.textContent = 
            `Please maintain educational standards. This is warning ${warningCount}/${MAX_WARNINGS}.`;
        document.getElementById('warning-number').textContent = warningCount;
        document.getElementById('warning-modal').classList.add('active');
    } else {
        warningMessage.textContent = 
            `You have received 3 warnings. I don't know about your behavior anymore. Session restricted.`;
        document.getElementById('warning-number').textContent = '3';
        document.getElementById('warning-modal').classList.add('active');
        // Disable chat after 3 warnings
        disableChat();
    }
}

function closeWarning() {
    document.getElementById('warning-modal').classList.remove('active');
}

function disableChat() {
    document.getElementById('chat-input').disabled = true;
    document.getElementById('chat-input').placeholder = 'Chat disabled due to policy violations';
    addBotMessage('Your chat has been disabled due to repeated warnings. Please respect educational guidelines.');
}

// ===== ATTACHMENT MENU =====
function toggleAttachmentMenu() {
    const menu = document.getElementById('attachment-menu');
    menu.classList.toggle('active');
}

function openCamera() {
    toggleAttachmentMenu();
    alert('📷 Camera Feature - Open device camera to capture photos for learning');
}

function openGallery() {
    toggleAttachmentMenu();
    alert('🖼️ Photo Gallery - Select photos from your device for educational use');
}

function openFiles() {
    toggleAttachmentMenu();
    alert('📁 File Manager - Upload documents, PDFs, images for learning purposes');
}

// ===== CHAT INTERFACE =====
function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();

    if (!message) return;

    // Check if chat is disabled
    if (warningCount >= MAX_WARNINGS) {
        alert('Chat is disabled. Please respect educational guidelines.');
        return;
    }

    // Check for abusive content
    if (containsAbusiveContent(message)) {
        showWarning();
        chatInput.value = '';
        return;
    }

    // Add user message
    addUserMessage(message);
    chatInput.value = '';

    // Generate bot response
    setTimeout(() => {
        const response = generateBotResponse(message);
        addBotMessage(response);
    }, 500);
}

function addUserMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `<p>${escapeHtml(message)}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = `<p>${escapeHtml(message)}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotResponse(userMessage) {
    const responses = {
        'math': '📐 Mathematics is fascinating! Would you like to learn about algebra, geometry, calculus, or statistics?',
        'science': '🔬 Science covers many topics! Interested in physics, chemistry, biology, or earth science?',
        'history': '📜 History helps us understand the past! Which historical period interests you?',
        'language': '🌐 Language learning is important! Which language would you like to study?',
        'programming': '💻 Programming is a valuable skill! Learn Python, JavaScript, Java, or other languages.',
        'help': '📚 I\'m here to help! Ask me about any educational topic and I\'ll provide resources and explanations.',
        'study': '📖 Study tips: Create a schedule, take breaks, practice problems, and review regularly!',
        'exam': '✏️ Exam preparation: Start early, understand concepts, practice tests, and manage time well.'
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }

    return '📚 That\'s an interesting question! Could you provide more details about what you\'d like to learn?';
}

// ===== SAVED PAGES =====
function savePage(pageName) {
    if (!savedPages.includes(pageName)) {
        savedPages.push(pageName);
        localStorage.setItem('savedPages', JSON.stringify(savedPages));
    }
    
    document.getElementById('saved-page-name').textContent = `✓ Page saved: "${pageName}"`;
    document.getElementById('save-modal').classList.add('active');
}

function closeSaveModal() {
    document.getElementById('save-modal').classList.remove('active');
}

function displaySavedPages() {
    if (savedPages.length === 0) {
        alert('No saved pages yet. Save topics while learning!');
        return;
    }
    alert(`Saved Pages:\n\n${savedPages.join('\n')}`);
}

// ===== UTILITY FUNCTIONS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (userProfile) {
        goToDashboard();
    } else {
        showPage('auth-page');
    }

    // Close attachment menu when clicking outside
    document.addEventListener('click', function(event) {
        const attachmentMenu = document.getElementById('attachment-menu');
        const dotsMenu = document.querySelector('.dots-menu');
        
        if (attachmentMenu && !attachmentMenu.contains(event.target) && !dotsMenu.contains(event.target)) {
            attachmentMenu.classList.remove('active');
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (window.innerWidth <= 768) {
            if (sidebar && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
});

// Welcome message on load
window.addEventListener('load', function() {
    setTimeout(() => {
        if (userProfile) {
            addBotMessage(`Welcome back, ${userProfile.name}! 👋 How can I help you learn today?`);
        }
    }, 1000);
});