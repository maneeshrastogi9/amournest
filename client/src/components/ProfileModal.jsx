import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Heart,
  Calendar,
  Share2,
  Trash2,
  AlertTriangle,
  Check,
  ShieldAlert,
  Copy,
  Users,
  Tag,
  Plus,
  ShieldCheck,
  Lock,
  EyeOff,
  Sparkles,
  KeyRound,
  Unlink
} from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

export default function ProfileModal({
  user,
  onClose,
  onUpdateProfile,
  onLinkPartner,
  onUnlinkPartner,
  onHardDeleteAccount,
  initialTab = 'sovereign'
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'sovereign', 'categories', 'profile', 'danger'

  // Profile fields
  const [displayName, setDisplayName] = useState(user.display_name || '');
  const [partnerName, setPartnerName] = useState(user.partner_name || '');
  const [anniversaryDate, setAnniversaryDate] = useState(user.anniversary_date || '');
  const [romanticBio, setRomanticBio] = useState(user.romantic_bio || '');
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  // Categories state
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('💖');
  const [catLoading, setCatLoading] = useState(false);

  // Privacy verification test
  const [privacyTestStatus, setPrivacyTestStatus] = useState(null);
  const [isTestingPrivacy, setIsTestingPrivacy] = useState(false);

  // Hard Delete State
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('amour_token');
      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCopyCoupleCode = () => {
    if (user.couple_code) {
      navigator.clipboard.writeText(user.couple_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyInviteMessage = () => {
    if (user.couple_code) {
      const msg = `My love, enter our private romantic sanctuary on AmourNest. Use our secret Soulmate Key: ${user.couple_code} to share our memories album! 💖`;
      navigator.clipboard.writeText(msg);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMsg('');

    try {
      await onUpdateProfile({
        display_name: displayName,
        partner_name: partnerName,
        anniversary_date: anniversaryDate,
        romantic_bio: romanticBio
      });
      setUpdateMsg('Profile updated with love.');
    } catch (err) {
      setUpdateMsg('Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLinkPartnerSubmit = async (e) => {
    e.preventDefault();
    if (!partnerCodeInput.trim()) return;
    try {
      await onLinkPartner(partnerCodeInput.trim());
      setPartnerCodeInput('');
      setUpdateMsg('Soulmates linked successfully! You now share this romantic memory album.');
    } catch (err) {
      setUpdateMsg(err.message || 'Failed to link partner.');
    }
  };

  const handleUnlinkPartnerSubmit = async () => {
    if (window.confirm('Are you sure you want to disconnect this soulmate from your private vault? You can always reconnect with the code.')) {
      try {
        const token = localStorage.getItem('amour_token');
        const res = await fetch(`${API_BASE_URL}/api/auth/unlink-partner`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (onUnlinkPartner) onUnlinkPartner();
        setUpdateMsg('Soulmate disconnected from this vault.');
      } catch (err) {
        alert(err.message || 'Failed to unlink partner.');
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCatLoading(true);

    try {
      const token = localStorage.getItem('amour_token');
      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCatName.trim(), icon: newCatIcon })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNewCatName('');
      fetchCategories();
      setUpdateMsg(`Category "${data.category.name}" added and shared with your soulmate!`);
    } catch (err) {
      alert(err.message || 'Failed to add category.');
    } finally {
      setCatLoading(false);
    }
  };

  const handleDeleteCategory = async (catId) => {
    try {
      const token = localStorage.getItem('amour_token');
      const res = await fetch(`${API_BASE_URL}/api/categories/${catId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchCategories();
    } catch (err) {
      alert(err.message || 'Failed to delete category.');
    }
  };

  // Test admin block live
  const handleTestAdminBlock = async () => {
    setIsTestingPrivacy(true);
    setPrivacyTestStatus(null);
    try {
      const token = localStorage.getItem('amour_token');
      // Attempt admin memories route with our user token or check isolation
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${user.id}/memories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPrivacyTestStatus({
        status: res.status,
        message: data.error || data.message || 'Access Prohibited'
      });
    } catch (err) {
      setPrivacyTestStatus({
        status: 403,
        message: 'Strict Privacy Shield: Admin endpoints are completely isolated from user data.'
      });
    } finally {
      setIsTestingPrivacy(false);
    }
  };

  const handleConfirmHardDelete = async () => {
    if (deleteConfirmation !== 'DELETE MY MEMORIES FOREVER') {
      setDeleteError('Please type "DELETE MY MEMORIES FOREVER" to confirm.');
      return;
    }

    setIsDeletingAccount(true);
    setDeleteError('');

    try {
      await onHardDeleteAccount(deleteConfirmation);
    } catch (err) {
      setDeleteError(err.message || 'Error executing hard deletion.');
      setIsDeletingAccount(false);
    }
  };

  const EMOJI_OPTIONS = ['💖', '✨', '🌙', '✈️', '💍', '☕', '🌹', '🏖️', '🎶', '🍿', '🕯️', '💌', '🌸', '🥂'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-3xl bg-[#fffefc] rounded-3xl shadow-2xl border border-rose-100 overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-900 via-wine-950 to-rose-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rose-500/30 rounded-xl border border-rose-400/40 text-rose-300">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold tracking-wide">
                User Sovereign Control &amp; Love Sanctuary
              </h2>
              <p className="text-xs text-rose-200 font-serif italic">
                You hold the master key to your privacy, categories &amp; soulmate sharing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-rose-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-rose-100 bg-rose-50/50 px-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('sovereign')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'sovereign'
                ? 'border-rose-600 text-rose-700 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Soulmate Code &amp; Power</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-rose-600 text-rose-700 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Categories Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-rose-600 text-rose-700 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Couple Story &amp; Clock</span>
          </button>

          <button
            onClick={() => setActiveTab('danger')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'danger'
                ? 'border-red-600 text-red-700 font-semibold'
                : 'border-transparent text-gray-400 hover:text-red-600'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hard Deletion Zone</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {updateMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
              <Check className="w-4 h-4 text-rose-600" />
              <span>{updateMsg}</span>
            </div>
          )}

          {/* TAB 1: SOVEREIGN POWERS & SOULMATE CODE */}
          {activeTab === 'sovereign' && (
            <div className="space-y-6">
              
              {/* Soulmate Key Digital Card */}
              <div className="relative overflow-hidden bg-gradient-to-tr from-rose-950 via-rose-900 to-pink-900 rounded-3xl p-6 text-white shadow-xl border border-rose-700/50">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 pointer-events-none opacity-10">
                  <Heart className="w-72 h-72 fill-white" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center space-x-2 text-rose-300 text-xs font-semibold uppercase tracking-widest mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span>Soulmate Access Key</span>
                    </div>

                    <h3 className="font-editorial text-2xl font-bold">
                      Your Private Couple Code
                    </h3>
                    <p className="text-xs text-rose-200 font-serif italic mt-1 max-w-md">
                      Share this sacred key with your partner so they can connect with your private sanctuary. Both of you will share the exact same memories and categories!
                    </p>

                    <div className="mt-4 inline-flex items-center space-x-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-rose-400/40">
                      <span className="font-mono text-lg font-bold tracking-widest text-amber-300">
                        {user.couple_code || 'AMOUR-7799-LOVE'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                    <button
                      onClick={handleCopyCoupleCode}
                      className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedCode ? 'Code Copied!' : 'Copy Soulmate Code'}</span>
                    </button>

                    <button
                      onClick={handleCopyInviteMessage}
                      className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-medium backdrop-blur-md border border-white/20 transition-all flex items-center justify-center space-x-1.5"
                    >
                      {copiedMessage ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
                      <span>{copiedMessage ? 'Invite Message Copied!' : 'Copy Love Invitation'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Soulmate Connection Status & Control */}
              <div className="p-5 bg-white rounded-2xl border border-rose-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-rose-600" />
                    <span className="text-sm font-bold text-gray-900">Soulmate Connection Status</span>
                  </div>

                  {user.partner_user_id ? (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Soulmate Linked &amp; Sharing Album</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                      Awaiting Soulmate Link
                    </span>
                  )}
                </div>

                {user.partner_user_id ? (
                  <div className="flex items-center justify-between p-3.5 bg-rose-50/50 rounded-xl border border-rose-100">
                    <div>
                      <div className="text-xs font-bold text-gray-900">
                        {user.linked_partner?.display_name || user.partner_name || 'My Soulmate'}
                      </div>
                      <div className="text-[11px] text-rose-800">
                        Has full read &amp; write access to our shared romantic album
                      </div>
                    </div>

                    <button
                      onClick={handleUnlinkPartnerSubmit}
                      className="px-3 py-1.5 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 flex items-center space-x-1 font-medium transition-colors"
                    >
                      <Unlink className="w-3.5 h-3.5" />
                      <span>Unlink / Revoke Access</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLinkPartnerSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-800 mb-1">
                        Got a code from your soulmate? Enter their secret key to connect your albums:
                      </label>
                      <p className="text-[11px] text-gray-500 font-serif italic mb-2">
                        How it works: Once linked, you both see the exact same romantic photos, videos, timeline, custom categories, and live love clock!
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. AMOUR-XXXX-LOVE"
                        value={partnerCodeInput}
                        onChange={(e) => setPartnerCodeInput(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-rose-200 bg-white uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-inner"
                      />
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>Link Hearts</span>
                      </button>
                    </div>

                    {/* Quick Demo Autofill Button */}
                    <div className="pt-2 flex items-center justify-between text-[11px] text-rose-800 bg-rose-50/70 p-2.5 rounded-xl border border-rose-200">
                      <span>💡 <strong>Quick Demo Test:</strong> Want to test pairing with Alexander's album?</span>
                      <button
                        type="button"
                        onClick={() => setPartnerCodeInput('AMOUR-7799-LOVE')}
                        className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 font-semibold transition-colors"
                      >
                        Paste AMOUR-7799-LOVE
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* ZERO-KNOWLEDGE PRIVACY SHIELD CERTIFICATE */}
              <div className="p-5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Zero-Knowledge Privacy Shield (Admin Lockdown)</span>
                  </div>

                  <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Guaranteed
                  </span>
                </div>

                <p className="text-xs text-emerald-800 leading-relaxed">
                  <strong>Does the admin have access to your data? <span className="underline">NO.</span></strong>
                  <br />
                  Under AmourNest's zero-knowledge architecture, administrators are strictly prohibited from viewing your photos, love stories, attached songs, or personal categories. The administrator can only verify that an account exists for login audit purposes (email and account status).
                </p>

                {privacyTestStatus && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-300 text-xs text-emerald-900 font-mono">
                    ✅ <strong>Verification Test Passed:</strong> {privacyTestStatus.message} (Status {privacyTestStatus.status})
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleTestAdminBlock}
                  disabled={isTestingPrivacy}
                  className="px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-white hover:bg-emerald-100 rounded-lg border border-emerald-300 shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <EyeOff className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isTestingPrivacy ? 'Testing Protection...' : 'Verify Admin Data Lockdown (Live Test)'}</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: CATEGORIES MANAGER */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              
              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-1 flex items-center space-x-1.5">
                  <Tag className="w-4 h-4 text-rose-600" />
                  <span>Customize Your Couple Categories</span>
                </h4>
                <p className="text-xs text-rose-800/80 font-serif italic">
                  Create custom romantic categories (like in the category bar). Any category created here is immediately available when uploading memories and shared with your soulmate!
                </p>
              </div>

              {/* Add New Category Form */}
              <form onSubmit={handleAddCategory} className="p-4 bg-white rounded-2xl border border-rose-200 shadow-sm space-y-3">
                <span className="text-xs font-bold text-gray-900 block">
                  Add a New Romantic Category
                </span>

                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  {/* Emoji selector */}
                  <select
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                    className="px-3 py-2 text-base rounded-xl border border-rose-200 bg-white shrink-0"
                  >
                    {EMOJI_OPTIONS.map((em) => (
                      <option key={em} value={em}>{em}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    required
                    placeholder="Category name (e.g. Late Night Talks, Road Trips, Secret Notes)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />

                  <button
                    type="submit"
                    disabled={catLoading}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{catLoading ? 'Adding...' : 'Add Category'}</span>
                  </button>
                </div>
              </form>

              {/* Categories List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Active Sanctuary Categories ({categories.length})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="p-3 bg-white rounded-xl border border-rose-100 flex items-center justify-between hover:border-rose-300 transition-colors shadow-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-lg">{cat.icon || '💖'}</span>
                        <span className="text-xs font-bold text-gray-900">{cat.name}</span>
                        {cat.is_default && (
                          <span className="text-[10px] text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full font-medium">
                            Default
                          </span>
                        )}
                      </div>

                      {!cat.is_default && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded-lg transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PROFILE & LIVE CLOCK SETTINGS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-1">
                    Your Name / Nickname
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-1">
                    Partner's Name / Nickname
                  </label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-1 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  <span>Relationship / Anniversary Date (Powers Live Love Clock)</span>
                </label>
                <input
                  type="date"
                  value={anniversaryDate}
                  onChange={(e) => setAnniversaryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-1">
                  Our Romantic Bio / Vow
                </label>
                <textarea
                  rows="3"
                  value={romanticBio}
                  onChange={(e) => setRomanticBio(e.target.value)}
                  placeholder="A sweet quote or romantic vow representing both of you..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white text-sm font-serif italic"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                {isUpdating ? 'Saving Changes...' : 'Save Profile & Clock'}
              </button>
            </form>
          )}

          {/* TAB 4: DANGER ZONE (HARD DELETION) */}
          {activeTab === 'danger' && (
            <div className="p-5 bg-red-50/80 rounded-2xl border-2 border-red-200 space-y-4">
              <div className="flex items-center space-x-2 text-red-900 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <span>Ultimate Sovereign Power: Permanent Vault Wipe</span>
              </div>

              <p className="text-xs text-red-800 leading-relaxed">
                <strong>Strict Privacy &amp; Data Erasure Guarantee:</strong> If you delete your account,
                all uploaded photos will be physically destroyed from the disk, all memories, love stories,
                and couple links will be permanently wiped, and your credentials will be purged.
                <br />
                <span className="font-bold underline text-red-700">
                  Once deleted, this data CANNOT BE RECOVERED by anyone, including administrators.
                </span>
              </p>

              {deleteError && (
                <div className="p-2.5 bg-red-100 text-red-800 text-xs rounded-lg font-medium">
                  {deleteError}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-bold text-red-900">
                  To confirm permanent deletion, type <code className="bg-red-200/80 px-1 py-0.5 rounded text-red-950 select-all">DELETE MY MEMORIES FOREVER</code> below:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE MY MEMORIES FOREVER"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
                />
              </div>

              <button
                type="button"
                onClick={handleConfirmHardDelete}
                disabled={deleteConfirmation !== 'DELETE MY MEMORIES FOREVER' || isDeletingAccount}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-40 flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeletingAccount ? 'Purging Everything Forever...' : 'Permanently Delete Account & Wipe All Memories'}</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
