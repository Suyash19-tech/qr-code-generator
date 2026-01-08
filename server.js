const express = require('express');
const QRCode = require('qrcode');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS
app.set('view engine', 'ejs');

// =================== RENDER FRONTEND ===================
app.get('/', (req, res) => {
    res.render('index');
});

// =================== GENERATE QR API ===================
app.post('/api/generate-qr', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'URL is required'
            });
        }

        const qr = await QRCode.toDataURL(url);

        res.json({
            success: true,
            qrCode: qr
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Failed to generate QR'
        });
    }
});

// =================== START SERVER ===================
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
