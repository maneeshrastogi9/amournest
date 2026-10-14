const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();
const { db } = require('./db');

const authRoutes = require('./routes/auth');
const memoriesRoutes = require('./routes/memories');
const adminRoutes = require('./routes/admin');
const categoriesRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded romantic images
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/memories', memoriesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoriesRoutes);

// Health check & Privacy Charter verification
app.get('/api/privacy-charter', (req, res) => {
  res.json({
    platform: 'AmourNest',
    vision: 'A private sanctuary for romantic memories.',
    privacy_policy: {
      end_to_end_isolation: true,
      admin_data_access: 'Strictly Restricted: Credentials & Account Status ONLY',
      permanent_deletion: 'Hard unrecoverable purge on demand',
      google_oauth_supported: true
    }
  });
});

// Seed Initial Admin & Demo Lovers Data if DB is new
function seedInitialData() {
  db.get('SELECT COUNT(*) as count FROM users', [], async (err, row) => {
    if (err) return;
    if (row && row.count === 0) {
      console.log('Seeding initial demo accounts with romantic memories...');
      const adminPass = await bcrypt.hash('AdminPass2026!', 10);
      const userPass = await bcrypt.hash('LoveStory2026!', 10);

      const adminId = uuidv4();
      const loverId = uuidv4();

      // Seed Admin (Credentials ONLY)
      db.run(
        `INSERT INTO users (id, email, password_hash, role, status) VALUES (?, ?, ?, 'admin', 'active')`,
        [adminId, 'admin@amournest.com', adminPass]
      );
      db.run(
        `INSERT INTO profiles (user_id, display_name, couple_code, romantic_bio) VALUES (?, ?, ?, ?)`,
        [adminId, 'Security Admin', 'AMOUR-ADMN-KEY', 'System Administrator (Zero-Knowledge Privacy Shield Enforcement)']
      );

      // Seed Demo Couple
      db.run(
        `INSERT INTO users (id, email, password_hash, role, status) VALUES (?, ?, ?, 'user', 'active')`,
        [loverId, 'lovers@gmail.com', userPass]
      );
      db.run(
        `INSERT INTO profiles (user_id, display_name, partner_name, couple_code, anniversary_date, romantic_bio, avatar_url)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          loverId,
          'Elena Rostova',
          'Alexander Wright',
          'AMOUR-7799-LOVE',
          '2024-06-18',
          'Every heartbeat is a love letter written for you across the stars.',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
        ]
      );

      // Seed 3 Romantic Memories with Signs & Songs
      const demoMemories = [
        {
          id: uuidv4(),
          user_id: loverId,
          title: 'Under the Parisian Golden Lights',
          memory_date: '2024-10-24',
          image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
          image_filename: '',
          romantic_sign: '💖 Infinity Bond',
          romantic_sign_meaning: 'Two souls forever woven into one timeless heartbeat.',
          song_title: 'Candlelight Waltz in Paris',
          song_type: 'preset',
          song_url: 'candlelight-waltz',
          story: 'We stood by the Seine as the raindrops danced upon the water. You whispered in my ear that you never wanted this evening to end, and in that quiet breath, my entire world found its home.',
          location: 'Pont des Arts, Paris',
          mood_tag: 'Midnight Reverie'
        },
        {
          id: uuidv4(),
          user_id: loverId,
          title: 'Sunset Whispers on the Shoreline',
          memory_date: '2025-02-14',
          image_url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
          image_filename: '',
          romantic_sign: '🌹 Eternal Rose',
          romantic_sign_meaning: 'An unfading bloom of devotion that defies all seasons.',
          song_title: 'Sunset Serenade for Strings',
          song_type: 'preset',
          song_url: 'sunset-serenade',
          story: 'The horizon was painted in blush pink and warm amber gold. We traced our initials in the wet sand, laughing as the tide kissed our feet. A memory that lives rent-free in my heart.',
          location: 'Amalfi Coast, Italy',
          mood_tag: 'Valentine Magic'
        },
        {
          id: uuidv4(),
          user_id: loverId,
          title: 'Our First Coffee & Stolen Smiles',
          memory_date: '2024-06-18',
          image_url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
          image_filename: '',
          romantic_sign: '✨ Starlit Promise',
          romantic_sign_meaning: 'A divine spark ignited under the watchful glow of the universe.',
          song_title: 'Piano Melodies for Two',
          song_type: 'preset',
          song_url: 'piano-melodies',
          story: 'It started with one spilled latte and three hours of non-stop laughter. When you looked at me, I already knew my future had just walked through the doorway.',
          location: 'Le Petit Café',
          mood_tag: 'First Spark'
        }
      ];

      demoMemories.forEach((mem) => {
        db.run(
          `INSERT INTO memories (id, user_id, title, memory_date, image_url, image_filename, romantic_sign, romantic_sign_meaning, song_title, song_type, song_url, story, location, mood_tag)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            mem.id,
            mem.user_id,
            mem.title,
            mem.memory_date,
            mem.image_url,
            mem.image_filename,
            mem.romantic_sign,
            mem.romantic_sign_meaning,
            mem.song_title,
            mem.song_type,
            mem.song_url,
            mem.story,
            mem.location,
            mem.mood_tag
          ]
        );
      });

      console.log('Seeded demo lovers and admin accounts successfully!');
    }
  });
}

// Serve production client build if exists
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

seedInitialData();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AmourNest Server running passionately on port ${PORT}`);
});
