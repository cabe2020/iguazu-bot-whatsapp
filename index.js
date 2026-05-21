import { makeWASocket, useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import pino from "pino";
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
let pairingRequested = false;

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
  pairingRequested = false;

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    markOnlineOnConnect: false,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr && !pairingRequested) {
      pairingRequested = true;
      if (PHONE) {
        console.log(`\n📱 Solicitando código de vinculación para ${PHONE}...`);
        try {
          let code = await sock.requestPairingCode(PHONE);
          code = code.match(/.{1,4}/g)?.join("-") || code;
          console.log("\n═══════════════════════════════════════════");
          console.log(`  Código: ${code}`);
          console.log("═══════════════════════════════════════════");
          console.log("\n📲 Ingresalo en WhatsApp > Dispositivos vinculados > Vincular con número");
        } catch (e) {
          console.log(`❌ Error al generar código: ${e.message}`);
        }
      }
    }
    if (connection === "open") {
      console.log("✅ Bot conectado a WhatsApp!");
    }
    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const errorMsg = lastDisconnect?.error?.message || "sin detalle";
      console.log(`❌ Conexión cerrada. Código: ${statusCode}. Error: ${errorMsg}`);

      if (statusCode === DisconnectReason.loggedOut) {
        console.log("👋 Sesión cerrada. Eliminá la carpeta sessions y reiniciá.");
        return;
      }

      const delay = 3000;
      console.log(`🔁 Reconectando en ${delay / 1000}s...`);
      clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(() => startBot(), delay);
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (msg) => {
    const message = msg.messages[0];
    if (!message.key || !message.message) return;
    if (message.key.fromMe) return;

    const remoteJid = message.key.remoteJid;
    if (!remoteJid.endsWith("@s.whatsapp.net") && !remoteJid.endsWith("@g.us")) return;

    const pushName = message.pushName || "viajer@";
    const text =
      message.message.conversation ||
      message.message.extendedTextMessage?.text ||
      "";

    if (!text.trim()) return;

    const userId = remoteJid;
    const mem = getUserMemory(userId);

    if (!mem.name && pushName) {
      updateName(userId, pushName);
    }

    const userName = mem.name || pushName;

    addMessage(userId, "user", text);
    const mensajeConNombre = mem.known
      ? text
      : `(nombre del usuario: ${userName}) ${text}`;

    console.log(`💬 ${userName}: ${text}`);

    await sock.sendPresenceUpdate("composing", remoteJid);

    const history = mem.history.map((h) => ({
      role: h.role,
      content: h.content,
    }));

    const response = await generateResponse(mensajeConNombre, history);

    addMessage(userId, "assistant", response);

    await sock.sendMessage(remoteJid, { text: response });
  });

  console.log("🚀 Iniciando Bot Turistico...");
}

startBot();
