import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Calendar,
  MapPin,
  Music,
  Volume2,
  VolumeX,
  Sparkles,
  Share2,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { romanticAudio } from '../utils/romanticAudio';
import { getMediaUrl } from '../apiConfig';

export default function MemoryModal({ memory, onClose }) {
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Escape key listener
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      romanticAudio.stop();
    };
  }, [onClose]);

  if (!memory) return null;

  const toggleSong = () => {
    const trackKey = memory.song_url || 'piano-serenade';
    const active = romanticAudio.toggle(trackKey, memory.song_title);
    setIsPlayingSong(active);
  };

  const triggerHeartBurst = () => {
    setLiked(true);
    // Romantic heart-shaped confetti burst
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#ffffff'],
      shapes: ['circle']
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-4xl bg-[#fffefc] rounded-3xl shadow-2xl border border-rose-100 overflow-hidden z-10 flex flex-col md:flex-row transform transition-all">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image with Vinyl / Song Overlay */}
        <div className="relative md:w-1/2 bg-rose-950 flex flex-col items-center justify-center min-h-[320px] md:min-h-[500px] overflow-hidden group">
          {/\.(mp4|webm|mov|m4v|ogg)$/i.test(memory.image_url) ? (
            <video
              src={getMediaUrl(memory.image_url)}
              controls
              autoPlay
              loop
              playsInline
              className="w-full h-full object-contain max-h-[550px]"
            />
          ) : (
            <img
              src={getMediaUrl(memory.image_url)}
              alt={memory.title}
              className="w-full h-full object-cover max-h-[550px]"
            />
          )}

          {/* Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

          {/* Spinning Vinyl Record Badge for Song */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white z-10">
            <button
              onClick={toggleSong}
              className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 transition-all shadow-lg group-hover:scale-105"
            >
              {/* Spinning Vinyl Record Icon */}
              <div className={`relative w-8 h-8 rounded-full bg-neutral-900 border-2 border-amber-300/60 flex items-center justify-center ${isPlayingSong ? 'animate-spin' : ''}`}>
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
              </div>

              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider text-rose-200">
                  {isPlayingSong ? 'Now Playing' : 'Attached Melody'}
                </div>
                <div className="text-xs font-semibold truncate max-w-[160px]">
                  {memory.song_title}
                </div>
              </div>

              {isPlayingSong ? (
                <Volume2 className="w-4 h-4 text-rose-400 animate-pulse" />
              ) : (
                <Music className="w-4 h-4 text-white/80" />
              )}
            </button>

            {/* Heart Reaction */}
            <button
              onClick={triggerHeartBurst}
              className={`p-3 rounded-full backdrop-blur-md border border-white/20 transition-all transform active:scale-125 ${
                liked ? 'bg-rose-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title="Send Heart"
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
            </button>
          </div>

        </div>

        {/* Right Column: Romantic Details & Love Letter */}
        <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between overflow-y-auto max-h-[600px]">
          
          <div>
            {/* Romantic Sign Header */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-200 text-xs font-semibold">
                <span className="text-base">{memory.romantic_sign.split(' ')[0]}</span>
                <span>{memory.romantic_sign.replace(/^[^\s]+\s*/, '')}</span>
              </div>
              {memory.mood_tag && (
                <span className="px-2.5 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-medium">
                  {memory.mood_tag}
                </span>
              )}
            </div>

            {/* Poetic meaning of the sign */}
            {memory.romantic_sign_meaning && (
              <p className="text-xs text-rose-800/80 italic font-serif mb-4 pl-2 border-l-2 border-rose-300">
                "{memory.romantic_sign_meaning}"
              </p>
            )}

            {/* Title */}
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {memory.title}
            </h2>

            {/* Date & Location */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-rose-900/70 mt-3 font-medium">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>{formatDate(memory.memory_date)}</span>
              </div>
              {memory.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{memory.location}</span>
                </div>
              )}
            </div>

            <div className="my-5 border-t border-rose-100"></div>

            {/* Handwritten / Poetic Love Note */}
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-rose-700">
                Our Memory &amp; Story
              </span>
              <div className="mt-2 text-gray-700 font-serif leading-relaxed text-sm sm:text-base italic whitespace-pre-line bg-rose-50/40 p-4 rounded-2xl border border-rose-100/60">
                {memory.story || "A quiet moment etched into the pages of our forever."}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-8 pt-4 border-t border-rose-100 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-sans">
              🔒 End-to-End Private in AmourNest
            </span>
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 text-xs text-rose-700 hover:text-rose-900 font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share with Partner</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
