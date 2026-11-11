(()=>{"use strict";
const main=document.querySelector("main"),header=document.getElementById("siteHeader");if(!main||!header||main.dataset.rep8==="ready")return;main.dataset.rep8="ready";
const $=id=>document.getElementById(id);
const moveOut=(rootId)=>{const root=$(rootId);if(!root)return;while(root.firstElementChild)main.append(root.firstElementChild);root.remove();};
moveOut("talomRepSections");moveOut("talomExperience");
const oldDiscover=main.querySelector(".rep-discover");if(oldDiscover)oldDiscover.remove();
const oldIntro=main.querySelector(".rep-welcome");if(oldIntro)oldIntro.remove();
const hero=$("home"),menu=$("menu"),gallery=$("gallery"),contact=$("contact");
const intro=document.createElement("section");intro.className="rep8-welcome";intro.innerHTML='<span class="rep8-welcome-kicker">TALOM · CAFÉ / BAKERY / TABLE</span><h1>به <em>TALOM</em> خوش آمدید</h1><p>قهوه‌ی تازه، نان گرم و میزبانی صمیمی؛ برای لحظه‌هایی که ارزش ماندن دارند.</p>';
const experiences=document.createElement("section");experiences.id="rep8-experiences";experiences.className="rep8-experiences";experiences.innerHTML='<div class="rep8-section-top"><div><span>01 / تجربه‌های تالم</span><h2>هر روز، <em>یک انتخاب تازه.</em></h2></div><p>از اولین فنجان صبح تا میز شام؛ حال‌وهوای دلخواهت را پیدا کن.</p></div><div class="rep8-experience-grid"><a class="rep8-tile rep8-bakery" href="#cafe-bakery"><span>01 / BAKERY</span><strong>نان و شیرینی تازه</strong><b>کشف نانوایی ↗</b></a><a class="rep8-tile rep8-brunch" href="#menu"><span>02 / BRUNCH</span><strong>صبحانه و برانچ</strong><b>دیدن منو ↗</b></a><a class="rep8-tile rep8-coffee" href="#menu"><span>03 / COFFEE</span><strong>قهوه و نوشیدنی</strong><b>انتخاب قهوه ↗</b></a><a class="rep8-tile rep8-dining" href="#restaurant"><span>04 / DINING</span><strong>ناهار و شام</strong><b>رستوران تالم ↗</b></a><a class="rep8-tile rep8-gather" href="#events"><span>05 / GATHERINGS</span><strong>مراسم و دورهمی</strong><b>هماهنگی مراسم ↗</b></a></div>';
const heroImage=hero?.querySelector(".full-hero-image");if(heroImage){heroImage.alt="فضای گرم و دعوت‌کننده کافه تالم";heroImage.loading="eager";heroImage.fetchPriority="high";}
if(hero){hero.classList.add("rep8-hero");const e=hero.querySelector(".full-hero-eyebrow"),h=hero.querySelector("h1"),d=hero.querySelector(".full-hero-description"),a=hero.querySelector(".full-hero-actions a"),foot=hero.querySelector(".full-hero-foot"),scroll=hero.querySelector(".full-hero-scroll");if(e)e.textContent="قهوه · نانوایی · رستوران";if(h)h.innerHTML="لحظه‌ها را<br><em>با طعم خوب زندگی کن.</em>";if(d)d.textContent="از صبحانه‌ی آرام تا شام دوستانه؛ برای هر ساعت روز، میز خودت را در تالم پیدا کن.";if(a){a.href="#menu";a.innerHTML="<span>مشاهده منوی تالم</span><span>↗</span>";}if(foot)foot.innerHTML="<span>TALOM — GOOD MOMENTS</span><span>از صبح تا شب، کنار هم</span>";if(scroll)scroll.innerHTML="<span></span> ادامه تجربه";}
const sectionOrder=["cafe-bakery","restaurant","menu","signature","our-story","services","events","reservation","event-request","gift-request","talom-team","faq","newsletter","career-request","gallery","contact-request","contact"];
if(intro)main.prepend(intro);
if(hero)main.insertBefore(hero,intro.nextSibling);
main.insertBefore(experiences,hero?hero.nextSibling:intro.nextSibling);
for(const id of sectionOrder){const el=$(id);if(el)main.append(el);}
const section=(id)=>$(id);
const cafe=section("cafe-bakery"),rest=section("restaurant"),story=section("our-story"),events=section("events"),booking=section("reservation");
if(cafe)cafe.classList.add("rep8-feature","rep8-feature-cafe");
if(rest)rest.classList.add("rep8-feature","rep8-feature-restaurant");
if(story)story.classList.add("rep8-story");
if(events)events.classList.add("rep8-events");
if(booking)booking.classList.add("rep8-booking");
if(menu){menu.classList.add("rep8-menu");const kicker=menu.querySelector(".menu-discovery-kicker");if(kicker)kicker.innerHTML="<span>02</span><span>از منوی تالم انتخاب کن</span>";}
if(gallery)gallery.classList.add("rep8-gallery");
if(contact)contact.classList.add("rep8-contact");
const nav=header.querySelector(".main-nav");if(nav){nav.innerHTML=[["#home","خانه"],["#cafe-bakery","کافه و نانوایی"],["#restaurant","رستوران"],["#menu","منو"],["#events","مراسم"],["#gallery","گالری"],["#contact","تماس"]].map(([h,t])=>'<a href="'+h+'">'+t+'</a>').join("");}
const brand=header.querySelector(".brand");if(brand){const small=brand.querySelector("small");if(small)small.textContent="CAFÉ · BAKERY · RESTAURANT";}
const actions=header.querySelector(".header-actions");if(actions){const c=actions.querySelector(".header-cta");if(c){c.href="#reservation";c.innerHTML="<span>رزرو میز</span><span>↗</span>";}}
const overlay=$("talomRepubliqueOverlay");if(overlay){const nav2=overlay.querySelector("nav");if(nav2)nav2.innerHTML=[["#home","خانه"],["#cafe-bakery","کافه و نانوایی"],["#restaurant","رستوران تالم"],["#menu","منو و سفارش آنلاین"],["#reservation","رزرو میز"],["#events","مراسم و دورهمی"],["#our-story","داستان تالم"],["#gallery","گالری تصاویر"],["#contact","تماس با ما"]].map(([h,t])=>'<a href="'+h+'">'+t+'</a>').join("");const side=overlay.querySelector("aside");if(side)side.innerHTML="<strong>تالم · کافه، نانوایی و رستوران</strong><span>قهوه‌ی تازه، نان گرم و میزهایی برای باهم بودن.</span><a href=\"#menu\">مشاهده منو ↗</a><a href=\"#reservation\">درخواست رزرو ↗</a><a href=\"#contact\">راه‌های ارتباطی ↗</a>";}
const footer=document.querySelector(".site-footer");if(footer){let links=footer.querySelector(".rep8-footer-links");if(!links){links=document.createElement("nav");links.className="rep8-footer-links";links.innerHTML=[["#cafe-bakery","کافه و نانوایی"],["#restaurant","رستوران"],["#menu","منو"],["#reservation","رزرو"],["#events","مراسم"],["#gallery","گالری"],["#contact","تماس"]].map(([h,t])=>'<a href="'+h+'">'+t+'</a>').join("");footer.append(links);}}
const dateInputs=main.querySelectorAll('input[type="date"]');const now=new Date(),today=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);dateInputs.forEach(input=>input.min=today);
if("IntersectionObserver"in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("rep8-visible");io.unobserve(entry.target);}}),{threshold:.08,rootMargin:"0px 0px -30px 0px"});main.querySelectorAll(".rep8-feature,.rep8-story,.rep8-events,.rep8-menu,.rep8-gallery,.rep8-contact,.signature-banner").forEach(el=>io.observe(el));}
const onScroll=()=>header.classList.toggle("scrolled",window.scrollY>32);window.addEventListener("scroll",onScroll,{passive:true});onScroll();
})();