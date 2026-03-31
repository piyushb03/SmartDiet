import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import useUserStore from '../../store/userstore';

const baseFoodDB = [
    { id: 'f1', name: 'Roti (Atta)', category: 'Indian', unit: 'piece', cals: 100, pro: 3, carb: 15, fat: 1 },
    { id: 'f2', name: 'White Rice', category: 'Indian', unit: 'bowl', cals: 200, pro: 4, carb: 45, fat: 0.5 },
    { id: 'f3', name: 'Yellow Dal Tadka', category: 'Indian', unit: 'bowl', cals: 150, pro: 9, carb: 20, fat: 3 },
    { id: 'f4', name: 'Paneer (Raw)', category: 'Dairy', unit: '100g', cals: 265, pro: 18, carb: 1, fat: 20 },
    { id: 'f5', name: 'Chicken Breast', category: 'Meat', unit: '100g', cals: 165, pro: 31, carb: 0, fat: 3 },
    { id: 'f6', name: 'Boiled Egg', category: 'Dairy/Meat', unit: 'egg', cals: 78, pro: 6, carb: 0.5, fat: 5 },
    { id: 'f7', name: 'Apple', category: 'Fruit', unit: 'medium', cals: 95, pro: 0.5, carb: 25, fat: 0.3 },
    { id: 'f8', name: 'Banana', category: 'Fruit', unit: 'medium', cals: 105, pro: 1.3, carb: 27, fat: 0.3 },
    { id: 'f9', name: 'Oats (Dry)', category: 'Grain', unit: '50g', cals: 190, pro: 6, carb: 30, fat: 4 },
    { id: 'f10', name: 'Mango', category: 'Fruit', unit: '100g', cals: 60, pro: 0.8, carb: 15, fat: 0.4 },
];

export default function AddFoodModal({ onClose, dateStr }) {
    const [query, setQuery] = useState('');
    const [customFoods, setCustomFoods] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const queryClient = useQueryClient();
    const { ai } = useUserStore();

    const addFoodMutation = useMutation({
        mutationFn: (foodData) => api.post('/diary', foodData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['diary', dateStr] });
            onClose();
        },
        onError: (err) => {
            setAiError('Failed to add food: ' + (err.response?.data?.error || err.message));
        },
    });

    const handleAdd = (food) => {
        addFoodMutation.mutate({
            food_name: food.name,
            calories: food.cals,
            protein: food.pro,
            carbs: food.carb,
            fats: food.fat,
            qty: 1,
            unit: food.unit,
            base_cals: food.cals,
            base_pro: food.pro,
            base_carbs: food.carb,
            base_fats: food.fat,
            date: dateStr,
        });
    };

    const handleAiSearch = async () => {
        if (!query.trim()) return;
        const aiKey = ai?.keys?.[ai?.provider];
        if (!aiKey) {
            setAiError('Please set your AI API key in Settings first.');
            return;
        }
        setAiError('');
        setAiLoading(true);
        try {
            const { data } = await api.post('/ai/search-food', {
                provider: ai.provider,
                query: query.trim(),
                apiKey: ai?.keys?.[ai?.provider] || '',
            });
            if (data && data.name) {
                setCustomFoods(prev => [...prev, data]);
                setQuery('');
            }
        } catch (err) {
            setAiError('AI fetch failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setAiLoading(false);
        }
    };

    const fullDB = [...baseFoodDB, ...customFoods];
    const filtered = fullDB.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[55] flex flex-col justify-end md:items-center md:justify-center">
            <div className="bg-white dark:bg-darkCard w-full md:max-w-md rounded-t-3xl md:rounded-2xl shadow-2xl p-5 flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add to Diary</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="flex space-x-2 mb-4">
                    <div className="relative flex-1">
                        <i className="fas fa-search absolute left-3 top-3 text-slate-400"></i>
                        <input
                            type="text"
                            placeholder="Search foods..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={handleAiSearch} disabled={aiLoading}
                        className="bg-ai-500 hover:bg-ai-600 text-white px-4 rounded-xl text-sm font-medium flex-shrink-0 shadow-md transition-colors disabled:opacity-70"
                        title="Search with AI"
                    >
                        {aiLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
                    </button>
                </div>

                {aiError && <p className="text-xs text-red-500 mb-3 px-1">{aiError}</p>}

                <div className="flex-1 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
                    {filtered.map((food) => {
                        const isCustom = !food.id.startsWith('f') || food.id.startsWith('ai_');
                        return (
                            <div
                                key={food.id}
                                onClick={() => handleAdd(food)}
                                className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 cursor-pointer transition-colors"
                            >
                                <div className="text-left">
                                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                                        {food.name} {isCustom && <i className="fas fa-magic text-ai-400 text-[10px] ml-1"></i>}
                                    </p>
                                    <p className="text-xs text-slate-500">{food.cals} kcal / {food.unit}</p>
                                </div>
                                <button className="w-8 h-8 rounded-full bg-brand-50 dark:bg-slate-700 text-brand-500 flex-shrink-0 flex items-center justify-center">
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>
                        );
                    })}
                    {filtered.length === 0 && !aiLoading && (
                        <p className="text-sm text-center text-slate-400 mt-4">
                            No results. Click <i className="fas fa-magic text-ai-500"></i> to search with AI.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
