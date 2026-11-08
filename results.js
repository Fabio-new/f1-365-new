export default async function handler(req,res){
  const season=req.query.season||'2026';
  try{
    const sched=await fetch(`https://api.jolpi.ca/ergast/f1/${season}.json`).then(r=>r.json());
    const races=sched.MRData?.RaceTable?.Races||[];
    const completed=races.filter(r=>new Date(`${r.date}T${r.time||'00:00:00Z'}`)<new Date()).slice(-8);
    const results=[];
    for(const r of completed){
      try{
        const j=await fetch(`https://api.jolpi.ca/ergast/f1/${season}/${r.round}/results/1.json`).then(x=>x.json());
        const rr=j.MRData?.RaceTable?.Races?.[0]?.Results||[];
        results.push({round:r.round,raceName:r.raceName,date:r.date,results:rr.map(x=>({position:x.position,driver:`${x.Driver?.givenName||''} ${x.Driver?.familyName||''}`.trim(),constructor:x.Constructor?.name,time:x.Time?.time,status:x.status}))});
      }catch{}
    }
    res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=900');
    res.status(200).json({results:results.reverse()});
  }catch(e){res.status(502).json({error:'Results unavailable'})}
}
