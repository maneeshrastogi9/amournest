import React, { useState, useEffect } from 'react';
import {
  Heart,
  Music,
  PlusCircle,
  User,
  ShieldCheck,
  LogOut,
  Sparkles,
  Calendar,
  Volume2,
  VolumeX,
  Camera,
  Film
} from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';

export default function Navbar({
  user,
  activeView,
  setActiveView,
  onOpenUpload,
  onOpenProfile,
  onOpenAdmin,
  onOpenAuth,
  onLogout
}) {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrackName, setCurrentTrackName] = useState('Piano Serenade for Two');
  const [loveDuration, setLoveDuration] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Update love counter every second
  useEffect(() => {
    if (!user || !user.anniversary_date) return;

    const calculateTime = () => {
      const start = new Date(user.anniversary_date).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setLoveDuration({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [user?.anniversary_date]);

  const toggleBackgroundMusic = () => {
    const playing = romanticAudio.toggle('piano-serenade', 'Piano Serenade for Two');
    setIsPlayingMusic(playing);
    if (playing) {
      setCurrentTrackName('Piano Serenade for Two');
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/75 border-b border-rose-100/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Romantic Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('scrapbook')}>
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-400 p-0.5 shadow-md flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-rosevelvet-950/20 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
                <Heart className="w-7 h-7 text-white fill-white animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-editorial text-2xl font-bold tracking-tight text-gray-900">
                  Amour<span className="text-rose-600 font-script text-3xl font-normal">Nest</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-rose-50 text-rose-700 rounded-full border border-rose-200">
                  Private Sanctuary
                </span>
              </div>
              <p className="text-xs text-rose-800/70 font-serif italic hidden md:block">
                Where love stories are etched in eternity
              </p>
            </div>
          </div>

          {/* Center: Live Romantic Days Counter (if logged in) */}
          {user && (
            <div className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-rose-50/80 via-pink-50/80 to-rose-50/80 px-4 py-2 rounded-full border border-rose-200/70 shadow-inner">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-bounce" />
              <div className="text-xs text-rose-900 font-medium">
                {user.anniversary_date ? (
                  <span>
                    <strong className="text-rose-700 font-semibold">{user.display_name} &amp; {user.partner_name || 'My Soulmate'}</strong>
                    {' '}• In Love for{' '}
                    <span className="font-bold text-rose-700 tracking-wider">
                      {loveDuration.days}d {loveDuration.hours}h {loveDuration.minutes}m {loveDuration.seconds}s
                    </span>
                  </span>
                ) : (
                  <span className="italic text-rose-700 cursor-pointer hover:underline" onClick={onOpenProfile}>
                    ✨ Set your anniversary date in profile to start the love clock
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Romantic Ambience Music Button */}
            <button
              onClick={toggleBackgroundMusic}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-300 ${
                isPlayingMusic
                  ? 'bg-rose-500 text-white border-rose-600 shadow-romantic-glow animate-pulse'
                  : 'bg-white/80 hover:bg-rose-50 text-rose-800 border-rose-200 shadow-sm'
              }`}
              title={isPlayingMusic ? 'Pause romantic music' : 'Play romantic acoustic piano'}
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Playing Serenade</span>
                </>
              ) : (
                <>
                  <Music className="w-3.5 h-3.5 text-rose-500" />
                  <span className="hidden sm:inline">Romantic Ambience</span>
                </>
              )}
            </button>

            {user ? (
              <>
                {/* View Switchers */}
                <div className="hidden md:flex items-center p-1 bg-rose-50/80 rounded-xl border border-rose-100">
                  <button
                    onClick={() => setActiveView('scrapbook')}
                    className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                      activeView === 'scrapbook'
                        ? 'bg-white text-rose-700 shadow-sm font-semibold'
                        : 'text-gray-600 hover:text-rose-600'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Album</span>
                  </button>
                  <button
                    onClick={() => setActiveView('timeline')}
                    className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                      activeView === 'timeline'
                        ? 'bg-white text-rose-700 shadow-sm font-semibold'
                        : 'text-gray-600 hover:text-rose-600'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Timeline</span>
                  </button>
                  <button
                    onClick={() => setActiveView('slideshow')}
                    className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                      activeView === 'slideshow'
                        ? 'bg-white text-rose-700 shadow-sm font-semibold'
                        : 'text-gray-600 hover:text-rose-600'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Cinema</span>
                  </button>
                </div>

                {/* Etch Memory Button */}
                <button
                  onClick={onOpenUpload}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Etch Memory</span>
                  <span className="sm:hidden">Add</span>
                </button>

                {/* Profile Modal Button */}
                <button
                  onClick={onOpenProfile}
                  className="p-2 text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-full border border-rose-200 transition-colors"
                  title="Love Profile & Permanent Deletion Settings"
                >
                  <User className="w-4 h-4" />
                </button>

                {/* Admin Portal Button (Available to Admin) */}
                {user.role === 'admin' && (
                  <button
                    onClick={onOpenAdmin}
                    className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-full transition-colors"
                    title="Admin Credentials Audit"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span className="hidden lg:inline">Admin Audit</span>
                  </button>
                )}

                {/* Sign Out */}
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-500 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs sm:text-sm font-semibold rounded-full shadow-md transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Enter Our Nest</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
