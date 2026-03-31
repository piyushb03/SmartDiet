import React from 'react';

export default function CalorieRing({ consumed, target }) {
    const percentage = Math.min((consumed / target) * 100, 100) || 0;
    const circumference = 339.292; // 2 * pi * r (where r = 54)
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    let colorClass = "text-brand-500";
    if (percentage > 100) colorClass = "text-red-500";
    else if (percentage > 85) colorClass = "text-amber-500";

    return (
        <div className="relative w-48 h-48 flex items-center justify-center mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-700" />
                <circle 
                    cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" 
                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
                    strokeLinecap="round" className={`transition-all duration-1000 ease-out ${colorClass}`} 
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{Math.round(consumed)}</span>
                <span className="text-xs text-slate-500 mt-1">/ {target} kcal</span>
            </div>
        </div>
    );
}
