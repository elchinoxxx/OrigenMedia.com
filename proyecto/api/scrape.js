export default async function handler(req, res) {

const { url } = req.body;

if (!url) {
  return res.status(400).json({ error: "No URL" });
}

try {

  const r = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const html = await r.text();

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 15000);

  res.status(200).json({ text });

} catch (e) {
  console.error(e);
  res.status(500).json({ error: "scrape error" });
}

}
