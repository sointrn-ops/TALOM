(()=>{"use strict";
const main=document.querySelector("main"),header=document.getElementById("siteHeader");
if(!main||!header||main.dataset.talomV6==="ready")return;
main.dataset.talomV6="ready";
const get=id=>document.getElementById(id);
const intro=get("repWelcome")||document.querySelector(".rep-welcome");
if(intro){intro.id="repWelcome";intro.className="rep-welcome rep-welcome-v6";intro.innerHTML='<p>کافه · نانوایی · رستوران</p><h1>به <em>TALOM</em> خوش آمدید</h1><span>قهوه، نان تازه و غذا؛ برای لحظه‌هایی که ارزش ماندن دارند</span>';}
const hero=get("home");
if(hero){
 const eyebrow=hero.querySelector(".full-hero-eyebrow"),h=hero.querySelector("h1"),desc=hero.querySelector(".full-hero-description"),foot=hero.querySelector(".full-hero-foot"),scroll=hero.querySelector(".full-hero-scroll");
 if(eyebrow)eyebrow.textContent="کافه، نانوایی و رستوران";
 if(h)h.innerHTML="طعم خوب،<br><em>برای لحظه‌های خوب.</em>";
 if(desc)desc.textContent="از صبحانه و نان تازه تا قهوه و شام؛ انتخاب کن و لحظه‌ات را در تالم بساز.";
 if(foot)foot.innerHTML="<span>تالم · از صبح تا شب</span><span>یک میز برای هر لحظه</span>";
 if(scroll)scroll.innerHTML="<span></span> کشف تالم";
}
let journeys=get("repJourneys");
if(!journeys){journeys=document.createElement("section");journeys.id="repJourneys";journeys.className="rep-journeys";if(hero&&hero.parentNode)hero.after(journeys);}
const cards=[
["rep-journey-bakery","#cafe-bakery","۰۱ / کافه و نانوایی","نان تازه و شیرینی روز","دیدن تجربه کافه ↗"],
["rep-journey-brunch","#menu","۰۲ / صبحانه و برانچ","شروع آرام یک روز خوب","دیدن منو ↗"],
["rep-journey-dining","#restaurant","۰۳ / رستوران","ناهار، شام و دورهمی","آشنایی با رستوران ↗"],
["rep-journey-coffee","#menu","۰۴ / قهوه و نوشیدنی","از کلاسیک تا امضای تالم","انتخاب نوشیدنی ↗"],
["rep-journey-events","#events","۰۵ / مراسم خصوصی","برای جمع‌هایی که مهم‌اند","هماهنگی مراسم ↗"]
];
journeys.innerHTML=cards.map(c=>'<a class="rep-journey '+c[0]+'" href="'+c[1]+'"><span>'+c[2]+'</span><strong>'+c[3]+'</strong><b>'+c[4]+'</b></a>').join("");
const ids=["cafe-bakery","restaurant","menu","signature","our-story","services","reservation","events","event-request","gift-request","talom-team","faq","newsletter","career-request","gallery","contact-request","contact"];
for(const id of ids){const el=get(id);if(el)main.append(el);}
if(intro)main.prepend(intro);
const actions=header.querySelector(".header-actions");
if(actions&&!actions.querySelector(".rep-header-reserve")){
 const make=(cls,href,label)=>{const a=document.createElement("a");a.className=cls;a.href=href;a.textContent=label;return a;};
 actions.prepend(make("rep-header-reserve","#reservation","رزرو میز"));
 actions.prepend(make("rep-header-order","#menu","سفارش کافه"));
}
const brand=header.querySelector(".brand");if(brand){const small=brand.querySelector("small");if(small)small.textContent="کافه · نانوایی · رستوران";}
const overlay=get("talomRepubliqueOverlay");if(overlay){const nav=overlay.querySelector("nav");if(nav)nav.innerHTML=[["#home","صفحه اصلی"],["#cafe-bakery","کافه و نانوایی"],["#restaurant","رستوران"],["#menu","منو و سفارش"],["#reservation","رزرو میز"],["#events","مراسم و دورهمی"],["#our-story","داستان تالم"],["#gallery","گالری تصاویر"],["#contact-request","تماس با ما"]].map(([href,label])=>'<a href="'+href+'">'+label+'</a>').join("");}
const onScroll=()=>header.classList.toggle("scrolled",window.scrollY>18);window.addEventListener("scroll",onScroll,{passive:true});onScroll();
})();