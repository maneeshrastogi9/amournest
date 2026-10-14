const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');
const { requireUser, enforceMemoryPrivacy } = require('../middleware/auth');

router.use(requireUser);
router.use(enforceMemoryPrivacy);

const DEFAULT_CATEGORIES = [
  { id: 'def_1', name: 'First Spark', icon: '✨', is_default: true },
  { id: 'def_2', name: 'Midnight Reverie', icon: '🌙', is_default: true },
  { id: 'def_3', name: 'Valentine Magic', icon: '💖', is_default: true },
  { id: 'def_4', name: 'Anniversary Vow', icon: '💍', is_default: true },
  { id: 'def_5', name: 'Travel Adventure', icon: '✈️', is_default: true },
  { id: 'def_6', name: 'Cozy Sunday', icon: '☕', is_default: true }
];

// 1. Get all categories for user & soulmate
router.get('/', (req, res) => {
  const userId = req.user.id;

  db.get('SELECT partner_user_id FROM profiles WHERE user_id = ?', [userId], (err, profile) => {
    if (err) return res.status(500).json({ error: 'Database lookup error.' });

    const partnerId = profile?.partner_user_id;
    let query = 'SELECT * FROM categories WHERE user_id = ? ORDER BY created_at ASC';
    let params = [userId];

    if (partnerId) {
      query = 'SELECT * FROM categories WHERE user_id = ? OR user_id = ? ORDER BY created_at ASC';
      params = [userId, partnerId];
    }

    db.all(query, params, (cErr, rows) => {
      if (cErr) return res.status(500).json({ error: 'Failed to fetch categories.' });

      // Combine defaults with custom user/soulmate categories
      const customCats = rows.map((r) => ({
        id: r.id,
        name: r.name,
        icon: r.icon || '💖',
        is_default: false,
        created_at: r.created_at
      }));

      // Merge avoiding duplicate names
      const existingNames = new Set(customCats.map((c) => c.name.toLowerCase()));
      const combined = [
        ...DEFAULT_CATEGORIES.filter((d) => !existingNames.has(d.name.toLowerCase())),
        ...customCats
      ];

      res.json({ categories: combined });
    });
  });
});

// 2. Add a new romantic category
router.post('/', (req, res) => {
  const { name, icon } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required.' });
  }

  const catId = uuidv4();
  const cleanName = name.trim();
  const cleanIcon = icon ? icon.trim() : '💖';

  db.run(
    'INSERT INTO categories (id, user_id, name, icon) VALUES (?, ?, ?, ?)',
    [catId, req.user.id, cleanName, cleanIcon],
    function (err) {
      if (err) {
        console.error('Insert category error:', err);
        return res.status(500).json({ error: 'Failed to create category.' });
      }

      res.status(201).json({
        message: 'New romantic category created and shared with your soulmate!',
        category: {
          id: catId,
          name: cleanName,
          icon: cleanIcon,
          is_default: false
        }
      });
    }
  );
});

// 3. Delete a custom category
router.delete('/:id', (req, res) => {
  const catId = req.params.id;
  const userId = req.user.id;

  db.get('SELECT partner_user_id FROM profiles WHERE user_id = ?', [userId], (err, profile) => {
    const partnerId = profile?.partner_user_id;

    db.get('SELECT * FROM categories WHERE id = ?', [catId], (gErr, category) => {
      if (gErr || !category) {
        return res.status(404).json({ error: 'Category not found.' });
      }

      if (category.user_id !== userId && category.user_id !== partnerId) {
        return res.status(403).json({ error: 'Not authorized to delete this category.' });
      }

      db.run('DELETE FROM categories WHERE id = ?', [catId], function (delErr) {
        if (delErr) return res.status(500).json({ error: 'Failed to delete category.' });
        res.json({ message: 'Category removed from your sanctuary.' });
      });
    });
  });
});

module.exports = router;
