import { useState } from 'react';
import useUserStore from '../store/userstore';
import AuthModal from '../components/modals/AuthModal';

export default function Landing() {
    const [isAuthOpen, setAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState('signup');
    const { theme, setTheme } = useUserStore();

    const openAuth = (mode) => {
        setAuthMode(mode);
        setAuthOpen(true);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Landing Header */}
            <header className="backdrop-blur-md bg-white/80 dark:bg-darkCard/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-2xl text-brand-500 mr-2">💪</span>
                            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">SmartDiet</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                                className="text-slate-400 hover:text-brand-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            >
                                {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun text-amber-400"></i>}
                            </button>
                            <button
                                onClick={() => openAuth('login')}
                                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors hidden sm:block"
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => openAuth('signup')}
                                className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-brand-500/30"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 overflow-hidden border-b border-slate-200 dark:border-slate-800/50" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(16,185,129,0.05) 100%)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold tracking-wide uppercase border border-brand-200 dark:border-brand-500/30 shadow-sm">
                            Universal AI Engine
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
                            Track smarter. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-accent-500">Eat better.</span>
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10">
                            Your hyper-personalized daily meal plan. Set your goals, customize your timings, and let our AI engine keep you accountable.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <button
                                onClick={() => openAuth('signup')}
                                className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full text-lg font-bold transition-transform hover:scale-105 shadow-xl"
                            >
                                Start Your Journey <i className="fas fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-white dark:bg-darkBg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why choose SmartDiet?</h2>
                            <p className="mt-4 text-slate-500 dark:text-slate-400">Everything you need to transform your body, built into one seamless dashboard.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-darkCard border border-slate-100 dark:border-slate-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-center">
                                <div className="w-14 h-14 mx-auto bg-brand-100 dark:bg-brand-900/30 text-brand-500 rounded-2xl flex items-center justify-center text-2xl mb-6">
                                    <i className="fas fa-bolt"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Dynamic Macros</h3>
                                <p className="text-slate-600 dark:text-slate-400">Auto-calculated protein, carb, and fat targets based on your specific biometrics and goals.</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-darkCard border border-slate-100 dark:border-slate-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-center">
                                <div className="w-14 h-14 mx-auto bg-accent-100 dark:bg-accent-900/30 text-accent-500 rounded-2xl flex items-center justify-center text-2xl mb-6">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Smart Timings</h3>
                                <p className="text-slate-600 dark:text-slate-400">Set custom meal times. We'll warn you of unhealthy gaps and send browser push notifications.</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-darkCard border border-slate-100 dark:border-slate-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-center">
                                <div className="w-14 h-14 mx-auto bg-ai-100 dark:bg-ai-900/30 text-ai-500 rounded-2xl flex items-center justify-center text-2xl mb-6">
                                    <i className="fas fa-robot"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Integrations</h3>
                                <p className="text-slate-600 dark:text-slate-400">Bring your own Gemini or Groq API keys to unlock personalized diet recommendations and custom food lookups instantly.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1">
                        <div className="flex items-center mb-4">
                            <span className="text-2xl text-brand-500 mr-2">💪</span>
                            <span className="font-bold text-xl tracking-tight text-white">SmartDiet</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">Track smarter. Eat better. The ultimate personalized nutrition engine for modern professionals.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><span className="cursor-pointer hover:text-brand-400 transition-colors">Terms of Service</span></li>
                            <li><span className="cursor-pointer hover:text-brand-400 transition-colors">Privacy Policy</span></li>
                            <li><span className="cursor-pointer hover:text-brand-400 transition-colors">AI Disclaimer</span></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
                    &copy; 2026 SmartDiet Inc. All rights reserved. Built for your health.
                </div>
            </footer>

            {isAuthOpen && <AuthModal onClose={() => setAuthOpen(false)} defaultMode={authMode} />}
        </div>
    );
}
