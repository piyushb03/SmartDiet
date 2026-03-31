import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './services/supabaseClient';
import useUserStore from './store/userstore';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import MealPlan from './pages/MealPlan';
import Diary from './pages/Diary';
import Navbar from './components/layout/Navbar';

function App() {
    const { userAuth, setAuth, fetchProfile, theme } = useUserStore();

    useEffect(() => {
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [theme]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setAuth(session);
            if (session) fetchProfile();
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuth(session);
            if (session) fetchProfile();
            else {
                // Reset store on logout
                useUserStore.setState({ profile: null, isSetup: false, customMealPlan: null });
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <Router>
            <div className="min-h-screen bg-slate-50 dark:bg-darkBg text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
                {/* Only show Navbar (app header) when logged in */}
                {userAuth && <Navbar />}
                <Routes>
                    <Route path="/" element={!userAuth ? <Landing /> : <Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={userAuth ? <Dashboard /> : <Navigate to="/" />} />
                    <Route path="/plan" element={userAuth ? <MealPlan /> : <Navigate to="/" />} />
                    <Route path="/diary" element={userAuth ? <Diary /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
