function abs(u){try{return new URL(u,'https://www.formula1.com').href}catch{return null}}
function clean(s){return (s||'').replace(/\s+/g,' ').replace(/&amp;/g,'&').trim()}
function extract(html,source){
  const out=[], re=/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi; let m;
  while((m=re.exec(html))&&out.length<16){
    const href=abs(m[1]), title=clean(m[2].replace(/<[^>]+>/g,' '));
    if(!href||title.length<25||title.length>180)continue;
    if(!/(f1|formula 1|grand prix|gp |verstappen|norris|antonelli|leclerc|hamilton|ferrari|mercedes|mclaren|red bull|fia)/i.test(title))continue;
    if(out.some(x=>x.url===href))continue;
    out.push({title,url:href,source,date:new Date().toLocaleDateString('it-IT')});
  }
  return out;
}
async function og(url){try{const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0'}});const h=await r.text();const m=h.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)||h.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);return m?m[1]:null}catch{return null}}
export default async function handler(req,res){
  try{
    const sources=[['Formula1.com','https://www.formula1.com/en/latest'],['FIA','https://www.fia.com/news']];
    let all=[];
    for(const [name,url] of sources){const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0'}});if(r.ok)all=all.concat(extract(await r.text(),name))}
    all=all.filter((x,i,a)=>a.findIndex(y=>y.title===x.title)===i).slice(0,8);
    const news=await Promise.all(all.slice(0,6).map(async n=>({...n,image:await og(n.url)})));
    res.setHeader('Cache-Control','s-maxage=900, stale-while-revalidate=1800');
    res.status(200).json({news,verifiedSources:['Formula1.com','FIA']});
  }catch(e){res.status(502).json({news:[],error:'News unavailable'})}
}
