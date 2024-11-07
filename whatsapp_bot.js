const { default: makeWASocket, useSingleFileAuthState } = require('@adiwajshing/baileys');
const { exec } = require('child_process');
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

// Fungsi untuk menjalankan script Python dan mendapatkan respons dari ChatGPT
function callChatGPT(question, callback) {
    exec(`python3 chatgpt_api.py "${question}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        callback(stdout.trim());
    });
}

// Fungsi utama untuk memulai koneksi ke WhatsApp
async function startWhatsAppBot() {
    const sock = makeWASocket({
        auth: state,
    });

    sock.ev.on('creds.update', saveState);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const question = msg.message.conversation;
        console.log("Pesan diterima:", question);

        // Panggil fungsi Python dan kirim respons
        callChatGPT(question, (reply) => {
            sock.sendMessage(msg.key.remoteJid, { text: reply });
        });
    });
}

startWhatsAppBot();
