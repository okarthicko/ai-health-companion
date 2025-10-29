// ==========================================================
//  AI Health Companion - Main JavaScript File
// ==========================================================

// ---------------------- Health Responses ----------------------
const healthResponses = {
    'headache': 'For headaches, try resting in a dark room, staying hydrated, and consider over-the-counter pain relief. If persistent, consult your doctor.',
    'fever': 'Monitor your temperature regularly. Stay hydrated, rest, and consider fever-reducing medication. Seek medical attention if fever exceeds 103°F (39.4°C).',
    'cough': 'For dry coughs, try honey and warm liquids. If persistent, or accompanied by other symptoms, please consult a healthcare professional.',
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
    
    for (const [keyword, response] of Object.entries(healthResponses)) {
        if (lowerMessage.includes(keyword)) {
            return response;
        }
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        return 'I can help you track symptoms, provide health information, remind you about medications, and answer wellness questions. Try asking about specific symptoms or health topics!';
    }
    
    if (lowerMessage.includes('emergency')) {
        return '🚨 For medical emergencies, call 911 immediately. I can help with general health information, but cannot replace emergency medical care.';
    }
    
    return 'I understand you\'re asking about your health. While I can provide general information, please consult with a healthcare professional for personalized medical advice. Can you tell me more about your specific concern?';
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, true);
        input.value = '';
        
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

  uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) {
      alert('Please upload a skin image first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    uploadBtn.innerText = 'Scanning...';
    uploadBtn.disabled = true;

    try {
      // ⚠️ IMPORTANT: REPLACE THIS URL with your live Render URL
      const response = await fetch('https://ai-health-companion-593l.onrender.com', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      // Get the result elements
      const resultBox = document.getElementById('scanResult');
      const predictionText = document.getElementById('predictionText');
      
      // Display the new, real prediction
      predictionText.innerHTML = `<strong>${data.condition}</strong> (${data.probability}%)`;
      resultBox.style.display = 'block';

    } catch (err) {
      alert('Error connecting to backend: ' + err.message);
    }

    uploadBtn.innerText = 'Scan Now';
    uploadBtn.disabled = false;
  });
}

// ==========================================================
//  Health Stats Updates
// ==========================================================
function updateStats() {
    const steps = document.getElementById('steps');
    if (!steps) return;
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
