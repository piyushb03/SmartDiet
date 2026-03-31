SmartDiet 💪 - Client (Frontend)The frontend application for SmartDiet, a hyper-personalized AI nutrition engine. This client is built for high performance and a seamless user experience, utilizing modern React patterns, global state management, and real-time data fetching.🛠️ Tech StackFramework: React.js (Bootstrapped with Vite)Styling: Tailwind CSS + Framer Motion (Animations)State Management: Zustand (Global user state & theme)Data Fetching: TanStack Query (React Query) + AxiosAuthentication: Supabase Auth (JWT based)Routing: React Router v6📂 Project Structureclient/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components (Modals, Navbar, Progress Rings)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Main views (Landing, Dashboard, MealPlan, Diary)
│   ├── services/       # API configuration (Axios instances, Supabase client)
│   ├── store/          # Zustand global state (userStore.js)
│   ├── App.jsx         # App routing and theme wrapper
│   └── main.jsx        # Entry point & React Query Provider
├── .env                # Environment variables
└── tailwind.config.js  # Tailwind theme and plugin configuration
🚀 Getting Started1. PrerequisitesMake sure you have Node.js installed (v18+ recommended).2. InstallationNavigate to the client directory and install the dependencies:cd client
npm install
3. Environment VariablesCreate a .env file in the root of the client directory and add your Supabase and local API configurations:# Your Supabase Project URL (Found in Project Settings -> API)
VITE_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)

# Your Supabase Anon Public Key
VITE_SUPABASE_ANON_KEY=your_anon_public_key

# Your local Node.js backend URL
VITE_API_BASE_URL=http://localhost:5000/api
4. Running the ApplicationStart the Vite development server:npm run dev
The application will be available at http://localhost:5173.🔐 Authentication FlowThis application uses Supabase Auth. When a user logs in via the AuthModal, Supabase provisions a JWT access token. This token is automatically intercepted by our Axios instance (src/services/api.js) and attached as a Bearer token to every backend request ensuring secure communication with our Node.js server.