# ⚡ FitGPT

FitGPT is a modern, local-first, AI-powered personal training companion. By combining the power of **Google Gemini** with local IndexedDB storage (**Dexie.js**), FitGPT crafts highly personalized, safe, and progressive workout regimens based on your physical metrics, fitness goals, and actual historic performance.

The interface is built with React and styled with a custom dark-mode, glassmorphism cyberpunk aesthetic that is fluid and fully responsive.

---

## 🚀 Key Features

- **Personalized AI Workouts**: Generates exercises, sets, reps, target weights, and rest periods matching your exact age, height, weight, fitness level, and primary goals.
- **Historic Adaptation & Progressive Overload**: Automatically analyzes your last 10 workouts. If previous sessions were too easy, it steps up the challenge. If they were too hard, it scales back intensity to facilitate proper recovery.
- **Injury & Limitation Guardrails**: List your physical limitations or current injuries during onboarding, and the AI automatically adjusts exercise selection to keep you safe.
- **Local-First & Privacy-Focused**: Your personal profile and training logs are saved locally in your browser's IndexedDB via Dexie.js. Your data never leaves your device except for secure prompt processing via the Gemini API.
- **Interactive Workout Tracker**: Mark off exercises in real-time, rate the perceived exertion (Good/Medium/Hard) for individual movements, and log a detailed session review.
- **API Key Guard**: An integrated validation tool that tests your Gemini API key before saving, ensuring seamless configuration.

---

## 🛠️ Technology Stack

- **Frontend Core**: [React 19](https://react.dev/) & [Vite](https://vite.dev/)
- **AI Engine**: [Google Generative AI SDK (`@google/generative-ai`)](https://www.npmjs.com/package/@google/generative-ai)
- **Local Database**: [Dexie.js](https://dexie.org/) (IndexedDB wrapper)
- **Styling**: Vanilla CSS (Cyberpunk neon theme, Outfit and JetBrains Mono typography, custom glassmorphism)

---

## 📂 Project Architecture

```
FitGPT/
├── public/                  # Static assets
├── src/
│   ├── config/
│   │   └── db.js            # Dexie.js IndexedDB database configuration
│   ├── services/
│   │   └── aiService.js     # Gemini API integration & prompt engineering
│   ├── components/
│   │   ├── OnBoarding.jsx   # Onboarding and profile management form
│   │   ├── CheckAPIButton.jsx # Real-time Gemini API key validation
│   │   ├── Dashboard.jsx    # Home dashboard, parameters form, and history list
│   │   └── WorkoutTodo.jsx  # Interactive, live workout checklist with ratings
│   ├── App.jsx              # App entry point (switches Onboarding vs Dashboard)
│   ├── App.css              # Dashboard and component styling
│   ├── index.css            # Base styles, variables, typography, scrollbars
│   └── main.jsx             # React entry mounting
├── .env                     # Local environment variables
├── package.json             # Scripts and package dependencies
└── vite.config.js           # Vite server configuration
```

---

## 💾 Local Database Schema (Dexie.js)

FitGPT uses a local database named `FitGPT` with the following stores:

| Store Name | Primary Key | Keys / Schema | Description |
| :--- | :--- | :--- | :--- |
| **`profile`** | `++id` | `date` | Contains personal stats (height, weight, age, fitness level, goals, injuries) and the encrypted/saved Gemini API key. |
| **`history`** | `++id` | `date` | Log of all completed sessions, storing completed exercises, sets, reps, weights, individual exercise feedback, and general notes. |

---

## ⚙️ Setup and Installation

### Prerequisites

- Node.js (v18 or higher recommended)
- A Google Gemini API Key. You can get one from the [Google AI Studio](https://aistudio.google.com/).

### Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd FitGPT
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_MODEL=gemini-2.5-flash
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:5173` to view the application.

---

## 💡 How It Works (AI Prompt & Context Engineering)

When you request a workout, the app performs a local query to fetch your profile data and your last 10 logged exercises. It then injects this context into a highly structured system prompt. 

Gemini acts as an expert trainer, executing:
1. **Goal-Based Programming**: Directing reps and volumes toward muscle building, weight loss, or maintenance.
2. **Injury Adaptation**: Dynamically substituting movements (e.g., swapping back squats for leg presses if a lower back injury is listed).
3. **Session Length Management**: Ensuring the exercise list, sets, and rest intervals fit within your requested time limit (e.g., 30, 45, or 60 minutes).
4. **Structured JSON Output**: Forcing the AI to reply with standard JSON conforming to React's rendering models.

---

## ⚠️ Disclaimer

FitGPT is an AI-powered helper tool designed for recreational fitness planning. The workout recommendations generated by Google Gemini do not constitute professional medical or personal training advice. Please consult with a physician or physical therapist before beginning any new training program, especially if you have chronic pain or pre-existing injuries.
