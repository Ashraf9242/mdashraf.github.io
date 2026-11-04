(()=>{
 const root=document.documentElement;
 function apply(theme){root.dataset.theme=theme;root.style.colorScheme=theme;const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=theme==='light'?'#f4f5ed':'#10110e';const button=document.querySelector('#theme-toggle');if(button){button.setAttribute('aria-label',theme==='light'?'Switch to dark mode':'Switch to light mode');button.querySelector('.theme-icon').textContent=theme==='light'?'☾':'☀';button.querySelector('.theme-label').textContent=theme==='light'?'Dark':'Light'}document.dispatchEvent(new Event('themechange'))}
 let stored;try{stored=localStorage.getItem('ashraf-theme')}catch{}apply(stored==='light'?'light':'dark');
 document.addEventListener('DOMContentLoaded',()=>{apply(root.dataset.theme);document.querySelector('#theme-toggle').addEventListener('click',()=>{const theme=root.dataset.theme==='light'?'dark':'light';apply(theme);try{localStorage.setItem('ashraf-theme',theme)}catch{}})});
})();
