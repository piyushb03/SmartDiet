import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import useUserStore from '../store/userstore';
import CalorieRing from '../components/ui/CalorieRing';
import MacroBar from '../components/ui/MacroBar';
import SettingsModal from '../components/modals/SettingsModal';

export default function Dashboard() {
    const { profile, isSetup, goals, ai } = useUserStore();
    const [showSetup, setShowSetup] = useState(false);
    const dateStr = new Date().toISOString().split('T')[0];
    const todayDisplay = new Date().toDateString();

    useEffect(() => {
        if (!isSetup) setShowSetup(true);
    }, [isSetup]);

    const { data: diary = [] } = useQuery({
        queryKey: ['diary', dateStr],
        queryFn: async () => {
            const { data } = await api.get(`/diary?date=${dateStr}`);
            return data || [];
        },
        enabled: isSetup,
    });

    const totals = diary.reduce((acc, item) => ({
        cal: acc.cal + (Number(item.calories) || 0),
        pro: acc.pro + (Number(item.protein) || 0),
        carb: acc.carb + (Number(item.carbs) || 0),
        fat: acc.fat + (Number(item.fats) || 0),
    }), { cal: 0, pro: 0, carb: 0, fat: 0 });

    const aiKey = ai?.keys?.[ai?.provider];
    const showAiInsight = totals.cal > goals.cal || !aiKey;
    const insightText = totals.cal > goals.cal
        ? "You've exceeded your calorie limit. Try keeping your next meal very light."
        : "Set an AI API key in Settings to unlock custom food lookups.";

    if (!isSetup) {
        return (
            <>
                <div className="max-w-7xl mx-auto p-4 md:p-8 text-center text-slate-400 pt-20">
                    <i className="fas fa-user-circle text-5xl mb-4 opacity-40"></i>
                    <p className="text-lg font-semibold dark:text-slate-300">Welcome to SmartDiet!</p>
                    <p className="text-sm mt-2">Please complete your profile setup to see your dashboard.</p>
                    <button onClick={() => setShowSetup(true)} className="mt-6 bg-brand-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-600 transition-colors">
                        Set Up Profile
                    </button>
                </div>
                {showSetup && <SettingsModal onClose={() => setShowSetup(false)} forceSetup={true} />}
            </>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 pb-12">
            {/* AI Insight Banner */}
            {showAiInsight && (
                <div className="bg-ai-50 dark:bg-ai-900/20 border border-ai-200 dark:border-ai-800 rounded-xl p-4 flex items-start shadow-sm">
                    <i className="fas fa-robot text-ai-500 mt-1 mr-3 text-lg"></i>
                    <div>
                        <h4 className="font-semibold text-ai-900 dark:text-ai-300 text-sm">Smart AI Insight</h4>
                        <p className="text-ai-700 dark:text-ai-400 text-sm mt-1">{insightText}</p>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-end mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {profile?.name ? `Hello, ${profile.name.split(' ')[0]}` : 'Daily Overview'}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{todayDisplay}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calorie Ring */}
                <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 w-full text-left mb-4">Calorie Balance</h3>
                    <CalorieRing consumed={totals.cal} target={goals.cal} />
                    <p className={`mt-4 text-sm font-medium px-3 py-1 rounded-full border ${
                        totals.cal > goals.cal
                            ? 'text-red-600 bg-red-50 border-red-200'
                            : totals.cal > goals.cal * 0.85
                                ? 'text-amber-600 bg-amber-50 border-amber-200'
                                : 'text-brand-600 bg-brand-50 border-brand-200 dark:text-brand-400 dark:bg-brand-500/10 dark:border-brand-500/30'
                    }`}>
                        {totals.cal > goals.cal ? 'Over Limit' : totals.cal > goals.cal * 0.85 ? 'Almost There' : 'On Track'}
                    </p>
                </div>

                {/* Macro Bars */}
                <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-1 hover:shadow-md transition-all duration-300 lg:col-span-2 flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-6">Macronutrients Target</h3>
                    <div className="space-y-6">
                        <MacroBar label="Protein" consumed={totals.pro} target={goals.pro} colorClass="bg-brand-500" />
                        <MacroBar label="Carbs" consumed={totals.carb} target={goals.carb} colorClass="bg-accent-500" />
                        <MacroBar label="Fats" consumed={totals.fat} target={goals.fat} colorClass="bg-amber-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
