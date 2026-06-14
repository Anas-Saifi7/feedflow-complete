# 🌊 FeedFlow — Instagram Feed Personalizer

> Automatically shape your Instagram feed based on your interests using smart automation.

---

## 📱 App Screens

| Screen | Description |
|--------|-------------|
| Onboarding | 4-slide intro explaining the product |
| Auth | Register / Login with JWT |
| Preferences | Pick topics you love & want to reduce |
| Instagram Connect | Securely link your Instagram |
| Dashboard | Stats, automation toggle, progress |
| Analytics | Charts, activity log, breakdown |
| Automation | Full control panel with live logs |
| Profile | Account, settings, preferences |

---

## 🛠️ Tech Stack

**Frontend:** React Native + Expo (SDK 51) + Expo Router  
**State:** Zustand + AsyncStorage  
**Backend:** Node.js + Express  
**Database:** MongoDB Atlas (with in-memory fallback)  
**Auth:** JWT  
**Deployment:** Expo EAS (APK) + Render (backend)  

---

## 🚀 Local Setup

### 1. Clone & install

```bash
# Frontend
cd feedflow-app
npm install

# Backend
cd feedflow-backend
npm install
```

### 2. Backend setup

```bash
cd feedflow-backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Frontend setup

```bash
cd feedflow-app
# Update src/constants/theme.ts → API_URL to your backend URL
npx expo start
```

---

## 📦 Build APK (for submission)

```bash
cd feedflow-app

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build Android APK
eas build --platform android --profile preview
```

---

## 🌐 Deploy Backend on Render

1. Push `feedflow-backend` to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set environment variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = any random secret
5. Deploy → copy the URL
6. Update `API_URL` in `src/constants/theme.ts`

---

## 🔐 MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Free cluster
2. Create database `feedflow`
3. Whitelist IP: `0.0.0.0/0` (for Render)
4. Get connection string → paste in `.env`

---

## ⚙️ How Automation Works

```
User selects topics (AI, Tech, Fitness...)
         ↓
FeedFlow maps topics → Instagram hashtags
         ↓
Automation engine runs actions:
  • Like posts under relevant hashtags
  • Follow niche creators
  • Explore topic-specific feeds
  • Unfollow irrelevant accounts
         ↓
Instagram algorithm detects pattern
         ↓
Feed becomes more personalized over time
```

---

## 📊 Analytics Tracked

- Total actions completed
- Sessions run
- Feed personalization score (0–100%)
- Daily action progress vs target
- Action type breakdown (likes / follows / explores)
- Live activity log

---

## 🏗️ Project Structure

```
feedflow-app/
├── app/
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Router/splash
│   ├── onboarding.tsx       # Intro slides
│   ├── auth.tsx             # Login/Register
│   ├── preferences.tsx      # Topic picker
│   ├── connect.tsx          # Instagram connect
│   └── (tabs)/
│       ├── _layout.tsx      # Tab bar
│       ├── index.tsx        # Dashboard
│       ├── analytics.tsx    # Analytics
│       ├── automation.tsx   # Automation control
│       └── profile.tsx      # Profile/Settings
├── src/
│   ├── constants/theme.ts   # Colors, fonts, topics
│   ├── store/appStore.ts    # Zustand global state
│   └── services/api.ts      # Axios API calls

feedflow-backend/
├── src/
│   ├── index.js             # Express server
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── preferences.js
│   │   ├── instagram.js
│   │   └── automation.js
│   └── middleware/auth.js   # JWT middleware
```

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| POST | /api/preferences | Save topics |
| GET | /api/preferences/:userId | Get topics |
| POST | /api/instagram/connect | Connect Instagram |
| POST | /api/instagram/disconnect | Disconnect |
| GET | /api/instagram/status/:userId | Get status |
| POST | /api/automation/start | Start engine |
| POST | /api/automation/stop | Stop engine |
| POST | /api/automation/run-session | Run action |
| GET | /api/automation/stats/:userId | Get stats |
| GET | /health | Health check |

---

## 🎨 Design System

- **Primary:** Purple `#A855F7`
- **Accent:** Cyan `#06B6D4`
- **Background:** Deep dark `#060609`
- **Style:** Glassmorphism + gradient orbs
- **Font:** System (SF Pro / Roboto)

---

Built with 💜 for the FeedFlow Hackathon
