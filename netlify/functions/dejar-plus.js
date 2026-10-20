import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("codigoplus");
  let data = await store.get("data", {type: "json"});
  if (!data) data = { total: 0, pluses: [] };
  
  data.total += 1;
  data.pluses.push({ fecha: new Date().toISOString() });
  
  await store.setJSON("data", data);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
