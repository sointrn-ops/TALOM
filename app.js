const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const nav=$('#nav, #site-nav');
const toggle=$('.menu-toggle');
toggle?.addEventListener('click',()=>{
  const open=nav?.classList.toggle('open') ?? false;
  toggle.setAttribute('aria-expanded',String(open));
});
$$('a',nav||document).forEach(a=>a.addEventListener('click',()=>{
  nav?.classList.remove('open');
  toggle?.setAttribute('aria-expanded','false');
}));

const search=$('.search-screen, .search-panel');
const field=$('#search-field, #site-search');
const searchLinks=$$('.search-links a, .search-results a');
function showSearch(open){
  if(!search)return;
  search.classList.toggle('open',open);
  search.setAttribute('aria-hidden',String(!open));
  document.body.classList.toggle('lock',open);
  if(open)field?.focus();
}
$('.search-open, .search-trigger')?.addEventListener('click',()=>showSearch(true));
$('.search-close')?.addEventListener('click',()=>showSearch(false));
field?.addEventListener('input',()=>{
  const q=field.value.toLowerCase().trim();
  searchLinks.forEach(a=>a.hidden=!!q&&!a.textContent.toLowerCase().includes(q));
});

const light=$('.lightbox'),lightImg=$('.lightbox img');
$$('[data-full]').forEach(b=>b.addEventListener('click',()=>{
  if(!light||!lightImg)return;
  lightImg.src=b.dataset.full;
  lightImg.alt=$('img',b)?.alt||'Gallery image';
  light.classList.add('open');
  light.setAttribute('aria-hidden','false');
  document.body.classList.add('lock');
}));
function closeLight(){
  light?.classList.remove('open');
  light?.setAttribute('aria-hidden','true');
  document.body.classList.remove('lock');
  if(lightImg)lightImg.src='';
}
$('.lightbox-close')?.addEventListener('click',closeLight);
light?.addEventListener('click',e=>{if(e.target===light)closeLight()});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    showSearch(false);closeLight();nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded','false');
  }
});
