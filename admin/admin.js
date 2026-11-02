/* ======================================================================
   TechPulse Admin Dashboard
   Reads the data the website writes to the browser's localStorage:
   tp_users, tp_messages, tp_activity. Put this file in the SAME folder as
   the website (../user/user.html). Both pages must be opened from the same
   origin (e.g. one local server at the project root) so they share storage.
   Sign-in is shared: log in on the website with an admin account and you are
   sent straight here. Replace storage + sign-in with a real backend before launch.
   ====================================================================== */
const $=id=>document.getElementById(id),$$=s=>[...document.querySelectorAll(s)];
const MEM={},store={
  get:k=>{try{const v=localStorage.getItem(k);if(v!==null)return v}catch(e){}return MEM[k]===undefined?null:MEM[k]},
  set:(k,v)=>{MEM[k]=v;try{localStorage.setItem(k,v)}catch(e){}},
  del:k=>{delete MEM[k];try{localStorage.removeItem(k)}catch(e){}}};
const rd=(k,d)=>{try{const v=JSON.parse(store.get(k));return v==null?d:v}catch(e){return d}};
const wr=(k,v)=>store.set(k,JSON.stringify(v));
const K={users:'tp_users',msgs:'tp_messages',act:'tp_activity',adm:'tp_admin',ses:'tp_admin_session'};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const I={
 dash:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
 mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
 act:'<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
 set:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
 out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
 search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
 trash:'<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
 edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
 eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21 7 14.2 2 9.3l6.9-1z"/>',
 ban:'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
 key:'<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
 dl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
 ul:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 x:'<path d="M18 6 6 18M6 6l12 12"/>',
 reply:'<path d="M9 14 4 9l5-5"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>',
 ext:'<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
 check:'<path d="M20 6 9 17l-5-5"/>',
 clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'
};
const ic=(k,c)=>'<svg class="ic'+(c?' '+c:'')+'" viewBox="0 0 24 24" aria-hidden="true">'+I[k]+'</svg>';
const NAVI={overview:['dash','Overview'],users:['users','Users'],messages:['mail','Messages'],activity:['act','Activity log'],settings:['set','Settings']};
Object.keys(NAVI).forEach(k=>{$('n-'+k).innerHTML=ic(NAVI[k][0])+'<span>'+NAVI[k][1]+'</span>'+(k==='messages'?'<span class="badge" id="unreadBadge" hidden>0</span>':'')});
$('n-site').innerHTML=ic('ext')+'<span>View website</span>';$('n-out').innerHTML=ic('out')+'<span>Sign out</span>';$('b-menu').innerHTML=ic('menu');

/* ---------- Data helpers ---------- */
const users=()=>Object.values(rd(K.users,{})).map(u=>Object.assign({role:'client',status:'active',createdAt:0,lastLogin:null},u));
const saveUser=u=>{const m=rd(K.users,{});m[u.email]=u;wr(K.users,m)};
const msgs=()=>rd(K.msgs,[]);
/* Page-view tracking is removed: any 'view' events written by the website are ignored and dropped. */
const acts=()=>rd(K.act,[]).filter(a=>a&&a.type!=='view');
const newId=()=>Date.now()+Math.random().toString(36).slice(2,6);
function log(type,detail,user){const a=acts();a.push({id:newId(),t:Date.now(),type,user:user||'Admin',detail});wr(K.act,a.slice(-1000))}
const TYPES={signup:['Sign up','#0A58CA','#EAF3FF'],login:['Login','#067647','#ECFDF3'],failed:['Failed login','#B42318','#FEF3F2'],logout:['Logout','#475569','#F1F5F9'],message:['Message','#5925DC','#F4F3FF'],request:['Service request','#B54708','#FFFAEB'],file:['File shared','#0E7090','#ECFDFF'],admin:['Admin action','#1E293B','#E2E8F0']};
const chip=t=>{const x=TYPES[t]||[t,'#475569','#F1F5F9'];return '<span class="chip" style="color:'+x[1]+';background:'+x[2]+'">'+esc(x[0])+'</span>'};
const ini=n=>String(n||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase()||'?';
const fmt=t=>t?new Date(t).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'-';
const fmtD=t=>t?new Date(t).toLocaleDateString([],{month:'short',day:'numeric',year:'numeric'}):'-';
const toLocalInput=t=>{const d=new Date(t);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,16)};
function ago(t){const s=Math.max(0,(Date.now()-t)/1000);if(s<60)return 'just now';if(s<3600)return Math.floor(s/60)+' min ago';if(s<86400)return Math.floor(s/3600)+' h ago';return Math.floor(s/86400)+' d ago'}
const nameOf=em=>{const u=(rd(K.users,{}))[em];return u?u.name:em};
const who=em=>em==='Visitor'||em==='Admin'?'<div class="who"><div class="avatar">'+(em==='Admin'?'A':'V')+'</div><div>'+em+'</div></div>':'<div class="who"><div class="avatar">'+esc(ini(nameOf(em)))+'</div><div>'+esc(nameOf(em))+(nameOf(em)!==em?'<small>'+esc(em)+'</small>':'')+'</div></div>';
const ADMIN_EMAIL='techpulse.admin@gmail.com',SITE_LOGIN='../user/user.html#/login';
const emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
async function hash(s){if(window.crypto&&crypto.subtle){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}return btoa(unescape(encodeURIComponent(s)))}
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;$('toasts').append(t);setTimeout(()=>t.remove(),3200)}
function csv(rows){return rows.map(r=>r.map(v=>{v=String(v==null?'':v);if(/^[=+\-@]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'}).join(',')).join('\n')}
function download(name,text,mime){try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:mime||'text/plain'}));a.download=name;document.body.appendChild(a);a.click();a.remove();toast('Downloaded '+name)}catch(e){toast('Download is not available here.')}}
function pager(total,page,size,k){const pages=Math.max(1,Math.ceil(total/size)),a=total?(page-1)*size+1:0,b=Math.min(total,page*size);
  return '<div class="pager"><span>Showing '+a+'-'+b+' of '+total+'</span><div><button class="btn ghost sm" data-act="page" data-k="'+k+'" data-d="-1" type="button" '+(page<=1?'disabled':'')+'>Previous</button><button class="btn ghost sm" data-act="page" data-k="'+k+'" data-d="1" type="button" '+(page>=pages?'disabled':'')+'>Next</button></div></div>'}

/* ---------- Modal ---------- */
function openModal(html){$('dlg').innerHTML=html;$('overlay').hidden=false;const f=$('dlg').querySelector('input:not([disabled]),select,textarea,button');if(f)f.focus()}
function closeModal(){$('overlay').hidden=true;$('dlg').innerHTML='';refresh(true)}
let PENDING=null;
function confirmBox(title,text,label,fn){PENDING=fn;openModal('<h2>'+esc(title)+'</h2><p style="margin:0;color:var(--muted)">'+esc(text)+'</p><div class="foot"><button class="btn ghost" data-act="close" type="button">Cancel</button><button class="btn danger" data-act="confirmYes" type="button" data-primary>'+esc(label)+'</button></div>')}
const mErr=m=>{const e=$('mErr');if(e)e.textContent=m||''};

/* ---------- State + router ---------- */
const S={uq:'',ust:'all',urole:'all',usort:'new',upage:1,mf:'all',mq:'',msel:null,aq:'',at:'all',apage:1};
const ROUTES={'/':'overview','/users':'users','/messages':'messages','/activity':'activity','/settings':'settings'};
let CUR=(location.hash||'').slice(1)||'/',SIG='';
const adminSess=()=>rd(K.ses,null);
function go(to){CUR=to;try{if(location.hash.slice(1)!==to)location.hash=to}catch(e){}render()}
addEventListener('hashchange',()=>{const h=location.hash.slice(1)||'/';if(h!==CUR){CUR=h;render()}});
const REDRAW=()=>({users:drawUsers,messages:drawMessages,activity:drawActivity}[ROUTES[CUR]||'overview']||(()=>{}))();
function render(){
  const ses=adminSess();$('loginScreen').hidden=!!ses;$('app').hidden=!ses;if(!ses)return;
  const name=ROUTES[CUR]||'overview';
  $$('[data-nav]').forEach(a=>a.dataset.nav===name?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
  $('pageTitle').textContent=NAVI[name][1];document.title=NAVI[name][1]+' | TechPulse Admin';
  $('meName').textContent=ses.name||'Admin';$('meAv').textContent=ini(ses.name||'Admin');$('side').classList.remove('open');
  ({overview:viewOverview,users:viewUsers,messages:viewMessages,activity:viewActivity,settings:viewSettings})[name]();
  SIG=sigNow();badge();window.scrollTo(0,0);
}
const sigNow=()=>{const A=acts(),last=A.length?A[A.length-1].id:'';return [store.get(K.users)||'',store.get(K.msgs)||'',A.length+':'+last].join('|')};
function badge(){const n=msgs().filter(m=>!m.read).length,b=$('unreadBadge');if(b){b.textContent=n;b.hidden=!n}}
function refresh(force){if(!adminSess())return;const s=sigNow();if(!force&&s===SIG)return;
  if(!$('overlay').hidden&&!force)return;
  const el=document.activeElement;if(!force&&el&&/INPUT|TEXTAREA|SELECT/.test(el.tagName)&&$('view').contains(el)){badge();return}
  const y=window.scrollY;render();window.scrollTo(0,y)}
setInterval(()=>refresh(false),3000);addEventListener('storage',()=>refresh(false));

/* ---------- Overview ---------- */
function barChart(vals,labels){const W=560,H=190,pad=28,max=Math.max(1,...vals),bw=(W-pad*2)/vals.length;
  return '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Activity in the last 7 days" class="chart">'+vals.map((v,i)=>{const h=Math.round((H-pad-26)*v/max),x=pad+i*bw+bw*.2,y=H-pad-h;
  return '<rect x="'+x+'" y="'+y+'" width="'+(bw*.6)+'" height="'+h+'" rx="5" fill="#0D6FFD"/><text x="'+(x+bw*.3)+'" y="'+(y-6)+'" text-anchor="middle" class="cv">'+v+'</text><text x="'+(x+bw*.3)+'" y="'+(H-8)+'" text-anchor="middle" class="cl">'+labels[i]+'</text>'}).join('')+'<line x1="'+pad+'" x2="'+(W-pad)+'" y1="'+(H-pad)+'" y2="'+(H-pad)+'" stroke="#E2E8F0"/></svg>'}
function viewOverview(){
  const U=users(),M=msgs(),A=acts(),now=Date.now(),day=864e5;
  const st={total:U.length,newW:U.filter(u=>now-u.createdAt<7*day).length,active:U.filter(u=>u.lastLogin&&now-u.lastLogin<7*day).length,susp:U.filter(u=>u.status==='suspended').length,unread:M.filter(m=>!m.read).length,
   requests:A.filter(a=>a.type==='request').length,online:new Set(A.filter(a=>now-a.t<5*6e4&&a.user&&a.user!=='Admin'&&a.user!=='Visitor').map(a=>a.user)).size};
  const days=[],labels=[];for(let i=6;i>=0;i--){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-i);const s=d.getTime();days.push(A.filter(a=>a.type!=='admin'&&a.t>=s&&a.t<s+day).length);labels.push(d.toLocaleDateString([],{weekday:'short'}))}
  const topics={};M.forEach(m=>{if(m.topic)topics[m.topic]=(topics[m.topic]||0)+1});const tl=Object.entries(topics).sort((a,b)=>b[1]-a[1]).slice(0,5),tmax=tl.length?tl[0][1]:1;
  const card=(ico,n,l)=>'<div class="card stat"><div class="ico">'+ic(ico)+'</div><div><b>'+n+'</b><span>'+l+'</span></div></div>';
  const recentA=A.slice(-7).reverse(),recentM=M.slice().sort((a,b)=>b.t-a.t).slice(0,5);
  $('view').innerHTML='<div class="stats">'+card('users',st.total,'Total users ('+st.newW+' new this week)')+card('act',st.online,'Online now ('+st.active+' active this week)')+card('mail',st.unread,'Unread messages ('+M.length+' total)')+card('clock',st.requests,'Service requests')+'</div>'
  +(!U.length&&!M.length&&!A.length?'<div class="card" style="margin-bottom:20px"><h2>No data yet</h2><p style="margin:0 0 14px;color:var(--muted)">Open the website in this browser, sign up and send a message, and it will show here live. Or load sample data to preview the dashboard.</p><button class="btn" data-act="seed" type="button">Load sample data</button></div>':'')
  +'<div class="grid2"><div class="card"><h2>Activity, last 7 days</h2>'+barChart(days,labels)+'</div>'
  +'<div class="card"><h2>Top requested services</h2>'+(tl.length?tl.map(t=>'<div class="bar-row"><div class="t"><span>'+esc(t[0])+'</span><b>'+t[1]+'</b></div><div class="bar"><span style="width:'+Math.round(t[1]/tmax*100)+'%"></span></div></div>').join(''):'<div class="empty">No service requests yet.</div>')+'</div></div>'
  +'<div class="grid2" style="grid-template-columns:1fr 1fr"><div class="card"><h2>Recent activity <a href="#/activity">View all</a></h2>'+(recentA.length?'<ul class="list">'+recentA.map(a=>'<li>'+chip(a.type)+'<div class="grow"><div>'+esc(nameOf(a.user))+'</div><small>'+esc(a.detail)+'</small></div><small>'+ago(a.t)+'</small></li>').join('')+'</ul>':'<div class="empty">No activity yet.</div>')+'</div>'
  +'<div class="card"><h2>Latest messages <a href="#/messages">Open inbox</a></h2>'+(recentM.length?'<ul class="list">'+recentM.map(m=>'<li><div class="avatar">'+esc(ini(m.name))+'</div><div class="grow"><div><b>'+esc(m.name)+'</b>'+(m.read?'':' <span class="chip" style="background:#EAF3FF;color:#0A58CA">New</span>')+'</div><small>'+esc(String(m.text||'').slice(0,70))+'</small></div><small>'+ago(m.t)+'</small></li>').join('')+'</ul>':'<div class="empty">No messages yet.</div>')+'</div></div>'}

/* ---------- Users ---------- */
function viewUsers(){
  $('view').innerHTML='<div class="toolbar"><div class="search">'+ic('search')+'<input type="search" placeholder="Search name or email" aria-label="Search users" data-bind="uq" data-page="upage" value="'+esc(S.uq)+'"></div>'
  +'<select aria-label="Status" data-bind="ust" data-page="upage"><option value="all">All statuses</option><option value="active">Active</option><option value="suspended">Suspended</option></select>'
  +'<select aria-label="Role" data-bind="urole" data-page="upage"><option value="all">All roles</option><option value="client">Client</option><option value="staff">Staff</option></select>'
  +'<select aria-label="Sort" data-bind="usort"><option value="new">Newest first</option><option value="name">Name A-Z</option><option value="login">Last login</option></select>'
  +'<button class="btn ghost" data-act="exportUsers" type="button">'+ic('dl','sm')+' Export CSV</button><button class="btn" data-act="addUser" type="button">'+ic('plus','sm')+' Add user</button></div><div class="card" id="uTable"></div>';
  ['ust','urole','usort'].forEach(k=>{const s=$('view').querySelector('[data-bind="'+k+'"]');if(s)s.value=S[k]});drawUsers()}
function filteredUsers(){const q=S.uq.trim().toLowerCase();let L=users().filter(u=>(S.ust==='all'||u.status===S.ust)&&(S.urole==='all'||u.role===S.urole)&&(!q||(u.name+' '+u.email).toLowerCase().includes(q)));
  const sorts={new:(a,b)=>b.createdAt-a.createdAt,name:(a,b)=>String(a.name).localeCompare(String(b.name)),login:(a,b)=>(b.lastLogin||0)-(a.lastLogin||0)};return L.sort(sorts[S.usort])}
function drawUsers(){const L=filteredUsers(),size=8,pages=Math.max(1,Math.ceil(L.length/size));S.upage=Math.min(S.upage,pages);const rows=L.slice((S.upage-1)*size,S.upage*size);
  $('uTable').innerHTML=rows.length?'<div class="tbl-wrap"><table><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Last login</th><th style="text-align:right">Actions</th></tr></thead><tbody>'+rows.map(u=>{const e=esc(u.email);
  return '<tr><td><div class="who"><div class="avatar">'+esc(ini(u.name))+'</div><div>'+esc(u.name)+'<small>'+e+'</small></div></div></td><td><span class="chip r-'+esc(u.role)+'">'+esc(u.role)+'</span></td><td><span class="chip s-'+esc(u.status)+'">'+esc(u.status)+'</span></td><td>'+fmtD(u.createdAt)+'</td><td>'+(u.lastLogin?ago(u.lastLogin):'Never')+'</td>'
  +'<td><div class="actions"><button class="icon-btn" data-act="openUser" data-e="'+e+'" type="button" title="View" aria-label="View '+esc(u.name)+'">'+ic('eye','sm')+'</button><button class="icon-btn" data-act="editUser" data-e="'+e+'" type="button" title="Edit" aria-label="Edit '+esc(u.name)+'">'+ic('edit','sm')+'</button>'
  +'<button class="icon-btn" data-act="toggleStatus" data-e="'+e+'" type="button" title="'+(u.status==='active'?'Suspend':'Activate')+'" aria-label="'+(u.status==='active'?'Suspend ':'Activate ')+esc(u.name)+'">'+ic(u.status==='active'?'ban':'check','sm')+'</button><button class="icon-btn" data-act="resetPw" data-e="'+e+'" type="button" title="Reset password" aria-label="Reset password for '+esc(u.name)+'">'+ic('key','sm')+'</button>'
  +'<button class="icon-btn bad" data-act="delUser" data-e="'+e+'" type="button" title="Delete" aria-label="Delete '+esc(u.name)+'">'+ic('trash','sm')+'</button></div></td></tr>'}).join('')+'</tbody></table></div>'+pager(L.length,S.upage,size,'upage'):'<div class="empty">'+(users().length?'No users match your filters.':'No users yet. When people sign up on the website, they appear here.')+'</div>'}
const userForm=(u,add)=>'<div class="field"><label for="m-name">Full name</label><input id="m-name" value="'+esc(u.name||'')+'"></div>'
  +'<div class="field"><label for="m-email">Email</label><input id="m-email" type="email" value="'+esc(u.email||'')+'"></div>'
  +(add?'<div class="field"><label for="m-pw">Password</label><input id="m-pw" type="password" placeholder="At least 8 characters"></div>':'')
  +'<div class="field"><label for="m-role">Role</label><select id="m-role"><option value="client"'+(u.role==='client'?' selected':'')+'>Client</option><option value="staff"'+(u.role==='staff'?' selected':'')+'>Staff</option></select></div>'
  +(add?'':'<div class="field"><label for="m-status">Status</label><select id="m-status"><option value="active"'+(u.status==='active'?' selected':'')+'>Active</option><option value="suspended"'+(u.status==='suspended'?' selected':'')+'>Suspended</option></select></div>')+'<p class="error" id="mErr" role="alert"></p>';
const getU=e=>rd(K.users,{})[e];

/* ---------- Messages ---------- */
const topicOpts=cur=>{const L=['General question'].concat(SVC);cur=cur||'General question';if(!L.includes(cur))L.push(cur);return L.map(t=>'<option'+(t===cur?' selected':'')+'>'+esc(t)+'</option>').join('')};
function viewMessages(){
  $('view').innerHTML='<div class="toolbar"><div class="search">'+ic('search')+'<input type="search" placeholder="Search messages" aria-label="Search messages" data-bind="mq" value="'+esc(S.mq)+'"></div>'
  +'<button class="btn ghost" data-act="markAllRead" type="button">'+ic('check','sm')+' Mark all read</button></div>'
  +'<div class="chips" role="group" aria-label="Filter messages">'+[['all','All'],['unread','Unread'],['starred','Starred'],['replied','Replied']].map(f=>'<button class="fchip" data-act="mf" data-f="'+f[0]+'" aria-pressed="'+(S.mf===f[0])+'" type="button">'+f[1]+'</button>').join('')+'</div>'
  +'<div class="inbox"><div class="card msg-list" id="mList" style="padding:0"></div><div class="card detail" id="mDetail"></div></div>';drawMessages()}
function drawMessages(){
  const q=S.mq.trim().toLowerCase(),M=msgs().sort((a,b)=>b.t-a.t).filter(m=>(S.mf==='all'||(S.mf==='unread'&&!m.read)||(S.mf==='starred'&&m.starred)||(S.mf==='replied'&&m.replied))&&(!q||(m.name+' '+m.email+' '+m.text+' '+(m.topic||'')+' '+(m.note||'')).toLowerCase().includes(q)));
  $$('#view .fchip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.f===S.mf));
  if(!M.find(m=>m.id===S.msel))S.msel=null;
  $('mList').innerHTML=M.length?M.map(m=>'<button class="msg '+(m.read?'':'unread')+(m.id===S.msel?' sel':'')+'" data-act="selmsg" data-id="'+esc(m.id)+'" type="button"><span class="dot"></span><span class="grow"><div><b>'+esc(m.name)+'</b>'+(m.starred?' &#9733;':'')+'</div><div>'+esc(m.topic||'General question')+'</div><div><small>'+esc(String(m.text||'').slice(0,60))+'</small></div></span><small>'+ago(m.t)+'</small></button>').join(''):'<div class="empty">'+(msgs().length?'No messages match.':'No messages yet. Messages sent from the website contact form appear here.')+'</div>';
  const m=M.find(x=>x.id===S.msel),id=m?esc(m.id):'';
  $('mDetail').innerHTML=m?'<h2>'+esc(m.topic||'General question')+'</h2><p class="meta">From <b>'+esc(m.name)+'</b> &lt;'+esc(m.email)+'&gt; &middot; '+fmt(m.t)+(m.edited?' &middot; edited '+fmt(m.edited):'')+(m.replied?' &middot; <span class="chip s-active">Replied</span>':'')+'</p><div class="body">'+esc(m.text)+'</div>'
   +'<div class="note-box"><label for="m-note">Private admin note</label><textarea id="m-note" rows="3" placeholder="Add an internal note about this message">'+esc(m.note||'')+'</textarea><div class="row"><button class="btn ghost sm" data-act="saveNote" data-id="'+id+'" type="button">'+ic('check','sm')+' Save note</button></div></div>'
   +'<div class="row"><a class="btn" data-act="reply" data-id="'+id+'" href="mailto:'+esc(m.email)+'?subject='+encodeURIComponent('Re: '+(m.topic||'Your inquiry to TechPulse'))+'">'+ic('reply','sm')+' Reply by email</a>'
   +'<button class="btn ghost" data-act="editMsg" data-id="'+id+'" type="button">'+ic('edit','sm')+' Edit</button>'
   +'<button class="btn ghost" data-act="star" data-id="'+id+'" type="button">'+ic('star','sm')+(m.starred?' Unstar':' Star')+'</button><button class="btn ghost" data-act="toggleRead" data-id="'+id+'" type="button">Mark unread</button><button class="btn ghost" data-act="replied" data-id="'+id+'" type="button">'+(m.replied?'Mark not replied':'Mark replied')+'</button><button class="btn danger" data-act="delMsg" data-id="'+id+'" type="button">'+ic('trash','sm')+' Delete</button></div>'
   :'<div class="empty">Select a message to read it.</div>'}
function patchMsg(id,fn){const L=msgs(),m=L.find(x=>x.id===id);if(m){fn(m);wr(K.msgs,L)}}

/* ---------- Activity ---------- */
function viewActivity(){
  $('view').innerHTML='<div class="toolbar"><div class="search">'+ic('search')+'<input type="search" placeholder="Search user or detail" aria-label="Search activity" data-bind="aq" data-page="apage" value="'+esc(S.aq)+'"></div>'
  +'<button class="btn ghost" data-act="exportAct" type="button">'+ic('dl','sm')+' Export CSV</button><button class="btn" data-act="addAct" type="button">'+ic('plus','sm')+' Add entry</button><button class="btn danger" data-act="clearAct" type="button">'+ic('trash','sm')+' Clear log</button></div>'
  +'<div class="chips" role="group" aria-label="Filter by type"><button class="fchip" data-act="at" data-f="all" type="button">All</button>'+Object.keys(TYPES).map(t=>'<button class="fchip" data-act="at" data-f="'+t+'" type="button">'+esc(TYPES[t][0])+'</button>').join('')+'</div><div class="card" id="aTable"></div>';drawActivity()}
function filteredAct(){const q=S.aq.trim().toLowerCase();return acts().slice().sort((a,b)=>b.t-a.t).filter(a=>(S.at==='all'||a.type===S.at)&&(!q||(nameOf(a.user)+' '+a.user+' '+a.detail).toLowerCase().includes(q)))}
function drawActivity(){$$('#view .fchip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.f===S.at));
  const L=filteredAct(),size=15,pages=Math.max(1,Math.ceil(L.length/size));S.apage=Math.min(S.apage,pages);const rows=L.slice((S.apage-1)*size,S.apage*size);
  $('aTable').innerHTML=rows.length?'<div class="tbl-wrap"><table><thead><tr><th>Time</th><th>Event</th><th>User</th><th>Details</th><th style="text-align:right">Actions</th></tr></thead><tbody>'+rows.map(a=>'<tr><td style="white-space:nowrap">'+fmt(a.t)+'</td><td>'+chip(a.type)+'</td><td>'+who(a.user)+'</td><td>'+esc(a.detail)+'</td><td><div class="actions"><button class="icon-btn" data-act="editAct" data-id="'+esc(a.id)+'" type="button" title="Edit" aria-label="Edit entry">'+ic('edit','sm')+'</button><button class="icon-btn bad" data-act="delAct" data-id="'+esc(a.id)+'" type="button" title="Delete" aria-label="Delete entry">'+ic('trash','sm')+'</button></div></td></tr>').join('')+'</tbody></table></div>'+pager(L.length,S.apage,size,'apage'):'<div class="empty">No activity recorded yet. Events appear here as people use the website.</div>'}
const actForm=a=>'<div class="field"><label for="x-type">Event type</label><select id="x-type">'+Object.keys(TYPES).map(t=>'<option value="'+t+'"'+(a.type===t?' selected':'')+'>'+esc(TYPES[t][0])+'</option>').join('')+'</select></div>'
  +'<div class="field"><label for="x-user">User (email, Visitor or Admin)</label><input id="x-user" value="'+esc(a.user||'Admin')+'"></div>'
  +'<div class="field"><label for="x-time">Date and time</label><input id="x-time" type="datetime-local" value="'+toLocalInput(a.t||Date.now())+'"></div>'
  +'<div class="field"><label for="x-det">Details</label><input id="x-det" value="'+esc(a.detail||'')+'"></div><p class="error" id="mErr" role="alert"></p>';

/* ---------- Settings ---------- */
function viewSettings(){const ses=adminSess();
  $('view').innerHTML='<div class="set-grid"><div class="card"><h2>Admin profile</h2><div class="field"><label for="p-name">Name</label><input id="p-name" value="'+esc(ses.name||'')+'"></div><div class="field"><label for="p-email">Email</label><input id="p-email" type="email" value="'+esc(ses.email)+'"></div><p class="error" id="pErr" role="alert"></p><button class="btn" data-act="saveProfile" type="button">Save profile</button></div>'
  +'<div class="card"><h2>Change password</h2><div class="field"><label for="c-old">Current password</label><input id="c-old" type="password" autocomplete="current-password"></div><div class="field"><label for="c-new">New password</label><input id="c-new" type="password" autocomplete="new-password" placeholder="At least 8 characters"></div><p class="error" id="cErr" role="alert"></p><button class="btn" data-act="savePwAdmin" type="button">Update password</button></div>'
  +'<div class="card"><h2>Data tools</h2><p>All data lives in this browser. Load sample data to preview the dashboard, or back up and restore everything.</p><div class="row"><button class="btn ghost" data-act="seed" type="button">Load sample data</button><button class="btn ghost" data-act="exportAll" type="button">'+ic('dl','sm')+' Backup (JSON)</button><button class="btn ghost" data-act="restore" type="button">'+ic('ul','sm')+' Restore backup</button></div></div>'
  +'<div class="card"><h2>Danger zone</h2><p>Permanently remove all users, messages and activity. Your admin account is kept.</p><button class="btn danger" data-act="resetAll" type="button">'+ic('trash','sm')+' Delete all data</button></div></div>'}

/* ---------- Sample data ---------- */
const SVC=['Web Development','Mobile App Development','Cloud Integration','UI/UX Design','IT Consulting','Technical Support','Custom Software','E-Commerce Solutions','Cybersecurity','DevOps & Automation','Data Analytics','AI & Chatbots'];
async function seed(){
  const names=['Maria Santos','Juan Dela Cruz','Ana Reyes','Carlos Garcia','Liza Mendoza','Mark Villanueva','Sofia Lim','Paolo Ramos'],h=await hash('Password123'),now=Date.now(),day=864e5,R=n=>Math.floor(Math.random()*n),pick=a=>a[R(a.length)];
  const m=rd(K.users,{}),emails=[];
  names.forEach((n,i)=>{const e=n.toLowerCase().replace(/ /g,'.')+'@gmail.com';emails.push(e);if(!m[e])m[e]={name:n,email:e,hash:h,role:i===6?'staff':'client',status:i===3?'suspended':'active',createdAt:now-R(30)*day-R(day),lastLogin:i===7?null:now-R(6*day)}});
  wr(K.users,m);
  const texts=['Hi, we need a new website for our small business. Can you send a quote?','Looking for a mobile app that works on Android and iOS. What is your timeline?','Our online store is slow. Can you help optimize it?','We want to move our servers to the cloud. Do you offer migration?','Can you redesign our app interface? We need a modern look.','I need help with a bug on my dashboard login.','Do you offer monthly maintenance and support plans?','Please call me about a custom inventory system.'];
  const ms=msgs();texts.forEach((t,i)=>{const e=emails[i];ms.push({id:'demo'+now+i,name:names[i],email:e,topic:pick(SVC),text:t,t:now-R(6*day)-R(day),read:i>3,starred:i===1,replied:i===5,userEmail:e})});wr(K.msgs,ms);
  const A=acts(),kinds=['login','login','login','failed','logout','logout','request','request','request','file','signup'];
  for(let i=0;i<70;i++){const type=pick(kinds);let u=pick(emails),detail;
   if(type==='login')detail='Logged in';else if(type==='failed')detail='Wrong password';else if(type==='logout')detail='Logged out';else if(type==='file')detail='Shared a file';else if(type==='signup')detail='Created an account';else{detail='Requested '+pick(SVC);if(Math.random()<.3)u='Visitor'}
   A.push({id:'d'+now+i,t:now-R(7*day),type,user:u,detail})}
  wr(K.act,A.sort((a,b)=>a.t-b.t).slice(-1000));log('admin','Loaded sample data');toast('Sample data loaded.');render()}

/* ---------- Actions ---------- */
const ACT={
 logout(){const s=adminSess();if(s)log('logout','Logged out',s.email);store.del(K.ses);store.del('tp_session');location.href=SITE_LOGIN},
 menu(){$('side').classList.toggle('open')},
 close(){closeModal()},
 confirmYes(){const f=PENDING;PENDING=null;$('overlay').hidden=true;$('dlg').innerHTML='';if(f)f();refresh(true)},
 page(d){S[d.k]=Math.max(1,S[d.k]+Number(d.d));REDRAW()},
 mf(d){S.mf=d.f;drawMessages()},at(d){S.at=d.f;S.apage=1;drawActivity()},
 seed(){seed()},
 restore(){$('importFile').click()},
 /* users */
 openUser(d){const u=getU(d.e);if(!u)return;const ev=acts().filter(a=>a.user===u.email).slice(-12).reverse(),ms=msgs().filter(m=>m.email===u.email||m.userEmail===u.email);
  openModal('<h2>'+esc(u.name)+'<button class="icon-btn" data-act="close" type="button" aria-label="Close">'+ic('x','sm')+'</button></h2><dl class="kv"><dt>Email</dt><dd>'+esc(u.email)+'</dd><dt>Role</dt><dd>'+esc(u.role||'client')+'</dd><dt>Status</dt><dd>'+esc(u.status||'active')+'</dd><dt>Joined</dt><dd>'+fmtD(u.createdAt)+'</dd><dt>Last login</dt><dd>'+(u.lastLogin?fmt(u.lastLogin):'Never')+'</dd><dt>Messages sent</dt><dd>'+ms.length+'</dd><dt>Events</dt><dd>'+acts().filter(a=>a.user===u.email).length+'</dd></dl>'
  +'<b style="font-size:.9rem">Recent activity</b>'+(ev.length?'<ul class="list">'+ev.map(a=>'<li>'+chip(a.type)+'<div class="grow">'+esc(a.detail)+'</div><small>'+fmt(a.t)+'</small></li>').join('')+'</ul>':'<p style="color:var(--muted)">No activity yet.</p>')+'<div class="foot"><button class="btn ghost" data-act="close" type="button">Close</button><button class="btn" data-act="editUser" data-e="'+esc(u.email)+'" type="button">'+ic('edit','sm')+' Edit user</button></div>')},
 editUser(d){const u=getU(d.e);if(!u)return;openModal('<h2>Edit user</h2>'+userForm(Object.assign({role:'client',status:'active'},u),false)+'<div class="foot"><button class="btn ghost" data-act="close" type="button">Cancel</button><button class="btn" data-act="saveEdit" data-e="'+esc(u.email)+'" type="button" data-primary>Save changes</button></div>')},
 saveEdit(d){const u=getU(d.e);if(!u)return closeModal();const n=$('m-name').value.trim(),e=$('m-email').value.trim().toLowerCase();
  if(n.length<2)return mErr('Enter a name.');if(!emailOk(e))return mErr('Enter a valid email.');if(e!==u.email&&getU(e))return mErr('A user with this email already exists.');
  const old=u.email,was=u.status;u.name=n;u.role=$('m-role').value;u.status=$('m-status').value;
  if(e!==old){const m=rd(K.users,{});delete m[old];u.email=e;m[e]=u;wr(K.users,m);
    wr(K.msgs,msgs().map(x=>{if(x.email===old)x.email=e;if(x.userEmail===old)x.userEmail=e;return x}));
    wr(K.act,acts().map(a=>{if(a.user===old)a.user=e;return a}))}
  else saveUser(u);
  log('admin','Edited user '+u.email+(e!==old?' (was '+old+')':'')+(was!==u.status?' ('+u.status+')':''));toast('User updated.');closeModal()},
 addUser(){openModal('<h2>Add user</h2>'+userForm({role:'client'},true)+'<div class="foot"><button class="btn ghost" data-act="close" type="button">Cancel</button><button class="btn" data-act="saveAdd" type="button" data-primary>Create user</button></div>')},
 async saveAdd(){const n=$('m-name').value.trim(),e=$('m-email').value.trim().toLowerCase(),p=$('m-pw').value;
  if(n.length<2)return mErr('Enter a name.');if(!emailOk(e))return mErr('Enter a valid email.');if(p.length<8)return mErr('Password must be at least 8 characters.');if(getU(e))return mErr('A user with this email already exists.');
  saveUser({name:n,email:e,hash:await hash(p),role:$('m-role').value,status:'active',createdAt:Date.now(),lastLogin:null});log('admin','Created user '+e);toast('User created.');closeModal()},
 toggleStatus(d){const u=getU(d.e);if(!u)return;u.status=u.status==='suspended'?'active':'suspended';saveUser(u);log('admin',(u.status==='suspended'?'Suspended ':'Activated ')+u.email);toast(u.name+' is now '+u.status+'.');REDRAW();badge()},
 resetPw(d){const u=getU(d.e);if(!u)return;openModal('<h2>Reset password</h2><p style="margin:0 0 14px;color:var(--muted)">Set a new password for '+esc(u.name)+'. Share it with them securely.</p><div class="field"><label for="m-pw">New password</label><input id="m-pw" type="text" placeholder="At least 8 characters"></div><p class="error" id="mErr" role="alert"></p><div class="foot"><button class="btn ghost" data-act="close" type="button">Cancel</button><button class="btn" data-act="savePw" data-e="'+esc(u.email)+'" type="button" data-primary>Set password</button></div>')},
 async savePw(d){const p=$('m-pw').value;if(p.length<8)return mErr('Password must be at least 8 characters.');const u=getU(d.e);if(!u)return closeModal();u.hash=await hash(p);saveUser(u);log('admin','Reset password for '+u.email);toast('Password updated.');closeModal()},
 delUser(d){const u=getU(d.e);if(!u)return;confirmBox('Delete user?','This permanently deletes '+u.name+' ('+u.email+'). Their messages and activity history are kept.','Delete user',()=>{const m=rd(K.users,{});delete m[u.email];wr(K.users,m);log('admin','Deleted user '+u.email);toast('User deleted.');REDRAW()})},
 exportUsers(){download('techpulse-users.csv',csv([['Name','Email','Role','Status','Joined','Last login']].concat(filteredUsers().map(u=>[u.name,u.email,u.role,u.status,fmtD(u.createdAt),u.lastLogin?fmt(u.lastLogin):'Never']))),'text/csv')},
 /* messages */
 selmsg(d){S.msel=d.id;patchMsg(d.id,m=>m.read=true);badge();drawMessages()},
 star(d){patchMsg(d.id,m=>m.starred=!m.starred);drawMessages()},
 toggleRead(d){patchMsg(d.id,m=>m.read=false);S.msel=null;badge();drawMessages()},
 replied(d){patchMsg(d.id,m=>m.replied=!m.replied);drawMessages()},
 reply(d){patchMsg(d.id,m=>{m.replied=true;m.read=true});log('admin','Replied to a message');setTimeout(drawMessages,200)},
 saveNote(d){const v=$('m-note').value.trim();patchMsg(d.id,m=>{m.note=v});toast(v?'Note saved.':'Note cleared.');drawMessages()},
 editMsg(d){const m=msgs().find(x=>x.id===d.id);if(!m)return;
  openModal('<h2>Edit message</h2><div class="field"><label for="e-name">Sender name</label><input id="e-name" value="'+esc(m.name)+'"></div><div class="field"><label for="e-email">Sender email</label><input id="e-email" type="email" value="'+esc(m.email)+'"></div><div class="field"><label for="e-topic">Topic</label><select id="e-topic">'+topicOpts(m.topic)+'</select></div><div class="field"><label for="e-text">Message</label><textarea id="e-text" rows="6">'+esc(m.text)+'</textarea></div><p class="error" id="mErr" role="alert"></p><div class="foot"><button class="btn ghost" data-act="close" type="button">Cancel</button><button class="btn" data-act="saveMsg" data-id="'+esc(m.id)+'" type="button" data-primary>Save changes</button></div>')},
 saveMsg(d){const n=$('e-name').value.trim(),e=$('e-email').value.trim(),tp=$('e-topic').value,tx=$('e-text').value.trim();
  if(n.length<2)return mErr('Enter a name.');if(!emailOk(e))return mErr('Enter a valid email.');if(!tx)return mErr('The message cannot be empty.');
  patchMsg(d.id,m=>{m.name=n;m.email=e;m.topic=tp;m.text=tx;m.edited=Date.now()});log('admin','Edited a message from '+n);toast('Message updated.');closeModal()},
 delMsg(d){confirmBox('Delete message?','This message will be permanently deleted.','Delete',()=>{wr(K.msgs,msgs().filter(m=>m.id!==d.id));S.msel=null;badge();toast('Message deleted.');drawMessages()})},
 markAllRead(){const L=msgs();L.forEach(m=>m.read=true);wr(K.msgs,L);badge();drawMessages();toast('All messages marked as read.')},
 /* activity */
 exportAct(){download('techpulse-activity.csv',csv([['Time','Event','User','Name','Details']].concat(filteredAct().map(a=>[new Date(a.t).toISOString(),(TYPES[a.type]||[a.type])[0],a.user,nameOf(a.user),a.detail]))),'text/csv')},
 addAct(){openModal('<h2>Add activity entry</h2>'+actForm({type:'admin',user:'Admin',t:Date.now()})+'<div class="foot"><button class="btn ghost" data-act="close" type="button">Cancel</button><button class="btn" data-act="saveAct" type="button" data-primary>Add entry</button></div>')},
 editAct(d){const a=acts().find(x=>x.id===d.id);if(!a)return;openModal('<h2>Edit activity entry</h2>'+actForm(a)+'<div class="foot"><button class="btn ghost" data-act="close" type="button">Cancel</button><button class="btn" data-act="saveAct" data-id="'+esc(a.id)+'" type="button" data-primary>Save changes</button></div>')},
 saveAct(d){const type=$('x-type').value,user=$('x-user').value.trim()||'Admin',detail=$('x-det').value.trim(),t=new Date($('x-time').value).getTime();
  if(!detail)return mErr('Enter the details.');if(isNaN(t))return mErr('Pick a valid date and time.');
  const L=acts();
  if(d.id){const a=L.find(x=>x.id===d.id);if(a)Object.assign(a,{type,user,detail,t})}else L.push({id:newId(),t,type,user,detail});
  L.sort((a,b)=>a.t-b.t);wr(K.act,L.slice(-1000));toast(d.id?'Entry updated.':'Entry added.');closeModal()},
 delAct(d){confirmBox('Delete entry?','This activity entry will be permanently deleted.','Delete',()=>{wr(K.act,acts().filter(a=>a.id!==d.id));toast('Entry deleted.');drawActivity()})},
 clearAct(){confirmBox('Clear activity log?','All recorded activity will be deleted.','Clear log',()=>{wr(K.act,[]);toast('Activity log cleared.');drawActivity()})},
 /* settings */
 saveProfile(){const n=$('p-name').value.trim(),e=$('p-email').value.trim().toLowerCase();if(n.length<2)return $('pErr').textContent='Enter a name.';if(!emailOk(e))return $('pErr').textContent='Enter a valid email.';
  const old=adminSess().email,m=rd(K.users,{});if(e!==old&&m[e])return $('pErr').textContent='That email is already used by another account.';
  const rec=m[old];if(rec){delete m[old];rec.name=n;rec.email=e;m[e]=rec;wr(K.users,m)}
  wr(K.ses,Object.assign(adminSess(),{name:n,email:e}));const ws=rd('tp_session',null);if(ws)wr('tp_session',Object.assign(ws,{name:n,email:e}));toast('Profile saved.');render()},
 async savePwAdmin(){const o=$('c-old').value,n=$('c-new').value,err=$('cErr');err.textContent='';if(n.length<8)return err.textContent='New password must be at least 8 characters.';
  const m=rd(K.users,{}),rec=m[adminSess().email];if(!rec||rec.hash!==await hash(o))return err.textContent='Current password is incorrect.';
  rec.hash=await hash(n);m[rec.email]=rec;wr(K.users,m);log('admin','Changed admin password');toast('Password updated.');$('c-old').value=$('c-new').value=''},
 exportAll(){download('techpulse-backup.json',JSON.stringify({users:rd(K.users,{}),messages:msgs(),activity:acts()},null,2),'application/json')},
 resetAll(){confirmBox('Delete all data?','This removes every user, message and activity record. This cannot be undone.','Delete everything',()=>{const keep={};Object.values(rd(K.users,{})).forEach(u=>{if(u.role==='admin')keep[u.email]=u});wr(K.users,keep);wr(K.msgs,[]);wr(K.act,[]);toast('All data deleted.');render()})}
};
document.addEventListener('click',e=>{
  const a=e.target.closest&&e.target.closest('a[href^="#/"]');if(a){e.preventDefault();go(a.getAttribute('href').slice(1));return}
  if(e.target===$('overlay')){closeModal();return}
  const b=e.target.closest&&e.target.closest('[data-act]');if(!b)return;const f=ACT[b.dataset.act];if(!f)return;
  if(b.tagName!=='A')e.preventDefault();f(b.dataset,b)});
const bind=e=>{const t=e.target;if(!t.dataset||!t.dataset.bind)return;S[t.dataset.bind]=t.value;if(t.dataset.page)S[t.dataset.page]=1;REDRAW()};
document.addEventListener('input',bind);document.addEventListener('change',bind);
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(!$('overlay').hidden)closeModal();else $('side').classList.remove('open')}
  if(e.key==='Enter'&&!$('overlay').hidden&&e.target.tagName!=='TEXTAREA'&&e.target.tagName!=='BUTTON'){const p=$('dlg').querySelector('[data-primary]');if(p){e.preventDefault();p.click()}}});
$('importFile').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{try{const d=JSON.parse(r.result);if(d.users)wr(K.users,d.users);if(d.messages)wr(K.msgs,d.messages);if(d.activity)wr(K.act,d.activity);toast('Backup restored.');render()}catch(x){toast('That file is not a valid backup.')}e.target.value=''};r.readAsText(f)});

/* ---------- Admin sign in (same accounts as the website) ---------- */
async function ensureAdminUser(){const m=rd(K.users,{});if(m[ADMIN_EMAIL]&&m[ADMIN_EMAIL].role==='admin')return;
  m[ADMIN_EMAIL]=Object.assign({},m[ADMIN_EMAIL]||{},{name:'TechPulse Admin',email:ADMIN_EMAIL,hash:await hash('TechPulse@2026'),role:'admin',status:'active',createdAt:Date.now(),lastLogin:null});wr(K.users,m)}
async function signIn(){
  const em=$('a-email').value.trim().toLowerCase(),pw=$('a-pw').value,err=$('a-err');err.textContent='';
  if(!emailOk(em)||!pw){err.textContent='Enter your email and password.';return}
  await ensureAdminUser();const u=rd(K.users,{})[em];
  if(!u||u.hash!==await hash(pw)){err.textContent='Email or password is incorrect.';return}
  if(u.role!=='admin'){err.textContent='This account does not have admin access.';return}
  wr(K.ses,{email:u.email,name:u.name||'Admin',t:Date.now()});wr('tp_session',{name:u.name||'Admin',email:u.email,role:'admin'});log('admin','Admin signed in',u.email);go('/')}
$('a-go').addEventListener('click',signIn);
$('loginScreen').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();signIn()}});
/* Boot: honour the website login. Admin on the site -> straight in. Anyone else -> back to the website login. */
(async function boot(){
  await ensureAdminUser();
  const web=rd('tp_session',null),u=web&&rd(K.users,{})[web.email];
  if(u&&u.role==='admin'&&u.status!=='suspended'){if(!adminSess()||adminSess().email!==u.email)wr(K.ses,{email:u.email,name:u.name||'Admin',t:Date.now()});}
  else{store.del(K.ses);if(web&&u){location.replace('../user/user.html#/dashboard');return}location.replace(SITE_LOGIN);return}
  render();
})();
