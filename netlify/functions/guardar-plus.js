const { getStore } = require('@netlify/blobs');
exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    let data = {};
    if (event.httpMethod === "GET") {
      data = event.queryStringParameters || {};
    } else {
      try { data = JSON.parse(event.body || "{}"); } catch(e){ data = event.queryStringParameters || {}; }
    }

    const store = getStore({ 
      name: "codigoplus", 
      siteID: process.env.SITE_ID,
      token: process.env.NETLIFY_API_TOKEN || process.env.NETLIFY_BLOBS_TOKEN,
      consistency: "strong" 
    });

    let raw = await store.get("data", { type: "json" });
    let lista = [];
    if (!raw) lista = [];
    else if (Array.isArray(raw)) lista = raw;
    else if (Array.isArray(raw.pluses)) lista = raw.pluses;
    else if (raw.pluses && Array.isArray(raw.pluses.pluses)) lista = raw.pluses.pluses;
    else lista = [];

    // --- NUEVO: Soporta teclado visual puro CSS ---
    // Si viene pos0, pos1, pos2... los concatenamos en orden
    let mensajeConstruido = "";
    const posKeys = Object.keys(data).filter(k => k.startsWith("pos")).sort((a,b)=>{
      const na = parseInt(a.replace("pos",""))||0;
      const nb = parseInt(b.replace("pos",""))||0;
      return na-nb;
    });
    if (posKeys.length > 0) {
      mensajeConstruido = posKeys.map(k => data[k] || "").join("").trim();
    }
    // También soporta letra[] como array
    if (!mensajeConstruido && data.letra) {
      if (Array.isArray(data.letra)) mensajeConstruido = data.letra.join("");
      else mensajeConstruido = data.letra;
    }
    // Si viene checkbox letras individuales letra-A, letra-B etc con valor on
    if (!mensajeConstruido) {
      const letrasMarcadas = Object.keys(data).filter(k=>k.startsWith("letra-") && data[k]).map(k=>k.replace("letra-","")).join("");
      if (letrasMarcadas) mensajeConstruido = letrasMarcadas;
    }

    const nuevo = {
      codigo: data.codigo || "491 819 517 498 14",
      nombre: data.nombre || "codigo anonimo",
      origen: data.origen || "codigo",
      mensaje: mensajeConstruido || data.mensaje || data.plus || "Mi +1 de amor propio",
      fecha: new Date().toISOString(),
      metodo: posKeys.length>0 ? "teclado-visual-puro-CSS" : "GET",
      ipMask: "net • IA"
    };

    lista.push(nuevo);
    await store.setJSON("data", lista);

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, total: lista.length, plus: nuevo }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message, stack: e.stack }) };
  }
};
