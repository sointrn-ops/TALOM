const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const drawer=$('.site-drawer'),backdrop=$('.drawer-backdrop'),menuToggle=$('.menu-toggle'),legacyNav=$('.main-nav');
function setDrawer(open){
 if(drawer&&backdrop){
  drawer.classList.toggle('open',open);backdrop.classList.toggle('open',open);
  drawer.setAttribute('aria-hidden',String(!open));menuToggle?.setAttribute('aria-expanded',String(open));
  document.body.classList.toggle('lock',open);if(open) $('.drawer-close')?.focus();
 }else if(legacyNav){
  legacyNav.classList.toggle('mobile-open',open);menuToggle?.setAttribute('aria-expanded',String(open));
 }
}
menuToggle?.addEventListener('click',()=>setDrawer(!(drawer?drawer.classList.contains('open'):legacyNav?.classList.contains('mobile-open'))));
$('.drawer-close')?.addEventListener('click',()=>setDrawer(false));backdrop?.addEventListener('click',()=>setDrawer(false));
$$('.drawer-links a,.drawer-actions a,.main-nav a').forEach(a=>a.addEventListener('click',()=>setDrawer(false)));
const search=$('.search-panel')||$('.search-screen'),searchField=$('#site-search')||$('#search-field');
function setSearch(open){
 if(!search)return;search.classList.toggle('open',open);search.setAttribute('aria-hidden',String(!open));
 document.body.classList.toggle('lock',open);if(open)searchField?.focus();
}
$('.search-trigger')?.addEventListener('click',()=>setSearch(true));$('.search-open')?.addEventListener('click',()=>setSearch(true));
$('.search-close')?.addEventListener('click',()=>setSearch(false));
searchField?.addEventListener('input',()=>{
 const q=searchField.value.trim().toLocaleLowerCase('fa');
 $$('.search-results a,.search-links a').forEach(a=>a.hidden=Boolean(q)&&!a.textContent.toLocaleLowerCase('fa').includes(q));
});
const lightbox=$('.lightbox'),lightboxImage=$('.lightbox img');
$$('[data-full]').forEach(b=>b.addEventListener('click',()=>{
 if(!lightbox||!lightboxImage)return;lightboxImage.src=b.dataset.full;
 lightboxImage.alt=$('img',b)?.alt||'تصویر گالری';lightbox.classList.add('open');
 lightbox.setAttribute('aria-hidden','false');document.body.classList.add('lock');$('.lightbox-close')?.focus();
}));
function closeLightbox(){lightbox?.classList.remove('open');lightbox?.setAttribute('aria-hidden','true');if(lightboxImage)lightboxImage.src='';document.body.classList.remove('lock')}
$('.lightbox-close')?.addEventListener('click',closeLightbox);
lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){setDrawer(false);setSearch(false);closeLightbox()}});
