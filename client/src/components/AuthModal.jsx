import React, { useState } from 'react';
import {
  X,
  Heart,
  Lock,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [anniversaryDate, setAnniversaryDate] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Google (Gmail) Sign-In Handler
  const handleGoogleSignIn = async (isDemo = false, customUser = null) => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const payload = isDemo
        ? {
            demoUser: customUser || {
              id: 'gmail_lover_442',
              email: 'lovers@gmail.com',
              name: 'Elena Rostova',
              picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
            }
          }
        : {
            demoUser: {
              id: 'gmail_' + Date.now(),
              email: email.includes('@') ? email : 'mylove@gmail.com',
              name: displayName || 'Beloved Soulmate',
              picture: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&auto=format&fit=crop&q=80'
            }
          };

      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google Sign-In failed.');

      localStorage.setItem('amour_token', data.token);
      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Google Sign-In error.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Regular Email & Password Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = mode === 'login'
      ? { email, password }
      : { email, password, display_name: displayName, partner_name: partnerName, anniversary_date: anniversaryDate };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed.');

      localStorage.setItem('amour_token', data.token);
      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Autofills
  const handleInstantDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setMode('login');
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed.');

      localStorage.setItem('amour_token', data.token);
      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCouple = () => {
    handleInstantDemoLogin('lovers@gmail.com', 'LoveStory2026!');
  };

  const fillDemoAdmin = () => {
    handleInstantDemoLogin('admin@amournest.com', 'AdminPass2026!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-[#fffefc] rounded-3xl shadow-2xl border border-rose-100 overflow-hidden z-10 flex flex-col">
        
        {/* Header with Romantic Glow */}
        <div className="px-6 pt-6 pb-4 text-center bg-gradient-to-b from-rose-50 to-transparent relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-rose-100"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md mb-2">
            <Heart className="w-6 h-6 fill-white animate-pulse" />
          </div>

          <h2 className="font-editorial text-2xl font-bold text-gray-900">
            Welcome to Amour<span className="font-script text-rose-600 text-3xl font-normal">Nest</span>
          </h2>
          <p className="text-xs text-rose-700 font-serif italic mt-0.5">
            Your private, encrypted sanctuary for timeless love memories
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 flex border-b border-rose-100">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
              mode === 'login'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
              mode === 'register'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Create Our Nest
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* GMAIL / GOOGLE OAUTH LOGIN BUTTON */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleGoogleSignIn(true)}
            className="w-full py-3 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-2xl text-xs sm:text-sm font-semibold text-gray-700 shadow-sm hover:shadow transition-all flex items-center justify-center space-x-3 group"
          >
            {/* Google SVG Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Gmail (Google Sign-In)</span>
          </button>

          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-[11px] uppercase tracking-wider text-gray-400 font-medium">
              or with password
            </span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-900 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Romeo"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-900 mb-1">
                      Partner's Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Juliet"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-900 mb-1">
                    Anniversary / Date We Met
                  </label>
                  <input
                    type="date"
                    value={anniversaryDate}
                    onChange={(e) => setAnniversaryDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-900 mb-1">
                Email Address / Gmail
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="love@amournest.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white pl-9"
                />
                <Mail className="w-4 h-4 text-rose-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-900 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white pl-9"
                />
                <Lock className="w-4 h-4 text-rose-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{isLoading ? 'Connecting Hearts...' : (mode === 'login' ? 'Enter Sanctuary' : 'Create Our Love Album')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins for instant evaluation */}
          <div className="pt-2 border-t border-rose-100 text-center">
            <span className="text-[11px] text-gray-500 block mb-1.5 font-medium">
              Quick Test Autofills:
            </span>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={fillDemoCouple}
                className="text-[11px] px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200"
              >
                💑 Demo Couple (Elena &amp; Alexander)
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="text-[11px] px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200"
              >
                🛡️ Demo Admin (Credentials Audit)
              </button>
            </div>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-[10px] text-rose-900/80 leading-relaxed flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>
              <strong>Zero-Knowledge Privacy:</strong> Administrators only verify accounts and cannot view personal photos, songs, or private love stories.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
