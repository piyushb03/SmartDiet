import { create } from 'zustand';
import api from '../services/api';

// BMR/TDEE calculation (Mifflin-St Jeor, sedentary)
function calculateGoals(profile) {
    const w = parseFloat(profile.weight) || 70;
    const h = parseFloat(profile.height) || 170;
    const a = parseInt(profile.age) || 25;
    const goal = profile.goal || 'lose';

    let bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
    let tdee = bmr * 1.2;

    if (goal === 'lose') tdee -= 500;
    if (goal === 'gain') tdee += 300;

    const cal = Math.round(tdee);
    const pro = Math.round(w * (goal === 'gain' ? 1.8 : 1.5));
    const fat = Math.round((tdee * 0.25) / 9);
    const carb = Math.round((tdee - (pro * 4) - (fat * 9)) / 4);

    return { cal, pro, carb, fat };
}

const useUserStore = create((set, get) => ({
    userAuth: null,
    profile: null,
    isSetup: false,
    goals: { cal: 2000, pro: 130, carb: 200, fat: 55 },
    timings: { breakfast: '08:30', lunch: '13:30', snack: '17:00', dinner: '20:00' },
    ai: { provider: 'gemini', keys: { gemini: '', groq: '' } },
    customMealPlan: null,
    theme: 'light',

    setAuth: (session) => set({ userAuth: session }),
    setTheme: (theme) => set({ theme }),
    setCustomMealPlan: (plan) => set({ customMealPlan: plan }),

    fetchProfile: async () => {
        try {
            const { data } = await api.get('/users/profile');
            if (data) {
                const goals = calculateGoals(data);
                set({
                    profile: data,
                    isSetup: true,
                    goals,
                    timings: data.timings || { breakfast: '08:30', lunch: '13:30', snack: '17:00', dinner: '20:00' },
                    ai: {
                        provider: data.ai_provider || 'gemini',
                        keys: { gemini: data.ai_key_gemini || '', groq: data.ai_key_groq || '' },
                    },
                });
            } else {
                set({ profile: null, isSetup: false });
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    },

    updateProfile: async (profileData) => {
        const goals = calculateGoals(profileData);
        const newTimings = profileData.timings || get().timings;
        const newAi = profileData.ai || get().ai;

        // ✅ Optimistic update: set local state immediately so the app works
        // even if the DB save fails due to missing columns
        set({
            profile: profileData,
            isSetup: true,
            goals,
            timings: newTimings,
            ai: newAi,
        });

        // Try to persist to backend
        try {
            const payload = {
                ...profileData,
                goal_cal: goals.cal,
                goal_pro: goals.pro,
                goal_carb: goals.carb,
                goal_fat: goals.fat,
            };
            const { data } = await api.post('/users/profile', payload);
            // Update with DB-confirmed values (keeps id etc.)
            set({ profile: data });
        } catch (error) {
            // DB save failed (e.g. migration not run yet) — local state still works
            console.warn('Profile not persisted to DB:', error?.response?.data?.error || error.message);
        }
    },
}));

export default useUserStore;
