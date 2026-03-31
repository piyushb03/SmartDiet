import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function AuthModal({ onClose, defaultMode = 'login' }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(defaultMode === 'login');
    const [tncChecked, setTncChecked] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!isLogin && !tncChecked) {
            setError('Please agree to the Terms and Privacy Policy.');
            return;
        }

        setLoading(true);
        try {
            const { error: authError } = isLogin
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({ email, password });

            if (authError) throw authError;
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md hidden z-50 flex items-center justify-center opacity-0 transition-opacity duration-300 p-4"
            style={{ display: 'flex', opacity: 1 }}>
            <div className="bg-white dark:bg-darkCard w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition">
                    <i className="fas fa-times"></i>
                </button>
                <div className="p-8">
                    <div className="text-center mb-6">
                        <span className="text-3xl text-brand-500 mb-2 block">💪</span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                            <input
                                type="email" required placeholder="you@example.com"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Password</label>
                            <input
                                type="password" required placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        {!isLogin && (
                            <div className="flex items-start mt-2">
                                <input
                                    id="tnc-checkbox" type="checkbox"
                                    checked={tncChecked} onChange={(e) => setTncChecked(e.target.checked)}
                                    className="w-4 h-4 mt-0.5 border border-slate-300 rounded bg-slate-50 focus:ring-2 focus:ring-brand-500 cursor-pointer"
                                />
                                <label htmlFor="tnc-checkbox" className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400 cursor-pointer">
                                    I agree to the <span className="text-brand-600 hover:underline cursor-pointer">Terms</span> and <span className="text-brand-600 hover:underline cursor-pointer">Privacy</span>.
                                </label>
                            </div>
                        )}

                        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-lg text-sm font-bold shadow-md mt-2 transition-colors disabled:opacity-70"
                        >
                            {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Sign Up')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-sm text-slate-500 hover:text-brand-500">
                            {isLogin
                                ? <>Don't have an account? <span className="font-bold">Sign up</span></>
                                : <>Already have an account? <span className="font-bold">Log in</span></>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
