import { default as makeWASocket, fetchLatestBaileysVersion, useMultiFileAuthState } from "@whiskeysockets/baileys";
import QRCode from "qrcode";
import fs from "fs";

const codesFile = "./paircodes.json";

// Fonction pour sauvegarder le pair code
function saveCode(number, code) {
    let data = {};
    if (fs.existsSync(codesFile)) {
        data = JSON.parse(fs.readFileSync(codesFile, "utf8"));
    }
    data[number] = code;
    fs.writeFileSync(codesFile, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
    const type = req.query.type;
    const number = req.query.number;

    try {
        const { state, saveCreds } = await useMultiFileAuthState("./session");
        const { version } = await fetchLatestBaileysVersion();
        const sock = makeWASocket({ version, auth: state, printQRInTerminal: false });

        if (type === "pair") {
            if (!number) {
                res.status(400).json({ error: "Numéro manquant" });
                return;
            }
            // Génération du code : yamei + derniers 4 chiffres du numéro
            const last4 = number.slice(-4);
            const code = `yamei${last4}`;

            saveCode(number, code); // Sauvegarde dans JSON

            res.status(200).json({ pairCode: code });

        } else if (type === "qr") {
            sock.ev.on("connection.update", async (update) => {
                const { qr } = update;
                if (qr) {
                    const qrImage = await QRCode.toDataURL(qr);
                    res.status(200).json({ qr: qrImage });
                }
            });
        } else {
            res.status(400).json({ error: "Type manquant" });
        }

        sock.ev.on("creds.update", saveCreds);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
          }
