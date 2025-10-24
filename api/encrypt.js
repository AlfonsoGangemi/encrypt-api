const crypto = require('crypto');

module.exports = (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const { text, key } = req.body;

    if (!text || !key) {
        res.status(400).send('text and key are required');
        return;
    }

    try {
        // AES-256-CBC encryption
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', crypto.createHash('sha256').update(key).digest(), iv);
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        const result = iv.toString('base64') + ':' + encrypted;

        res.json({ encrypted: result });
    } catch (e) {
        res.status(500).send('Encryption failed');
    }
};
