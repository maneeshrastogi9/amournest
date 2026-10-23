import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Heart,
  Music,
  Calendar,
  Sparkles
} from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';
import { getMediaUrl } from '../apiConfig';

export default function RomanticSlideshow({ memories, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentMem = memories[currentIndex] || null;

  // Auto advance every 6 seconds if playing
  useEffect(() => {
    if (!isPlaying || !memories || memories.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % memories.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPlaying, memories]);

  // Play romantic music when opening slideshow
  useEffect(() => {
    if (currentMem) {
      romanticAudio.playTrack(currentMem.song_url || 'piano-serenade', currentMem.song_title);
    }
    return () => {
      romanticAudio.stop();
    };
  }, [currentIndex]);

  if (!memories || memories.length === 0 || !currentMem) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center">
        <p>No memories to show.</p>
        <button onClick={onClose} className="ml-4 underline">Close</button>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % memories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col justify-between overflow-hidden select-none animate-fadeIn">
      
      {/* Background Ambience with Blur */}
      <div className="absolute inset-0 opacity-25 filter blur-3xl pointer-events-none scale-125 transform">
        <img
          key={'bg-' + currentMem.id}
          src={getMediaUrl(currentMem.image_url)}
          alt=""
          className="w-full h-full object-cover transition-all duration-1000"
        />
      </div>

      {/* Top Bar */}
      <div className="relative z-20 p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
          <span className="font-editorial text-lg font-bold tracking-wide">
            Cinema of Us
          </span>
          <span className="text-xs text-rose-300 font-serif italic ml-2 hidden sm:inline">
            Slide {currentIndex + 1} of {memories.length}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors"
            title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors"
            title="Exit Cinema"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Image with Romantic Cinematic Zoom */}
      <div className="relative flex-1 flex items-center justify-center p-4 z-10 overflow-hidden">
        <div className="relative max-w-4xl max-h-[70vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
          {/\.(mp4|webm|mov|m4v|ogg)$/i.test(currentMem.image_url) ? (
            <video
              key={currentMem.id}
              src={getMediaUrl(currentMem.image_url)}
              autoPlay
              loop
              playsInline
              controls
              className="w-full h-full object-contain max-h-[70vh] transition-all duration-700"
            />
          ) : (
            <img
              key={currentMem.id}
              src={getMediaUrl(currentMem.image_url)}
              alt={currentMem.title}
              className="w-full h-full object-contain max-h-[70vh] transform scale-100 animate-kenburns transition-all duration-1000"
            />
          )}

          {/* Romantic Sign overlay badge */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-300 border border-white/20 flex items-center space-x-2">
            <span>{currentMem.romantic_sign.split(' ')[0]}</span>
            <span>{currentMem.romantic_sign.replace(/^[^\s]+\s*/, '')}</span>
          </div>

          {/* Music Melody indicator */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-rose-200 border border-white/20 flex items-center space-x-1.5">
            <Music className="w-3.5 h-3.5 text-rose-400 animate-spin" />
            <span className="truncate max-w-[150px]">{currentMem.song_title}</span>
          </div>
        </div>

        {/* Prev / Next Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-6 p-3 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all transform hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-6 p-3 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all transform hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Romantic Caption Overlay */}
      <div className="relative z-20 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-center max-w-3xl mx-auto">
        <div className="text-xs uppercase font-bold tracking-widest text-rose-400 flex items-center justify-center space-x-1 mb-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(currentMem.memory_date)}</span>
          {currentMem.location && <span>• {currentMem.location}</span>}
        </div>

        <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white mb-2">
          {currentMem.title}
        </h2>

        {currentMem.story && (
          <p className="text-sm sm:text-base text-rose-100 font-serif italic max-w-2xl mx-auto leading-relaxed">
            "{currentMem.story}"
          </p>
        )}
      </div>

    </div>
  );
}
