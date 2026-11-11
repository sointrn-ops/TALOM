(()=>{"use strict";
const routes={
 "/":{key:"home",title:"TALOM — کافه، نانوایی و رستوران",desc:"تجربه قهوه، نان تازه و میزبانی در TALOM.",eyebrow:"TALOM · CAFÉ / BAKERY / TABLE",heading:"به دنیای تالم<br><em>خوش آمدید.</em>",intro:"قهوه‌ی تازه، نان گرم و میزهایی برای لحظه‌های خوب.",image:"https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=2200&q=88",ids:["home","talomExperiences","home-menu-cta","rep10-intro","events","gallery"]},
 "/cafe-bakery":{key:"cafe",title:"کافه و نانوایی | TALOM",desc:"قهوه، نان تازه، شیرینی و صبحانه در TALOM.",eyebrow:"TALOM / CAFÉ & BAKERY",heading:"از عطر قهوه<br><em>تا نان تازه.</em>",intro:"برای صبحانه‌های آرام، قهوه روزانه و انتخاب‌های شیرین.",image:"https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=2200&q=88",ids:["cafe-bakery","menu"]},
 "/restaurant":{key:"restaurant",title:"رستوران | TALOM",desc:"تجربه غذا و میزبانی در رستوران TALOM.",eyebrow:"TALOM / RESTAURANT",heading:"برای میزهای خوب<br><em>و لحظه‌های ماندگار.</em>",intro:"از انتخاب‌های سبک تا وعده‌های کامل؛ منوی رستوران TALOM.",image:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2200&q=88",ids:["restaurant","menu","reservation"]},
 "/menu":{key:"menu",title:"منو و سفارش آنلاین | TALOM",desc:"منوی نوشیدنی، دسر و خوراکی‌های TALOM.",eyebrow:"TALOM / THE MENU",heading:"انتخابی برای<br><em>هر سلیقه.</em>",intro:"منوی به‌روز تالم را ببینید و انتخابتان را به سبد خرید اضافه کنید.",image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2200&q=88",ids:["menu"]},
 "/events":{key:"events",title:"مراسم و دورهمی‌ها | TALOM",desc:"درخواست میزبانی و برگزاری دورهمی در TALOM.",eyebrow:"TALOM / PRIVATE GATHERINGS",heading:"برای باهم‌بودن<br><em>بهانه‌ای بسازیم.</em>",intro:"برای دورهمی‌ها و مناسبت‌های ویژه، جزئیات برنامه‌تان را با ما در میان بگذارید.",image:"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2200&q=88",ids:["events","event-request"]},
 "/about":{key:"about",title:"داستان TALOM | درباره ما",desc:"با داستان، ارزش‌ها و تیم TALOM آشنا شوید.",eyebrow:"TALOM / OUR STORY",heading:"داستان ما<br><em>از یک میز شروع می‌شود.</em>",intro:"قهوه فقط آغاز ماجراست؛ اصل، تجربه‌ای است که کنار هم می‌سازیم.",image:"https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2200&q=88",ids:["our-story","services","talom-team","faq"]},
 "/reservation":{key:"reservation",title:"رزرو میز | TALOM",desc:"درخواست رزرو میز در کافه و رستوران TALOM.",eyebrow:"TALOM / RESERVATIONS",heading:"میزتان را<br><em>هماهنگ کنیم.</em>",intro:"درخواست رزرو را ارسال کنید؛ همکاران ما برای تأیید با شما تماس می‌گیرند.",image:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2200&q=88",ids:["reservation"]},
 "/contact":{key:"contact",title:"تماس با TALOM",desc:"راه‌های ارتباطی و ارسال پیام به TALOM.",eyebrow:"TALOM / CONTACT",heading:"در ارتباط<br><em>بمانیم.</em>",intro:"برای پرسش، پیشنهاد یا همکاری از راه‌های ارتباطی زیر با ما تماس بگیرید.",image:"https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=2200&q=88",ids:["contact","contact-request"]}
};
const path=location.pathname.endsWith("/")?location.pathname.slice(0,-1)||"/":location.pathname;
const route=routes[path]||routes["/"];
const main=document.querySelector("main");
if(!main)return;
const signature=main.querySelector(".signature-banner");if(signature&&!signature.id)signature.id="signature-banner";
const visible=new Set(route.ids);
[...main.children].forEach(el=>{el.hidden=!visible.has(el.id);});
if(route.key!=="home"){
 const mast=document.createElement("section");mast.className="talom-page-masthead talom-page-"+route.key;
 mast.style.setProperty("--page-image",'url("'+route.image+'")');
 mast.innerHTML='<div class="talom-page-masthead-inner"><span>'+route.eyebrow+'</span><h1>'+route.heading+'</h1><p>'+route.intro+'</p><div class="talom-page-index">TALOM · '+String(Object.keys(routes).indexOf(path)).padStart(2,"0")+' / 07</div></div>';
 if(route.key==="menu"){mast.classList.add("talom-page-menu-hero");mast.innerHTML='<div class="talom-page-masthead-inner"><span>'+route.eyebrow+'</span><h1>'+route.heading+'</h1><p>'+route.intro+'</p><a class="talom-page-action" href="#categoryTabs">رفتن به دسته‌بندی‌ها ↓</a></div>';}
 if(route.key==="reservation"){mast.classList.add("talom-page-reservation-hero");mast.innerHTML='<div class="talom-page-masthead-inner"><span>'+route.eyebrow+'</span><h1>'+route.heading+'</h1><p>'+route.intro+'</p><div class="talom-reservation-note">درخواست شما پس از بررسی ظرفیت تأیید می‌شود.</div></div>';}
 if(route.key==="events"){mast.classList.add("talom-page-events-hero");mast.innerHTML='<div class="talom-page-masthead-inner"><span>'+route.eyebrow+'</span><h1>'+route.heading+'</h1><p>'+route.intro+'</p><a class="talom-page-action" href="/events#event-request">ثبت درخواست مراسم ↗</a></div>';}

 main.prepend(mast);
}
document.title=route.title;
const description=document.querySelector('meta[name="description"]');if(description)description.content=route.desc;
let canonical=document.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement("link");canonical.rel="canonical";document.head.append(canonical)}canonical.href=location.origin+(path==="/"?"":path);
const paths={"/":"خانه","/cafe-bakery":"کافه و نانوایی","/restaurant":"رستوران","/menu":"منو","/events":"مراسم","/about":"داستان تالم","/reservation":"رزرو","/contact":"تماس"};
const nav=document.querySelector("#mainNav");if(nav)nav.innerHTML=Object.entries(paths).filter(([p])=>p!=="/").map(([p,l])=>'<a href="'+p+'"'+(p===path?' aria-current="page"':'')+'>'+l+'</a>').join("");
const overlay=document.querySelector("#talomRepubliqueOverlay nav");if(overlay)overlay.innerHTML=Object.entries(paths).map(([p,l])=>'<a href="'+p+'"'+(p===path?' aria-current="page"':'')+'>'+l+'</a>').join("");
const brand=document.querySelector("#siteHeader .brand");if(brand)brand.href="/";
const cta=document.querySelector("#siteHeader .header-cta");if(cta){cta.href="/reservation";cta.innerHTML='<span>رزرو میز</span><span class="cta-arrow">↗</span>';}
const footer=document.querySelector(".site-footer");if(footer){let f=footer.querySelector(".talom-pages-footer-nav");if(!f){f=document.createElement("nav");f.className="talom-pages-footer-nav";footer.append(f)}f.innerHTML=Object.entries(paths).map(([p,l])=>'<a href="'+p+'">'+l+'</a>').join("");}
const sectionRoute={"home":"/","menu":"/menu","cafe-bakery":"/cafe-bakery","restaurant":"/restaurant","events":"/events","event-request":"/events","reservation":"/reservation","our-story":"/about","talom-team":"/about","services":"/about","faq":"/about","newsletter":"/about","gallery":"/","contact":"/contact","contact-request":"/contact","signature-banner":"/"};
document.querySelectorAll('a[href^="#"]').forEach(a=>{const id=a.getAttribute("href").slice(1);const dest=sectionRoute[id];if(!dest)return;if(dest===path)a.href="#"+id;else a.href=dest+(id?("#"+id):"");});
document.documentElement.dataset.page=route.key;
document.body.dataset.page=route.key;
})();