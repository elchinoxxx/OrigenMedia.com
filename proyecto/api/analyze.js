export default async function handler(req, res) {

const API_KEY = process.env.GEMINI_API_KEY;

const { instagram, tiktok, web } = req.body;

try {

let webText = "";

// 🔥 BASE URL CORRECTA (FIX VERCEL)
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// 🔥 SCRAPING REAL
if (web) {
  try {
    const scrape = await fetch(`${baseUrl}/api/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: web })
    });

    const scrapeData = await scrape.json();
    webText = (scrapeData.text || "").slice(0, 3000);
  } catch (e) {
    console.error("Scrape error:", e);
  }
}

// 🔥 PROMPT MEJORADO (NO GENÉRICO)
const prompt = `
Actúa como un consultor experto en branding premium y marketing digital.

Analiza esta marca de forma crítica y específica:

Instagram: ${instagram}
TikTok: ${tiktok}
Web: ${web}

Contenido del sitio:
${webText}

REGLAS:
- Prohibido dar respuestas genéricas
- Sé directo, crítico y profesional
- Detecta errores reales
- Cada plataforma debe tener análisis distinto
- Si falta información, dilo claramente

Devuelve SOLO JSON válido:

{
  "instagram": {
    "score": número,
    "diagnostico": "análisis claro",
    "problemas": "errores concretos",
    "plan": "acciones específicas"
  },
  "tiktok": {
    "score": número,
    "diagnostico": "",
    "problemas": "",
    "plan": ""
  },
  "web": {
    "score": número,
    "diagnostico": "",
    "problemas": "",
    "plan": ""
  }
}
`;

// 🔥 LLAMADA A GEMINI
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

// 🔥 EXTRAER TEXTO
let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

// limpiar markdown si viene
text = text.replace(/```json|```/g, "").trim();

// 🔥 PARSEO SEGURO
let parsed;

try {
  parsed = JSON.parse(text);
} catch (err) {
  console.error("JSON inválido:", text);
  return res.status(500).json({
    error: "Error parseando IA",
    raw: text
  });
}

// 🔥 RESPUESTA FINAL
res.status(200).json(parsed);

} catch (e) {
console.error(e);
res.status(500).json({ error: "IA error", detail: e.toString() });
}

}
