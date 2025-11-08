# ✨ Let's Write a Story! ✨

A fun, interactive collaborative storytelling app where you and AI take turns writing a story together!

## 🎭 What is this?

A playful chat interface where:
1. You write a part of the story
2. AI continues with 2-3 sentences
3. You continue again
4. And so on... creating a unique story together!

## 🚀 How to Use

### For Netlify Deployment (Recommended)

1. **Deploy to Netlify**
   - Fork this repository
   - Connect it to Netlify
   - Add your OpenAI API key as an environment variable named `OPENAI_KEY` in Netlify settings
   - Deploy!

2. **Start Writing**
   - Visit your deployed app
   - Start writing your story immediately
   - Click "Send & Let AI Continue" or press Enter
   - Watch as AI continues your story with creative flair!

### For Local Development

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Set up environment**
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key to the `.env` file

3. **Run locally**
   ```bash
   netlify dev
   ```

## 🎨 Features

- **Secure**: API key stored safely in Netlify environment variables
- **Serverless**: Uses Netlify Functions for secure API calls
- **Fun Design**: Colorful, playful, and casual interface
- **Smooth Experience**: Real-time story building with AI
- **Mobile Friendly**: Works great on phones and tablets
- **Zero Setup**: Just deploy and start writing!

## 🔧 Technical Details

- **Model**: gpt-4o-mini (fast and creative!)
- **Frontend**: Vanilla JavaScript (no dependencies!)
- **Backend**: Netlify serverless functions
- **API**: OpenAI Chat Completions API
- **Deployment**: Netlify with environment variables

## 🎪 Tips for Great Stories

- Start with an interesting hook
- Be creative and don't hold back!
- The AI matches your tone, so have fun with it
- Use the "Fresh Start" button to begin new stories

## 📝 Note

This app uses Netlify serverless functions to securely call the OpenAI API. Your API key is stored as an environment variable in Netlify and never exposed to the client. You'll be charged according to OpenAI's standard rates for API usage.

## 🏗️ Architecture

- **Frontend**: Static HTML/CSS/JS served by Netlify
- **Backend**: Netlify serverless function (`netlify/functions/continue-story.js`)
- **Security**: OpenAI API key stored in Netlify environment variables (not exposed to client)

---

Made with chaos and creativity 💫
