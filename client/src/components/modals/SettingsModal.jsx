import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import useUserStore from '../../store/userstore';

function timeToMins(t) {
    if (!t) return 0;
    const [h, m] = t.split(':');
    return parseInt(h || 0) * 60 + parseInt(m || 0);
}

export default function SettingsModal({ onClose, forceSetup = false }) {
    const { profile, timings, ai, isSetup, updateProfile } = useUserStore();

    const [formData, setFormData] = useState({
        name: '', weight: '', height: '', age: '', goal: 'lose', diet: 'veg', region: 'north',
    });
    const [mealTimings, setMealTimings] = useState({ breakfast: '08:30', lunch: '13:30', snack: '17:00', dinner: '20:00' });
    const [aiProvider, setAiProvider] = useState('gemini');
    const [aiKeyGemini, setAiKeyGemini] = useState('');
    const [aiKeyGroq, setAiKeyGroq] = useState('');
    const [notifEnabled, setNotifEnabled] = useState(false);
    const [timingError, setTimingError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                weight: profile.weight || '',
                height: profile.height || '',
                age: profile.age || '',
                goal: profile.goal || 'lose',
                diet: profile.diet || 'veg',
                region: profile.region || 'north',
            });
        }
        if (timings) setMealTimings(timings);
        if (ai) {
            setAiProvider(ai.provider || 'gemini');
            setAiKeyGemini(ai.keys?.gemini || '');
            setAiKeyGroq(ai.keys?.groq || '');
        }
    }, [profile, timings, ai]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleTimingChange = (e) => setMealTimings({ ...mealTimings, [e.target.name]: e.target.value });

    const handleSave = async () => {
        setTimingError('');

        // Validate required fields
        if (!formData.name || !formData.weight || !formData.height || !formData.age) {
            setTimingError('Please fill in all required profile fields.');
            return;
        }

        const { breakfast: tb, lunch: tl, snack: ts, dinner: td } = mealTimings;
        if (tb && tl && timeToMins(tl) < timeToMins(tb) + 180) {
            setTimingError('Error: Lunch must be at least 3 hours after Breakfast.');
            return;
        }
        if (tl && td && timeToMins(td) < timeToMins(tl) + 180) {
            setTimingError('Error: Dinner must be at least 3 hours after Lunch.');
            return;
        }

        if (notifEnabled && typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
            await Notification.requestPermission();
        }

        setSaving(true);
        // updateProfile is optimistic — it updates local state immediately
        // then tries to persist to DB (non-blocking)
        await updateProfile({
            ...formData,
            weight: parseFloat(formData.weight) || 70,
            height: parseFloat(formData.height) || 170,
            age: parseInt(formData.age) || 25,
            timings: mealTimings,
            ai_provider: aiProvider,
            ai_key_gemini: aiKeyGemini.trim(),
            ai_key_groq: aiKeyGroq.trim(),
            ai: { provider: aiProvider, keys: { gemini: aiKeyGemini.trim(), groq: aiKeyGroq.trim() } },
        });
        setSaving(false);
        if (onClose) onClose();
    };

    // Keep form onSubmit handler as a thin wrapper
    const handleSubmit = (e) => { e.preventDefault(); handleSave(); };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        if (onClose) onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-darkCard w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
                    <h3 className="text-lg font-bold dark:text-white">
                        {forceSetup ? "Welcome! Let's setup your profile." : 'Settings & Profile'}
                    </h3>
                    {!forceSetup && (
                        <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition">
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    {/* Profile */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">First Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Weight (kg)</label>
                            <input type="number" name="weight" value={formData.weight} onChange={handleChange} required
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Height (cm)</label>
                            <input type="number" name="height" value={formData.height} onChange={handleChange} required
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} required
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Primary Goal</label>
                            <select name="goal" value={formData.goal} onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white">
                                <option value="lose">Fat Loss</option>
                                <option value="maintain">Maintenance</option>
                                <option value="gain">Muscle Gain</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Diet Preference</label>
                            <select name="diet" value={formData.diet} onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white">
                                <option value="veg">Vegetarian</option>
                                <option value="nonveg">Non-Vegetarian</option>
                                <option value="vegan">Vegan</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Region/Cuisine</label>
                            <select name="region" value={formData.region} onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white">
                                <option value="north">North Indian</option>
                                <option value="south">South Indian</option>
                                <option value="global">Global/Mixed</option>
                            </select>
                        </div>
                    </div>

                    {/* AI Engine */}
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Universal AI Engine</h4>
                        <p className="text-xs text-slate-500 mb-3">Select your preferred AI provider to power generation.</p>
                        <div className="flex flex-col space-y-3">
                            <select value={aiProvider} onChange={(e) => setAiProvider(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white font-semibold text-ai-600 dark:text-ai-400">
                                <option value="gemini">Google Gemini API</option>
                                <option value="groq">Groq (Llama 3) API</option>
                            </select>
                            {aiProvider === 'gemini' ? (
                                <input type="password" value={aiKeyGemini} onChange={(e) => setAiKeyGemini(e.target.value)}
                                    placeholder="Enter Gemini API Key (AIzaSy...)"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
                            ) : (
                                <input type="password" value={aiKeyGroq} onChange={(e) => setAiKeyGroq(e.target.value)}
                                    placeholder="Enter Groq API Key (gsk_...)"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
                            )}
                        </div>
                    </div>

                    {/* Meal Timings */}
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Custom Meal Timings</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Breakfast', key: 'breakfast' },
                                { label: 'Lunch', key: 'lunch' },
                                { label: 'Snack', key: 'snack' },
                                { label: 'Dinner', key: 'dinner' },
                            ].map(({ label, key }) => (
                                <div key={key}>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>
                                    <input type="time" name={key} value={mealTimings[key]} onChange={handleTimingChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
                                </div>
                            ))}
                        </div>
                        {timingError && <p className="text-xs text-red-500 mt-2 font-medium">{timingError}</p>}
                    </div>

                    {/* Push Notifications */}
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Push Notifications</h4>
                                <p className="text-xs text-slate-500">Get reminders to eat at your scheduled times.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={notifEnabled} onChange={(e) => setNotifEnabled(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-500"></div>
                            </label>
                        </div>
                    </div>
                </form>

                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-between bg-slate-50 dark:bg-slate-800">
                    {!forceSetup && (
                        <button type="button" onClick={handleLogout} className="text-red-500 text-sm font-medium hover:underline">
                            Log Out
                        </button>
                    )}
                    <button
                        type="button" onClick={handleSave} disabled={saving}
                        className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-md ml-auto disabled:opacity-70"
                    >
                        {saving ? 'Saving...' : 'Save & Calculate'}
                    </button>
                </div>
            </div>

            {/* Force setup: show after login if profile not set */}
        </div>
    );
}
