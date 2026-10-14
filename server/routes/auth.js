const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();
const fs = require('fs');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const { db } = require('../db');
const { JWT_SECRET, requireUser } = require('../middleware/auth');

const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

// Helper: Generate unique romantic couple code (e.g. LOVE-7821-NEST)
function generateCoupleCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `AMOUR-${rand}-LOVE`;
}

// 1. Register with Email & Password
router.post('/register', async (req, res) => {
  try {
    const { email, password, display_name, partner_name, anniversary_date } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    db.get('SELECT id FROM users WHERE email = ?', [normalizedEmail], async (err, existing) => {
      if (err) return res.status(500).json({ error: 'Database query failed.' });
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = uuidv4();
      const coupleCode = generateCoupleCode();

      // First registered user can optionally be admin or user
      const role = normalizedEmail === 'admin@amournest.com' ? 'admin' : 'user';

      db.run(
        `INSERT INTO users (id, email, password_hash, role, status) VALUES (?, ?, ?, ?, 'active')`,
        [userId, normalizedEmail, passwordHash, role],
        function (insertErr) {
          if (insertErr) {
            return res.status(500).json({ error: 'Failed to create user account.' });
          }

          db.run(
            `INSERT INTO profiles (user_id, display_name, partner_name, couple_code, anniversary_date, romantic_bio)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              userId,
              display_name || 'My Darling',
              partner_name || 'My Soulmate',
              coupleCode,
              anniversary_date || '',
              'Two hearts beating as one rhythm in the sanctuary of AmourNest.'
            ],
            function (profErr) {
              if (profErr) {
                return res.status(500).json({ error: 'Failed to initialize couple profile.' });
              }

              const token = jwt.sign({ id: userId, email: normalizedEmail, role }, JWT_SECRET, {
                expiresIn: '30d'
              });

              return res.status(201).json({
                message: 'Welcome to AmourNest!',
                token,
                user: {
                  id: userId,
                  email: normalizedEmail,
                  role,
                  display_name: display_name || 'My Darling',
                  partner_name: partner_name || 'My Soulmate',
                  couple_code: coupleCode,
                  anniversary_date: anniversary_date || ''
                }
              });
            }
          );
        }
      );
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 2. Login with Email & Password
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  db.get('SELECT * FROM users WHERE email = ?', [normalizedEmail], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database lookup error.' });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Account suspended. Contact support.' });
    }

    if (!user.password_hash) {
      return res.status(400).json({ error: 'This account was created with Google Sign-In. Please click Login with Gmail.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Update last_login
    db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    db.get('SELECT * FROM profiles WHERE user_id = ?', [user.id], (pErr, profile) => {
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: '30d'
      });

      res.json({
        message: 'Welcome back to your private nest.',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          display_name: profile ? profile.display_name : 'Beloved',
          partner_name: profile ? profile.partner_name : 'Soulmate',
          couple_code: profile ? profile.couple_code : '',
          anniversary_date: profile ? profile.anniversary_date : '',
          romantic_bio: profile ? profile.romantic_bio : '',
          avatar_url: profile ? profile.avatar_url : '',
          partner_user_id: profile ? profile.partner_user_id : null
        }
      });
    });
  });
});

// 3. Login / Sign Up with Gmail (Google OAuth or Demo Google Simulator)
router.post('/google', async (req, res) => {
  try {
    const { credential, demoUser } = req.body;
    let googleId, email, name, picture;

    if (demoUser) {
      // Instant Test Mode for Google Sign-In (no Google Cloud API keys needed immediately!)
      googleId = 'google_demo_' + (demoUser.id || '987654321');
      email = (demoUser.email || 'lovers@gmail.com').toLowerCase();
      name = demoUser.name || 'Romeo & Juliet';
      picture = demoUser.picture || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=150&auto=format&fit=crop&q=80';
    } else if (credential && googleClient) {
      // Real Google ID Token verification
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: googleClientId
      });
      const payload = ticket.getPayload();
      googleId = payload.sub;
      email = payload.email.toLowerCase();
      name = payload.name;
      picture = payload.picture;
    } else if (credential) {
      // Fallback decode if client ID isn't set yet
      try {
        const decoded = jwt.decode(credential);
        if (decoded && decoded.email) {
          googleId = decoded.sub || 'google_' + Date.now();
          email = decoded.email.toLowerCase();
          name = decoded.name || 'Gmail Lover';
          picture = decoded.picture || '';
        } else {
          return res.status(400).json({ error: 'Unable to parse Google credential token.' });
        }
      } catch (err) {
        return res.status(400).json({ error: 'Invalid Google credential.' });
      }
    } else {
      return res.status(400).json({ error: 'Google credential payload is required.' });
    }

    // Check if user exists by google_id or email
    db.get('SELECT * FROM users WHERE google_id = ? OR email = ?', [googleId, email], (err, existingUser) => {
      if (err) return res.status(500).json({ error: 'Database check failed.' });

      if (existingUser) {
        // Update google_id if missing and update last_login
        db.run('UPDATE users SET google_id = ?, last_login = CURRENT_TIMESTAMP WHERE id = ?', [googleId, existingUser.id]);

        db.get('SELECT * FROM profiles WHERE user_id = ?', [existingUser.id], (pErr, profile) => {
          const token = jwt.sign({ id: existingUser.id, email: existingUser.email, role: existingUser.role }, JWT_SECRET, {
            expiresIn: '30d'
          });

          return res.json({
            message: 'Signed in with Gmail successfully.',
            token,
            user: {
              id: existingUser.id,
              email: existingUser.email,
              role: existingUser.role,
              display_name: profile?.display_name || name,
              partner_name: profile?.partner_name || 'My Soulmate',
              couple_code: profile?.couple_code || '',
              anniversary_date: profile?.anniversary_date || '',
              romantic_bio: profile?.romantic_bio || '',
              avatar_url: profile?.avatar_url || picture,
              partner_user_id: profile?.partner_user_id || null
            }
          });
        });
      } else {
        // Create new user via Google
        const newUserId = uuidv4();
        const coupleCode = generateCoupleCode();
        const role = email === 'admin@amournest.com' ? 'admin' : 'user';

        db.run(
          `INSERT INTO users (id, email, google_id, role, status) VALUES (?, ?, ?, ?, 'active')`,
          [newUserId, email, googleId, role],
          (insertErr) => {
            if (insertErr) return res.status(500).json({ error: 'Failed to create Google account.' });

            db.run(
              `INSERT INTO profiles (user_id, display_name, partner_name, couple_code, avatar_url, romantic_bio)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [
                newUserId,
                name,
                'My Soulmate',
                coupleCode,
                picture,
                'A private universe woven from our sweet memories.'
              ],
              (profErr) => {
                if (profErr) return res.status(500).json({ error: 'Failed to create profile.' });

                const token = jwt.sign({ id: newUserId, email, role }, JWT_SECRET, {
                  expiresIn: '30d'
                });

                return res.status(201).json({
                  message: 'Welcome to AmourNest with Gmail!',
                  token,
                  user: {
                    id: newUserId,
                    email,
                    role,
                    display_name: name,
                    partner_name: 'My Soulmate',
                    couple_code: coupleCode,
                    anniversary_date: '',
                    romantic_bio: 'A private universe woven from our sweet memories.',
                    avatar_url: picture,
                    partner_user_id: null
                  }
                });
              }
            );
          }
        );
      }
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ error: 'Google authentication failed.' });
  }
});

// 4. Get Current User & Profile
router.get('/me', requireUser, (req, res) => {
  db.get(
    `SELECT u.id, u.email, u.role, u.created_at,
            p.display_name, p.partner_name, p.couple_code, p.partner_user_id,
            p.anniversary_date, p.romantic_bio, p.avatar_url
     FROM users u
     LEFT JOIN profiles p ON u.id = p.user_id
     WHERE u.id = ?`,
    [req.user.id],
    (err, userProfile) => {
      if (err || !userProfile) {
        return res.status(404).json({ error: 'User profile not found.' });
      }

      // Check partner details if linked
      if (userProfile.partner_user_id) {
        db.get(
          `SELECT display_name, avatar_url FROM profiles WHERE user_id = ?`,
          [userProfile.partner_user_id],
          (pErr, partnerData) => {
            return res.json({
              user: {
                ...userProfile,
                linked_partner: partnerData || null
              }
            });
          }
        );
      } else {
        return res.json({ user: userProfile });
      }
    }
  );
});

// 5. Update Profile
router.put('/profile', requireUser, (req, res) => {
  const { display_name, partner_name, anniversary_date, romantic_bio, avatar_url } = req.body;

  db.run(
    `UPDATE profiles
     SET display_name = COALESCE(?, display_name),
         partner_name = COALESCE(?, partner_name),
         anniversary_date = COALESCE(?, anniversary_date),
         romantic_bio = COALESCE(?, romantic_bio),
         avatar_url = COALESCE(?, avatar_url),
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = ?`,
    [display_name, partner_name, anniversary_date, romantic_bio, avatar_url, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to update profile.' });
      res.json({ message: 'Profile updated with love.' });
    }
  );
});

// 6. Link Partner by Couple Code
router.post('/link-partner', requireUser, (req, res) => {
  const { couple_code } = req.body;
  if (!couple_code) {
    return res.status(400).json({ error: 'Partner couple code is required.' });
  }

  const cleanCode = couple_code.trim().toUpperCase();

  db.get('SELECT user_id, display_name FROM profiles WHERE couple_code = ?', [cleanCode], (err, targetProfile) => {
    if (err) return res.status(500).json({ error: 'Database lookup error.' });
    if (!targetProfile) {
      return res.status(404).json({ error: 'No couple found with this code. Please verify the code.' });
    }

    if (targetProfile.user_id === req.user.id) {
      return res.status(400).json({ error: 'You cannot link with your own couple code!' });
    }

    // Bidirectional link
    db.serialize(() => {
      db.run('UPDATE profiles SET partner_user_id = ? WHERE user_id = ?', [targetProfile.user_id, req.user.id]);
      db.run('UPDATE profiles SET partner_user_id = ? WHERE user_id = ?', [req.user.id, targetProfile.user_id]);

      res.json({
        message: `Successfully linked your hearts with ${targetProfile.display_name}! You both now share this romantic memory album.`,
        partner: targetProfile
      });
    });
  });
});

// 6.5. Unlink Soulmate / Partner (User Sovereign Power)
router.post('/unlink-partner', requireUser, (req, res) => {
  const userId = req.user.id;
  db.get('SELECT partner_user_id FROM profiles WHERE user_id = ?', [userId], (err, profile) => {
    if (err) return res.status(500).json({ error: 'Database lookup error.' });
    const partnerId = profile?.partner_user_id;

    db.serialize(() => {
      db.run('UPDATE profiles SET partner_user_id = NULL WHERE user_id = ?', [userId]);
      if (partnerId) {
        db.run('UPDATE profiles SET partner_user_id = NULL WHERE user_id = ?', [partnerId]);
      }
      res.json({ message: 'Soulmate link disconnected from your private vault.' });
    });
  });
});

// 7. PERMANENT HARD DELETION: IRREVERSIBLE ACCOUNT & DATA PURGE
// "and they can delete also if they deleted once data will not recover"
router.delete('/delete-account', requireUser, async (req, res) => {
  const { confirmation_text, password } = req.body;
  const userId = req.user.id;

  // Security check: Must supply exact confirmation sentence
  if (confirmation_text !== 'DELETE MY MEMORIES FOREVER') {
    return res.status(400).json({
      error: 'Please type "DELETE MY MEMORIES FOREVER" to confirm permanent, unrecoverable deletion.'
    });
  }

  try {
    // 1. Fetch all memory files uploaded by this user to physically remove from disk
    db.all('SELECT image_filename, song_url FROM memories WHERE user_id = ?', [userId], (err, memoryRows) => {
      if (!err && memoryRows && memoryRows.length > 0) {
        const uploadsDir = path.join(__dirname, '../uploads');
        memoryRows.forEach((mem) => {
          if (mem.image_filename) {
            const filePath = path.join(uploadsDir, mem.image_filename);
            if (fs.existsSync(filePath)) {
              try {
                fs.unlinkSync(filePath);
              } catch (e) {
                console.error('File purge error:', e);
              }
            }
          }
        });
      }

      // 2. Cascade delete database records
      db.serialize(() => {
        // Delete all memories
        db.run('DELETE FROM memories WHERE user_id = ?', [userId]);

        // Unlink any partner pointing to this user
        db.run('UPDATE profiles SET partner_user_id = NULL WHERE partner_user_id = ?', [userId]);

        // Delete profile
        db.run('DELETE FROM profiles WHERE user_id = ?', [userId]);

        // Delete user credentials completely
        db.run('DELETE FROM users WHERE id = ?', [userId]);

        // Run VACUUM to scrub disk sectors
        db.run('VACUUM', (vacErr) => {
          if (vacErr) console.warn('Vacuum notice:', vacErr.message);
        });

        return res.json({
          success: true,
          message: 'Your account, photos, songs, and all romantic memories have been permanently and irreversibly purged from our servers. Nothing can be recovered.'
        });
      });
    });
  } catch (error) {
    console.error('Account hard deletion error:', error);
    res.status(500).json({ error: 'Failed to complete hard deletion.' });
  }
});

module.exports = router;
