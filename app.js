// Story writing app with OpenAI
let conversationHistory = [];
let currentStory = '';

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

// Get AI continuation using Netlify serverless function
async function getAIContinuation() {
    const response = await fetch('/.netlify/functions/continue-story', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            currentStory: currentStory
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
    }

    const data = await response.json();
    return data.continuation;
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
        // Focus on input when page loads
        input.focus();
    }
});
