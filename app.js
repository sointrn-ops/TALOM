const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const toggle=$('.menu-toggle'),nav=$('.main-nav');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));});$$('a',nav).forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false')}));}
const searchPanel=$('.search-panel'),searchTrigger=$('.search-trigger'),searchClose=$('.search-close'),searchInput=$('#site-search');
function setSearch(open){if(!searchPanel)return;searchPanel.classList.toggle('is-open',open);searchPanel.setAttribute('aria-hidden',String(!open));document.body.classList.toggle('panel-open',open);if(open)setTimeout(()=>searchInput?.focus(),80);}
searchTrigger?.addEventListener('click',()=>setSearch(true));searchClose?.addEventListener('click',()=>setSearch(false));
searchInput?.addEventListener('input',()=>{const q=searchInput.value.trim().toLowerCase();$$('.search-results a').forEach(a=>a.hidden=q&&!a.textContent.toLowerCase().includes(q));});
const lightbox=$('.lightbox'),lightboxImage=$('.lightbox img');
$$('.gallery-item').forEach(item=>item.addEventListener('click',()=>{lightboxImage.src=item.dataset.full;lightboxImage.alt=$('img',item)?.alt||'Gallery image';lightbox.classList.add('is-open');lightbox.setAttribute('aria-hidden','false');document.body.classList.add('panel-open');}));
function closeLightbox(){lightbox?.classList.remove('is-open');lightbox?.setAttribute('aria-hidden','true');document.body.classList.remove('panel-open');if(lightboxImage)lightboxImage.src='';}
$('.lightbox-close')?.addEventListener('click',closeLightbox);lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){setSearch(false);closeLightbox();nav?.classList.remove('is-open');toggle?.setAttribute('aria-expanded','false');}});
