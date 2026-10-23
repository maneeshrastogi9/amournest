import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MemoryCard from './components/MemoryCard';
import MemoryModal from './components/MemoryModal';
import UploadModal from './components/UploadModal';
import LoveTimeline from './components/LoveTimeline';
import RomanticSlideshow from './components/RomanticSlideshow';
import ProfileModal from './components/ProfileModal';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';
import FloatingPetals from './components/FloatingPetals';
import LandingPage from './components/LandingPage';
import {
  Heart,
  PlusCircle,
  Sparkles,
  Camera,
  Calendar,
  Film,
  Shield,
  Search,
  Lock,
  Volume2,
  Tag,
  KeyRound,
  Settings,
  SlidersHorizontal
} from 'lucide-react';
import { romanticAudio } from './utils/romanticAudio';
import { API_BASE_URL } from './apiConfig';

export default function App() {
  const [user, setUser] = useState(null);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('scrapbook'); // 'scrapbook', 'timeline', 'slideshow'
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [activeMemoryDetail, setActiveMemoryDetail] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState('sovereign');
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [categories, setCategories] = useState([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Fetch current user
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('amour_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem('amour_token');
        setUser(null);
      }
    } catch (err) {
      console.error('Fetch user error:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch memories
  const fetchMemories = async () => {
    const token = localStorage.getItem('amour_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/memories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMemories(data.memories || []);
      }
    } catch (err) {
      console.error('Fetch memories error:', err);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    const token = localStorage.getItem('amour_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMemories();
      fetchCategories();
    } else {
      setMemories([]);
      setCategories([]);
    }
  }, [user]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('amour_token');
    setUser(null);
    setMemories([]);
    romanticAudio.stop();
    showToast('Signed out of your private nest.');
  };

  // Handle Auth Success
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    showToast(`Welcome to AmourNest, ${userData.display_name}!`);
  };

  // 1-Click Instant Couple Demo Login
  const handleQuickCoupleDemo = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'lovers@gmail.com', password: 'LoveStory2026!' })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem('amour_token', data.token);
        setUser(data.user);
        showToast(`Welcome to AmourNest, ${data.user.display_name}!`);
      } else {
        setShowAuthModal(true);
      }
    } catch (e) {
      setShowAuthModal(true);
    }
  };

  // 1-Click Instant Admin Demo Login
  const handleQuickAdminDemo = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@amournest.com', password: 'AdminPass2026!' })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem('amour_token', data.token);
        setUser(data.user);
        setShowAdminPortal(true);
        showToast(`Logged in as Administrator (${data.user.email}). Credentials Audit Portal active.`);
      } else {
        setShowAuthModal(true);
      }
    } catch (e) {
      setShowAuthModal(true);
    }
  };

  // Handle Profile Update
  const handleUpdateProfile = async (profileData) => {
    const token = localStorage.getItem('amour_token');
    const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    fetchCurrentUser();
  };

  // Handle Partner Linking
  const handleLinkPartner = async (coupleCode) => {
    const token = localStorage.getItem('amour_token');
    const res = await fetch(`${API_BASE_URL}/api/auth/link-partner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ couple_code: coupleCode })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    fetchCurrentUser();
    fetchMemories();
  };

  // Handle Hard Delete Account ("Data Will Not Recover")
  const handleHardDeleteAccount = async (confirmationText) => {
    const token = localStorage.getItem('amour_token');
    const res = await fetch(`${API_BASE_URL}/api/auth/delete-account`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ confirmation_text: confirmationText })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // Hard purge executed: clear tokens and memory state
    localStorage.removeItem('amour_token');
    setUser(null);
    setMemories([]);
    setShowProfileModal(false);
    alert('Account and all memories permanently wiped. All photo files and records have been deleted and cannot be recovered.');
  };

  // Handle Single Memory Deleted
  const handleDeleteMemory = async (memoryId) => {
    const token = localStorage.getItem('amour_token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/memories/${memoryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMemories((prev) => prev.filter((m) => m.id !== memoryId));
      if (activeMemoryDetail?.id === memoryId) {
        setActiveMemoryDetail(null);
      }
      showToast('Memory permanently erased from album.');
    } catch (err) {
      alert(err.message || 'Failed to delete memory.');
    }
  };

  // Filter memories by tag and search query
  const filteredMemories = memories.filter((mem) => {
    const matchTag = selectedTag === 'All' || mem.mood_tag === selectedTag;
    const matchSearch =
      !searchQuery ||
      mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mem.story && mem.story.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (mem.location && mem.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchTag && matchSearch;
  });

  const MOOD_TAGS = ['All', 'First Spark', 'Midnight Reverie', 'Valentine Magic', 'Anniversary Vow', 'Travel Adventure', 'Cozy Sunday'];

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-[#faf5f6] via-[#fdf7f8] to-[#f9f0f2] text-gray-900 selection:bg-rose-200">
      
      {/* Romantic Canvas Background of Falling Rose Petals and Hearts */}
      <FloatingPetals />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-900/90 text-white px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md border border-rose-700/50 flex items-center space-x-2 animate-bounce text-xs font-semibold">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenUpload={() => setShowUploadModal(true)}
        onOpenProfile={() => {
          setProfileModalTab('sovereign');
          setShowProfileModal(true);
        }}
        onOpenAdmin={() => setShowAdminPortal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Body */}
      <main className="flex-1 relative z-10">
        
        {/* If user is not logged in: Breathtaking Romantic Landing Page */}
        {!user ? (
          <LandingPage
            onOpenAuth={() => setShowAuthModal(true)}
            onQuickCoupleDemo={handleQuickCoupleDemo}
            onAdminDemo={handleQuickAdminDemo}
          />
        ) : (
          /* LOGGED IN USER EXPERIENCE */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Romantic Couple Banner Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-rose-950 via-rose-900 to-wine-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-rose-800/40 mb-10">
              
              {/* Background ambient heart */}
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 pointer-events-none opacity-10">
                <Heart className="w-96 h-96 fill-white" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center space-x-2 text-rose-300 text-xs font-semibold tracking-wider uppercase mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Private Couple Sanctuary</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-mono">🔒 Zero-Knowledge Active</span>
                  </div>

                  <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight">
                    {user.display_name} <span className="font-script text-rose-400 font-normal text-4xl sm:text-6xl">&amp;</span> {user.partner_name || 'My Soulmate'}
                  </h1>

                  <p className="mt-2 text-rose-200 text-xs sm:text-sm font-serif italic max-w-xl">
                    "{user.romantic_bio || 'Two souls intertwined in an unbreakable promise, creating memories that outlive the stars.'}"
                  </p>
                </div>

                {/* Right Quick Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Etch Romantic Memory</span>
                  </button>

                  <button
                    onClick={() => setActiveView('slideshow')}
                    className="flex items-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-medium rounded-2xl border border-white/20 transition-all"
                  >
                    <Film className="w-4 h-4 text-rose-300" />
                    <span>Play Cinema Mode</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Filter Pills & Search Bar */}
            {/* Filter Pills & Search Bar (Dynamic Couple Categories & Soulmate Powers) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              
              {/* Mood Filter Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                {/* All Pill */}
                <button
                  onClick={() => setSelectedTag('All')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedTag === 'All'
                      ? 'bg-rose-600 text-white shadow-sm font-semibold'
                      : 'bg-white/80 hover:bg-rose-50 text-rose-900 border border-rose-200/70'
                  }`}
                >
                  All Memories
                </button>

                {/* Dynamic Sanctuary Categories */}
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedTag(cat.name)}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      selectedTag === cat.name
                        ? 'bg-rose-600 text-white shadow-sm font-semibold'
                        : 'bg-white/80 hover:bg-rose-50 text-rose-900 border border-rose-200/70'
                    }`}
                  >
                    <span>{cat.icon || '💖'}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}

                {/* Customize Categories Shortcut (Opens Profile Modal Tab) */}
                <button
                  onClick={() => {
                    setProfileModalTab('categories');
                    setShowProfileModal(true);
                  }}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-700 bg-rose-50/80 hover:bg-rose-100 border border-rose-200 whitespace-nowrap transition-colors"
                  title="Manage & Add Custom Categories in User Profile"
                >
                  <Tag className="w-3.5 h-3.5 text-rose-500" />
                  <span>+ Customize Categories</span>
                </button>
              </div>

              {/* Right Side: Soulmate Code Badge & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                
                {/* Soulmate Code Pill */}
                <button
                  onClick={() => {
                    setProfileModalTab('sovereign');
                    setShowProfileModal(true);
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 text-rose-900 rounded-full border border-rose-200/80 text-xs font-medium shadow-xs transition-all"
                  title="View Soulmate Sharing Key & Controls"
                >
                  <KeyRound className="w-3.5 h-3.5 text-rose-600" />
                  <span>Soulmate Key:</span>
                  <span className="font-mono font-bold text-rose-700">{user.couple_code}</span>
                </button>

                {/* Search Memory Input */}
                <div className="relative w-full sm:w-56">
                  <input
                    type="text"
                    placeholder="Search memories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3.5 py-1.5 pl-8 text-xs rounded-full border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white shadow-sm"
                  />
                  <Search className="w-3.5 h-3.5 text-rose-400 absolute left-2.5 top-2" />
                </div>

              </div>

            </div>

            {/* VIEW DISPLAY: Scrapbook vs Timeline vs Cinema */}
            {activeView === 'timeline' ? (
              <LoveTimeline
                memories={filteredMemories}
                onOpenDetails={(mem) => setActiveMemoryDetail(mem)}
              />
            ) : (
              /* POLAROID SCRAPBOOK GALLERY WALL */
              <div>
                {filteredMemories.length === 0 ? (
                  <div className="py-20 text-center bg-white/40 rounded-3xl border-2 border-dashed border-rose-200 p-8">
                    <Camera className="w-12 h-12 text-rose-300 mx-auto mb-3 animate-bounce" />
                    <h3 className="font-editorial text-2xl font-bold text-gray-800">
                      No memories etched in this category yet
                    </h3>
                    <p className="text-xs sm:text-sm text-rose-700/80 font-serif italic mt-1 max-w-md mx-auto">
                      Click "Etch Romantic Memory" above to upload your first picture with date, romantic sign, and song.
                    </p>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="mt-6 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-md"
                    >
                      Etch First Memory
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 sm:gap-10">
                    {filteredMemories.map((mem, index) => (
                      <MemoryCard
                        key={mem.id}
                        memory={mem}
                        index={index}
                        onOpenDetails={(m) => setActiveMemoryDetail(m)}
                        onDeleteMemory={handleDeleteMemory}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Romantic Footer */}
      <footer className="mt-16 py-8 border-t border-rose-100 bg-white/50 backdrop-blur-sm text-center text-xs text-rose-900/70 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="font-editorial font-bold text-gray-900">
              Amour<span className="font-script text-rose-600 text-xl font-normal">Nest</span>
            </span>
            <span>— The Private Romantic Memory Sanctuary for Couples</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="text-emerald-700 font-medium">
              🔒 End-to-End Privacy Charter Enforced
            </span>
            <span>•</span>
            <span className="text-gray-500">
              Total Privacy Protection &amp; Hard Data Deletion Guaranteed
            </span>
          </div>
        </div>
      </footer>

      {/* ALL MODAL OVERLAYS */}
      
      {/* 1. Memory Detail Lightbox */}
      {activeMemoryDetail && (
        <MemoryModal
          memory={activeMemoryDetail}
          onClose={() => setActiveMemoryDetail(null)}
        />
      )}

      {/* 2. Upload Memory Modal */}
      {showUploadModal && (
        <UploadModal
          categories={categories}
          onClose={() => setShowUploadModal(false)}
          onMemoryUploaded={(newMem) => {
            setMemories((prev) => [newMem, ...prev]);
            showToast('New romantic memory etched into your album!');
          }}
        />
      )}

      {/* 3. Profile & Permanent Deletion Settings Modal */}
      {showProfileModal && user && (
        <ProfileModal
          user={user}
          initialTab={profileModalTab}
          onClose={() => setShowProfileModal(false)}
          onUpdateProfile={handleUpdateProfile}
          onLinkPartner={handleLinkPartner}
          onUnlinkPartner={() => {
            fetchCurrentUser();
            fetchMemories();
            fetchCategories();
          }}
          onHardDeleteAccount={handleHardDeleteAccount}
        />
      )}

      {/* 4. Admin Credentials Audit Portal */}
      {showAdminPortal && (
        <AdminPortal
          onClose={() => setShowAdminPortal(false)}
        />
      )}

      {/* 5. Auth / Login with Gmail Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* 6. Romantic Cinema Slideshow */}
      {activeView === 'slideshow' && (
        <RomanticSlideshow
          memories={memories}
          onClose={() => setActiveView('scrapbook')}
        />
      )}

    </div>
  );
}
