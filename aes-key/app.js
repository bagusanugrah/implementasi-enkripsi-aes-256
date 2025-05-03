require('dotenv').config();
const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 3001;

// Kunci dan IV untuk AES-256
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes key
const IV_LENGTH = 16; // 16 bytes IV

// Fungsi untuk mengenkripsi data
const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

app.get('/AES-KEY', (req, res) => {
  const secret = process.env.AES_KEY;
  const encrypted = encrypt(secret);
  res.json({ encrypted });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});