const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');
const { requireUser, enforceMemoryPrivacy } = require('../middleware/auth');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = 'amour_' + Date.now() + '_' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for high-res pictures & romantic video clips
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|avif|mp4|webm|mov|m4v|ogg|quicktime/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype) || file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/');
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only romantic photos (JPG, PNG, WEBP, GIF) and video clips (MP4, WEBM, MOV) are allowed.'));
    }
  }
});

// Enforce strict memory privacy across all routes in this file
router.use(requireUser);
router.use(enforceMemoryPrivacy);

// 1. Get All Memories for User and Linked Partner
router.get('/', (req, res) => {
  const userId = req.user.id;

  // First check if user is paired with a partner
  db.get('SELECT partner_user_id FROM profiles WHERE user_id = ?', [userId], (err, profile) => {
    if (err) return res.status(500).json({ error: 'Database read error.' });

    const partnerId = profile?.partner_user_id;
    let query = 'SELECT * FROM memories WHERE user_id = ?';
    let params = [userId];

    if (partnerId) {
      query = 'SELECT * FROM memories WHERE user_id = ? OR user_id = ? ORDER BY memory_date DESC, created_at DESC';
      params = [userId, partnerId];
    } else {
      query = 'SELECT * FROM memories WHERE user_id = ? ORDER BY memory_date DESC, created_at DESC';
      params = [userId];
    }

    db.all(query, params, (mErr, rows) => {
      if (mErr) return res.status(500).json({ error: 'Failed to fetch memories.' });
      res.json({
        count: rows.length,
        memories: rows
      });
    });
  });
});

// 2. Upload and Create a Romantic Memory
router.post('/upload', upload.single('photo'), (req, res) => {
  try {
    if (!req.file && !req.body.sample_image) {
      return res.status(400).json({ error: 'A photo is required for your romantic memory.' });
    }

    const {
      title,
      memory_date,
      romantic_sign,
      romantic_sign_meaning,
      song_title,
      song_type,
      song_url,
      story,
      location,
      mood_tag,
      sample_image
    } = req.body;

    if (!title || !memory_date) {
      return res.status(400).json({ error: 'Title and Date of Memory are required.' });
    }

    const memoryId = uuidv4();
    const filename = req.file ? req.file.filename : (sample_image ? 'sample_photo.jpg' : '');
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : (sample_image || '/uploads/default.jpg');

    db.run(
      `INSERT INTO memories (
        id, user_id, title, memory_date, image_url, image_filename,
        romantic_sign, romantic_sign_meaning, song_title, song_type,
        song_url, story, location, mood_tag
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        memoryId,
        req.user.id,
        title,
        memory_date,
        imageUrl,
        filename,
        romantic_sign || '💖 Infinity Bond',
        romantic_sign_meaning || 'Two souls intertwined in an unbreakable promise.',
        song_title || 'Piano Serenade for Two',
        song_type || 'preset',
        song_url || 'piano-serenade',
        story || '',
        location || 'In each other\'s arms',
        mood_tag || 'Pure Love'
      ],
      function (err) {
        if (err) {
          console.error('Insert memory error:', err);
          return res.status(500).json({ error: 'Failed to save memory to your vault.' });
        }

        db.get('SELECT * FROM memories WHERE id = ?', [memoryId], (gErr, newMemory) => {
          return res.status(201).json({
            message: 'Memory etched into your romantic album forever.',
            memory: newMemory
          });
        });
      }
    );
  } catch (error) {
    console.error('Upload processing error:', error);
    res.status(500).json({ error: 'Failed to process memory upload.' });
  }
});

// 3. Delete a Single Memory (Permanent Hard Delete of File & Row)
router.delete('/:id', (req, res) => {
  const memoryId = req.params.id;
  const userId = req.user.id;

  // Ensure this memory belongs to user or their linked partner
  db.get('SELECT partner_user_id FROM profiles WHERE user_id = ?', [userId], (pErr, profile) => {
    const partnerId = profile?.partner_user_id;

    db.get('SELECT * FROM memories WHERE id = ?', [memoryId], (err, memory) => {
      if (err || !memory) {
        return res.status(404).json({ error: 'Memory not found.' });
      }

      if (memory.user_id !== userId && memory.user_id !== partnerId) {
        return res.status(403).json({ error: 'You are not authorized to delete this memory.' });
      }

      // Hard delete file from disk
      if (memory.image_filename) {
        const filePath = path.join(uploadsDir, memory.image_filename);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.error('Unlink error:', e);
          }
        }
      }

      // Permanently remove row
      db.run('DELETE FROM memories WHERE id = ?', [memoryId], function (delErr) {
        if (delErr) return res.status(500).json({ error: 'Failed to delete memory record.' });
        res.json({
          message: 'Memory and photo permanently erased from the album. Data cannot be recovered.'
        });
      });
    });
  });
});

module.exports = router;
