import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USERS_DIR = path.join(__dirname, "..", "users");

const MAX_HISTORY = 10;

function ensureDir() {
  if (!fs.existsSync(USERS_DIR)) {
    fs.mkdirSync(USERS_DIR, { recursive: true });
  }
}

function userPath(userId) {
  return path.join(USERS_DIR, `${userId}.json`);
}

export function getUserMemory(userId) {
  ensureDir();
  try {
    const data = fs.readFileSync(userPath(userId), "utf-8");
    return JSON.parse(data);
  } catch {
    return { history: [], known: false, name: null };
  }
}

export function saveUserMemory(userId, memory) {
  ensureDir();
  fs.writeFileSync(userPath(userId), JSON.stringify(memory, null, 2));
}

export function addMessage(userId, role, content) {
  const mem = getUserMemory(userId);
  mem.history.push({ role, content });
  if (mem.history.length > MAX_HISTORY * 2) {
    mem.history = mem.history.slice(-MAX_HISTORY);
  }
  mem.known = true;
  saveUserMemory(userId, mem);
}

export function updateName(userId, name) {
  const mem = getUserMemory(userId);
  mem.name = name;
  saveUserMemory(userId, mem);
}
