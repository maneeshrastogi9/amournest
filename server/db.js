const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'amournest.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database: AmourNest');
  }
});

// Initialize Tables
function initDb() {
  db.serialize(() => {
    // 1. Users Table (Credentials & Account Meta ONLY)
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        google_id TEXT UNIQUE,
        role TEXT DEFAULT 'user', -- 'user' or 'admin'
        status TEXT DEFAULT 'active', -- 'active' or 'suspended'
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. User Profiles Table (Display details, partner pairing)
    db.run(`
      CREATE TABLE IF NOT EXISTS profiles (
        user_id TEXT PRIMARY KEY,
        display_name TEXT,
        partner_name TEXT,
        couple_code TEXT UNIQUE,
        partner_user_id TEXT,
        anniversary_date TEXT,
        romantic_bio TEXT,
        avatar_url TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // 3. Memories Table (Strictly Private - ZERO ADMIN ACCESS)
    db.run(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        couple_id TEXT, -- shared identifier between paired partners
        title TEXT NOT NULL,
        memory_date TEXT NOT NULL,
        image_url TEXT NOT NULL,
        image_filename TEXT NOT NULL,
        romantic_sign TEXT NOT NULL, -- e.g. 'Infinity Bond', 'Eternal Rose'
        romantic_sign_meaning TEXT,
        song_title TEXT NOT NULL,
        song_type TEXT DEFAULT 'preset', -- 'preset', 'custom', 'embed'
        song_url TEXT,
        story TEXT,
        location TEXT,
        mood_tag TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // 4. Categories Table (User-customizable & shared with soulmate)
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        icon TEXT DEFAULT '💖',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables verified and initialized.');
  });
}

initDb();

module.exports = {
  db,
  dbPath
};
