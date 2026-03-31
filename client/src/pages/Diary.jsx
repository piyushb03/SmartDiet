import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import AddFoodModal from '../components/modals/AddFoodModal';

export default function Diary() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const dateStr = new Date().toISOString().split('T')[0];

    const { data: diary = [], isLoading } = useQuery({
        queryKey: ['diary', dateStr],
        queryFn: async () => {
            const { data } = await api.get(`/diary?date=${dateStr}`);
            return data || [];
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/diary/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['diary', dateStr] }),
    });

    const updateQtyMutation = useMutation({
        mutationFn: ({ id, qty, calories, protein, carbs, fats }) =>
            api.patch(`/diary/${id}`, { qty, calories, protein, carbs, fats }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['diary', dateStr] }),
    });

    const handleQtyChange = (item, newQty) => {
        let q = parseFloat(newQty);
        if (isNaN(q) || q <= 0) q = 1;
        // Use stored base values if available, else divide current total by current qty
        const currentQty = item.qty || 1;
        const baseCals = item.base_cals ?? (item.calories / currentQty);
        const basePro = item.base_pro ?? (item.protein / currentQty);
        const baseCarbs = item.base_carbs ?? (item.carbs / currentQty);
        const baseFats = item.base_fats ?? (item.fats / currentQty);

        updateQtyMutation.mutate({
            id: item.id,
            qty: q,
            calories: baseCals * q,
            protein: basePro * q,
            carbs: baseCarbs * q,
            fats: baseFats * q,
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 pb-12 space-y-6">
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Food Diary</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-brand-500/20 transition-colors"
                >
                    <i className="fas fa-plus mr-2"></i> Add Food
                </button>
            </div>

            <div className="bg-white dark:bg-darkCard rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-slate-500">Loading your diary...</div>
                ) : diary.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        <i className="fas fa-utensils text-4xl mb-3 opacity-50"></i>
                        <p>No food logged today. Add items to track your progress.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {diary.map((item) => (
                            <li key={item.id} className="py-3 px-4 flex justify-between items-center group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex-1 min-w-0 pr-4 text-left">
                                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{item.food_name}</p>
                                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                        P:{Math.round(item.protein)} C:{Math.round(item.carbs)} F:{Math.round(item.fats)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
                                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded px-2 py-1">
                                        <input
                                            type="number"
                                            defaultValue={item.qty || 1}
                                            min="0.1" step="0.1"
                                            onBlur={(e) => handleQtyChange(item, e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleQtyChange(item, e.target.value)}
                                            className="w-10 bg-transparent text-center font-bold text-sm text-brand-600 dark:text-brand-400 focus:outline-none"
                                        />
                                        <span className="text-[10px] text-slate-500 font-medium ml-1">{item.unit || 'x'}</span>
                                    </div>
                                    <div className="text-right w-12 sm:w-16">
                                        <p className="font-bold text-sm text-slate-700 dark:text-slate-300">{Math.round(item.calories)}</p>
                                        <p className="text-[9px] text-slate-400 uppercase font-bold">kcal</p>
                                    </div>
                                    <button
                                        onClick={() => deleteMutation.mutate(item.id)}
                                        className="text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <i className="fas fa-trash-alt text-sm"></i>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {isModalOpen && <AddFoodModal onClose={() => setIsModalOpen(false)} dateStr={dateStr} />}
        </div>
    );
}
