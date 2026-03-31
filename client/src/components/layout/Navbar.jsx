import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useUserStore from '../../store/userstore';
import SettingsModal from '../modals/SettingsModal';

export default function Navbar() {
    const { profile, theme, setTheme } = useUserStore();
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const location = useLocation();

    const avatarLetter = profile?.name?.charAt(0).toUpperCase() || 'U';

    const navLinks = [
        { to: '/dashboard', id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
        { to: '/plan', id: 'plan', label: 'Meal Plan', icon: 'fa-calendar-day' },
        { to: '/diary', id: 'diary', label: 'Diary', icon: 'fa-utensils' },
    ];

    const isActive = (to) => location.pathname === to;

    return (
        <>
            <header className="backdrop-blur-md bg-white/80 dark:bg-darkCard/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/dashboard" className="flex-shrink-0 flex items-center cursor-pointer">
                            <span className="text-2xl text-brand-500 mr-2">💪</span>
                            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-tight">SmartDiet</span>
                        </Link>

                        {/* Desktop nav links */}
                        <nav className="hidden md:flex space-x-1 sm:space-x-4">
                            {navLinks.map(link => (
                                <Link
                                    key={link.id}
                                    to={link.to}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isActive(link.to)
                                            ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400'
                                            : 'text-slate-500 hover:text-brand-600 dark:hover:text-brand-400'
                                    }`}
                                >
                                    <i className={`fas ${link.icon} mr-1`}></i> {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                                className="text-slate-400 hover:text-brand-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-slate-100 dark:bg-slate-800"
                            >
                                {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun text-amber-400"></i>}
                            </button>
                            <button
                                onClick={() => setSettingsOpen(true)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-slate-100 dark:bg-slate-800"
                            >
                                <i className="fas fa-cog"></i>
                            </button>
                            <div
                                onClick={() => setSettingsOpen(true)}
                                className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-500 to-accent-500 text-white flex items-center justify-center font-bold text-sm shadow-md cursor-pointer"
                            >
                                {avatarLetter}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile scrollable tabs */}
                <div className="md:hidden border-t border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-hide bg-white dark:bg-darkCard">
                    <div className="flex px-2 py-2 space-x-2 w-max">
                        {navLinks.map(link => (
                            <Link
                                key={link.id}
                                to={link.to}
                                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                                    isActive(link.to)
                                        ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
                                        : 'text-slate-500 bg-slate-50 dark:bg-slate-800'
                                }`}
                            >
                                <i className={`fas ${link.icon} mr-1`}></i>
                                {link.id === 'plan' ? 'Meals' : link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </header>

            {isSettingsOpen && (
                <SettingsModal onClose={() => setSettingsOpen(false)} forceSetup={false} />
            )}
        </>
    );
}
