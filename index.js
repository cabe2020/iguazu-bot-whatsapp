import { makeWASocket, useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import pino from "pino";
import QRCode from "qrcode";
import dotenv from "dotenv";
import fs from "fs";
import { generateResponse } from "./src/ai.js";
import { getUserMemory, addMessage, updateName } from "./src/memory.js";

dotenv.config();

const SESSION_DIR = "./sessions";
const PHONE = process.env.BOT_PHONE || "";

if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
}

let reconnectTimeout = null;
let credsSaved = false;

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "error" }),
    markOnlineOnConnect: false,
  });

  sock.ev.on("creds.update", () => {
    saveCreds();
    credsSaved = true;
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      const qrText = await QRCode.toString(qr, { type: "terminal", small: true });
      console.log(`\n🔐 ESCANEÁ ESTE QR:\n${qrText}`);
      console.log("📱 O usá WhatsApp > Dispositivos vinculados > Vincular con número de teléfono");

      if (PHONE) {
        try {
          let code = await sock.requestPairingCode(PHONE);
          code = code.match(/.{1,4}/g)?.join("-") || code;
          console.log(`\n🔑 CÓDIGO: ${code}\n`);
        } catch {}
      }
    }

    if (connection === "open") {
      console.log("✅ Bot conectado a WhatsApp!");
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const errorMsg = lastDisconnect?.error?.message || "sin detalle";

      if (statusCode === DisconnectReason.loggedOut) {
        console.log("❌ Sesión cerrada remotamente. Eliminá la carpeta sessions y volvé a iniciar.");
        return;
      }

      console.log(`🔁 Reconectando en 3s... (${statusCode}: ${errorMsg})`);
      clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(() => startBot(), 3000);
    }
  });

  sock.ev.on("messages.upsert", async (msg) => {
    const message = msg.messages[0];
    if (!message.key || !message.message || message.key.fromMe) return;

    const remoteJid = message.key.remoteJid;
    if (!remoteJid.endsWith("@s.whatsapp.net") && !remoteJid.endsWith("@g.us")) return;

    const pushName = message.pushName || "viajer@";
    const text = message.message.conversation || message.message.extendedTextMessage?.text || "";
    if (!text.trim()) return;

    const userId = remoteJid;
    const mem = getUserMemory(userId);
    if (!mem.name && pushName) updateName(userId, pushName);

    const userName = mem.name || pushName;
    addMessage(userId, "user", text);
    const mensajeConNombre = mem.known ? text : `(nombre: ${userName}) ${text}`;

    console.log(`💬 ${userName}: ${text}`);

    await sock.sendPresenceUpdate("composing", remoteJid);

    const history = mem.history.map((h) => ({ role: h.role, content: h.content }));
    const response = await generateResponse(mensajeConNombre, history);

    addMessage(userId, "assistant", response);
    await sock.sendMessage(remoteJid, { text: response });
  });

  console.log("🚀 Iniciando Bot Turistico...");
}

startBot();
