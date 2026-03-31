import React from 'react';

export default function MacroBar({ label, consumed, target, colorClass }) {
    const percentage = Math.min((consumed / target) * 100, 100) || 0;
    
    return (
        <div>
            <div className="flex justify-between text-sm mb-2">
                <span className="font-medium flex items-center text-slate-700 dark:text-slate-300">
                    <div className={`w-3 h-3 rounded-full mr-2 ${colorClass}`}></div>{label}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-200">
                    {Math.round(consumed)}g <span className="text-xs font-normal text-slate-400">/ {target}g</span>
                </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div 
                    className={`${colorClass} h-3 rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}