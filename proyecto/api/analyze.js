export default async function handler(req, res) {

const API_KEY = process.env.GEMINI_API_KEY;

const { instagram, tiktok, web } = req.body;

try {

let webText = "";

if (web) {
  try {
    const scrape = await fetch(`${req.headers.origin}/api/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: web })
    });

    const scrapeData = await scrape.json();
    webText = scrapeData.text.slice(0, 3000);
  } catch {}
}

const prompt = `
Eres un consultor experto en branding premium.

Analiza esta marca:

Instagram: ${instagram}
TikTok: ${tiktok}
Web: ${web}

Contenido del sitio:
${webText}

INSTRUCCIONES:
- NO des respuestas genéricas
- Sé específico
- Da análisis distinto por plataforma

Devuelve JSON así:

{
  "instagram": {
    "score": 0,
    "diagnostico": "",
    "problemas": "",
    "plan": ""
  },
  "tiktok": {
    "score": 0,
    "diagnostico": "",
    "problemas": "",
    "plan": ""
  },
  "web": {
    "score": 0,
    "diagnostico": "",
    "problemas": "",
    "plan": ""
  }
}
`;

const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  }
);

const data = await response.json();

let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

text = text.replace(/```json|```/g, "").trim();

const parsed = JSON.parse(text);

res.status(200).json(parsed);

} catch (e) {
res.status(500).json({ error: "IA error", detail: e.toString() });
}
}
