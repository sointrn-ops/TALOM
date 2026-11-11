(()=>{"use strict";
const main=document.querySelector("main");
if(!main||main.dataset.rep10==="ready")return;
main.dataset.rep10="ready";
const byId=id=>document.getElementById(id);
const release=id=>{const root=byId(id);if(root){[...root.children].forEach(node=>main.append(node));root.remove();}};
release("talomRepSections");release("talomExperience");
const hero=byId("home"),menu=byId("menu"),signature=main.querySelector(".signature-banner");
const experiences=byId("talomExperiences");
if(experiences&&!byId("rep10-intro")){
 const intro=document.createElement("section");
 intro.id="rep10-intro";intro.className="rep10-intro";
 intro.innerHTML='<div class="rep10-intro-copy"><span class="rep10-kicker">TALOM · CAFÉ, BAKERY & TABLE</span><h2>یک خانه برای<br><em>طعم‌های خوب و دورهمی‌ها.</em></h2></div><div class="rep10-intro-detail"><p>تالم فقط یک فنجان قهوه نیست؛ از صبحانه و نان تازه تا غذا و لحظه‌هایی که کنار هم می‌گذرانیم، برای هر ساعت روز جایی در نظر گرفته‌ایم.</p><a href="#our-story">با دنیای تالم آشنا شو <span>↗</span></a></div>';
 const menuCta=document.createElement("section");
 menuCta.id="home-menu-cta";menuCta.className="rep10-menu-cta";
 menuCta.innerHTML='<span>THE TALOM MENU</span><p>از قهوه و نان تازه تا انتخاب‌های آشپزخانه</p><a href="/menu">مشاهده منوی تالم <b>↗</b></a>';
 experiences.after(menuCta);menuCta.after(intro);
}
const order=[
 "home","talomExperiences","rep10-intro","cafe-bakery","restaurant","menu",
 "signature-banner","our-story","services","events","reservation","event-request",
 "gallery","talom-team","faq","newsletter","gift-request","career-request",
 "contact-request","contact"
];
const direct=[...main.children];
const find=id=>id==="signature-banner"?main.querySelector(".signature-banner"):byId(id);
const ordered=[],used=new Set();
order.forEach(id=>{const el=find(id);if(el&&main.contains(el)&&!used.has(el)){ordered.push(el);used.add(el);}});
direct.forEach(el=>{if(!used.has(el)){ordered.push(el);used.add(el);}});
ordered.forEach(el=>main.append(el));
if(hero){
 hero.classList.add("rep10-hero");
 const eyebrow=hero.querySelector(".full-hero-eyebrow");
 const heading=hero.querySelector("h1");
 const desc=hero.querySelector(".full-hero-description");
 if(eyebrow){eyebrow.textContent="به تالم خوش آمدید · کافه، نانوایی و رستوران";eyebrow.dataset.fa=eyebrow.textContent;eyebrow.dataset.en="WELCOME TO TALOM · CAFÉ, BAKERY & RESTAURANT";}
 if(heading){heading.innerHTML="برای طعم‌های خوب،<br><em>کمی بیشتر بمان.</em>";heading.dataset.fa=heading.innerHTML;heading.dataset.en="Come for the flavour,<br><em>stay for the moment.</em>";}
 if(desc){desc.textContent="قهوه‌ی تازه، نان گرم، صبحانه و غذا؛ تجربه‌ای صمیمی برای لحظه‌های روزمره و دورهمی‌های به‌یادماندنی.";desc.dataset.fa=desc.textContent;desc.dataset.en="Fresh coffee, warm bread, breakfast and dining — thoughtful hospitality for everyday moments and memorable gatherings.";}
}
const header=byId("siteHeader");
if(header){
 const nav=header.querySelector(".main-nav");
 if(nav)nav.innerHTML=[["#menu","منو"],["#cafe-bakery","کافه و نانوایی"],["#restaurant","رستوران"],["#events","مراسم"],["#contact","تماس"]].map(([h,t])=>'<a href="'+h+'">'+t+'</a>').join("");
 const cta=header.querySelector(".header-cta");
 if(cta){cta.href="#reservation";cta.innerHTML='<span data-fa="رزرو میز" data-en="Reserve">رزرو میز</span><span class="cta-arrow">↗</span>';}
}
const overlay=byId("talomRepubliqueOverlay");
if(overlay){
 const nav=overlay.querySelector("nav");
 if(nav)nav.innerHTML=[["#home","خانه"],["#cafe-bakery","کافه و نانوایی"],["#restaurant","رستوران"],["#menu","منو و سفارش آنلاین"],["#reservation","رزرو میز"],["#events","مراسم و دورهمی"],["#our-story","داستان تالم"],["#gallery","گالری"],["#contact","تماس با ما"]].map(([h,t])=>'<a href="'+h+'">'+t+'</a>').join("");
}
const footer=document.querySelector(".site-footer");
if(footer&&!footer.querySelector(".rep10-footer-nav")){
 const nav=document.createElement("nav");nav.className="rep10-footer-nav";
 nav.innerHTML=[["#cafe-bakery","کافه و نانوایی"],["#restaurant","رستوران"],["#menu","منو"],["#reservation","رزرو"],["#events","مراسم"],["#gallery","گالری"],["#contact","تماس"]].map(([h,t])=>'<a href="'+h+'">'+t+'</a>').join("");
 footer.append(nav);
}
if("IntersectionObserver"in window){
 const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("rep10-in");io.unobserve(entry.target);}}),{threshold:.08});
 main.querySelectorAll(".rep10-intro,.rep9-experiences,.rep9-feature,.rep9-story,.rep9-events,.rep9-menu,.rep9-gallery,.rep9-contact").forEach(el=>io.observe(el));
}
})();