import React from 'react';
import { Calendar, Heart, Music, MapPin, Sparkles } from 'lucide-react';

export default function LoveTimeline({ memories, onOpenDetails }) {
  if (!memories || memories.length === 0) {
    return (
      <div className="py-20 text-center">
        <Heart className="w-12 h-12 text-rose-300 mx-auto mb-3 animate-pulse" />
        <h3 className="font-editorial text-2xl text-gray-800 font-bold">Your Love Journey Awaits</h3>
        <p className="text-sm text-rose-700/80 font-serif italic mt-1">
          Etch your first romantic memory to see your timeline unfold like poetry.
        </p>
      </div>
    );
  }

  // Sort memories chronologically (earliest to latest for a true story timeline)
  const sorted = [...memories].sort((a, b) => new Date(a.memory_date) - new Date(b.memory_date));

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-widest font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          The Journey of Us
        </span>
        <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
          Our Love Story Through Time
        </h2>
        <p className="text-xs sm:text-sm text-rose-800/80 font-serif italic mt-1">
          Every moment, every heartbeat, chronicled across the pages of forever
        </p>
      </div>

      <div className="relative border-l-2 border-rose-200/80 ml-4 sm:ml-32 space-y-12 pb-12">
        {sorted.map((mem, index) => {
          const formattedDate = new Date(mem.memory_date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });

          return (
            <div key={mem.id} className="relative group pl-6 sm:pl-8">
              {/* Timeline Heart Node */}
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-white border-2 border-rose-500 shadow-md flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </div>

              {/* Date Callout on Left (Desktop) */}
              <div className="hidden sm:block absolute -left-36 top-1 text-right w-28">
                <span className="text-xs font-bold text-rose-900 block">{formattedDate}</span>
                <span className="text-[10px] text-rose-500 uppercase tracking-wider font-semibold">
                  {mem.mood_tag || 'Chapter ' + (index + 1)}
                </span>
              </div>

              {/* Timeline Card */}
              <div
                onClick={() => onOpenDetails(mem)}
                className="bg-white/90 hover:bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg border border-rose-100/90 transition-all duration-300 cursor-pointer flex flex-col md:flex-row gap-4 items-center group-hover:border-rose-300"
              >
                {/* Photo Thumbnail */}
                <div className="w-full md:w-44 aspect-[4/3] rounded-xl overflow-hidden bg-rose-50 shrink-0 border border-rose-100">
                  <img
                    src={mem.image_url.startsWith('http') ? mem.image_url : `http://localhost:5000${mem.image_url}`}
                    alt={mem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-rose-50 text-rose-700 rounded-full text-xs font-semibold">
                      <span>{mem.romantic_sign.split(' ')[0]}</span>
                      <span>{mem.romantic_sign.replace(/^[^\s]+\s*/, '')}</span>
                    </div>

                    <div className="sm:hidden text-xs text-rose-800 font-medium">
                      {formattedDate}
                    </div>

                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Music className="w-3 h-3 text-rose-400" />
                      <span className="truncate max-w-[140px]">{mem.song_title}</span>
                    </div>
                  </div>

                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                    {mem.title}
                  </h3>

                  {mem.location && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>{mem.location}</span>
                    </div>
                  )}

                  {mem.story && (
                    <p className="mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2 italic font-serif">
                      "{mem.story}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
