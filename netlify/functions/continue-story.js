// Netlify serverless function to handle OpenAI API calls
// Using native fetch API (Node 18+)

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
        const { currentStory } = JSON.parse(event.body);

        if (!currentStory) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'currentStory is required' })
            };
        }

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
