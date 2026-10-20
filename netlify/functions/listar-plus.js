import { getStore } from "@netlify/blobs";
export default async () => {
  const store = getStore("codigoplus");
  let data = await store.get("data", {type: "json"});
  if (!data) data = { total: 0, pluses: [] };
  return new Response(JSON.stringify(data), { 
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
  });
}
