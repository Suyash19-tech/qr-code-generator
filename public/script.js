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

// ==================== MAIN FUNCTIONS ====================

async function handleGenerate() {
    const url = urlInput.value.trim();

    // Clear previous errors
    errorMessage.textContent = "";

    // Validate url
    if (!url) return showError("Please enter a URL");
    if (!isValidURL(url)) return showError("Enter a valid URL (must include http/https)");

    generateBtn.classList.add("loading");
    generateBtn.disabled = true;

    try {
        // Call backend API
        const response = await fetch("/api/generate-qr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error("QR generation failed");
        }

        // Display the QR Code returned from backend
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
