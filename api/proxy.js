// الملف: proxy.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).send("Error: No URL provided.");
    }

    try {
        const response = await fetch(videoUrl, {
            headers: {
                'Referer': 'https://the-original-website.com/', // ⚠️ استبدل هذا
                'Origin': 'https://the-original-website.com/',   // ⚠️ واستبدل هذا
                'User-Agent': 'Mozilla/5.0'
            }
        });

        // إعادة بث الفيديو
        res.setHeader('Content-Type', response.headers.get('content-type'));
        response.body.pipe(res);

    } catch (error) {
        res.status(500).send("Proxy Error: " + error.message);
    }
};