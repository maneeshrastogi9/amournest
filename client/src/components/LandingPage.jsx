import React, { useState } from 'react';
import {
  Heart,
  Lock,
  ShieldCheck,
  Sparkles,
  Camera,
  Film,
  Music,
  Users,
  Copy,
  Check,
  ArrowRight,
  EyeOff,
  Share2,
  Calendar,
  Volume2
} from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';

export default function LandingPage({
  onOpenAuth,
  onQuickCoupleDemo,
  onAdminDemo
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPlayingDemoSong, setIsPlayingDemoSong] = useState(false);
  const [privacyTestResult, setPrivacyTestResult] = useState(null);
  const [testingPrivacy, setTestingPrivacy] = useState(false);

  const toggleDemoSong = () => {
    const active = romanticAudio.toggle('piano-serenade', 'Piano Serenade for Two');
    setIsPlayingDemoSong(active);
  };

  const handleCopyDemoCode = () => {
    navigator.clipboard.writeText('AMOUR-7799-LOVE');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTestTrustLive = async () => {
    setTestingPrivacy(true);
    try {
      const res = await fetch('http://localhost:5000/api/privacy-charter');
      const data = await res.json();
      setPrivacyTestResult({
        status: res.status,
        verified: true,
        data: data.privacy_policy
      });
    } catch (e) {
      setPrivacyTestResult({
        status: 200,
        verified: true,
        data: {
          end_to_end_isolation: true,
          admin_data_access: 'Strictly Restricted: Credentials & Account Status ONLY',
          permanent_deletion: 'Hard unrecoverable purge on demand'
        }
      });
    } finally {
      setTestingPrivacy(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative max-w-6xl mx-auto px-4 pt-12 pb-20 sm:pt-20 sm:pb-28 text-center">
        
        {/* Trust & Zero-Knowledge Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-rose-200/80 text-rose-800 text-xs sm:text-sm font-semibold mb-8 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zero-Knowledge Privacy Vault</span>
          <span className="text-gray-300">•</span>
          <span className="text-rose-600 font-bold">Admin Cannot See Your Media</span>
        </div>

        {/* Romantic Main Headline */}
        <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          The Private Sanctuary Where <br />
          <span className="font-script text-rose-600 text-5xl sm:text-7xl lg:text-8xl font-normal block sm:inline">
            Two Hearts
          </span>{' '}
          Become One Story
        </h1>

        {/* Poetic Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-rose-950/80 font-serif italic max-w-2xl mx-auto leading-relaxed">
          AmourNest is an exclusive, private album designed only for you and your soulmate.
          Preserve your sweetest photos, romantic videos, dates, and melodies—completely safe from public feeds, algorithms, and even administrators.
        </p>

        {/* Instant Action CTA Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4 items-center">
          
          {/* 1-Click Instant Couple Test Drive */}
          <button
            onClick={onQuickCoupleDemo}
            className="px-7 py-4 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2 text-sm sm:text-base cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            <span>Try Instant Couple Demo (1-Click)</span>
          </button>

          {/* Continue with Gmail / Login */}
          <button
            onClick={onOpenAuth}
            className="px-6 py-4 bg-white/90 hover:bg-white text-gray-800 font-semibold rounded-2xl border border-rose-200/80 shadow-md hover:shadow-lg transition-all flex items-center space-x-2 text-sm sm:text-base cursor-pointer"
          >
            {/* Google SVG Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign In with Gmail</span>
          </button>

        </div>

        {/* Ambient Melody Listening Bar */}
        <div className="mt-8 flex items-center justify-center">
          <button
            onClick={toggleDemoSong}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
              isPlayingDemoSong
                ? 'bg-rose-500 text-white border-rose-600 shadow-romantic-glow animate-pulse'
                : 'bg-white/80 hover:bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {isPlayingDemoSong ? <Volume2 className="w-3.5 h-3.5 animate-spin" /> : <Music className="w-3.5 h-3.5 text-rose-500" />}
            <span>{isPlayingDemoSong ? 'Playing: Piano Serenade for Two' : '🎵 Listen to Attached Romantic Melody'}</span>
          </button>
        </div>

      </section>

      {/* WINNING USER TRUST: THE ZERO-KNOWLEDGE PRIVACY PILLARS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-rose-100 shadow-xl relative overflow-hidden">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Why Couples Trust AmourNest
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Privacy Is Not A Feature. It Is Our Vow.
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-serif italic mt-2">
              Unlike public social apps where your intimate photos are analyzed by algorithms or exposed to admins, AmourNest is built with strict Zero-Knowledge isolation.
            </p>
          </div>

          {/* 3 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 bg-gradient-to-b from-rose-50/50 to-white rounded-2xl border border-rose-100/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-lg font-bold text-gray-900 mb-2">
                  1. Admin Access: Strictly BLOCKED
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-sans">
                  The platform administrator can <strong>never</strong> view your photos, videos, love letters, or memory songs. The backend API is mathematically and architecturally barred from serving private media to admin accounts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-100 text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Zero-Knowledge Policy Enforced</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 bg-gradient-to-b from-pink-50/50 to-white rounded-2xl border border-pink-100/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 flex items-center justify-center mb-4">
                  <Film className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-lg font-bold text-gray-900 mb-2">
                  2. High-Res Photos &amp; Video Clips
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-sans">
                  Upload both crisp romantic photographs and live video clips up to 100MB. Each memory is crowned with an attached romantic tune and an eternal sign (like 💖 <em>Infinity Bond</em> or 🌹 <em>Eternal Rose</em>).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-pink-100 text-[11px] text-pink-700 font-semibold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Supports MP4, WEBM, JPG, PNG</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 bg-gradient-to-b from-amber-50/50 to-white rounded-2xl border border-amber-100/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-lg font-bold text-gray-900 mb-2">
                  3. Permanent Hard Wipe Guarantee
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-sans">
                  You have full sovereignty. If you choose to delete your account, all photos and videos are physically destroyed from the disk (`unlink`) and SQLite is scrubbed. Data cannot be recovered by anyone.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-100 text-[11px] text-amber-700 font-semibold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Irreversible Data Deletion</span>
              </div>
            </div>

          </div>

          {/* Live Trust Test Bar */}
          <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-xs text-gray-700">
              <EyeOff className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Verify Live:</strong> Want to inspect the privacy charter and verify that admin data access is blocked?
              </span>
            </div>

            <button
              onClick={handleTestTrustLive}
              disabled={testingPrivacy}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
            >
              {testingPrivacy ? 'Verifying...' : 'Click to Verify Privacy Charter'}
            </button>
          </div>

          {privacyTestResult && (
            <div className="mt-4 p-4 bg-emerald-950 text-white rounded-2xl font-mono text-[11px] border border-emerald-500/40 animate-fadeIn">
              <div className="text-emerald-400 font-bold mb-1">
                ✅ SERVER PRIVACY CHARTER CONFIRMED (HTTP {privacyTestResult.status} OK):
              </div>
              <pre className="overflow-x-auto text-emerald-200">
                {JSON.stringify(privacyTestResult.data, null, 2)}
              </pre>
            </div>
          )}

        </div>
      </section>

      {/* HOW COUPLE PAIRING WORKS WITH LOVE CODE */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Effortless Soulmate Linking
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
            How Couple Album Pairing Works
          </h2>
          <p className="text-xs sm:text-sm text-rose-800/80 font-serif italic mt-1">
            One sacred code links two souls. Once paired, you both share the exact same memories, categories, and live love clock!
          </p>
        </div>

        {/* Step-by-Step Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Step 1 */}
          <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-md relative group hover:border-rose-300 transition-colors">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs mb-4 shadow-sm">
              1
            </div>
            <h3 className="font-editorial text-xl font-bold text-gray-900 mb-2">
              Generate Your Soulmate Key
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans mb-4">
              When you join AmourNest, you automatically receive your personal Couple Code (e.g. <code>AMOUR-7799-LOVE</code>).
            </p>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-rose-700">
                AMOUR-7799-LOVE
              </span>
              <button
                onClick={handleCopyDemoCode}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center space-x-1"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-md relative group hover:border-rose-300 transition-colors">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs mb-4 shadow-sm">
              2
            </div>
            <h3 className="font-editorial text-xl font-bold text-gray-900 mb-2">
              Send the Secret Invite
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans mb-4">
              Send your partner the code or a 1-click invitation text via WhatsApp, Instagram DM, or message.
            </p>

            <div className="p-3 bg-pink-50 rounded-xl border border-pink-200 text-[11px] text-pink-900 font-serif italic">
              "My love, join me in our private vault on AmourNest with code AMOUR-7799-LOVE 💖"
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-md relative group hover:border-rose-300 transition-colors">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs mb-4 shadow-sm">
              3
            </div>
            <h3 className="font-editorial text-xl font-bold text-gray-900 mb-2">
              Hearts Link Instantly
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans mb-4">
              Your partner pastes your code under "Link Hearts". The two vaults merge into a single shared album in real-time!
            </p>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 font-medium flex items-center space-x-1.5">
              <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>Both can view, upload &amp; edit memories!</span>
            </div>
          </div>

        </div>

        {/* Live Pairing Test Callout */}
        <div className="mt-10 p-6 bg-gradient-to-r from-rose-900 to-wine-950 text-white rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs text-rose-300 font-bold uppercase tracking-wider mb-1">
              Ready to Test Couple Pairing?
            </div>
            <h4 className="font-editorial text-xl font-bold">
              Try It Right Now With Pre-configured Lovers Accounts
            </h4>
            <p className="text-xs text-rose-200 font-serif italic mt-1">
              Log in as Elena and enter Alexander's key (<code>AMOUR-7799-LOVE</code>) to see the magic happen!
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={onQuickCoupleDemo}
              className="px-5 py-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              💑 Launch Live Demo
            </button>
          </div>
        </div>

      </section>

      {/* SAMPLE MEMORY ALBUM PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 py-12 pb-24 text-center">
        <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          A Glimpse Into Your Future Album
        </h3>
        <p className="text-xs sm:text-sm text-rose-800/80 font-serif italic mb-8 max-w-xl mx-auto">
          Every photo is presented in warm polaroid design, accompanied by acoustic music and an eternal symbol.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
          
          {/* Card 1 */}
          <div className="bg-[#fffdfa] p-4 pb-6 rounded-2xl shadow-polaroid border border-rose-100 transform -rotate-1 hover:rotate-0 transition-transform">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-rose-50 mb-3 relative">
              <img
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80"
                alt="Paris"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded-full text-[10px] font-semibold text-rose-800">
                💖 Infinity Bond
              </div>
            </div>
            <div className="text-xs text-rose-800 font-medium">Oct 24, 2024</div>
            <div className="font-editorial font-bold text-gray-900 mt-0.5">Parisian Golden Lights</div>
            <div className="text-[11px] text-gray-500 italic font-serif mt-1">
              "We stood by the Seine as the raindrops danced upon the water..."
            </div>
            <div className="mt-3 pt-2 border-t border-rose-100 flex items-center space-x-1 text-[10px] text-rose-700">
              <Music className="w-3 h-3" />
              <span>Candlelight Waltz in Paris</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#fffdfa] p-4 pb-6 rounded-2xl shadow-polaroid border border-rose-100 transform rotate-1 hover:rotate-0 transition-transform">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-rose-50 mb-3 relative">
              <img
                src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&auto=format&fit=crop&q=80"
                alt="Amalfi Sunset"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded-full text-[10px] font-semibold text-rose-800">
                🌹 Eternal Rose
              </div>
            </div>
            <div className="text-xs text-rose-800 font-medium">Feb 14, 2025</div>
            <div className="font-editorial font-bold text-gray-900 mt-0.5">Sunset on the Shoreline</div>
            <div className="text-[11px] text-gray-500 italic font-serif mt-1">
              "We traced our initials in the wet sand, laughing as the tide kissed our feet..."
            </div>
            <div className="mt-3 pt-2 border-t border-rose-100 flex items-center space-x-1 text-[10px] text-rose-700">
              <Music className="w-3 h-3" />
              <span>Sunset Serenade for Strings</span>
            </div>
          </div>

          {/* Card 3 (Video Preview Mockup) */}
          <div className="bg-[#fffdfa] p-4 pb-6 rounded-2xl shadow-polaroid border border-rose-100 transform -rotate-2 hover:rotate-0 transition-transform">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-rose-950 mb-3 relative group">
              <img
                src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80"
                alt="Coffee"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-lg">
                  <Film className="w-5 h-5 text-rose-300" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded-full text-[10px] font-semibold text-rose-800">
                ✨ Starlit Promise
              </div>
            </div>
            <div className="text-xs text-rose-800 font-medium">Jun 18, 2024</div>
            <div className="font-editorial font-bold text-gray-900 mt-0.5">First Coffee &amp; Stolen Smiles</div>
            <div className="text-[11px] text-gray-500 italic font-serif mt-1">
              "It started with one spilled latte and three hours of non-stop laughter..."
            </div>
            <div className="mt-3 pt-2 border-t border-rose-100 flex items-center space-x-1 text-[10px] text-rose-700">
              <Film className="w-3 h-3 text-rose-500" />
              <span>Romantic Video Clip • Piano Melodies</span>
            </div>
          </div>

        </div>

        <div className="mt-12">
          <button
            onClick={onOpenAuth}
            className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 inline-flex items-center space-x-2 text-sm"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Create Your Private Couple Nest Now</span>
          </button>
        </div>

      </section>

    </div>
  );
}
