# AI Meme Generator - Setup Guide

## Prerequisites
- Node.js 16+ installed
- npm installed
- A Google account

---

## Step 1: Get Your Gemini API Key

### 1.1 Go to Google AI Studio
1. Open browser and go to: **https://aistudio.google.com/app/apikey**
2. Click **"Create API Key"** button
3. Select a project or create a new one
4. Copy the API key (you'll use this in Step 2)

### 1.2 Enable the Generative Language API (if needed)
- If you get a quota or permission error, visit:
  - https://console.cloud.google.com/
  - Search for "Generative Language API"
  - Click **Enable**

---

## Step 2: Configure Backend (.env)

### 2.1 In the server folder
```bash
cd server
```

### 2.2 Create `.env` file
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Or manually create `server/.env` with:
```
GEMINI_API_KEY=paste_your_api_key_here
```

### 2.3 Paste your API key
Replace `paste_your_api_key_here` with the key from Step 1.4

**Example:**
```
GEMINI_API_KEY=AIzaSyDxxx...xxxyyy
```

⚠️ **NEVER commit .env to git** — it's already in `.gitignore`

---

## Step 3: Configure Frontend (.env)

### 3.1 In the client folder
```bash
cd client
```

### 3.2 Create `.env` file
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Or manually create `client/.env` with:
```
VITE_API_URL=http://localhost:5000
```

This tells your frontend where the backend API is running.

---

## Step 4: Install & Start (Two Terminal Windows)

### Terminal 1 - Backend Server

```bash
cd server
npm install
npm run dev
```

**Expected output:**
```
Server running on http://localhost:5000
```

### Terminal 2 - Frontend Dev Server

```bash
cd client
npm install
npm run build
npm run dev
```

**Expected output:**
```
  ➜  Local:   http://localhost:5173/
```

---

## Step 5: Test the App

1. Open **http://localhost:5173** in your browser
2. Type a topic (e.g., "monday mornings")
3. Choose a style (Funny / Dark / Relatable)
4. Select a template
5. Click **Generate**
6. Wait for AI to create caption text
7. Download, share, or copy the meme

---

## Troubleshooting

### Backend won't start
- Check `.env` file exists in `server/` folder
- Verify `GEMINI_API_KEY` is set correctly (no extra spaces)
- Run `npm install` in `server/` folder if you haven't

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check `client/.env` has `VITE_API_URL=http://localhost:5000`
- Hard refresh browser (Ctrl+Shift+R)

### "API key invalid" error
- Double-check key in `server/.env`
- Regenerate key from https://aistudio.google.com/app/apikey
- Make sure Generative Language API is enabled

### Build fails with Tailwind errors
- Delete `client/node_modules` and `.next` (if exists)
- Run `npm install` again in `client/`
- Run `npm run build`

---

## Production Deployment

When ready to deploy:

1. **Backend:** Deploy Express server to Heroku, Render, AWS, etc.
   - Set env vars in hosting platform dashboard
   - Point frontend VITE_API_URL to production backend URL

2. **Frontend:** Deploy build output to Netlify, Vercel, etc.
   - Build: `npm run build`
   - Output folder: `dist/`

---

## Folder Structure

```
Meme Generator/
├── server/
│   ├── index.js                 # Express server
│   ├── routes/
│   │   └── caption.js           # Gemini API route
│   ├── .env                     # API keys (CREATE THIS)
│   ├── .env.example             # Template
│   └── package.json
│
└── client/
    ├── src/
    │   ├── App.jsx              # Main app
    │   ├── api.js               # Axios config
    │   ├── components/          # React components
    │   └── index.css            # Tailwind
    ├── public/templates/        # SVG meme templates
    ├── .env                     # Frontend config (CREATE THIS)
    ├── .env.example             # Template
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Commands Reference

```bash
# Backend
cd server
npm install          # Install dependencies
npm run dev          # Start with file watching
npm start            # Start production

# Frontend
cd client
npm install          # Install dependencies
npm run dev          # Start dev server on localhost:5173
npm run build        # Build for production
npm run preview      # Preview production build
```

That's it! Your meme generator is ready to generate AI-powered memes. 🚀
