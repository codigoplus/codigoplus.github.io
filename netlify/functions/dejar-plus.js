import { getStore } from "@netlify/blobs";
export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  const store = getStore("codigoplus");
  let data = await store.get("data", {type: "json"});
  if (!data) data = { total: 0, pluses: [] };
  data.total += 1;
  data.pluses.push({ fecha: new Date().toISOString() });
  await store.setJSON("data", data);
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
