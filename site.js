
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const flag=c=>({Australia:'🇦🇺',China:'🇨🇳',Japan:'🇯🇵',USA:'🇺🇸',Canada:'🇨🇦',Monaco:'🇲🇨',Spain:'🇪🇸',Austria:'🇦🇹',UK:'🇬🇧',Belgium:'🇧🇪',Hungary:'🇭🇺',Netherlands:'🇳🇱',Italy:'🇮🇹',Azerbaijan:'🇦🇿',Malaysia:'🇲🇾',Singapore:'🇸🇬',Mexico:'🇲🇽',Brazil:'🇧🇷',Qatar:'🇶🇦',UAE:'🇦🇪'}[c]||'🏁');
const fmtDate=d=>new Intl.DateTimeFormat('it-IT',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(d));
async function json(url){const r=await fetch(url);if(!r.ok)throw Error(url);return r.json()}
async function getData(){
  try{return await json('/api/f1?season=2026')}
  catch(e){return await json('/data/fallback.json')}
}
async function getNews(){try{return await json('/api/news')}catch(e){return {news:[]}}}
function headerDate(){const x=$('#topdate');if(x)x.textContent=new Intl.DateTimeFormat('it-IT',{dateStyle:'full',timeStyle:'short'}).format(new Date())}
function toggleSearch(){const x=$('#searchbox');x.hidden=!x.hidden;if(!x.hidden)$('#search').focus()}
function countdown(iso,root){const el=$(root);if(!el)return;const tick=()=>{let n=Math.max(0,new Date(iso)-Date.now());let d=Math.floor(n/864e5),h=Math.floor(n%864e5/36e5),m=Math.floor(n%36e5/6e4);el.innerHTML=`<div><b>${String(d).padStart(2,'0')}</b><span>giorni</span></div><div><b>${String(h).padStart(2,'0')}</b><span>ore</span></div><div><b>${String(m).padStart(2,'0')}</b><span>minuti</span></div>`};tick();setInterval(tick,1000)}
function nextRace(data){return data.calendar.find(r=>new Date(`${r.date}T${r.time||'00:00:00Z'}`)>new Date())||data.calendar[data.calendar.length-1]}
function renderStandings(data,type='drivers',target='#standings'){
  const arr=type==='drivers'?data.drivers:data.constructors, el=$(target); if(!el)return;
  el.innerHTML=arr.slice(0,5).map((x,i)=>{let name=type==='drivers'?`${x.Driver.givenName} ${x.Driver.familyName}`:x.Constructor.name;let team=type==='drivers'?(x.Constructors?.[0]?.name||''):'';return `<div class="standrow"><span>${i+1}</span><span><strong>${esc(name)}</strong><small>${esc(team)}</small></span><strong>${esc(x.points)} pts</strong></div>`}).join('');
}
function renderCalendar(data,target='#calendar'){const el=$(target);if(!el)return;el.innerHTML=data.calendar.map((r,i)=>`<div class="race ${i===data.calendar.findIndex(x=>x.round===nextRace(data).round)?'next':''}"><span class="flag">${flag(r.country)}</span><span><strong>${esc(r.name.replace(' Grand Prix',''))}</strong><small>${esc(r.city)}</small></span><span>${fmtDate(r.date)}</span></div>`).join('')}
function renderTeams(data,target='#teams'){const el=$(target);if(!el)return;const arr=data.constructors||[];const icons={'Mercedes':'◼️','Ferrari':'🐎','Red Bull':'🐂','McLaren':'🟠','Aston Martin':'🪽','Alpine F1 Team':'🔷','Williams':'🔵','Haas F1 Team':'⚫','Audi':'◉','Cadillac F1 Team':'⚜️','RB F1 Team':'🔵'};el.innerHTML=arr.slice(0,10).map(x=>`<a class="team" href="teams.html"><b>${icons[x.Constructor.name]||'🏎️'}</b>${esc(x.Constructor.name)}</a>`).join('')}
async function initHome(){
  headerDate();const data=await getData(), n=nextRace(data);
  $('#gp').innerHTML=`<div class="muted">${flag(n.country)}</div><h2>${esc(n.name.replace(' Grand Prix',' GP'))}</h2><div class="muted">${esc(n.city)} · ${fmtDate(n.date)}</div><div id="count" class="count"></div><div class="track"></div><a class="btn" href="calendar.html">Scopri il GP →</a>`;countdown(`${n.date}T${n.time||'00:00:00Z'}`,'#count');
  renderStandings(data,'drivers');renderCalendar(data,'#homecalendar');renderTeams(data,'#teams');$('#races').textContent=data.calendar.length;$('#drivers').textContent=data.drivers.length;$('#wins').textContent=data.drivers.reduce((s,x)=>s+Number(x.wins||0),0);$('#poles').textContent='—';
  const news=await getNews();renderNews(news.news);
}
function renderNews(news,target='#news'){const el=$(target);if(!el)return;if(!news.length){el.innerHTML='<div class="muted">Le news automatiche saranno mostrate quando le fonti sono disponibili.</div>';return}el.innerHTML=news.slice(0,8).map(n=>`<article class="card"><a href="${esc(n.url)}" target="_blank" rel="noopener"><div class="newsimg">${n.image?`<img loading="lazy" src="${esc(n.image)}" alt="">`:''}<span class="tag">${esc(n.source||'Fonte')}</span></div><h3>${esc(n.title)}</h3></a><div class="meta">${esc(n.date||'Aggiornato')} · fonte primaria</div></article>`).join('')}
async function initNews(){headerDate();const d=await getNews();renderNews(d.news,'#allnews');}
async function initCalendar(){headerDate();const d=await getData();renderCalendar(d,'#calendarall')}
async function initStandings(){headerDate();const d=await getData();renderStandings(d,'drivers','#driverStand');renderStandings(d,'constructors','#constructorStand');document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-stand]').forEach(x=>x.hidden=true);document.querySelector(b.dataset.tab).hidden=false;document.querySelectorAll('[data-tab]').forEach(x=>x.classList.remove('active'));b.classList.add('active')})}
async function initDrivers(){headerDate();const d=await getData();$('#drivercards').innerHTML=d.drivers.map(x=>`<article class="driver"><div class="num">#${esc(x.Driver.permanentNumber||x.position)}</div><h3>${esc(x.Driver.givenName)} ${esc(x.Driver.familyName)}</h3><p>${esc(x.Constructors?.[0]?.name||'')}</p><p><strong>${esc(x.points)} punti</strong> · ${esc(x.wins)} vittorie</p></article>`).join('')}
async function initTeams(){headerDate();const d=await getData();$('#teamcards').innerHTML=d.constructors.map(x=>`<article class="teamcard"><h3>${esc(x.Constructor.name)}</h3><p>Posizione ${esc(x.position)} · ${esc(x.points)} punti</p><p>${esc(x.wins)} vittorie</p></article>`).join('')}
async function initResults(){headerDate();try{const d=await json('/api/results?season=2026');$('#results').innerHTML=d.results.map(r=>`<div class="panel" style="padding:14px;margin-bottom:10px"><h3 style="font:800 25px Barlow Condensed;margin:0 0 8px">${esc(r.raceName)} — ${fmtDate(r.date)}</h3>${r.results.slice(0,5).map(x=>`<div class="race"><span>${x.position}</span><span><strong>${esc(x.driver)}</strong><small>${esc(x.constructor)}</small></span><span>${esc(x.time||x.status||'')}</span></div>`).join('')}</div>`).join('')}catch(e){$('#results').innerHTML='<div class="notice">Risultati temporaneamente non disponibili. Le altre sezioni restano operative.</div>'}}
async function initLive(){headerDate();const box=$('#livebox');try{const d=await json('/api/live');box.innerHTML=`<span class="livebadge ${d.live?'ok':''}">${d.live?'LIVE':'DATI SESSIONE'}</span><h2>${esc(d.session?.session_name||'Ultima sessione')}</h2><p class="muted">${esc(d.session?.meeting_name||'')}${d.session?.location?' · '+esc(d.session.location):''}</p><div class="notice">${esc(d.message)}</div>${d.results?.length?'<div class="tablewrap"><table class="table"><tr><th>#</th><th>Pilota</th><th>Team</th><th>Stato</th></tr>'+d.results.slice(0,10).map(x=>`<tr><td>${x.position||'—'}</td><td>${esc(x.driver_name||x.driver_number)}</td><td>${esc(x.team_name||'')}</td><td>${esc(x.status||'')}</td></tr>`).join('')+'</table></div>':''}`}catch(e){box.innerHTML='<div class="notice">F1 Live non disponibile in questo momento.</div>'}}
const path=location.pathname;
if(path.endsWith('/')||path.endsWith('index.html'))initHome();
if(path.endsWith('news.html'))initNews();
if(path.endsWith('calendar.html'))initCalendar();
if(path.endsWith('standings.html'))initStandings();
if(path.endsWith('drivers.html'))initDrivers();
if(path.endsWith('teams.html'))initTeams();
if(path.endsWith('results.html'))initResults();
if(path.endsWith('live.html'))initLive();
