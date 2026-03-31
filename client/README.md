# SmartDiet 💪🏼 - Frontend(Client)

The **SmartDiet Client** is a lightning-fast, mobile-responsive frontend built with **React + Vite**. It enables users to track daily macros, log meals, and interact with an AI backend that generates personalized meal plans based on biometrics and goals.

---

## ✨ Features

### 📊 Dynamic Macro Dashboard

* Real-time calorie tracking with animated SVG rings
* Macronutrient progress bars with smooth updates

### 🤖 AI-Powered Meal Plans

* Generates structured 4-meal daily plans
* Integrated with **Google Gemini / Groq APIs**
* Personalized based on user biometrics

### 📔 Smart Food Diary

* Add, search, and delete food entries
* Clean, optimized UI for daily tracking

### 🌗 Dark / Light Mode

* Fully responsive UI with Tailwind CSS
* Seamless theme switching

### 🔐 Secure Authentication

* Powered by **Supabase Auth (JWT-based)**
* Persistent login sessions

### ⚡ Optimistic UI Updates

* Instant UI feedback using **TanStack React Query**

### 🧠 Global State Management

* Lightweight and scalable state via **Zustand**

---

## 🛠️ Tech Stack

| Category      | Technology          | Description              |
| ------------- | ------------------- | ------------------------ |
| Framework     | React 18 + Vite     | Fast, modern frontend    |
| Styling       | Tailwind CSS        | Utility-first CSS        |
| Animations    | Framer Motion       | Smooth UI transitions    |
| State Mgmt    | Zustand             | Global state handling    |
| Data Fetching | React Query + Axios | API handling & caching   |
| Auth / BaaS   | Supabase JS         | Authentication & backend |

---

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have installed:

* Node.js (v18 or higher)
* npm or yarn

---

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/piyushb03/SmartDiet.git
cd SmartDiet/client
npm install
```

---

### 3. Environment Variables

Create a `.env` file inside the `client` folder and add:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key

# Backend API
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### 4. Run the App

```bash
npm run dev
```

Now open 👉 **[http://localhost:5173](http://localhost:5173)**

---

## 📁 Project Structure

```bash
client/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # App pages (Dashboard, Diary, MealPlan)
│   ├── services/        # API + Supabase configs
│   ├── store/           # Zustand state management
│   ├── App.jsx          # Routing + Auth handling
│   └── main.jsx         # Entry point
├── .env
└── tailwind.config.js
```

---


## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo
# Create a new branch
git checkout -b feature/your-feature

# Commit changes
git commit -m "Added new feature"

# Push
git push origin feature/your-feature
```
