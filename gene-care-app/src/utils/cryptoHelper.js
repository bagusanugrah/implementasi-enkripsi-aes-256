const crypto = require('crypto');
const axios = require('axios');

// Fungsi untuk mengambil kunci AES terenkripsi dari endpoint
const fetchEncryptedAESKey = async () => {
    try {
        const response = await axios.get('http://localhost:3001/AES-KEY');
        return response.data.encrypted;
    } catch (error) {
        console.error('Error fetching AES key:', error);
        throw new Error('Failed to fetch AES key');
    }
};

// Fungsi untuk mendekripsi kunci AES
const decryptAESKey = (encryptedText) => {
    const [iv, encrypted] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(process.env.ENCRYPTION_KEY, 'hex'),
        Buffer.from(iv, 'hex')
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// Fungsi untuk mendapatkan kunci AES secara asynchronous
let AES_KEY = null; // Variabel untuk menyimpan kunci AES
const initializeAESKey = async () => {
    const encryptedAESKey = await fetchEncryptedAESKey();
    AES_KEY = decryptAESKey(encryptedAESKey);
};

// Fungsi untuk mengenkripsi data
exports.encrypt = (text) => {
    if (!AES_KEY) {
        throw new Error('AES key is not initialized');
    }
    const iv = crypto.randomBytes(16); // 16 bytes IV
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(AES_KEY, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

// Fungsi untuk mendekripsi data
exports.decrypt = (encryptedText) => {
    if (!AES_KEY) {
        throw new Error('AES key is not initialized');
    }
    const [iv, encrypted] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(AES_KEY, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// Ekspor fungsi untuk inisialisasi kunci AES
exports.initializeAESKey = initializeAESKey;