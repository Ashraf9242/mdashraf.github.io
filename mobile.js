(()=>{
 const button=document.querySelector('.menu-toggle'),nav=document.querySelector('#site-navigation'),small=matchMedia('(max-width:650px)');
 function setOpen(open,focus=false){button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');button.querySelector('span').textContent=open?'×':'☰';document.body.classList.toggle('menu-open',open);if(focus)button.focus()}
 button.addEventListener('click',()=>setOpen(button.getAttribute('aria-expanded')!=='true'));
 nav.addEventListener('click',e=>{if(e.target.closest('a'))setOpen(false)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('menu-open'))setOpen(false,true)});
 document.addEventListener('click',e=>{if(!e.target.closest('header')&&document.body.classList.contains('menu-open'))setOpen(false)});
 document.addEventListener('focusin',e=>{if(!e.target.closest('header')&&document.body.classList.contains('menu-open'))setOpen(false)});
 small.addEventListener('change',()=>setOpen(false));
})();
