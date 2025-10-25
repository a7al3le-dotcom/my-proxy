// الملف: my-proxy/api/proxy.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // نستخدم req.query.url للحصول على الرابط من الطلب
    const { url } = req.query;

    // التحقق من وجود الرابط
    if (!url) {
        return res.status(400).json({ error: "الرجاء توفير رابط في معامل 'url'" });
    }

    try {
        // إرسال الطلب إلى الخادم الأصلي مع رؤوس تحاكي المتصفح
        const response = await fetch(url, {
            headers: {
                'Referer': new URL(url).origin,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });

        // التأكد من أن الطلب للخادم الأصلي كان ناجحًا
        if (!response.ok) {
            // إذا فشل، نرجع نفس حالة الفشل للمستخدم
            return res.status(response.status).send(`فشل الخادم الأصلي بالحالة: ${response.status}`);
        }
        
        // إعادة توجيه الرؤوس المهمة من الخادم الأصلي إلى المستخدم
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/vnd.apple.mpegurl');
        res.setHeader('Access-Control-Allow-Origin', '*'); // السماح للمشغل بالوصول

        // إعادة بث محتوى الفيديو مباشرة إلى المستخدم
        response.body.pipe(res);

    } catch (error) {
        // في حال حدوث أي خطأ غير متوقع
        console.error("حدث خطأ فادح في الخادم الوسيط:", error);
        res.status(500).json({ error: "حدث خطأ داخلي في الخادم الوسيط", details: error.message });
    }
};
