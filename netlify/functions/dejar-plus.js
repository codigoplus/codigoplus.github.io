import { getStore } from "@netlify/blobs";
import crypto from "crypto";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
            || req.headers.get("x-nf-client-connection-ip") 
            || "unknown";
    const hashIp = crypto.createHash("sha256").update(ip).digest("hex");

    const store = getStore("codigos-plus");
    const existe = await store.get(hashIp);
    if (existe) {
      return new Response(JSON.stringify({ error: "Ya dejaste tu +1 desde esta IP" }), { status: 409 });
    }

    const { nombre, plus } = await req.json();
    if (!nombre || !plus || nombre.length < 2 || plus.length < 3) {
      return new 
Response(JSON.stringify({ error: "Faltan datos" }), { status: 400 });
    }

    const data = {
      nombre: nombre.slice(0,40),
      plus: plus.slice(0,120),
      fecha: new Date().toISOString(),
      ipMask: ip.slice(0,3) + "•••" + ip.slice(-2)
    };

    await store.setJSON(hashIp, data);
    return new Response(JSON.stringify({ ok: true, data }), { status: 200, headers: { "Content-Type": "application/
json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
