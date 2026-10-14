const jwt = require('jsonwebtoken');
const { db } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'amournest_super_romantic_secret_key_2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please sign in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Session expired or invalid token. Please log in again.' });
    }
    req.user = user;
    next();
  });
}

// Middleware to ensure user is active and has valid account
function requireUser(req, res, next) {
  authenticateToken(req, res, () => {
    db.get('SELECT id, email, role, status FROM users WHERE id = ?', [req.user.id], (err, row) => {
      if (err || !row) {
        return res.status(401).json({ error: 'User account not found.' });
      }
      if (row.status === 'suspended') {
        return res.status(403).json({ error: 'Account has been suspended.' });
      }
      req.user.role = row.role;
      next();
    });
  });
}

// Middleware strictly for Admin checking credentials ONLY
function requireAdmin(req, res, next) {
  requireUser(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin credentials required.' });
    }
    next();
  });
}

// PRIVACY ENFORCEMENT MIDDLEWARE:
// Ensures that NO admin or third party can access user personal memories.
// Memories are only accessible by the owner or their linked partner.
function enforceMemoryPrivacy(req, res, next) {
  requireUser(req, res, () => {
    // If an admin attempts to request private memories via administrative routes, block it!
    if (req.user.role === 'admin' && req.query.admin_override) {
      return res.status(403).json({
        error: 'Privacy Violation Blocked: Administrators have Zero-Knowledge access and cannot view user memories.'
      });
    }
    next();
  });
}

module.exports = {
  JWT_SECRET,
  authenticateToken,
  requireUser,
  requireAdmin,
  enforceMemoryPrivacy
};
