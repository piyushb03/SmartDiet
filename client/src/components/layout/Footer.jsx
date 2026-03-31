import React from 'react';

export default function Footer() {
    return (
        <footer className="text-center p-4 text-xs text-slate-400 dark:text-slate-500 space-x-4 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-darkCard/50 flex-shrink-0">
            <span className="cursor-pointer hover:text-brand-500 transition-colors">Terms of Service</span>
            <span>|</span>
            <span className="cursor-pointer hover:text-brand-500 transition-colors">Privacy Policy</span>
            <span>|</span>
            <span className="cursor-pointer hover:text-amber-500 transition-colors">
                <i className="fas fa-exclamation-triangle mr-1"></i> AI Disclaimer
            </span>
        </footer>
    );
}