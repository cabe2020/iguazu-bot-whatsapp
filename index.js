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

function restoreSessionFromEnv() {
  const data = process.env.SESSION_DATA;
  if (data) {
    try {
      const parsed = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
      for (const [file, content] of Object.entries(parsed)) {
        fs.writeFileSync(`${SESSION_DIR}/${file}`, content, "utf-8");
      }
      console.log("✅ Sesión restaurada desde SESSION_DATA");
      return true;
    } catch (e) {
      console.log("❌ Error al restaurar SESSION_DATA:", e.message);
    }
  }

  const sessionParts = [];
  for (let i = 1; i <= 4; i++) {
    const part = process.env[`SESS_P${i}`];
    if (part) sessionParts.push(part);
  }
  if (sessionParts.length >= 3) {
    try {
      const b64 = sessionParts.join("");
      const parsed = JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
      for (const [file, content] of Object.entries(parsed)) {
        fs.writeFileSync(`${SESSION_DIR}/${file}`, content, "utf-8");
      }
      console.log("✅ Sesión restaurada desde SESS_P*");
      return true;
    } catch (e) {
      console.log("❌ Error al restaurar sesión:", e.message);
    }
  }
  return false;
}

if (process.env.RESET_SESSION === "true") {
  console.log("🔄 RESET_SESSION activo — limpiando sesión...");
  try {
    fs.rmSync(SESSION_DIR, { recursive: true, force: true });
    fs.mkdirSync(SESSION_DIR, { recursive: true });
    console.log("✅ Carpeta sessions limpiada");
  } catch (e) {
    console.log("❌ Error limpiando sesión:", e.message);
  }
}

restoreSessionFromEnv();

let reconnectTimeout = null;
let credsSaved = false;
let pairingInterval = null;

async function startBot() {
  if (pairingInterval) {
    clearInterval(pairingInterval);
    pairingInterval = null;
  }
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    markOnlineOnConnect: false,
    fireInitQueries: false,
    syncFullHistory: false,
    generateHighQualityLinkPreview: false,
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

      if (PHONE && !pairingInterval) {
        pairingInterval = setInterval(async () => {
          try {
            let code = await sock.requestPairingCode(PHONE);
            code = code.match(/.{1,4}/g)?.join("-") || code;
            console.log(`\n🔑 CÓDIGO (válido 60s): ${code}  [${new Date().toLocaleTimeString()}]\n`);
          } catch {}
        }, 10000);
        pairingInterval.unref();
      }
    }

    if (connection === "open") {
      console.log("✅ Bot conectado a WhatsApp!");
      if (pairingInterval) {
        clearInterval(pairingInterval);
        pairingInterval = null;
      }
      if (!process.env.SESSION_DATA && !process.env.SESS_P1) {
        setTimeout(encodeAndLogSession, 15000);
      }
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const errorMsg = lastDisconnect?.error?.message || "sin detalle";

      if (statusCode === DisconnectReason.loggedOut) {
        console.log("❌ Sesión cerrada remotamente. Eliminá la carpeta sessions y volvé a iniciar.");
        if (pairingInterval) {
          clearInterval(pairingInterval);
          pairingInterval = null;
        }
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

function encodeAndLogSession() {
  try {
    if (!fs.existsSync(SESSION_DIR)) return;
    const files = fs.readdirSync(SESSION_DIR);
    const session = {};
    for (const file of files) {
      const content = fs.readFileSync(`${SESSION_DIR}/${file}`, "utf-8");
      session[file] = content;
    }
    const encoded = Buffer.from(JSON.stringify(session)).toString("base64");
    console.log("\n=== SESSION_BASE64 ===");
    console.log(encoded);
    console.log("=== FIN SESSION_BASE64 ===\n");
  } catch (e) {
    console.log("Error al codificar sesión:", e.message);
  }
}

startBot();
