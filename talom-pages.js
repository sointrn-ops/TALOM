(()=>{"use strict";
const routes={
 "/":{key:"home",title:"TALOM — کافه، نانوایی و رستوران",desc:"قهوه تازه، نان گرم، صبحانه و تجربه میزبانی در TALOM.",ids:["home","talomExperiences","home-menu-cta","rep10-intro","signature-banner","events","gallery"],nav:"خانه"},
 "/cafe-bakery":{key:"cafe",title:"کافه و نانوایی | TALOM",desc:"قهوه، نان تازه، شیرینی و صبحانه در TALOM.",eyebrow:"TALOM / CAFÉ & BAKERY",heading:"صبح را با عطر<br><em>قهوه و نان تازه شروع کن.</em>",intro:"قهوه‌های روزانه، شیرینی تازه و انتخاب‌هایی برای صبحانه و برانچ.",image:"https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1800&q=88",kind:"split",cta:[["#menu","دیدن منوی کافه"],["#cafe-bakery","درباره کافه"]],ids:["cafe-bakery","menu"],nav:"کافه و نانوایی"},
 "/restaurant":{key:"restaurant",title:"رستوران | TALOM",desc:"منوی غذا و تجربه رستوران TALOM.",eyebrow:"TALOM / THE RESTAURANT",heading:"برای ناهار و شام،<br><em>میز را آماده کرده‌ایم.</em>",intro:"از انتخاب‌های سبک تا غذای اصلی؛ منوی رستوران و امکان درخواست رزرو.",image:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2200&q=88",kind:"full",cta:[["#menu","مشاهده منوی رستوران"],["#reservation","درخواست رزرو"]],ids:["restaurant","menu","reservation"],nav:"رستوران"},
 "/menu":{key:"menu",title:"منوی TALOM | سفارش آنلاین",desc:"مشاهده محصولات، فیلتر دسته‌ها و افزودن انتخاب‌ها به سبد خرید.",eyebrow:"TALOM / THE MENU",heading:"منوی تالم،<br><em>انتخاب تو.</em>",intro:"دسته موردنظرت را انتخاب کن، محصولات را جست‌وجو کن و به سبد خرید اضافه کن.",image:"",kind:"minimal",cta:[["#categoryTabs","رفتن به دسته‌بندی‌ها"]],ids:["menu"],nav:"منو"},
 "/events":{key:"events",title:"مراسم و دورهمی‌ها | TALOM",desc:"درخواست میزبانی مراسم خصوصی و کترینگ در TALOM.",eyebrow:"TALOM / PRIVATE GATHERINGS",heading:"برای دورهمی‌ها،<br><em>یک میز متفاوت.</em>",intro:"برای جشن‌های کوچک، دورهمی‌های دوستانه و پذیرایی رویدادها با ما هماهنگ کن.",image:"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2200&q=88",kind:"event",cta:[["#event-request","ثبت درخواست مراسم"]],ids:["events","event-request","gift-request","career-request","contact-request"],nav:"مراسم"},
 "/about":{key:"about",title:"داستان TALOM | درباره ما",desc:"داستان، خدمات و تیم کافه و رستوران TALOM.",eyebrow:"TALOM / OUR STORY",heading:"تالم؛<br><em>فراتر از یک فنجان قهوه.</em>",intro:"جایی برای مکث، معاشرت و ساختن لحظه‌هایی که ارزش به‌خاطر سپردن دارند.",image:"https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2000&q=88",kind:"about",cta:[["#our-story","خواندن داستان ما"]],ids:["our-story","services","talom-team","faq","newsletter"],nav:"داستان تالم"},
 "/reservation":{key:"reservation",title:"رزرو میز | TALOM",desc:"ارسال درخواست رزرو میز در TALOM.",eyebrow:"TALOM / RESERVATIONS",heading:"میزت را<br><em>از قبل هماهنگ کن.</em>",intro:"زمان و تعداد مهمان‌ها را مشخص کن. تیم تالم برای تأیید نهایی با تو تماس می‌گیرد.",image:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=88",kind:"booking",cta:[["#reservation","تکمیل فرم رزرو"]],ids:["reservation"],nav:"رزرو"},
 "/contact":{key:"contact",title:"تماس با TALOM",desc:"راه‌های ارتباطی و ارسال پیام به TALOM.",eyebrow:"TALOM / SAY HELLO",heading:"راه ارتباط<br><em>همیشه باز است.</em>",intro:"برای پرسش، پیشنهاد یا همکاری، از راه‌های زیر با ما در ارتباط باش.",image:"https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1800&q=88",kind:"contact",cta:[["#contact-request","ارسال پیام"]],ids:["contact","contact-request"],nav:"تماس"}
};
const path=location.pathname.endsWith("/")?location.pathname.slice(0,-1)||"/":location.pathname;
const route=routes[path]||routes["/"];
const main=document.querySelector("main");
if(!main)return;
document.body.dataset.page=route.key;
document.documentElement.dataset.page=route.key;
document.title=route.title;
const description=document.querySelector('meta[name="description"]');if(description)description.content=route.desc;
let canonical=document.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement("link");canonical.rel="canonical";document.head.append(canonical)}canonical.href=location.origin+(path==="/"?"/":path);
const pageIds=new Set(route.ids);
[...main.children].forEach(el=>{if(el.id)el.hidden=!pageIds.has(el.id);else el.hidden=route.key!=="home";});
const existing=main.querySelector(":scope > .talom-route-hero");if(existing)existing.remove();
const showcase=main.querySelector(":scope > .talom-route-showcase");if(showcase)showcase.remove();
function actionLinks(items){return items.map(([href,label])=>'<a href="'+href+'">'+label+' <span>↗</span></a>').join("");}
function heroMarkup(){
 const image=route.image?'<div class="talom-route-hero-image" style="background-image:url(&quot;'+route.image+'&quot;)"></div>':"";
 return '<section class="talom-route-hero talom-hero-'+route.kind+'">'+
 '<div class="talom-route-hero-copy"><span class="talom-route-eyebrow">'+route.eyebrow+'</span><h1>'+route.heading+'</h1><p>'+route.intro+'</p><div class="talom-route-actions">'+actionLinks(route.cta||[])+'</div><span class="talom-route-index">TALOM / '+String(Object.keys(routes).indexOf(path)).padStart(2,"0")+' — 07</span></div>'+image+'</section>';
}
function showcaseMarkup(){
 const blocks={
 cafe:'<section class="talom-route-showcase talom-cafe-showcase"><a href="#menu" data-menu-filter="bakery"><span>01 / BAKERY</span><strong>نان و شیرینی تازه</strong><b>دیدن انتخاب‌ها ↗</b></a><a href="#menu" data-menu-filter="breakfast"><span>02 / BRUNCH</span><strong>صبحانه و برانچ</strong><b>شروع روز ↗</b></a><a href="#menu" data-menu-filter="coffee"><span>03 / COFFEE</span><strong>قهوه‌های روزانه</strong><b>منوی قهوه ↗</b></a></section>',
 restaurant:'<section class="talom-route-showcase talom-restaurant-showcase"><div><span>THE TALOM TABLE</span><h2>از پیش‌غذا تا<br><em>غذای اصلی.</em></h2><p>دسته‌بندی موردنظرت را انتخاب کن و محصولات موجود را در منو ببین.</p></div><div class="talom-menu-shortcuts"><a href="#menu" data-menu-filter="appetizer">پیش‌غذا ↗</a><a href="#menu" data-menu-filter="main">غذای اصلی ↗</a><a href="#menu" data-menu-filter="pasta">پاستا ↗</a><a href="#menu" data-menu-filter="restaurant">همه غذاها ↗</a></div></section>',
 menu:'<section class="talom-route-showcase talom-menu-showcase"><span>EXPLORE BY CATEGORY</span><a href="#menu" data-menu-filter="coffee">قهوه گرم</a><a href="#menu" data-menu-filter="cold">نوشیدنی سرد</a><a href="#menu" data-menu-filter="dessert">دسر</a><a href="#menu" data-menu-filter="food">خوراکی</a></section>',
 events:'<section class="talom-route-showcase talom-event-showcase"><article><span>01 / PRIVATE GATHERINGS</span><h2>مراسم خصوصی</h2><p>برای دورهمی‌ها و مناسبت‌های ویژه، جزئیات برنامه‌ات را ارسال کن.</p><a href="#event-request">درخواست میزبانی ↗</a></article><article><span>02 / CATERING</span><h2>پذیرایی و کترینگ</h2><p>برای جلسه‌ها و رویدادها، نوع پذیرایی و تعداد مهمان‌ها را اعلام کن.</p><a href="#event-request">درخواست کترینگ ↗</a></article></section>',
 about:'<section class="talom-route-showcase talom-about-showcase"><div><span>OUR VALUES</span><strong>میزبانی باحوصله</strong><p>توجه به جزئیات و احترام به زمان مهمان.</p></div><div><span>OUR CRAFT</span><strong>توجه به کیفیت</strong><p>انتخاب دقیق و آماده‌سازی با دقت.</p></div><div><span>OUR PLACE</span><strong>فضایی برای باهم‌بودن</strong><p>از قرارهای کوتاه تا دورهمی‌های طولانی.</p></div></section>',
 reservation:'<section class="talom-route-showcase talom-booking-showcase"><div><b>01</b><span>اطلاعات تماس را وارد کن</span></div><div><b>02</b><span>تاریخ، ساعت و تعداد مهمان‌ها را مشخص کن</span></div><div><b>03</b><span>منتظر تماس برای تأیید نهایی بمان</span></div><p>ارسال فرم به‌تنهایی به معنی رزرو قطعی نیست.</p></section>',
 contact:'<section class="talom-route-showcase talom-contact-showcase"><a href="tel:09904711802"><span>PHONE / 01</span><strong>0990 471 1802</strong><b>تماس ↗</b></a><a href="tel:09019795131"><span>PHONE / 02</span><strong>0901 979 5131</strong><b>تماس ↗</b></a><a href="https://www.instagram.com/mr.01di/" target="_blank" rel="noopener noreferrer"><span>SOCIAL</span><strong>Instagram</strong><b>مشاهده ↗</b></a></section>'
 };
 return blocks[route.key]||"";
}
if(route.key!=="home"){
 main.prepend(heroMarkup());
 const extra=showcaseMarkup();if(extra){const holder=document.createElement("div");holder.innerHTML=extra;const node=holder.firstElementChild;main.insertBefore(node,main.children[2]||null);}
}
const navItems=[["/","خانه"],["/cafe-bakery","کافه و نانوایی"],["/restaurant","رستوران"],["/menu","منو"],["/events","مراسم"],["/about","داستان تالم"],["/reservation","رزرو"],["/contact","تماس"]];
const nav=document.querySelector("#mainNav");if(nav)nav.innerHTML=navItems.map(([p,l])=>'<a href="'+p+'"'+(p===path?' aria-current="page"':'')+'>'+l+'</a>').join("");
const overlay=document.querySelector("#talomRepubliqueOverlay nav");if(overlay)overlay.innerHTML=navItems.map(([p,l])=>'<a href="'+p+'"'+(p===path?' aria-current="page"':'')+'>'+l+'</a>').join("");
const brand=document.querySelector("#siteHeader .brand");if(brand)brand.href="/";
const cta=document.querySelector("#siteHeader .header-cta");if(cta){cta.href="/reservation";cta.innerHTML='<span>رزرو میز</span><span class="cta-arrow">↗</span>';}
const footer=document.querySelector(".site-footer");
if(footer){let f=footer.querySelector(".talom-pages-footer-nav");if(!f){f=document.createElement("nav");f.className="talom-pages-footer-nav";footer.append(f)}f.innerHTML=navItems.map(([p,l])=>'<a href="'+p+'">'+l+'</a>').join("");}
const sectionRoutes={"home":"/","talomExperiences":"/","home-menu-cta":"/","rep10-intro":"/","signature-banner":"/","cafe-bakery":"/cafe-bakery","restaurant":"/restaurant","menu":"/menu","events":"/events","event-request":"/events","gift-request":"/events","career-request":"/events","reservation":"/reservation","our-story":"/about","talom-team":"/about","services":"/about","faq":"/about","newsletter":"/about","gallery":"/","contact":"/contact","contact-request":"/contact"};
document.querySelectorAll('a[href^="#"]').forEach(a=>{const id=a.getAttribute("href").slice(1),dest=sectionRoutes[id];if(!dest)return;a.href=dest===path?"#"+id:dest+"#"+id;});
document.querySelectorAll("[data-menu-filter]").forEach(a=>a.addEventListener("click",()=>{const key=a.dataset.menuFilter;const tab=document.querySelector('#categoryTabs [data-category="'+CSS.escape(key)+'"]');if(tab){tab.click();requestAnimationFrame(()=>document.getElementById("menu")?.scrollIntoView({behavior:"smooth",block:"start"}));}}));
})();