// ==================== DOM ELEMENTS ====================
const urlInput = document.getElementById('urlInput');
const generateBtn = document.getElementById('generateBtn');
const errorMessage = document.getElementById('errorMessage');
const qrOutput = document.getElementById('qrOutput');
const qrPlaceholder = document.getElementById('qrPlaceholder');
const qrImage = document.getElementById('qrImage');
const downloadBtn = document.getElementById('downloadBtn');

// ==================== EVENT LISTENERS ====================

// Generate button click event
generateBtn.addEventListener('click', handleGenerate);

// Allow Enter key to trigger QR generation
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleGenerate();
});

// Clear error when user types
urlInput.addEventListener('input', () => {
    errorMessage.textContent = "";
});

// Download QR
downloadBtn.addEventListener('click', handleDownload);

document.getElementById("qrType").addEventListener("change", () => {
    const type = document.getElementById("qrType").value;

    if (type === "url") urlInput.placeholder = "https://example.com";
    if (type === "text") urlInput.placeholder = "Enter any text";
    if (type === "email") urlInput.placeholder = "example@email.com";
    if (type === "phone") urlInput.placeholder = "Enter phone number";
    if (type === "sms") urlInput.placeholder = "SMS message";
    if (type === "whatsapp") urlInput.placeholder = "WhatsApp message";
    if (type === "wifi") urlInput.placeholder = "wifi-name | password";
});


// ==================== MAIN FUNCTIONS ====================

async function handleGenerate() {
    const qrType = document.getElementById("qrType").value;
    const url = urlInput.value.trim();
    const size = document.getElementById("qrSize").value;

    errorMessage.textContent = "";

    // Validate only URL type
    if (qrType === "url" && !isValidURL(url)) {
        return showError("Enter a valid URL (must include http/https)");
    }

    if (!url) return showError("Please enter input for QR");

    generateBtn.classList.add("loading");
    generateBtn.disabled = true;

    try {
        const response = await fetch("/api/generate-qr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: qrType, url, size: Number(size) })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error("QR generation failed");
        }

        displayQRCode(data.qrCode);

    } catch (err) {
        console.error(err);
        showError("Failed to generate QR. Please try again.");
    } finally {
        generateBtn.classList.remove("loading");
        generateBtn.disabled = false;
    }
}
// ==================== HELPER FUNCTIONS ====================

function isValidURL(str) {
    try {
        const url = new URL(str);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function showError(msg) {
    errorMessage.textContent = msg;
}

function displayQRCode(qrData) {
    qrImage.src = qrData;

    qrPlaceholder.style.display = "none";
    qrImage.classList.add("visible");
    qrOutput.classList.add("visible");
}

// Download QR as PNG (base64)
function handleDownload() {
    if (!qrImage.src) return;

    const link = document.createElement("a");
    link.href = qrImage.src;
    link.download = "qrcode.png";
    link.click();
}
