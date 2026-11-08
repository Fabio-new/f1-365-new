export default async function handler(req,res){
  try{
    const sessions=await fetch('https://api.openf1.org/v1/sessions?year=2026').then(r=>r.json());
    const session=sessions.filter(x=>!x.is_cancelled).sort((a,b)=>new Date(b.date_start)-new Date(a.date_start))[0];
    let results=[];
    if(session?.session_key){
      try{
        const rr=await fetch(`https://api.openf1.org/v1/session_result?session_key=${session.session_key}`).then(r=>r.json());
        const drivers=await fetch(`https://api.openf1.org/v1/drivers?session_key=${session.session_key}`).then(r=>r.json());
        const by=Object.fromEntries(drivers.map(x=>[x.driver_number,x]));
        results=(rr||[]).sort((a,b)=>(a.position||999)-(b.position||999)).map(x=>({position:x.position,driver_number:x.driver_number,driver_name:by[x.driver_number]?.full_name,team_name:by[x.driver_number]?.team_name,status:x.dnf?'DNF':x.dsq?'DSQ':'OK'}));
      }catch{}
    }
    res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=300');
    res.status(200).json({
      live:false,session,message:'OpenF1 provides historical data for free; real-time data during a live session requires its paid real-time tier.',
      results
    });
  }catch(e){res.status(502).json({error:'Live unavailable'})}
}
