// Story writing app with OpenAI
let apiKey = '';
let conversationHistory = [];
let currentStory = '';

// Check for saved API key on load
window.addEventListener('DOMContentLoaded', () => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
        apiKey = savedKey;
        showMainApp();
    }
});

// Save API key and show main app
function saveApiKey() {
    const input = document.getElementById('apiKeyInput');
    const key = input.value.trim();

    if (!key) {
        alert('Please enter your OpenAI API key! 🔑');
        return;
    }

    if (!key.startsWith('sk-')) {
        alert('Hmm, that doesn\'t look like a valid OpenAI API key. They usually start with "sk-" 🤔');
        return;
    }

    apiKey = key;
    localStorage.setItem('openai_api_key', key);
    showMainApp();
}

// Show main app interface
function showMainApp() {
    document.getElementById('apiKeySetup').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('userInput').focus();
}

// Send message and get AI continuation
async function sendMessage() {
    const input = document.getElementById('userInput');
    const userText = input.value.trim();

    if (!userText) {
        alert('Write something first! Let your creativity flow! ✨');
        return;
    }

    // Add user's contribution to the story
    addMessage(userText, 'user');
    currentStory += userText + ' ';
    input.value = '';

    // Disable input while AI is thinking
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;
    sendBtn.textContent = 'AI is writing... 🎨';
    input.disabled = true;

    try {
        // Get AI continuation
        const aiContinuation = await getAIContinuation();
        addMessage(aiContinuation, 'ai');
        currentStory += aiContinuation + ' ';
    } catch (error) {
        console.error('Error:', error);
        alert('Oops! Something went wrong. Check your API key or try again! 😅\n\n' + error.message);
    } finally {
        // Re-enable input
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send & Let AI Continue 🎨';
        input.disabled = false;
        input.focus();
    }
}

// Get AI continuation using OpenAI API
async function getAIContinuation() {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a creative storytelling partner. Continue the story that the user is writing with 2-3 engaging sentences. Be creative, fun, and match the tone of what the user wrote. Keep it light and entertaining. Don\'t end the story - leave room for the user to continue.'
                },
                {
                    role: 'user',
                    content: `Continue this story with 2-3 sentences. Keep it fun and leave it open for me to continue:\n\n${currentStory}`
                }
            ],
            temperature: 0.8,
            max_tokens: 150
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

// Add message to story container
function addMessage(text, type) {
    const container = document.getElementById('storyContainer');

    // Remove welcome message if it exists
    const welcomeMsg = container.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const label = document.createElement('div');
    label.className = 'message-label';
    label.textContent = type === 'user' ? '✍️ You wrote:' : '🎭 AI continues:';

    const content = document.createElement('div');
    content.textContent = text;

    messageDiv.appendChild(label);
    messageDiv.appendChild(content);
    container.appendChild(messageDiv);

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

// Reset the story
function resetStory() {
    if (currentStory && !confirm('Start a fresh story? Your current masterpiece will be lost! 🎨')) {
        return;
    }

    currentStory = '';
    conversationHistory = [];
    const container = document.getElementById('storyContainer');
    container.innerHTML = '<div class="welcome-message"><p>🎪 Fresh canvas! Start your new story adventure!</p></div>';
    document.getElementById('userInput').focus();
}

// Allow Enter key to send (Shift+Enter for new line)
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('userInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    const apiInput = document.getElementById('apiKeyInput');
    if (apiInput) {
        apiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveApiKey();
            }
        });
    }
});
