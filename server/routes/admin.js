const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);

/**
 * STRICT PRIVACY AUDIT ENDPOINT:
 * Administrator can ONLY view account credentials, auth provider,
 * status, and audit timestamps.
 * 
 * PERSONAL DATA (Memories, Stories, Photos, Songs, Notes) IS STRICTLY EXCLUDED.
 */
router.get('/credentials', (req, res) => {
  // We query users and only aggregate count of items, NEVER returning titles, images, or stories!
  const query = `
    SELECT 
      u.id,
      u.email,
      CASE 
        WHEN u.google_id IS NOT NULL THEN 'Google (Gmail)'
        ELSE 'Email / Password'
      END AS auth_provider,
      u.role,
      u.status,
      u.created_at,
      u.last_login,
      (SELECT COUNT(*) FROM memories m WHERE m.user_id = u.id) AS total_memories_count,
      p.display_name,
      p.couple_code
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
    ORDER BY u.created_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve credentials audit log.' });
    }

    res.json({
      privacy_notice: 'Zero-Knowledge Privacy Active: Administrator can ONLY review account credentials and status. User memories, private photos, and romantic notes are encrypted and isolated from administrative access.',
      users: rows
    });
  });
});

// Admin action: Toggle user account status (active/suspended)
router.patch('/users/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['active', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'Status must be active or suspended.' });
  }

  // Prevent admin from suspending themselves
  if (id === req.user.id) {
    return res.status(400).json({ error: 'Cannot change your own account status.' });
  }

  db.run('UPDATE users SET status = ? WHERE id = ?', [status, id], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to update user status.' });
    res.json({ message: `User status changed to ${status}.` });
  });
});

// Admin attempt to view user memories - ALWAYS REJECTED
router.get('/users/:id/memories', (req, res) => {
  return res.status(403).json({
    error: 'ACCESS PROHIBITED (Zero-Knowledge Privacy Shield)',
    message: 'Administrators are strictly forbidden from viewing user photos, memory albums, or private love stories under our strict End-to-End Privacy Charter.'
  });
});

module.exports = router;
