import React, { useState } from 'react';
import {
  X,
  Upload,
  Calendar,
  Heart,
  Music,
  MapPin,
  Sparkles,
  Camera,
  Check,
  Tag
} from 'lucide-react';
import { ROMANTIC_SIGNS, ROMANTIC_MELODIES } from '../utils/romanticSigns';

export default function UploadModal({ onClose, onMemoryUploaded, categories = [] }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [sampleImage, setSampleImage] = useState('');
  
  const [title, setTitle] = useState('');
  const [memoryDate, setMemoryDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSign, setSelectedSign] = useState(ROMANTIC_SIGNS[0]);
  const [selectedMelody, setSelectedMelody] = useState(ROMANTIC_MELODIES[0]);
  const [story, setStory] = useState('');
  const [location, setLocation] = useState('');
  const [moodTag, setMoodTag] = useState('First Spark');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Curated romantic presets for quick selection
  const SAMPLE_ROMANTIC_PHOTOS = [
    {
      label: 'Starlit Evening',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80'
    },
    {
      label: 'Cozy Morning Coffee',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80'
    },
    {
      label: 'Ocean Walk at Dusk',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
    },
    {
      label: 'Cottage Fireplace',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setSampleImage('');
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handlePickSample = (url, label) => {
    setSampleImage(url);
    setFile(null);
    setPreviewUrl(url);
    if (!title) setTitle(label);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please give your romantic memory a sweet title.');
      return;
    }
    if (!file && !sampleImage) {
      setErrorMsg('Please select or upload a photo of your memory.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const token = localStorage.getItem('amour_token');
      const formData = new FormData();
      
      if (file) {
        formData.append('photo', file);
      } else {
        formData.append('sample_image', sampleImage);
      }

      formData.append('title', title.trim());
      formData.append('memory_date', memoryDate);
      formData.append('romantic_sign', `${selectedSign.symbol} ${selectedSign.name}`);
      formData.append('romantic_sign_meaning', selectedSign.meaning);
      formData.append('song_title', selectedMelody.title);
      formData.append('song_type', 'preset');
      formData.append('song_url', selectedMelody.id);
      formData.append('story', story.trim());
      formData.append('location', location.trim());
      formData.append('mood_tag', moodTag);

      const res = await fetch('http://localhost:5000/api/memories/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save memory.');
      }

      onMemoryUploaded(data.memory);
      onClose();
    } catch (err) {
      console.error('Upload Error:', err);
      setErrorMsg(err.message || 'Error saving your memory.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-[#fffefc] rounded-3xl shadow-2xl border border-rose-100 overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-rose-500 rounded-full text-white">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-gray-900">
                Etch a Romantic Memory
              </h2>
              <p className="text-xs text-rose-700 font-serif italic">
                Preserve this precious moment with date, romantic sign, and song
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-rose-100/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Photo & Video Upload Zone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-2">
              Memory Photo or Video Clip <span className="text-rose-500">*</span>
            </label>

            {previewUrl ? (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-rose-950 border-2 border-rose-200 group flex items-center justify-center">
                {file?.type?.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogg)$/i.test(previewUrl) ? (
                  <video
                    src={previewUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl('');
                    setSampleImage('');
                  }}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-rose-800 flex items-center space-x-1.5 z-10">
                  <span>{selectedSign.symbol}</span>
                  <span>{selectedSign.name}</span>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-rose-200 hover:border-rose-400 rounded-2xl p-6 text-center bg-rose-50/40 transition-colors">
                <input
                  type="file"
                  id="photo-input"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="photo-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-rose-900">
                    Click to upload a romantic photo or video clip
                  </span>
                  <span className="text-xs text-rose-600/70">
                    Supports high-res JPG, PNG, WEBP, and MP4/WEBM videos (up to 100MB)
                  </span>
                </label>

                {/* Quick Romantic Inspiration Photos */}
                <div className="mt-4 pt-3 border-t border-rose-100/70">
                  <span className="text-[11px] font-medium text-rose-800 block mb-2">
                    Or select an instant romantic sample photo:
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SAMPLE_ROMANTIC_PHOTOS.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePickSample(item.url, item.label)}
                        className="text-xs bg-white hover:bg-rose-100/60 text-rose-800 px-2.5 py-1 rounded-full border border-rose-200 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Title & Memory Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-1">
                Memory Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Under the Parisian Golden Lights"
                className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>Date of Memory <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="date"
                required
                value={memoryDate}
                onChange={(e) => setMemoryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white text-sm font-medium text-rose-900"
              />
            </div>
          </div>

          {/* Romantic Sign Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-2 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Choose a Romantic Sign <span className="text-rose-500">*</span></span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ROMANTIC_SIGNS.map((sign) => {
                const isSelected = selectedSign.id === sign.id;
                return (
                  <button
                    key={sign.id}
                    type="button"
                    onClick={() => setSelectedSign(sign)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-600 shadow-md transform scale-[1.02]'
                        : 'bg-white hover:bg-rose-50 text-gray-800 border-rose-200'
                    }`}
                  >
                    <div className="text-xl mb-1">{sign.symbol}</div>
                    <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-rose-900'}`}>
                      {sign.name}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-rose-700 italic font-serif">
              "{selectedSign.meaning}"
            </p>
          </div>

          {/* Romantic Song Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-2 flex items-center space-x-1">
              <Music className="w-3.5 h-3.5 text-rose-500" />
              <span>Romantic Song / Melody for this Picture</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ROMANTIC_MELODIES.map((mel) => {
                const isSelected = selectedMelody.id === mel.id;
                return (
                  <button
                    key={mel.id}
                    type="button"
                    onClick={() => setSelectedMelody(mel)}
                    className={`flex items-center space-x-2.5 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-400'
                        : 'bg-white hover:bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <Music className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-gray-900 truncate">
                        {mel.title}
                      </div>
                      <div className="text-[10px] text-rose-600">
                        {mel.genre} • {mel.duration}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location & Mood Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Place / Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Venice Canal, Home Balcony, Sunset Beach"
                className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-1 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5 text-rose-500" />
                <span>Mood Tag</span>
              </label>
              <select
                value={moodTag}
                onChange={(e) => setMoodTag(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white text-sm font-medium"
              >
                {categories && categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.icon || '💖'} {cat.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="First Spark">✨ First Spark</option>
                    <option value="Midnight Reverie">🌙 Midnight Reverie</option>
                    <option value="Valentine Magic">💖 Valentine Magic</option>
                    <option value="Anniversary Vow">💍 Anniversary Vow</option>
                    <option value="Travel Adventure">✈️ Travel Adventure</option>
                    <option value="Cozy Sunday">☕ Cozy Sunday</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Love Note / Story */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-1">
              Our Love Story &amp; Whispers
            </label>
            <textarea
              rows="3"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="What made this moment unforgettable? Write from the depths of your heart..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white text-sm font-serif italic"
            ></textarea>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center space-x-2 text-[11px] text-emerald-800">
            <span className="text-sm">🔒</span>
            <span>
              <strong>Zero-Knowledge Privacy:</strong> Administrators have no access to your photos, songs, or diary notes. Only you and your partner hold the keys.
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 transform active:scale-98 disabled:opacity-50"
            >
              <Heart className="w-5 h-5 fill-white animate-pulse" />
              <span>{isSubmitting ? 'Etching into Vault...' : 'Etch Forever into Our Album'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
