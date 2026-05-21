import { makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore } from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";
import dotenv from "dotenv";
import { generateResponse } from "./src/ai.js";
import { getUserMemory, addMessage, updateName } from "./src/memory.js";

dotenv.config();

const SESSION_DIR = "./sessions";

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

  const sock = makeWASocket({
    version: [2, 3000, 1017901307],
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    markOnlineOnConnect: true,
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log("\n🔐 Escaneá este QR con WhatsApp (3 puntos > Dispositivos vinculados):\n");
      qrcode.generate(qr, { small: true });
    }
    if (connection === "open") {
      console.log("✅ Bot conectado a WhatsApp!");
    }
    if (connection === "close") {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log("🔁 Reconectando...");
        startBot();
      } else {
        console.log("❌ Sesión cerrada. Eliminá la carpeta sessions y volvé a iniciar.");
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (msg) => {
    const message = msg.messages[0];
    if (!message.key || !message.message) return;
    if (message.key.fromMe) return;

    const remoteJid = message.key.remoteJid;
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

  console.log("🚀 Iniciando Guazú Bot...");
}

startBot().catch(console.error);
