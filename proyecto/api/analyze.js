
export default async function handler(req, res) {

const API_KEY = process.env.GEMINI_API_KEY;

try{

const response = await fetch(
"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify(req.body)
}
);

const data = await response.json();
res.status(200).json(data);

}catch(e){
res.status(500).json({error:"Gemini error", detail:e.toString()});
}

}
