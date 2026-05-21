import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sessionsDir = path.join(__dirname, "sessions");

if (!fs.existsSync(sessionsDir)) {
  console.log("❌ No se encontró la carpeta sessions/");
  process.exit(1);
}

const files = fs.readdirSync(sessionsDir).filter((f) => f.endsWith(".json"));
const sessionData = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(sessionsDir, file), "utf-8");
  sessionData[file] = content;
}

const base64 = Buffer.from(JSON.stringify(sessionData)).toString("base64");
console.log("\n=== SESSION_BASE64 (copiá esto y ponelo en Railway > Variables) ===\n");
console.log(base64);
console.log("\n================================================");
