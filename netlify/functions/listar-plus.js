import { getStore } from "@netlify/blobs";

export default async () => {
  try {
    const store = getStore("codigos-plus");
    const { blobs } = await store.list();
    const items = [];
    for (const b of blobs) {
      const data = await store.get(b.key, { type: "json" });
      if (data) items.push(data);
    }
    // Ordenar por fecha
    items.sort((a,b) => new Date(a.fecha) - new Date(b.fecha));
    return new 
Response(JSON.stringify(items), { 
      status: 200, 
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
