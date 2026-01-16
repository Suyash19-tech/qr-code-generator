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
        const { url, size, type } = req.body;
        let qrText = url;
        switch (type) {
            case "text":
                qrText = url;
                break;

        case "email":
            qrText = `mailto:${url}`;
            break;

        case "phone":
            qrText = `tel:${url}`;
            break;

        case "sms":
            const [smsNumber, smsMessage] = url.split("|");
            qrText = `sms:${smsNumber}?body=${smsMessage}`;
            break;

        case "whatsapp":
            qrText = `https://wa.me/?text=${encodeURIComponent(url)}`;
            break;

        case "wifi":
            const [ssid, password] = url.split("|");
            qrText = `WIFI:S:${ssid};T:WPA;P:${password};;`;
            break;

        default:
            qrText = url;
        }
        const finalSize = Number(size) || 512;
        const scaleValue = finalSize / 32; // dynamic scaling

        const qrOptions = {
            type: 'image/png',
            width: finalSize,
            scale: scaleValue,
            margin: 2,
            errorCorrectionLevel: "H"
        };

        const qr = await QRCode.toDataURL(qrText, qrOptions);

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));


