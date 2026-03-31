import { useState } from 'react';
import useUserStore from '../store/userstore';
import api from '../services/api';

function formatTime(time24) {
    if (!time24) return 'Flexible';
    const [h, m] = time24.split(':');
    const hours = parseInt(h);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formatted = hours % 12 || 12;
    return `${formatted}:${m} ${ampm}`;
}

function getMealMeta(mealName, timings) {
    const lower = (mealName || '').toLowerCase();
    if (lower.includes('breakfast') || lower.includes('morning')) return { time: timings.breakfast, icon: 'fa-sun text-amber-500' };
    if (lower.includes('lunch') || lower.includes('mid')) return { time: timings.lunch, icon: 'fa-briefcase text-brand-600' };
    if (lower.includes('snack') || lower.includes('eve')) return { time: timings.snack, icon: 'fa-coffee text-amber-700' };
    if (lower.includes('dinner') || lower.includes('night')) return { time: timings.dinner, icon: 'fa-moon text-indigo-500' };
    return { time: timings.breakfast, icon: 'fa-utensils text-brand-500' };
}

function buildDefaultMeals(goals, timings, profile) {
    const isVeg = profile?.diet === 'veg' || profile?.diet === 'vegan';
    const cal = goals.cal;
    return [
        {
            name: 'Breakfast',
            time: timings.breakfast,
            icon: 'fa-sun text-amber-500',
            targetCals: Math.round(cal * 0.25),
            optionsHtml: `
                <li class="flex items-start mb-3"><i class="fas fa-check-circle text-brand-500 mt-1 mr-3 flex-shrink-0"></i><span><strong>Option 1 (Complex Carbs):</strong> 40g rolled oats cooked in 200ml unsweetened almond or skim milk, topped with 15g chia seeds and half a sliced apple.</span></li>
                ${isVeg
                    ? `<li class="flex items-start mb-2"><i class="fas fa-check-circle text-brand-500 mt-1 mr-3 flex-shrink-0"></i><span><strong>Option 2 (High Protein):</strong> 2 medium besan chillas (gram flour pancakes) stuffed with 50g low-fat paneer, served with fresh mint chutney.</span></li>`
                    : `<li class="flex items-start mb-2"><i class="fas fa-check-circle text-brand-500 mt-1 mr-3 flex-shrink-0"></i><span><strong>Option 2 (High Protein):</strong> 3-egg omelette (1 whole, 2 whites) with spinach and bell peppers, alongside 1 slice of whole-grain sourdough toast.</span></li>`
                }
            `,
        },
        {
            name: 'Lunch',
            time: timings.lunch,
            icon: 'fa-briefcase text-brand-600',
            targetCals: Math.round(cal * 0.35),
            optionsHtml: `
                <li class="flex items-start mb-3"><i class="fas fa-check-circle text-brand-500 mt-1 mr-3 flex-shrink-0"></i><span><strong>Option 1 (Balanced Traditional):</strong> 2 multigrain rotis or 150g cooked brown rice, 1 medium bowl of yellow dal, 100g mixed greens, and a side cucumber salad.</span></li>
                ${isVeg
                    ? `<li class="flex items-start mb-2"><i class="fas fa-check-circle text-brand-500 mt-1 mr-3 flex-shrink-0"></i><span><strong>Option 2 (Macro-Focused):</strong> 150g grilled tofu or paneer tikka, 100g roasted sweet potatoes, and a large serving of steamed broccoli.</span></li>`
                    : `<li class="flex items-start mb-2"><i class="fas fa-check-circle text-brand-500 mt-1 mr-3 flex-shrink-0"></i><span><strong>Option 2 (Macro-Focused):</strong> 150g grilled chicken breast seasoned with herbs, 100g roasted sweet potatoes, and a large serving of steamed broccoli.</span></li>`
                }
            `,
        },
        {
            name: 'Mid-Day Snack',
            time: timings.snack,
            icon: 'fa-coffee text-amber-700',
            targetCals: Math.round(cal * 0.15),
            optionsHtml: `
                <li class="flex items-start mb-3"><i class="fas fa-check-circle text-brand-500 mt-1 mr-3 flex-shrink-0"></i><span><strong>Option 1 (Quick Energy):</strong> 1 cup of unsweetened Greek yogurt (or plain Dahi) topped with a handful of antioxidant-rich mixed berries.</span></li>
                <li class="flex items-start mb-2"><i class="fas fa-check-circle text-brand-500 mt-1 mr-3 flex-shrink-0"></i><span><strong>Option 2 (Satiety Focus):</strong> 1 cup of green tea or black coffee served with 20g of dry roasted almonds and walnuts.</span></li>
            `,
        },
        {
            name: 'Dinner',
            time: timings.dinner,
            icon: 'fa-moon text-indigo-500',
            targetCals: Math.round(cal * 0.25),
            optionsHtml: `
                <li class="flex items-start mb-3"><i class="fas fa-check-circle text-brand-500 mt-1 mr-3 flex-shrink-0"></i><span><strong>Option 1 (Low Carb &amp; Light):</strong> A large bowl of clear vegetable broth alongside a fresh garden salad dressed with 1 tsp olive oil and lemon juice.</span></li>
                ${isVeg
                    ? `<li class="flex items-start mb-2"><i class="fas fa-check-circle text-brand-500 mt-1 mr-3 flex-shrink-0"></i><span><strong>Option 2 (Lean Recovery):</strong> 150g sautéed paneer or soya chunks with bell peppers, zucchini, and mushrooms cooked in minimal oil.</span></li>`
                    : `<li class="flex items-start mb-2"><i class="fas fa-check-circle text-brand-500 mt-1 mr-3 flex-shrink-0"></i><span><strong>Option 2 (Lean Recovery):</strong> 150g baked white fish or grilled chicken tenderloins with a side of sautéed garlic green beans.</span></li>`
                }
            `,
        },
    ];
}

export default function MealPlan() {
    const { profile, goals, timings, ai, customMealPlan, setCustomMealPlan } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generatePlan = async () => {
        const aiKey = ai?.keys?.[ai?.provider];
        if (!aiKey) {
            setError('Please set your AI API key in Settings first.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/ai/generate', {
                provider: ai.provider,
                profile,
                targets: { cal: goals.cal, pro: goals.pro },
                apiKey: ai?.keys?.[ai?.provider] || '',
            });
            setCustomMealPlan(data.meals || data);
        } catch (err) {
            setError('Could not generate meal plan. ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Build meals to render
    let mealsToRender = [];
    if (customMealPlan && customMealPlan.length > 0) {
        mealsToRender = customMealPlan.map(m => {
            const { time, icon } = getMealMeta(m.name, timings);
            const optionsHtml = Array.isArray(m.options)
                ? m.options.map((opt, i) => `<li class="flex items-start mb-2"><i class="fas fa-check-circle text-brand-500 mt-1 mr-3 flex-shrink-0"></i><span><strong>Option ${i + 1}:</strong> ${opt}</span></li>`).join('')
                : '';
            return { ...m, time, icon, optionsHtml };
        });
    } else {
        mealsToRender = buildDefaultMeals(goals, timings, profile);
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 pb-12 space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Personalized Meal Plan</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Based on your goals and preferences.</p>
                </div>
                <button
                    onClick={generatePlan} disabled={loading}
                    className="bg-ai-500 hover:bg-ai-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-ai-500/20 flex items-center disabled:opacity-70"
                >
                    {loading
                        ? <><i className="fas fa-spinner fa-spin mr-2"></i> Generating...</>
                        : <><i className="fas fa-magic mr-2"></i> Ask AI to generate plan</>
                    }
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400">
                    <i className="fas fa-exclamation-circle mr-2"></i>{error}
                </div>
            )}

            <div className="space-y-6">
                {mealsToRender.map((m, idx) => (
                    <div key={idx} className="bg-white dark:bg-darkCard rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                                <i className={`fas ${m.icon} mr-2`}></i>
                                {m.name}
                                <span className="text-sm font-normal text-slate-500 ml-2">{formatTime(m.time)}</span>
                            </h4>
                            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded font-medium">
                                ~{m.targetCals} kcal
                            </span>
                        </div>
                        <ul className="text-sm text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: m.optionsHtml }}></ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
