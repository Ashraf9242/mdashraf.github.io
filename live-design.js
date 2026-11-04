// A visual performance of a nine-agent design team. No remote agents are connected.
(()=>{
 const motion=matchMedia('(prefers-reduced-motion: reduce)');if(motion.matches)return;
 const layer=document.createElement('div');layer.className='agent-crew';layer.setAttribute('aria-hidden','true');document.body.append(layer);
 const roles=['COPY','LAYOUT','MOTION','STYLE','SYSTEMS','COLOR','TYPE','DETAIL','REVIEW'];
 const colors=['#cdf578','#83bcff','#ff8fae','#c3a0ff','#ffcf79','#70dfd4','#f4a07a','#d7edff','#dd9cfc'];
 const candidates=[...document.querySelectorAll('h1,.section-heading h2,.project-info h3,.about-copy h2,.intro,.project-info>p,.about-copy>p:not(.eyebrow),.repo-card h3,.repo-card>p,.pill,.orb-tag,.core,.device,.tags,.repo-visual,.skill-row,.portrait-wrap,.repo-card-bottom,.eyebrow,.section-label,.hero-bottom')];
 const textStates=new Map(),locks=new Map();
 document.querySelectorAll('h1,.section-heading h2,.project-info h3,.about-copy h2,.repo-card h3,.intro').forEach(el=>{
  const label=el.cloneNode(true);label.querySelectorAll('br').forEach(br=>br.replaceWith(' '));el.setAttribute('aria-label',label.textContent);
  const ghost=document.createElement('span');ghost.className='design-ghost';ghost.innerHTML=el.innerHTML;ghost.setAttribute('aria-hidden','true');
  const live=document.createElement('span');live.className='design-live';live.innerHTML=el.innerHTML;live.setAttribute('aria-hidden','true');el.classList.add('design-text');el.replaceChildren(ghost,live);
  const walker=document.createTreeWalker(live,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push({node:walker.currentNode,text:walker.currentNode.textContent});
  textStates.set(el,{el,live,nodes,total:nodes.reduce((n,p)=>n+p.text.length,0),done:false});
 });
 function fill(s,n){for(const part of s.nodes){part.node.textContent=part.text.slice(0,Math.max(0,n));n-=part.text.length}}
 const agents=roles.map((role,i)=>{
  const root=document.createElement('div');root.className='crew-agent';root.style.setProperty('--design-color',colors[i]);root.innerHTML=`<div class="design-frame"><i></i><i></i><i></i><i></i><span>${role} / SELECT</span></div><div class="design-pointer"><svg viewBox="0 0 24 28" width="20" height="25"><path d="M2 2L21 15L12 17L8 25Z" fill="currentColor" stroke="#10110e" stroke-width="1.5" stroke-linejoin="round"/></svg><span>AI ${String(i+1).padStart(2,'0')} · ${role.toLowerCase()}</span></div><div class="design-caret"></div>`;layer.append(root);
  return {root,frame:root.querySelector('.design-frame'),pointer:root.querySelector('.design-pointer'),caret:root.querySelector('.design-caret'),label:root.querySelector('.design-frame>span'),role,i,x:innerWidth*(.12+Math.random()*.76),y:innerHeight*(.15+Math.random()*.7),next:0,target:null,mode:'travel',count:-1};
 });
 const badge=document.createElement('div');badge.className='crew-badge';badge.innerHTML='<span class="crew-pulse"></span><b>9 AGENTS</b><span>LIVE DESIGN SIMULATION</span><button type="button" aria-label="Pause design animation">Ⅱ</button>';document.body.append(badge);
 let raf=0,last=0,paused=false;
 const lightColors=['#50752a','#3976aa','#a64667','#7551a8','#96651e','#2d7d72','#ab5b34','#4d7088','#884fa0'];
 function updateCrewColors(){agents.forEach((a,i)=>a.root.style.setProperty('--design-color',document.documentElement.dataset.theme==='light'?lightColors[i]:colors[i]))}document.addEventListener('themechange',updateCrewColors);updateCrewColors();
 function release(a){if(a.target){const s=textStates.get(a.target);if(a.mode==='write'&&s){fill(s,s.total);s.done=true}a.target.classList.remove('agent-tuning','agent-colored');a.target.style.removeProperty('--agent-tint');locks.delete(a.target)}a.target=null;a.frame.style.opacity='0';a.caret.style.opacity='0'}
 function choose(a,time,visible){release(a);const available=visible.filter(t=>!locks.has(t.el));
  const unwritten=available.filter(t=>{const s=textStates.get(t.el);return s&&!s.done});
  const pool=unwritten.length&&(a.i%3===0)?unwritten:available;
  if(pool.length){const item=pool[Math.floor(Math.random()*pool.length)];a.target=item.el;locks.set(a.target,a);const s=textStates.get(a.target);a.mode=s&&!s.done?'write':['layout','style','review'][a.i%3];if(a.target.matches('a,button'))a.mode='layout';a.start=time;a.duration=a.mode==='write'?Math.min(3300,Math.max(1600,s.total*42)):1600+Math.random()*2300;a.count=-1;a.label.textContent=a.role+' / '+(a.mode==='write'?'WRITING':a.mode==='style'?'REFINING':a.mode==='layout'?'ALIGNING':'REVIEWING');if(a.mode==='write')fill(s,0)}
  else{a.mode='travel';a.tx=20+Math.random()*Math.max(20,innerWidth-100);a.ty=80+Math.random()*Math.max(50,innerHeight-170);a.next=time+900+Math.random()*1300}
 }
 function tick(time){raf=0;if(paused||document.hidden||motion.matches)return;const dt=Math.min(time-(last||time-16),40);last=time;const modal=document.querySelector('#detail').open;layer.style.opacity=modal?'0':'1';
  if(modal){agents.forEach(release);raf=requestAnimationFrame(tick);return}
  const visible=candidates.map(el=>({el,r:el.getBoundingClientRect()})).filter(t=>t.r.width>25&&t.r.height>8&&t.r.top>45&&t.r.bottom<innerHeight-35);
  const bounds=new Map(visible.map(t=>[t.el,t.r]));
  agents.forEach(a=>{
   if(a.target&&!bounds.has(a.target)){release(a);a.next=time+Math.random()*350}
   if(!a.target&&time>=a.next)choose(a,time,visible);
   let tx=a.tx||innerWidth*.5,ty=a.ty||innerHeight*.5;
   if(a.target){const r=bounds.get(a.target);if(!r){release(a);return}const elapsed=time-a.start,progress=Math.max(0,Math.min(1,(elapsed-450)/a.duration));
    a.frame.style.transform=`translate3d(${r.left}px,${r.top}px,0)`;a.frame.style.width=r.width+'px';a.frame.style.height=r.height+'px';a.frame.style.opacity=elapsed>300?'.65':'0';
    if(a.mode==='write'){const s=textStates.get(a.target),count=Math.floor(progress*s.total);if(count!==a.count){fill(s,count);a.count=count}let tip={x:r.left+5,y:r.top+5,h:Math.min(35,r.height)};const written=s.nodes.filter(p=>p.node.textContent.length);if(written.length){const n=written[written.length-1].node,range=document.createRange(),len=n.textContent.length;range.setStart(n,Math.max(0,len-1));range.setEnd(n,len);const rr=range.getBoundingClientRect();if(rr.height)tip={x:rr.right,y:rr.top,h:rr.height}}tx=tip.x+12;ty=tip.y+tip.h*.65;a.caret.style.transform=`translate3d(${tip.x+1}px,${tip.y}px,0)`;a.caret.style.height=tip.h+'px';a.caret.style.opacity=elapsed>450&&progress<1?'1':'0'}
    else{const phase=elapsed/1200;tx=r.left+r.width*(.15+.7*(.5+.5*Math.sin(phase+a.i)));ty=r.top+r.height*(.2+.6*(.5+.5*Math.cos(phase*.8+a.i)));if(elapsed>450&&elapsed<2200){a.target.style.setProperty('--agent-tint',colors[a.i]);a.target.classList.add(a.mode==='style'?'agent-colored':'agent-tuning')}}
    if(elapsed>a.duration+1050){release(a);a.next=time+150+Math.random()*650;a.tx=tx;a.ty=ty}
   }
   const ease=1-Math.exp(-dt/(100+a.i*9));a.x+=(tx-a.x)*ease;a.y+=(ty-a.y)*ease;a.pointer.style.transform=`translate3d(${Math.max(4,Math.min(innerWidth-26,a.x))}px,${Math.max(4,Math.min(innerHeight-28,a.y))}px,0)`;
  });raf=requestAnimationFrame(tick);
 }
 function start(){if(!raf&&!paused&&!document.hidden&&!motion.matches){last=0;raf=requestAnimationFrame(tick)}}
 badge.querySelector('button').onclick=()=>{paused=!paused;badge.classList.toggle('is-paused',paused);badge.querySelector('button').textContent=paused?'▶':'Ⅱ';badge.querySelector('button').setAttribute('aria-label',paused?'Resume design animation':'Pause design animation');if(paused){cancelAnimationFrame(raf);raf=0;agents.forEach(release);layer.style.opacity='0'}else{layer.style.opacity='1';start()}};
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;agents.forEach(release)}else start()});
 motion.addEventListener('change',()=>{if(motion.matches){cancelAnimationFrame(raf);raf=0;agents.forEach(release);textStates.forEach(s=>fill(s,s.total));layer.style.display='none';badge.hidden=true}else{layer.style.display='';badge.hidden=false;start()}});start();
})();
