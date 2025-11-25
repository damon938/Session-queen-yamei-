const pairBtn = document.getElementById("pairBtn");
const pairCode = document.getElementById("pairCode");
const qrBtn = document.getElementById("qrBtn");
const qrImage = document.getElementById("qrImage");

// Bouton Pair Code
pairBtn.addEventListener("click", async () => {
    pairCode.textContent = "Génération...";
    const res = await fetch("/api/session?type=pair");
    const data = await res.json();
    pairCode.textContent = data.pairCode;
});

// Bouton QR Code
qrBtn.addEventListener("click", async () => {
    qrImage.src = "";
    const res = await fetch("/api/session?type=qr");
    const data = await res.json();
    qrImage.src = data.qr;
});
