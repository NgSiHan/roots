# AI-Powered Family Activities System

This guide will help you set up and use the AI-powered activity recommendation system for your ROOTS app.

## Features

✨ **Smart Activity Generation** - AI creates personalized family activities based on your preferences

📊 **Preference Learning** - Tracks which categories you complete most (gaming > singing, etc.)

🔄 **Auto-Refill** - Automatically generates new activities when you run low (< 5 activities)

🎯 **Activity Variations** - Creates similar activities to ones you enjoy (e.g., "Virtual Gaming Night" if you love "Family Game Night")

🎨 **Category-Aware** - Focuses on your favorite categories while introducing variety

---

## Setup Instructions

### Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated API key

### Step 2: Add Your API Key

1. Open the file `.env.local` in your project root
2. Replace `your_gemini_api_key_here` with your actual API key:

```env
GEMINI_API_KEY=AIzaSyD...your_actual_key_here
```

3. Save the file

**Important:** Never commit `.env.local` to git! It's already ignored in `.gitignore`.

### Step 3: Restart Your Development Server

```bash
# Stop your current server (Ctrl+C)
# Then restart it:
npm run dev
```

---

## How It Works

### 1. **Auto-Refill System with Circuit Breaker**

When you complete or skip activities, the system monitors your available activities count. When it drops below 5 activities, it **automatically** generates 5 new personalized activities.

**Circuit Breaker Protection:**
- If generation fails 3 times in a row, auto-generation pauses for 5 minutes
- Prevents endless retry loops that could waste API calls
- You can still manually click "✨ AI Generate" button anytime
- After 5 minutes cooldown, auto-generation resumes automatically
- Success resets the failure counter immediately

### 2. **Preference Tracking**

The system analyzes:
- Which **categories** you complete most (bonding, fun, learning, health, creative, outdoor)
- Which **specific activities** you complete most often
- Your **preferred activity duration**
- Total completion history

### 3. **Smart Generation**

Based on your preferences, the AI:
- Creates **variations** of activities you've completed
- Focuses on your **top 3 favorite categories**
- Avoids duplicating existing activities
- Generates activities with your preferred duration

---

## Using the System

### Manual Generation

Click the **"✨ AI Generate"** button at the top of the activities page to manually generate 5 new activities anytime.

### Automatic Generation

The system automatically generates activities when:
- You have fewer than 5 available activities
- You complete or skip an activity

### Visual Feedback

- **Loading State:** Shows a purple/pink banner with "Generating personalized activities..."
- **Error State:** Shows a red banner if generation fails (e.g., API key issue)
- **AI Badge:** AI-generated activities are marked internally (future: could show badge on cards)

---

## Example Workflow

1. **Start:** You have 12 seed activities
2. **Complete:** You complete "Family Board Game Night" (fun category)
3. **Complete:** You complete "Cook a Meal Together" (bonding category)
4. **Learning:** System learns you prefer "fun" and "bonding" categories
5. **Generate:** When activities drop to 4, system auto-generates:
   - "Family Trivia Tournament" (fun, variation of board games)
   - "Recipe Challenge Together" (bonding, variation of cooking)
   - "Karaoke Night" (fun, new idea)
   - "Storytelling Circle" (bonding, new idea)
   - "DIY Game Show" (fun, new idea)

---

## Customization

### Change Circuit Breaker Settings

In [app/activities/page.tsx:75-76](app/activities/page.tsx#L75-L76):

```typescript
// Change max failed attempts (default: 3)
const MAX_FAILED_ATTEMPTS = 3;

// Change cooldown period (default: 5 minutes)
const COOLDOWN_PERIOD = 5 * 60 * 1000; // milliseconds
```

### Change Generation Threshold

In [app/activities/page.tsx:86](app/activities/page.tsx#L86):

```typescript
// Change 5 to any number
if (availableActivities.length < 5 && !isGenerating) {
```

### Change Number of Generated Activities

In [app/activities/page.tsx:187](app/activities/page.tsx#L187):

```typescript
body: JSON.stringify({
  completedActivities: activeTree?.completedActivities || [],
  existingActivities: appState.activitySuggestions,
  count: 5, // Change this number
}),
```

### Adjust AI Prompt

Edit the prompt in [app/api/activities/generate/route.ts:120](app/api/activities/generate/route.ts#L120) to customize:
- Tone and style of activities
- Types of activities generated
- Level of detail in descriptions

---

## Troubleshooting

### Error: "Failed to generate activities"

**Cause:** API key is missing or invalid

**Solution:**
1. Check `.env.local` file exists and contains your API key
2. Verify API key is correct (no extra spaces)
3. Restart your development server

### Error: "Network error - please check your connection"

**Cause:** Cannot reach Gemini API

**Solution:**
1. Check your internet connection
2. Verify Gemini API is accessible in your region
3. Check for firewall/proxy issues

### Activities are not auto-generating

**Possible Causes:**
1. **Circuit breaker activated** - Auto-generation paused after 3 failures (waits 5 minutes)
2. Not enough activity data for preferences
3. JavaScript error in console

**Solution:**
1. Check if error message says "Auto-generation paused for 5 minutes"
   - If yes, wait 5 minutes or click "✨ AI Generate" manually
2. Check browser console for errors (F12)
3. Ensure you have completed activities (preference tracking needs data)
4. Try clicking "✨ AI Generate" button manually to retry immediately

### Activities are too generic

**Solution:**
Complete more activities! The more data the system has about your preferences, the better it can personalize recommendations.

---

## API Details

### Endpoint

`POST /api/activities/generate`

### Request Body

```json
{
  "completedActivities": [...],
  "existingActivities": [...],
  "count": 5
}
```

### Response

```json
{
  "success": true,
  "activities": [
    {
      "id": "ai-1234567890-0",
      "title": "Family Trivia Tournament",
      "description": "Create custom trivia questions...",
      "category": "fun",
      "duration": "1-2 hours",
      "tags": ["Indoor", "Interactive", "Brain game"],
      "aiGenerated": true
    }
  ],
  "preferences": {
    "topCategories": [...],
    "topActivities": [...],
    "preferredDuration": "1-2 hours",
    "totalCompleted": 8
  }
}
```

---

## Future Enhancements

Potential improvements:
- 🏷️ Show "AI-Generated" badge on activity cards
- 💾 Save generation history
- 📈 Show preference dashboard
- 🎯 Let users rate activities to improve recommendations
- 🔄 Regenerate specific activities
- 👨‍👩‍👧‍👦 Consider family member ages in generation
- 🌍 Location-aware activities (indoor/outdoor based on weather)

---

## Security Notes

- ✅ `.env.local` is gitignored and won't be committed
- ✅ API key is only used server-side (Next.js API route)
- ✅ API key is never exposed to the browser
- ⚠️ Don't share your `.env.local` file with anyone
- ⚠️ Don't commit API keys to version control

---

## Support

If you encounter issues:

1. Check this documentation
2. Review browser console for errors (F12)
3. Verify your API key is correct
4. Check [Google AI Studio](https://aistudio.google.com/) for API status

---

**Enjoy your personalized family activities! 🎉**
