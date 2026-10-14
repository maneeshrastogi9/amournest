# 💖 AmourNest — The Private Romantic Memory Sanctuary for Couples

> *"Where every heartbeat is etched in eternity, and your love story remains entirely yours."*

**AmourNest** is a privacy-first, aesthetic web application crafted exclusively for couples to document, cherish, and celebrate their romantic journey. Designed with warm velvet rose tones, vintage polaroid cards, delicate floating rose petals, and acoustic melodies, AmourNest delivers a romantic atmosphere while guaranteeing **Zero-Knowledge Privacy**.

---

## ✨ Key Features & Privacy Guarantee

### 1. 🔒 Absolute Zero-Knowledge Privacy (Admin Isolation)
- **Admin Cannot View Memories**: Under AmourNest's End-to-End Privacy Charter, administrators are architecturally and mathematically barred from viewing user photographs, love letters, songs, or album memories.
- **Credentials-Only Audit**: The Administrator Portal can *only* audit account metadata (User ID, Gmail/Email address, auth method, registration date, and account status).
- **Built-in Verification Shield**: Admins can test and verify this live in the Admin Portal; any attempt to query user memories returns an explicit `HTTP 403 Forbidden` response.

### 2. 💌 Gmail & Google OAuth Login
- **Sign in with Gmail**: Supports Google OAuth 2.0 / Google Identity Services for effortless one-click authentication.
- **Instant Demo Mode**: Includes an instant one-click login simulator (`lovers@gmail.com`) so couples can explore right away without requiring Google Cloud Console setup.
- **Couple Pairing Code**: Every user receives a unique Love Code (e.g. `AMOUR-7799-LOVE`) to share with their partner. Once paired, both partners view and upload to the exact same shared romantic album!

### 3. 📸 Romantic Presentation & Aesthetic Album
- **Scrapbook Polaroid Gallery**: Pictures appear as authentic vintage polaroids with gentle rotations, textured shadows, washi tape pins, and handwritten love notes.
- **Romantic Signs**: Each memory is crowned with a poetic romantic sign and meaning:
  - 💖 **Infinity Bond**: *"Two souls entwined for eternity, transcending distance and time."*
  - 🌹 **Eternal Rose**: *"Unfading beauty, deep passion, and a love that blooms forever."*
  - ✨ **Starlit Promise**: *"A sacred vow written among constellations and silent wishes."*
  - 🕊️ **Soulmate Whispers**: *"Pure harmony, peaceful understanding, and gentle tenderness."*
  - 💍 **Forever Vow**: *"Yesterday's sweetest dream, today's joy, and all our tomorrows."*
  - 💌 **Secret Love Note**: *"Written for your eyes alone, guarded in the heart's sanctuary."*
  - 🌙 **Midnight Reverie**: *"Late-night laughter, sweet secrets, and conversations under the moon."*
  - 🕯️ **Candlelight Devotion**: *"Warm, steady flame glowing with unconditional tenderness."*
- **Romantic Melody per Picture**:
  - Each uploaded picture has an attached romantic acoustic melody (synthesized via Web Audio API or custom audio track):
    - 🎹 *Piano Serenade for Two* (Acoustic piano arpeggios)
    - 🎻 *Candlelight Waltz in Paris* (French romantic waltz)
    - 🌅 *Sunset Serenade for Strings* (Cello & violin harmony)
    - 🌌 *Stargazing Hearts* (Ethereal dreamy chimes)
  - Pictures have a live music button with spinning vinyl record animations!
- **Interactive Lightbox with Confetti Hearts**: Click any memory to open a full-page romantic view with the full story, music player, and a heart reaction button that bursts floating confetti hearts.
- **The Journey of Us (Timeline)**: A chronological heart-linked roadmap charting your love from Day 1.
- **Cinema of Us (Fullscreen Slideshow)**: A cozy full-screen cinema view with slow Ken Burns zooms, romantic background music, and poetic lyric overlays for couple cuddle sessions.

### 4. ⏳ Live "In Love" Counter
- Set your relationship or anniversary date in your profile.
- A live beating-heart clock ticks in the navigation bar:
  `Elena & Alexander • In Love for 483d 14h 22m 19s`

### 5. 🗑️ Irreversible Hard Deletion ("Data Will Not Recover")
- Strict data sovereignty: Users can edit their profile at any time, or trigger a **Permanent Vault Wipe**.
- In the Profile Danger Zone, users must type `DELETE MY MEMORIES FOREVER` to confirm.
- The server permanently deletes all uploaded photo files from disk storage (`fs.unlinkSync`), scrubs all memory records and partner associations, purges the user credentials, and runs SQLite `VACUUM`.
- **Once deleted, the data cannot be recovered by anyone, including administrators.**

---

## 🚀 How to Run AmourNest

The application is completely built and ready to run locally!

### Quick Start (Full-Stack)

1. **Start the App**:
   ```bash
   npm start
   ```
2. **Open in Browser**:
   Navigate to:
   ```
   http://localhost:5000
   ```

### Development Mode (with Vite Hot Reload)
To run frontend and backend simultaneously in dev mode:
```bash
# Terminal 1: Backend Server
npm run server

# Terminal 2: Vite React Frontend
npm run client
```

---

## 🔑 Pre-seeded Demo Accounts

You can test immediately using the pre-configured accounts:

| Role | Email / Gmail | Password | Access Scope |
|------|---------------|----------|--------------|
| **Couple (Lovers)** | `lovers@gmail.com` | `LoveStory2026!` | Full access to private romantic memory album, photo upload, timeline, song playback, and hard delete. |
| **Administrator** | `admin@amournest.com` | `AdminPass2026!` | **Credentials Only**. Can review registered accounts, auth types, status. **ZERO access to photos or memories** (verified with 403 Forbidden shield). |

*(You can also click "Sign in with Gmail (Demo)" or register a brand-new couple account!)*

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Tailwind CSS, Lucide Icons, Canvas Confetti, Web Audio Synthesizer, Vite 5.
- **Backend**: Node.js, Express, SQLite3, Multer (secure file upload & physical unlink purge), JSON Web Tokens (JWT), Bcrypt, Google Auth Library.
