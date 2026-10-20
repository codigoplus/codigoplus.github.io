const { getStore } = require('@netlify/blobs');
exports.handler = async () => {
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  try {
    const store = getStore("pluses");
    const data = await store.get("pluses.json", { type: "json" }) || [];
    return { statusCode: 200, headers, body: JSON.stringify({ pluses: data, total: data.length }) };
  } catch (e) {
    return { statusCode: 200, headers, body: JSON.stringify({ pluses: [], total: 0 }) };
  }
};
