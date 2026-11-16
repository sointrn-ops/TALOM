const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const nav=$('#nav'),toggle=$('.menu-toggle');
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
$$('a',nav||document).forEach(a=>a.addEventListener('click',()=>{nav?.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}));
const search=$('.search-screen'),field=$('#search-field');
function showSearch(v){if(!search)return;search.classList.toggle('open',v);search.setAttribute('aria-hidden',String(!v));document.body.classList.toggle('lock',v);if(v)setTimeout(()=>field?.focus(),80)}
$('.search-open')?.addEventListener('click',()=>showSearch(true));$('.search-close')?.addEventListener('click',()=>showSearch(false));
field?.addEventListener('input',()=>{const q=field.value.toLowerCase().trim();$$('.search-links a').forEach(a=>a.hidden=!!q&&!a.textContent.toLowerCase().includes(q))});
const light=$('.lightbox'),lightImg=$('.lightbox img');
$$('[data-full]').forEach(b=>b.addEventListener('click',()=>{lightImg.src=b.dataset.full;lightImg.alt=$('img',b)?.alt||'Gallery image';light.classList.add('open');light.setAttribute('aria-hidden','false');document.body.classList.add('lock')}));
function closeLight(){light?.classList.remove('open');light?.setAttribute('aria-hidden','true');document.body.classList.remove('lock');if(lightImg)lightImg.src=''}
$('.lightbox-close')?.addEventListener('click',closeLight);light?.addEventListener('click',e=>{if(e.target===light)closeLight()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){showSearch(false);closeLight();nav?.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}});
