const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const drawer=$('.site-drawer'),backdrop=$('.drawer-backdrop'),menuToggle=$('.menu-toggle');
function setDrawer(open){
 if(!drawer||!backdrop)return;
 drawer.classList.toggle('open',open);backdrop.classList.toggle('open',open);
 drawer.setAttribute('aria-hidden',String(!open));
 menuToggle?.setAttribute('aria-expanded',String(open));
 document.body.classList.toggle('lock',open);
 if(open) $('.drawer-close')?.focus();
}
menuToggle?.addEventListener('click',()=>setDrawer(!drawer?.classList.contains('open')));
$('.drawer-close')?.addEventListener('click',()=>setDrawer(false));
backdrop?.addEventListener('click',()=>setDrawer(false));
$$('.drawer-links a,.drawer-actions a').forEach(a=>a.addEventListener('click',()=>setDrawer(false)));
const search=$('.search-panel'),searchField=$('#site-search');
function setSearch(open){
 if(!search)return;
 search.classList.toggle('open',open);search.setAttribute('aria-hidden',String(!open));
 document.body.classList.toggle('lock',open);if(open)searchField?.focus();
}
$('.search-trigger')?.addEventListener('click',()=>setSearch(true));
$('.search-close')?.addEventListener('click',()=>setSearch(false));
searchField?.addEventListener('input',()=>{
 const q=searchField.value.trim().toLocaleLowerCase('fa');
 $$('.search-results a').forEach(a=>a.hidden=Boolean(q)&&!a.textContent.toLocaleLowerCase('fa').includes(q));
});
const lightbox=$('.lightbox'),lightboxImage=$('.lightbox img');
$$('[data-full]').forEach(button=>button.addEventListener('click',()=>{
 if(!lightbox||!lightboxImage)return;
 lightboxImage.src=button.dataset.full;lightboxImage.alt=$('img',button)?.alt||'تصویر گالری';
 lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');
 document.body.classList.add('lock');$('.lightbox-close')?.focus();
}));
function closeLightbox(){
 lightbox?.classList.remove('open');lightbox?.setAttribute('aria-hidden','true');
 if(lightboxImage)lightboxImage.src='';
 document.body.classList.remove('lock');
}
$('.lightbox-close')?.addEventListener('click',closeLightbox);
lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){setDrawer(false);setSearch(false);closeLightbox()}
});
