import React, { useState } from 'react';
import {
  Heart,
  Music,
  MapPin,
  Calendar,
  Trash2,
  Play,
  Pause,
  Sparkles,
  Volume2,
  Film
} from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';
import { getMediaUrl } from '../apiConfig';

export default function MemoryCard({
  memory,
  index,
  onOpenDetails,
  onDeleteMemory
}) {
  const [isPlayingThisSong, setIsPlayingThisSong] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Subtle alternate vintage tilt for authentic scrapbook feel
  const tiltClasses = [
    '-rotate-1 hover:rotate-0',
    'rotate-1 hover:rotate-0',
    '-rotate-2 hover:rotate-0',
    'rotate-2 hover:rotate-0',
    'hover:-rotate-1'
  ];
  const tiltClass = tiltClasses[index % tiltClasses.length];

  // Format date romantically
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const handlePlaySong = (e) => {
    e.stopPropagation();
    const trackKey = memory.song_url || 'piano-serenade';
    const active = romanticAudio.toggle(trackKey, memory.song_title);
    setIsPlayingThisSong(active);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently erase this memory and photo from your album? This action cannot be recovered.')) {
      setIsDeleting(true);
      onDeleteMemory(memory.id);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(memory)}
      className={`group relative bg-[#fffdfa] p-4 pb-6 rounded-2xl shadow-polaroid hover:shadow-polaroid-hover transition-all duration-500 cursor-pointer transform ${tiltClass} border border-rose-100/70 flex flex-col justify-between`}
    >
      {/* Top Tape / Decorative Romantic Sticker */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-20 h-5 bg-rose-200/60 backdrop-blur-sm rounded-sm transform -rotate-2 border border-rose-300/40 shadow-xs flex items-center justify-center">
          <Heart className="w-2.5 h-2.5 text-rose-500/80 fill-rose-500/60" />
        </div>
      </div>

      <div>
        {/* Media Container (Photo or Romantic Video) */}
        <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-xl overflow-hidden bg-rose-50 border border-gray-100/80 shadow-inner group-hover:scale-[1.01] transition-transform duration-500">
          {/\.(mp4|webm|mov|m4v|ogg)$/i.test(memory.image_url) ? (
            <div className="relative w-full h-full bg-black">
              <video
                src={getMediaUrl(memory.image_url)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                muted
                loop
                playsInline
                onMouseEnter={(e) => e.target.play().catch(() => {})}
                onMouseLeave={(e) => e.target.pause()}
              />
              <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white flex items-center space-x-1 z-10">
                <Film className="w-3 h-3 text-rose-400" />
                <span>Video Clip</span>
              </div>
            </div>
          ) : (
            <img
              src={getMediaUrl(memory.image_url)}
              alt={memory.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          )}

          {/* Romantic Sign Overlay Badge */}
          <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-rose-100 flex items-center space-x-1.5 transform group-hover:scale-105 transition-transform">
            <span className="text-sm">{memory.romantic_sign.split(' ')[0]}</span>
            <span className="text-[11px] font-semibold text-rose-800 tracking-wide">
              {memory.romantic_sign.replace(/^[^\s]+\s*/, '')}
            </span>
          </div>

          {/* Mood / Location Tag */}
          {memory.location && (
            <div className="absolute bottom-2.5 left-2.5 bg-black/50 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center space-x-1">
              <MapPin className="w-2.5 h-2.5 text-rose-300" />
              <span className="truncate max-w-[120px]">{memory.location}</span>
            </div>
          )}
        </div>

        {/* Content Below Photo */}
        <div className="mt-4 px-1">
          {/* Memory Date & Days Ago */}
          <div className="flex items-center justify-between text-xs text-rose-800/80 mb-1">
            <div className="flex items-center space-x-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>{formatDate(memory.memory_date)}</span>
            </div>
            {memory.mood_tag && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100">
                {memory.mood_tag}
              </span>
            )}
          </div>

          {/* Romantic Title */}
          <h3 className="font-editorial text-lg font-bold text-gray-900 leading-snug group-hover:text-rose-600 transition-colors line-clamp-1">
            {memory.title}
          </h3>

          {/* Romantic Story Excerpt */}
          {memory.story && (
            <p className="mt-1.5 text-xs text-gray-600 line-clamp-2 italic font-serif leading-relaxed">
              "{memory.story}"
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Romantic Song Player & Delete Action */}
      <div className="mt-4 pt-3 border-t border-rose-100/60 flex items-center justify-between">
        
        {/* Memory Song Player */}
        <button
          onClick={handlePlaySong}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs transition-all ${
            isPlayingThisSong
              ? 'bg-rose-500 text-white font-medium shadow-sm'
              : 'bg-rose-50/70 hover:bg-rose-100 text-rose-800'
          }`}
          title={`Play song: ${memory.song_title}`}
        >
          {isPlayingThisSong ? (
            <>
              <Volume2 className="w-3 h-3 animate-pulse" />
              <span className="truncate max-w-[130px] font-medium">{memory.song_title}</span>
            </>
          ) : (
            <>
              <Music className="w-3 h-3 text-rose-500" />
              <span className="truncate max-w-[130px]">{memory.song_title}</span>
            </>
          )}
        </button>

        {/* Delete Single Memory Button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-gray-400 hover:text-rose-600 p-1 rounded-full hover:bg-rose-50 transition-colors"
          title="Delete memory permanently"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
}
