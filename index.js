import { makeWASocket, useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import pino from "pino";
import dotenv from "dotenv";
import fs from "fs";
import https from "https";
import { generateResponse } from "./src/ai.js";
import { getUserMemory, addMessage, updateName } from "./src/memory.js";
import { loadSessionFromSupabase, saveSessionToSupabase } from "./src/supabase.js";

dotenv.config();

const SESSION_DIR = "./sessions";
const PHONE = process.env.BOT_PHONE || "";

if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
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

async function restoreSession() {
  if (process.env.SKIP_SUPABASE_SESSION !== "true") {
    const restored = await loadSessionFromSupabase(SESSION_DIR);
    if (restored) return true;
  } else {
    console.log("⏭️ SKIP_SUPABASE_SESSION activo — ignorando Supabase");
  }
  if (restored) return true;

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

const IMAGES = {
  cataratas: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Cataratas_del_Iguaz%C3%BA_%2826804565465%29.jpg",
  garganta: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Garganta_do_Diabo.jpg",
  hito: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Hito_tres_fronteras.jpg",
  parqueAves: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Arara_canind%C3%A9.jpg",
  sanIgnacio: "https://upload.wikimedia.org/wikipedia/commons/d/d5/San_Ignacio_Mini_002.jpg",
};

function findImage(text) {
  const lower = text.toLowerCase();
  if (lower.includes("garganta")) return IMAGES.garganta;
  if (lower.includes("hito") || lower.includes("tres fronteras")) return IMAGES.hito;
  if (lower.includes("aves") || lower.includes("parque das aves")) return IMAGES.parqueAves;
  if (lower.includes("san ignacio") || lower.includes("jesuítica") || lower.includes("ruinas")) return IMAGES.sanIgnacio;
  if (lower.includes("catarata") || lower.includes("parque nacional") || lower.includes("circuito")) return IMAGES.cataratas;
  return null;
}

function fetchImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("error", reject);
  });
}

const COMMANDS = {
  "/comandos": "📋 *Comandos disponibles:*\n\n/comandos — Mostrar esta ayuda\n/horarios — Horarios del parque\n/precios — Precios de entradas\n/itinerario — Sugerencia de itinerario\n/clima — Mejor época para visitar\n/restaurantes — Recomendaciones para comer\n/emergencias — Números útiles",
  "/horarios": "🕐 *Horarios Parque Nacional Iguazú*\n\nAbierto todos los días de 8:00 a 18:00.\nÚltimo ingreso: 16:30.\n\nTrencito ecológico: cada 15-20 minutos desde el centro de visitantes.\n\n📌 Tip: llegá a las 8:00 para disfrutar con menos gente.",
  "/precios": "💰 *Precios entrada Parque Nacional Iguazú* (2025/2026 aprox):\n\n🇦🇷 Argentinos: ~$12,000 ARS\n🌎 Mercosur: ~$22,000 ARS\n🌍 Extranjeros: ~$40,000 ARS\n\n✅ Comprá online en cataratasdeliguazu.com.ar\n👶 Menores de 6: gratis\n👴 Jubilados: 50% desc.",
  "/itinerario": "🗺️ *Itinerarios sugeridos:*\n\n*1 día:* llegá 8am → Garganta del Diablo → Circuito Inferior → Almuerzo → Circuito Superior → Sendero Verde\n\n*2 días:* Día 1 — Circuitos + Gran Aventura. Día 2 — Lado brasileño + Parque das Aves\n\n*3 días:* Agregá Paseo Ecológico + San Ignacio Miní o Ciudad del Este\n\n📌 Decime cuántos días tenés y te ayudo a planificar!",
  "/clima": "🌤️ *Mejor época para visitar:*\n\n🌸 *Otoño* (mar-may): 20-30°C, poco lluvia. IDEAL\n🌻 *Primavera* (sep-nov): 22-35°C, lindo pero empiezan lluvias\n☀️ *Verano* (dic-feb): 30-40°C, húmedo, perfecto para mojarse\n❄️ *Invierno* (jul-ago): 10-22°C, menos turistas",
  "/restaurantes": "🍽️ *Recomendaciones para comer:*\n\n🥩 *La Rueda* — Parrilla regional (Av. Córdoba 189)\n🍝 *Charo* — Comida casera misionera (Av. Córdoba 156)\n👨‍🍳 *Aqua* — Cocina de autor (Av. Tres Fronteras 720)\n🍕 *La Mamma* — Italianas (Félix de Azara 244)\n\nProbá el surubí, la milanesa de surubí, chipá y mbeyú!",
  "/emergencias": "🆘 *Emergencias en Puerto Iguazú:*\n\n🚔 Policía: 101\n🚑 Ambulancia: 107\n🔥 Bomberos: 100\n🏥 Hospital SAMIC: +54 3757 421379\n\nPolicía Turística: 0800-555-5065"
};

function handleComand(text) {
  const lower = text.trim().toLowerCase();
  for (const [cmd, response] of Object.entries(COMMANDS)) {
    if (lower === cmd || lower.startsWith(cmd + " ")) return response;
  }
  return null;
}

const WELCOME_MESSAGE = `👋 *Hola! Soy Guazú, tu asistente turístico de Iguazú!* 🇦🇷🌿

Puedo ayudarte con información sobre:
🌊 Cataratas del Iguazú (horarios, precios, circuitos)
🍽️ Restaurantes y gastronomía local
🏨 Alojamiento para todos los presupuestos
🗺️ Itinerarios de 1, 2 o 3 días
🚌 Cómo llegar y moverte
🆘 Emergencias y datos útiles

Escribí */comandos* para ver todo lo que puedo hacer o simplemente preguntame lo que necesites! 😊`;

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
    if (process.env.SKIP_SUPABASE_SESSION !== "true") saveSessionToSupabase(SESSION_DIR);
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
      console.log(`\n🔐 ESCANEÁ ESTE QR abriendo este link:\n${qrUrl}`);
      console.log("O abrí WhatsApp en tu celular → 3 puntitos → Dispositivos vinculados → Vincular con número de teléfono");

      if (PHONE && !pairingInterval) {
        pairingInterval = setInterval(async () => {
          try {
            let code = await sock.requestPairingCode(PHONE);
            code = code.match(/.{1,4}/g)?.join("-") || code;
            console.log(`\n🔑 CÓDIGO: ${code}  (válido 60s, generado ${new Date().toLocaleTimeString()})`);
            console.log("📱 En WhatsApp: 3 puntitos → Dispositivos vinculados → Vincular con número de teléfono → ingresá el código\n");
          } catch (e) {
            console.log("⚠️ Error generando código:", e.message);
          }
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
      if (!process.env.SUPABASE_URL) {
        if (!process.env.SESSION_DATA && !process.env.SESS_P1) {
          setTimeout(encodeAndLogSession, 15000);
        }
      } else {
        if (process.env.SKIP_SUPABASE_SESSION !== "true") setTimeout(() => saveSessionToSupabase(SESSION_DIR), 15000);
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
    const isNew = !mem.known;

    if (!mem.name && pushName) updateName(userId, pushName);
    const userName = mem.name || pushName;

    addMessage(userId, "user", text);
    console.log(`💬 ${userName}: ${text}`);

    await sock.sendPresenceUpdate("composing", remoteJid);

    const cmdResponse = handleComand(text);
    if (cmdResponse) {
      await sock.sendMessage(remoteJid, { text: cmdResponse });
      addMessage(userId, "assistant", cmdResponse);
      return;
    }

    if (isNew) {
      await sock.sendMessage(remoteJid, { text: WELCOME_MESSAGE });
      addMessage(userId, "assistant", WELCOME_MESSAGE);
      await sock.sendPresenceUpdate("composing", remoteJid);
    }

    const mensajeConNombre = mem.known ? text : `(nombre: ${userName}) ${text}`;

    const history = mem.history.map((h) => ({ role: h.role, content: h.content }));
    const response = await generateResponse(mensajeConNombre, history);

    addMessage(userId, "assistant", response);

    const imgUrl = findImage(text + " " + response);
    if (imgUrl) {
      try {
        const imgBuffer = await fetchImage(imgUrl);
        await sock.sendMessage(remoteJid, { image: imgBuffer, caption: response });
      } catch {
        await sock.sendMessage(remoteJid, { text: response });
      }
    } else {
      await sock.sendMessage(remoteJid, { text: response });
    }
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

(async () => {
  await restoreSession();
  startBot();
})();
