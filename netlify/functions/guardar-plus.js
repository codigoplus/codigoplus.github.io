const { getStore } = require('@netlify/blobs');
exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    const data = JSON.parse(event.body || "{}");
    const store = getStore({ 
      name: "codigoplus", 
      siteID: process.env.SITE_ID,
      token: process.env.NETLIFY_API_TOKEN || process.env.NETLIFY_BLOBS_TOKEN,
      consistency: "strong" 
    });
    const actuales = await store.get("data", { type: "json" }) || [];
    actuales.push({
      codigo: data.codigo || "491 819 517 498 14",
      nombre: data.nombre || "codigo anonimo",
      origen: data.origen || "codigo",
      mensaje: data.mensaje || "Mi +1 de amor propio",
      fecha: new Date().toISOString()
    });
    await store.setJSON("data", actuales);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, total: actuales.length }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
