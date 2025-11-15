// Netlify serverless function to handle OpenAI API calls
// Using native fetch API (Node 18+)

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
    'סיפור אימה קוסמי בסגנון לאבקראפט' // Lovecraftian cosmic horror
];

function getRandomStyle() {
    return storyStyles[Math.floor(Math.random() * storyStyles.length)];
}

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Get API key from environment variable
    const apiKey = process.env.OPENAI_KEY;

    if (!apiKey) {
        console.error('OPENAI_KEY environment variable is not set');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server configuration error' })
        };
    }

    try {
        // Parse the request body
        const { currentStory, style } = JSON.parse(event.body);

        if (!currentStory) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'currentStory is required' })
            };
        }

        if (!style) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'style is required' })
            };
        }

        // Build system prompt with the selected style
        const systemPrompt = `אתה שותף יצירתי לכתיבת סיפורים בעברית. הסגנון שנבחר לסיפור הזה הוא: ${style}.

חשוב מאוד: עליך לכתוב רק בעברית! כל המשפטים, כל המילים, הכל צריך להיות בעברית בלבד.

המשך את הסיפור ב-2-3 משפטים מרתקים בסגנון הזה. התאם את הטון, השפה והאווירה לסגנון שנבחר. היה יצירתי, מעניין ומשעשע. אל תסיים את הסיפור - השאר מקום למשתמש להמשיך. כתוב רק בעברית!`;

        // Call OpenAI API
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
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: `המשך את הסיפור הזה ב-2-3 משפטים. שמור על הכיף והשאר אותו פתוח כדי שאוכל להמשיך. זכור: כתוב רק בעברית!\n\n${currentStory}`
                    }
                ],
                temperature: 0.8,
                max_tokens: 150
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('OpenAI API error:', error);
            return {
                statusCode: response.status,
                body: JSON.stringify({
                    error: error.error?.message || 'OpenAI API request failed'
                })
            };
        }

        const data = await response.json();
        const aiContinuation = data.choices[0].message.content.trim();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                continuation: aiContinuation
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to process request: ' + error.message
            })
        };
    }
};
