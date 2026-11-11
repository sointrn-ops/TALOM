(()=>{"use strict";
const main=document.querySelector("main"),header=document.getElementById("siteHeader");
if(!main||!header||main.dataset.talomV6==="ready")return;main.dataset.talomV6="ready";
const get=id=>document.getElementById(id);
const intro=get("repWelcome")||document.querySelector(".rep-welcome");
if(intro){intro.id="repWelcome";intro.className="rep-welcome rep-welcome-v6";intro.innerHTML='<p>کافه · نانوایی · رستوران</p><h1>به <em>TALOM</em> خوش آمدید</h1><span>یک خانه برای قهوه، نان تازه و غذاهای به‌یادماندنی</span>'}
const discover=document.querySelector(".rep-discover");if(discover)discover.remove();
const hero=get("home");
if(hero){
 const eyebrow=hero.querySelector(".full-hero-eyebrow"),h=hero.querySelector("h1"),desc=hero.querySelector(".full-hero-description"),foot=hero.querySelector(".full-hero-foot"),scroll=hero.querySelector(".full-hero-scroll");
 if(eyebrow)eyebrow.textContent="تجربه کافه و رستوران تالم";
 if(h)h.innerHTML="طعم خوب،<br><em>برای لحظه‌های خوب.</em>";
 if(desc)desc.textContent="از صبحانه و نان تازه تا قهوه و شام؛ انتخاب کن و لحظه‌ات را در تالم بساز.";
 if(foot)foot.innerHTML="<span>تالم · کافه، نانوایی و رستوران</span><span>از صبح تا شب</span>";
 if(scroll)scroll.innerHTML="<span></span> دیدن تجربه‌ها";
}
const journeys=document.createElement("section");journeys.className="rep-journeys";journeys.setAttribute("aria-label","مسیرهای سفارش و رزرو");
journeys.innerHTML='<a class="rep-journey rep-journey-cafe" href="#menu"><span>کافه و نانوایی</span><strong>قهوه، صبحانه و نان تازه</strong><b>مشاهده منو و سفارش ↗</b></a><a class="rep-journey rep-journey-dining" href="#restaurant"><span>رستوران تالم</span><strong>ناهار، شام و دورهمی</strong><b>آشنایی با رستوران ↗</b></a>';
if(hero&&hero.parentNode)hero.after(journeys);
const ids=["cafe-bakery","restaurant","menu","signature","our-story","services","reservation","events","event-request","gift-request","talom-team","faq","newsletter","career-request","gallery","contact-request","contact"];
for(const id of ids){const el=get(id);if(el)main.append(el)}
if(intro)main.prepend(intro);
const actions=header.querySelector(".header-actions");
if(actions&&!actions.querySelector(".rep-header-reserve")){
 const make=(cls,href,label)=>{const a=document.createElement("a");a.className=cls;a.href=href;a.textContent=label;return a};
 actions.prepend(make("rep-header-reserve","https://talom-coffee.vercel.app/#reservation","رزرو میز"));
 actions.prepend(make("rep-header-order","https://talom-coffee.vercel.app/#menu","سفارش کافه"));
}
const brand=header.querySelector(".brand");if(brand){const small=brand.querySelector("small");if(small)small.textContent="کافه · نانوایی · رستوران"}
const overlay=get("talomRepubliqueOverlay");if(overlay){const nav=overlay.querySelector("nav");if(nav)nav.innerHTML=[["#home","صفحه اصلی"],["#cafe-bakery","کافه و نانوایی"],["#restaurant","رستوران"],["#menu","منو و سفارش"],["#reservation","رزرو میز"],["#events","مراسم و دورهمی"],["#our-story","داستان تالم"],["#gallery","گالری تصاویر"],["#contact","تماس با ما"]].map(([href,label])=>'<a href="'+href+'">'+label+'</a>').join("")}
const onScroll=()=>header.classList.toggle("scrolled",window.scrollY>18);window.addEventListener("scroll",onScroll,{passive:true});onScroll();
})();