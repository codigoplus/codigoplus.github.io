const { getStore } = require('@netlify/blobs');
exports.handler = async () => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };
  try {
    const store = getStore({ name: "pluses", consistency: "strong" });
    const pluses = await store.get("pluses.json", { type: "json" }) || [];
    return { statusCode: 200, headers, body: JSON.stringify({ pluses, total: pluses.length }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message, pluses: [], total: 0 }) };
  }
};
