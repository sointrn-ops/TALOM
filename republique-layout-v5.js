(()=>{"use strict";
const main=document.querySelector("main"),header=document.getElementById("siteHeader");if(!main||!header||main.dataset.talomEditorialV5==="ready")return;main.dataset.talomEditorialV5="ready";
const get=id=>document.getElementById(id);
const roots=[get("talomRepSections"),get("talomExperience")].filter(Boolean);
const nodes={};
roots.forEach(root=>[...root.children].forEach(el=>{if(el.id)nodes[el.id]=el}));
["home","menu","gallery","contact"].forEach(id=>{const el=get(id);if(el)nodes[id]=el});
const signature=document.querySelector(".editorial-signature");if(signature)nodes.signature=signature;
const intro=document.createElement("section");intro.className="rep-welcome";intro.innerHTML='<p>کافه · نانوایی · رستوران</p><h1>خوش آمدید به <em>TALOM</em></h1><span>طعم خوب، نان تازه و لحظه‌هایی برای ماندن</span>';
const discover=document.createElement("section");discover.className="rep-discover";discover.setAttribute("aria-label","تجربه‌های تالم");
discover.innerHTML='<a class="rep-discover-card rep-pastry" href="#cafe-bakery"><span>۰۱ / نانوایی</span><strong>شیرینی و نان تازه</strong></a><a class="rep-discover-card rep-brunch" href="#menu"><span>۰۲ / صبحانه</span><strong>شروع آرام روز</strong></a><a class="rep-discover-card rep-dinner" href="#restaurant"><span>۰۳ / رستوران</span><strong>ناهار و شام</strong></a><a class="rep-discover-card rep-coffee" href="#menu"><span>۰۴ / قهوه</span><strong>قهوه و نوشیدنی</strong></a><a class="rep-discover-card rep-events" href="#events"><span>۰۵ / دورهمی</span><strong>مراسم و پذیرایی</strong></a>';
const hero=nodes.home;
if(hero){const h=hero.querySelector("h1"),e=hero.querySelector(".full-hero-eyebrow"),d=hero.querySelector(".full-hero-description"),foot=hero.querySelector(".full-hero-foot"),scroll=hero.querySelector(".full-hero-scroll");if(e){e.textContent="کافه، نانوایی و رستوران";e.dataset.fa=e.textContent}if(h){h.innerHTML="برای طعم‌های خوب،<br><em>وقت بگذار.</em>";h.dataset.fa=h.innerHTML}if(d){d.textContent="از نان تازه و صبحانه تا قهوه و غذاهای رستورانی؛ تالم برای لحظه‌هایی ساخته شده که دوست داری طولانی‌تر شوند.";d.dataset.fa=d.textContent}if(foot)foot.innerHTML="<span>تالم · از صبح تا شب</span><span>یک میز برای هر لحظه</span>";if(scroll)scroll.innerHTML="<span></span> کشف تالم"}
const ordered=["home","discover","cafe-bakery","restaurant","menu","signature","our-story","services","reservation","events","event-request","gift-request","talom-team","faq","newsletter","career-request","gallery","contact-request","contact"];
nodes.discover=discover;
ordered.forEach(key=>{const el=nodes[key];if(el)main.append(el)});
roots.forEach(root=>root.remove());intro.remove();main.prepend(intro);
const brand=header.querySelector(".brand");if(brand){const small=brand.querySelector("small");if(small)small.textContent="کافه · نانوایی · رستوران";brand.setAttribute("aria-label","صفحه اصلی تالم")}
const tr={"CAFÉ & BAKERY":"کافه و نانوایی","THE RESTAURANT":"رستوران تالم","PEOPLE & CRAFT":"تیم و هنر تهیه","THE TALOM STORY":"داستان تالم","MORE THAN A MEAL":"فراتر از یک وعده","YOUR TABLE AT TALOM":"رزرو میز در تالم","GATHER AROUND":"دورهمی در تالم","EVENTS & CATERING":"مراسم و پذیرایی","GOOD TO KNOW":"اطلاعات کاربردی","A GIFT FROM TALOM":"هدیه‌ای از تالم","NOTES FROM TALOM":"خبرهای تالم","JOIN OUR TEAM":"همکاری با تالم","COME SAY HELLO":"با ما در ارتباط باش","A CLOSER LOOK":"از نزدیک ببین","SPACE & DETAILS":"فضا و جزئیات","FIND US":"پیدایمان کن"};
document.querySelectorAll(".rx-kicker,.section-kicker,.overline").forEach(el=>{const key=el.textContent.trim();if(tr[key]){el.dataset.en=key;el.dataset.fa=tr[key];el.textContent=tr[key]}});
document.querySelectorAll(".rx-service b").forEach((el,i)=>{el.textContent=["۰۱ / صرف در محل","۰۲ / بیرون‌بر","۰۳ / دورهمی خصوصی","۰۴ / نانوایی"][i]||el.textContent});
document.querySelectorAll(".gallery-caption").forEach((el,i)=>{const labels=["۰۱ / فضای تالم","۰۲ / جزئیات","۰۳ / قهوه","۰۴ / دورهمی"];const b=el.querySelector("b");el.textContent=labels[i]||"فضای تالم";if(b)el.append(b)});
const overlay=get("talomRepubliqueOverlay");if(overlay){const nav=overlay.querySelector("nav");if(nav)nav.innerHTML=[["#home","صفحه اصلی"],["#cafe-bakery","کافه و نانوایی"],["#restaurant","رستوران"],["#menu","منوی خوراکی‌ها"],["#reservation","رزرو میز"],["#events","مراسم و دورهمی"],["#our-story","داستان تالم"],["#gallery","گالری تصاویر"],["#contact","تماس با ما"]].map(([href,label])=>'<a href="'+href+'">'+label+'</a>').join("")}
const onScroll=()=>header.classList.toggle("scrolled",window.scrollY>20);window.addEventListener("scroll",onScroll,{passive:true});onScroll();
})();