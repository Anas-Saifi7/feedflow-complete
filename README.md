# FeedFlow 🚀

A full-stack social media automation and content personalization platform built with React Native (Expo), Node.js, Express, and MongoDB Atlas.

## 🌐 Live Links

### Frontend

https://feedflow-complete.vercel.app/

### Backend API

https://feedflow-complete.onrender.com/

### GitHub Repository

https://github.com/Anas-Saifi7/feedflow-complete

---

# 📖 Overview

FeedFlow helps users personalize their social media experience by selecting preferred content categories, avoiding unwanted topics, managing Instagram integrations, and tracking automation activities through a modern analytics dashboard.

The project demonstrates a complete full-stack architecture with:

* Mobile & Web Frontend
* REST API Backend
* MongoDB Database
* Authentication System
* User Preference Management
* Automation Dashboard
* Cloud Deployment

---

# ✨ Features

## 🔐 Authentication

* User Registration
* Secure Login
* JWT Token Authentication
* Session Persistence

## 🎯 Content Preferences

Users can:

* Select preferred content categories
* Avoid unwanted topics
* Customize content experience

Supported categories include:

* Technology
* Artificial Intelligence
* Startups
* Finance
* Fitness
* Health
* Education
* Travel
* Gaming
* Design
* Photography
* Music
* Crypto
* Science

---

## 📸 Instagram Integration

* Connect Instagram account
* Monitor connection status
* Manage linked accounts

---

## 🤖 Automation System

* Start automation sessions
* Stop automation sessions
* View automation statistics
* Track session activity
* Monitor engagement progress

---

## 📊 Analytics Dashboard

* Activity Tracking
* Performance Metrics
* Automation Statistics
* Progress Monitoring

---

# 🛠 Technology Stack

## Frontend

* React Native
* Expo
* Expo Router
* TypeScript
* Zustand
* Axios
* AsyncStorage

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* JWT Authentication
* Helmet
* CORS
* Express Rate Limiting

## Deployment

### Frontend

* Vercel

### Backend

* Render

### Database

* MongoDB Atlas

---

# 📂 Project Structure

```text
feedflow-complete
│
├── feedflow-app
│   ├── app
│   ├── src
│   │   ├── services
│   │   ├── store
│   │   ├── constants
│   │   └── components
│   ├── package.json
│   └── app.json
│
├── feedflow-backend
│   ├── src
│   │   ├── routes
│   │   ├── models
│   │   ├── middleware
│   │   └── index.js
│   ├── package.json
│   └── .env
│
└── README.md

# ⚙️ Local Setup

## Clone Repository

```bash
git clone https://github.com/Anas-Saifi7/feedflow-complete.git
cd feedflow-complete
```

# 🚀 Frontend Setup

Navigate to frontend:

```bash
cd feedflow-app
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npx expo start
```

Run web version:

```bash
npm run web
```

# 🚀 Backend Setup

Navigate to backend:

```bash
cd feedflow-backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Start development server:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:3000
```

# 🔗 API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```
## Preferences

### Save Preferences

```http
POST /api/preferences
```

### Get Preferences

```http
GET /api/preferences/:userId
```

## Instagram

### Connect Instagram

```http
POST /api/instagram/connect
```

### Disconnect Instagram

```http
POST /api/instagram/disconnect
```

### Get Status

```http
GET /api/instagram/status/:userId
```
## Automation

### Start Automation

```http
POST /api/automation/start
```

### Stop Automation

```http
POST /api/automation/stop
```
### Automation Stats

```http
GET /api/automation/stats/:userId
```
### Run Session

```http
POST /api/automation/run-session
# ☁️ Deployment

## Frontend Deployment

Platform: Vercel

URL:https://feedflow-complete.vercel.app/

## Backend Deployment

Platform: Render

URL:https://feedflow-complete.onrender.com/
## Database

MongoDB Atlas Cloud Database

# 🔒 Security Features

* JWT Authentication
* Password Hashing
* Helmet Security Middleware
* Rate Limiting
* CORS Protection
* Secure API Communication

---

# 📈 Future Improvements

* Real Instagram OAuth Integration
* AI-Powered Content Recommendations
* Advanced Analytics Dashboard
* Push Notifications
* Multi-Platform Social Media Support
* Scheduled Automation Tasks

---

# 👨‍💻 Author

**Anas**

GitHub:
https://github.com/Anas-Saifi7

---

# 📄 License

This project is developed for educational, internship, and portfolio purposes.
