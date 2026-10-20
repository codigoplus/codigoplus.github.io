const { getStore } = require('@netlify/blobs');
exports.handler = async () => {
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  try {
    const store = getStore({ 
      name: "codigoplus", 
      siteID: process.env.SITE_ID,
      token: process.env.NETLIFY_API_TOKEN || process.env.NETLIFY_BLOBS_TOKEN,
      consistency: "strong" 
    });
    const pluses = await store.get("data", { type: "json" }) || [];
    return { statusCode: 200, headers, body: JSON.stringify({ pluses, total: pluses.length }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message, pluses: [], total: 0 }) };
  }
};
