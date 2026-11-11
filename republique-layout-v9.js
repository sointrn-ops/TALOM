(()=>{"use strict";
const main=document.querySelector("main"),header=document.getElementById("siteHeader");
if(!main||!header||main.dataset.rep9==="ready")return;
main.dataset.rep9="ready";
const $=id=>document.getElementById(id);
const release=rootId=>{const root=$(rootId);if(!root)return;[...root.children].forEach(node=>main.append(node));root.remove();};
release("talomRepSections");release("talomExperience");
main.querySelectorAll(".rep8-welcome,.rep8-experiences").forEach(el=>el.remove());
const hero=$("home"),menu=$("menu"),gallery=$("gallery"),contact=$("contact");
const signature=main.querySelector(".signature-banner");
const experiences=document.createElement("section");
experiences.id="talomExperiences";experiences.className="rep9-experiences";
experiences.innerHTML='<div class="rep9-section-head"><div><span class="rep9-kicker">TALOM / OUR EXPERIENCES</span><h2>طعم هر لحظه،<br><em>به سبک تالم.</em></h2></div><p>از نان تازه و صبحانه‌ی آرام تا قهوه‌ی روزانه و میز شام؛ تجربه‌ای برای هر ساعت روز.</p></div><div class="rep9-experience-grid"><a class="rep9-card rep9-pastry" href="#cafe-bakery"><span>01 / BAKERY & PASTRY</span><strong>نانوایی و شیرینی</strong><b>کشف طعم‌ها ↗</b></a><a class="rep9-card rep9-brunch" href="#cafe-bakery"><span>02 / BRUNCH</span><strong>صبحانه و برانچ</strong><b>شروع روز ↗</b></a><a class="rep9-card rep9-coffee" href="#menu"><span>03 / COFFEE</span><strong>قهوه و نوشیدنی</strong><b>منوی نوشیدنی ↗</b></a><a class="rep9-card rep9-dinner" href="#restaurant"><span>04 / DINING</span><strong>ناهار و شام</strong><b>تجربه رستوران ↗</b></a><a class="rep9-card rep9-signature" href="#menu"><span>05 / SIGNATURES</span><strong>ترکیب‌های ویژه</strong><b>انتخاب ویژه ↗</b></a></div>';
if(hero){
 hero.classList.add("rep9-hero");
 const eyebrow=hero.querySelector(".full-hero-eyebrow"),heading=hero.querySelector("h1"),desc=hero.querySelector(".full-hero-description"),cta=hero.querySelector(".full-hero-actions a"),foot=hero.querySelector(".full-hero-foot"),scroll=hero.querySelector(".full-hero-scroll");
 if(eyebrow){eyebrow.textContent="WELCOME TO TALOM · CAFÉ & RESTAURANT";eyebrow.dataset.fa="به تالم خوش آمدید · کافه و رستوران";eyebrow.dataset.en="WELCOME TO TALOM · CAFÉ & RESTAURANT";}
 if(heading){heading.innerHTML="به تالم خوش آمدید،<br><em>برای لحظه‌های ماندگار.</em>";heading.dataset.fa=heading.innerHTML;heading.dataset.en="Welcome to TALOM,<br><em>stay for the moment.</em>";}
 if(desc){desc.textContent="قهوه‌ی تازه، نان گرم و میزبانی صمیمی؛ از صبحانه تا شام، جایی برای مکث و باهم‌بودن.";desc.dataset.fa=desc.textContent;desc.dataset.en="Fresh coffee, warm bread and thoughtful hospitality — from breakfast through dinner, a place to slow down and gather.";}
 if(cta){cta.href="#menu";const label=cta.querySelector("span");if(label){label.textContent="مشاهده منو";label.dataset.fa="مشاهده منو";label.dataset.en="Explore the menu";}}
 if(foot)foot.innerHTML="<span>TALOM — CAFÉ / BAKERY / TABLE</span><span>از صبح تا شب، کنار هم</span>";
 if(scroll)scroll.innerHTML="<span></span> ادامه تجربه";
 const img=hero.querySelector(".full-hero-image");if(img){img.alt="فضای کافه و رستوران تالم";img.loading="eager";img.fetchPriority="high";}
}
const orderIds=["cafe-bakery","restaurant","menu","our-story","services","events","reservation","event-request","gallery","talom-team","faq","newsletter","gift-request","career-request","contact-request","contact"];
const ordered=[hero,experiences,...orderIds.map(id=>$(id)),signature].filter(Boolean);
const seen=new Set();ordered.forEach(el=>{if(!seen.has(el)){seen.add(el);main.append(el);}});
[...main.children].forEach(el=>{if(!seen.has(el))main.append(el);});
const cafe=$("cafe-bakery"),restaurant=$("restaurant"),story=$("our-story"),events=$("events"),booking=$("reservation");
if(cafe)cafe.classList.add("rep9-feature","rep9-cafe");
if(restaurant)restaurant.classList.add("rep9-feature","rep9-restaurant");
if(story)story.classList.add("rep9-story");
if(events)events.classList.add("rep9-events");
if(booking)booking.classList.add("rep9-booking");
if(menu)menu.classList.add("rep9-menu");
if(gallery)gallery.classList.add("rep9-gallery");
if(contact)contact.classList.add("rep9-contact");
const nav=header.querySelector(".main-nav");
if(nav){nav.innerHTML=[["#menu","منو"],["#cafe-bakery","کافه و نانوایی"],["#restaurant","رستوران"],["#reservation","رزرو"],["#events","مراسم"]].map(([href,label])=>'<a href="'+href+'">'+label+'</a>').join("");}
const brand=header.querySelector(".brand");if(brand){const small=brand.querySelector("small");if(small)small.textContent="CAFÉ · BAKERY · RESTAURANT";}
const actions=header.querySelector(".header-actions");
if(actions){const c=actions.querySelector(".header-cta");if(c){c.href="#reservation";c.innerHTML='<span data-fa="رزرو میز" data-en="Reserve">رزرو میز</span><span>↗</span>';}}
const overlay=$("talomRepubliqueOverlay");
if(overlay){const nav2=overlay.querySelector("nav");if(nav2)nav2.innerHTML=[["#home","خانه"],["#cafe-bakery","کافه و نانوایی"],["#restaurant","رستوران تالم"],["#menu","منو و سفارش آنلاین"],["#reservation","رزرو میز"],["#events","مراسم و دورهمی"],["#our-story","داستان تالم"],["#gallery","گالری تصاویر"],["#contact","تماس با ما"]].map(([href,label])=>'<a href="'+href+'">'+label+'</a>').join("");const side=overlay.querySelector("aside");if(side)side.innerHTML='<strong>تالم · کافه، نانوایی و رستوران</strong><span>قهوه‌ی تازه، نان گرم و میزهایی برای باهم‌بودن.</span><a href="#menu">مشاهده منو ↗</a><a href="#reservation">درخواست رزرو ↗</a><a href="#contact">راه‌های ارتباطی ↗</a>';}
const footer=document.querySelector(".site-footer");
if(footer&&!footer.querySelector(".rep9-footer-links")){const links=document.createElement("nav");links.className="rep9-footer-links";links.innerHTML=[["#cafe-bakery","کافه و نانوایی"],["#restaurant","رستوران"],["#menu","منو"],["#reservation","رزرو"],["#events","مراسم"],["#gallery","گالری"],["#contact","تماس"]].map(([href,label])=>'<a href="'+href+'">'+label+'</a>').join("");footer.append(links);}
const today=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
main.querySelectorAll('input[type="date"]').forEach(input=>input.min=today);
if("IntersectionObserver"in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("rep9-visible");observer.unobserve(entry.target);}}),{threshold:.08,rootMargin:"0px 0px -35px 0px"});main.querySelectorAll(".rep9-feature,.rep9-story,.rep9-events,.rep9-menu,.rep9-gallery,.rep9-contact,.signature-banner").forEach(el=>observer.observe(el));}
const onScroll=()=>header.classList.toggle("scrolled",window.scrollY>30);window.addEventListener("scroll",onScroll,{passive:true});onScroll();
})();