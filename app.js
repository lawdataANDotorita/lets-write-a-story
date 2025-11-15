// Story writing app with OpenAI
let conversationHistory = [];
let currentStory = '';
let currentStyle = null;

// Story styles and periods in Hebrew
const storyStyles = [
    'מותחן ויקטוריאני', // Victorian thriller
    'קומדיה מימי הביניים', // Medieval comedy
    'מדע בדיוני עתידני', // Futuristic sci-fi
    'רומן רומנטי מהמאה ה-19', // 19th century romance
    'מסתורין בסגנון נואר', // Noir mystery
    'פנטזיה אפית', // Epic fantasy
    'אימה גותית', // Gothic horror
    'הרפתקה פיראטים', // Pirate adventure
    'דרמה שייקספירית', // Shakespearean drama
    'סאטירה חברתית מודרנית', // Modern social satire
    'מערבון פראי', // Wild west
    'אגדה יוונית עתיקה', // Ancient Greek legend
    'סיפור בלשי בסגנון שרלוק הולמס', // Sherlock Holmes detective story
    'רומן מדעי בסגנון ג\'ול ורן', // Jules Verne scientific romance
    'סיפור אימה קוסמי בסגנון לאבקראפט', // Lovecraftian cosmic horror
    'מחזמר במאה ה-20' // 20th century musical
];

function getRandomStyle() {
    return storyStyles[Math.floor(Math.random() * storyStyles.length)];
}

// Send message and get AI continuation
async function sendMessage() {
    const input = document.getElementById('userInput');
    const userText = input.value.trim();

    if (!userText) {
        alert('כתבו משהו קודם! תנו לפנטזיה לזרום! ✨');
        return;
    }

    // Add user's contribution to the story
    addMessage(userText, 'user');
    currentStory += userText + ' ';
    input.value = '';

    // Disable input while AI is thinking
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;
    sendBtn.textContent = 'הבינה המלאכותית כותבת... 🎨';
    input.disabled = true;

    try {
        // Get AI continuation
        const aiContinuation = await getAIContinuation();

        addMessage(aiContinuation, 'ai');
        currentStory += aiContinuation + ' ';
    } catch (error) {
        console.error('Error:', error);
        alert('אופס! משהו השתבש. בדקו את המפתח או נסו שוב! 😅\n\n' + error.message);
    } finally {
        // Re-enable input
        sendBtn.disabled = false;
        sendBtn.textContent = 'שלח ותן לבינה המלאכותית להמשיך 🎨';
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
            currentStory: currentStory,
            style: currentStyle
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'בקשת API נכשלה');
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
    label.textContent = type === 'user' ? '✍️ כתבת:' : '🎭 הבינה המלאכותית ממשיכה:';

    const content = document.createElement('div');
    content.textContent = text;

    messageDiv.appendChild(label);
    messageDiv.appendChild(content);
    container.appendChild(messageDiv);

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

// Display the story style
function displayStyle(style) {
    const styleInfo = document.getElementById('styleInfo');
    styleInfo.innerHTML = `<p>🎭 <strong>סגנון הסיפור:</strong> ${style}</p>`;
    styleInfo.style.display = 'block';
}

// Reset the story
function resetStory() {
    if (currentStory && !confirm('להתחיל סיפור חדש? יצירת המופת הנוכחית תאבד! 🎨')) {
        return;
    }

    currentStory = '';
    conversationHistory = [];
    const container = document.getElementById('storyContainer');
    container.innerHTML = '<div class="welcome-message"><p>🎪 קנבס חדש! התחילו את הרפתקת הסיפור החדשה שלכם!</p></div>';

    // Select new random style
    currentStyle = getRandomStyle();
    displayStyle(currentStyle);

    document.getElementById('userInput').focus();
}

// Allow Enter key to send (Shift+Enter for new line)
document.addEventListener('DOMContentLoaded', () => {
    // Select random style on page load
    currentStyle = getRandomStyle();
    displayStyle(currentStyle);

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
