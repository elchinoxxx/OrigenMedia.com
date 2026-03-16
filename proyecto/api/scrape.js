
export default async function handler(req,res){

const {url} = req.body;

try{

const r = await fetch(url);
const html = await r.text();

const text = html
.replace(/<script[\s\S]*?<\/script>/gi,"")
.replace(/<style[\s\S]*?<\/style>/gi,"")
.replace(/<[^>]+>/g," ")
.replace(/\s+/g," ")
.trim()
.slice(0,15000);

res.status(200).json({text});

}catch(e){
res.status(500).json({error:"scrape error"});
}

}
