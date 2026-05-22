import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const TABLE = "whatsapp_sessions";

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

let saveTimeout = null;

export async function loadSessionFromSupabase(sessionDir) {
  if (!supabase) return false;
  try {
    const { data, error } = await supabase.from(TABLE).select("filename, content");
    if (error) throw error;
    if (!data || data.length === 0) return false;
    for (const row of data) {
      fs.writeFileSync(`${sessionDir}/${row.filename}`, row.content, "utf-8");
    }
    console.log(`✅ Sesión restaurada desde Supabase (${data.length} archivos)`);
    return true;
  } catch (e) {
    console.log("❌ Error al restaurar desde Supabase:", e.message);
    return false;
  }
}

export async function saveSessionToSupabase(sessionDir) {
  if (!supabase) return;
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      const files = fs.readdirSync(sessionDir);
      const rows = files
        .filter((f) => f.endsWith(".json"))
        .map((f) => ({
          filename: f,
          content: fs.readFileSync(`${sessionDir}/${f}`, "utf-8"),
          updated_at: new Date().toISOString(),
        }));
      if (rows.length === 0) return;
      for (const row of rows) {
        await supabase.from(TABLE).upsert(row, { onConflict: "filename" });
      }
      console.log(`✅ Sesión guardada en Supabase (${rows.length} archivos)`);
    } catch (e) {
      console.log("❌ Error al guardar en Supabase:", e.message);
    }
  }, 2000);
}
