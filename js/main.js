// ==========================================================
//  AI Health Companion - Main JavaScript File
// ==========================================================

// ---------------------- Health Responses ----------------------
const healthResponses = {
    'headache': 'For headaches, try resting in a dark room, staying hydrated, and consider over-the-counter pain relief. If persistent, consult your doctor.',
    'fever': 'Monitor your temperature regularly. Stay hydrated, rest, and consider fever-reducing medication. Seek medical attention if fever exceeds 103°F (39.4°C).',
    'cough': 'For dry coughs, try honey and warm liquids. If persistent or accompanied by other symptoms, please consult a healthcare professional.',
    'stress': 'Try deep breathing exercises, meditation, or light exercise. Maintaining regular sleep and talking to someone can help manage stress.',
    'exercise': 'Regular exercise is great! Aim for 150 minutes of moderate activity weekly. Start slowly and gradually increase intensity.',
    'diet': 'A balanced diet with fruits, vegetables, lean proteins, and whole grains supports good health. Stay hydrated and limit processed foods.',
    'sleep': 'Adults need 7-9 hours of quality sleep. Maintain a consistent sleep schedule and create a relaxing bedtime routine.',
    'water': 'Aim for 8 glasses of water daily. Increase intake during exercise or hot weather. Your urine color can indicate hydration levels.'
};

// ==========================================================
//  Chatbot Functionality
// ==========================================================
function addMessage(message, isUser = false) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.innerHTML = isUser ? message : `<strong>AI Assistant:</strong> ${message}`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for specific health topics
    for (const [keyword, response] of Object.entries(healthResponses)) {
        if (lowerMessage.includes(keyword)) {
            return response;
        }
    }
    
    // General responses
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        return 'I can help you track symptoms, provide health information, remind you about medications, and answer wellness questions. Try asking about specific symptoms or health topics!';
    }
    
    if (lowerMessage.includes('emergency')) {
        return '🚨 For medical emergencies, call 911 immediately. I can help with general health information, but cannot replace emergency medical care.';
    }
    
    // Default response
    return 'I understand you\'re asking about your health. While I can provide general information, please consult with a healthcare professional for personalized medical advice. Can you tell me more about your specific concern?';
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, true);
        input.value = '';
        
        // Simulate AI thinking time
        setTimeout(() => {
            const response = getAIResponse(message);
            addMessage(response);
        }, 1000);
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// ==========================================================
//  Quick Action Buttons
// ==========================================================
function addSymptom() {
    const result = document.getElementById('quickActionResult');
    result.style.display = 'block';
    result.innerHTML = '✅ Symptom logged successfully. What symptoms are you experiencing?';
    document.getElementById('chatInput').value = 'I want to log a symptom: ';
    document.getElementById('chatInput').focus();
}

function addMedication() {
    const result = document.getElementById('quickActionResult');
    result.style.display = 'block';
    result.innerHTML = '💊 Medication reminder set. Which medication did you take?';
}

function scheduleAppointment() {
    const result = document.getElementById('quickActionResult');
    result.style.display = 'block';
    result.innerHTML = '📅 Opening appointment scheduler... (Feature coming soon)';
}

function emergencyContact() {
    const result = document.getElementById('quickActionResult');
    result.style.display = 'block';
    result.innerHTML = '🚨 Emergency contacts: Call 911 for immediate help. Your emergency contact: John Doe (555-0123)';
}

// ==========================================================
//  Skin Scanner (New Feature)
// ==========================================================
function setupSkinScanner() {
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('skinImage');

    uploadBtn.addEventListener('click', () => {
        if (!fileInput.files[0]) {
            alert('Please upload a skin image first!');
            return;
        }

        uploadBtn.innerText = 'Scanning...';
        uploadBtn.disabled = true;

        // Simulate a scanning process (fake AI result for demo)
        setTimeout(() => {
            const acne = Math.floor(Math.random() * 50) + 50; // 50–100%
            const eczema = 100 - acne;

            document.getElementById('acneScore').textContent = acne + '%';
            document.getElementById('eczemaScore').textContent = eczema + '%';
            document.getElementById('scanResult').style.display = 'block';

            uploadBtn.innerText = 'Scan Now';
            uploadBtn.disabled = false;
        }, 1500);
    });
}

// ==========================================================
//  Health Stats Updates
// ==========================================================
function updateStats() {
    const steps = document.getElementById('steps');
    if (!steps) return; // Prevents error if element not found
    const currentSteps = parseInt(steps.textContent.replace(',', ''));
    steps.textContent = (currentSteps + Math.floor(Math.random() * 10)).toLocaleString();
}

// ==========================================================
//  Initialization
// ==========================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ AI Health Companion loaded successfully!');
    
    // Initialize features
    setupSkinScanner();
    
    // Auto update stats every 30 seconds
    setInterval(updateStats, 30000);
});

// ==========================================================
//  Exports (for testing or modular usage)
// ==========================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addMessage,
        getAIResponse,
        sendMessage,
        handleKeyPress,
        addSymptom,
        addMedication,
        scheduleAppointment,
        emergencyContact,
        updateStats,
        setupSkinScanner
    };
}
