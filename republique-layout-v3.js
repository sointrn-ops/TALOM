(()=>{"use strict";
const main=document.querySelector("main"),header=document.getElementById("siteHeader");
if(!main||main.dataset.talomV4==="ready")return;main.dataset.talomV4="ready";
document.documentElement.lang="fa";document.documentElement.dir="rtl";
const byId=id=>document.getElementById(id);
const hero=byId("home"),menu=byId("menu"),signature=main.querySelector(".editorial-signature"),gallery=byId("gallery"),contact=byId("contact");
const rep=byId("talomRepSections"),exp=byId("talomExperience"),sections={};
[...(rep?.children||[]),...(exp?.children||[])].forEach(node=>{if(node.id)sections[node.id]=node});
const nodes={"signature":signature,"gallery":gallery,"contact":contact,...sections,menu};
const highlight=document.createElement("section");highlight.id="talom-highlights";highlight.className="rx-section rx-highlights";
highlight.innerHTML='<div class="rx-wrap"><div class="rx-highlight-head"><div><span class="rx-kicker">طعم‌های تالم</span><h2 class="rx-heading">برای هر ساعت روز،<br><em>یک انتخاب تازه.</em></h2></div><a class="rx-highlight-link" href="#menu">دیدن منو <span>↗</span></a></div><div class="rx-highlight-grid"><a class="rx-highlight-card" href="#menu"><img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85" alt="نان تازه"><span>۰۱ / نانوایی</span><h3>نان و شیرینی تازه</h3></a><a class="rx-highlight-card" href="#menu"><img src="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=85" alt="صبحانه"><span>۰۲ / صبحانه</span><h3>صبحانه و برانچ</h3></a><a class="rx-highlight-card" href="#menu"><img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=85" alt="غذای رستوران"><span>۰۳ / رستوران</span><h3>ناهار و شام</h3></a><a class="rx-highlight-card" href="#menu"><img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85" alt="قهوه"><span>۰۴ / قهوه</span><h3>قهوه‌های کلاسیک</h3></a><a class="rx-highlight-card" href="#menu"><img src="https://images.unsplash.com/photo-1513558161293-cbdd765d2bef?auto=format&fit=crop&w=1000&q=85" alt="نوشیدنی خنک"><span>۰۵ / نوشیدنی</span><h3>ترکیب‌های ویژه</h3></a></div></div>';
const order=["cafe-bakery","restaurant","menu","signature","our-story","services","reservation","events","event-request","gift-request","talom-team","faq","gallery","newsletter","career-request","contact-request","contact"];
if(hero)main.append(hero);if(hero)hero.after(highlight);
const used=new Set([hero,highlight]);
for(const id of order){const node=nodes[id];if(node&&!used.has(node)){main.append(node);used.add(node)}}
[rep,exp].forEach(wrapper=>{if(wrapper?.isConnected)wrapper.remove()});
const replace=(selector,from,to,root=document)=>root.querySelectorAll(selector).forEach(el=>{if(el.textContent.trim()===from)el.textContent=to});
const heroScroll=main.querySelector(".full-hero-scroll");if(heroScroll)heroScroll.innerHTML='<span></span> برای کشف بیشتر';
const heroFoot=main.querySelector(".full-hero-foot");if(heroFoot)heroFoot.innerHTML='<span>۰۱ — فرهنگ قهوه</span><span>لحظه‌ای برای مکث</span>';
const signatureLabel=signature?.querySelector(".overline");if(signatureLabel)signatureLabel.textContent="انتخاب باریستا";
const signatureVertical=signature?.querySelector(".signature-vertical");if(signatureVertical)signatureVertical.textContent="تالم / انتخاب‌های ویژه";
const galleryLabels=[["01 / THE PLACE","۰۱ / فضای کافه"],["02 / THE SPACE","۰۲ / فضای داخلی"],["03 / THE CRAFT","۰۳ / هنر تهیه"],["04 / THE MOMENT","۰۴ / لحظه‌های تالم"]];
gallery?.querySelectorAll(".gallery-caption").forEach((el,i)=>{if(galleryLabels[i])el.firstChild.textContent=galleryLabels[i][1]+" "});
document.querySelectorAll(".rx-kicker").forEach(el=>{const t=el.textContent.trim();const map={"CAFÉ & BAKERY":"کافه و نانوایی","THE RESTAURANT":"رستوران تالم","PEOPLE & CRAFT":"آدم‌ها و هنر تهیه","THE TALOM STORY":"داستان تالم","MORE THAN A MEAL":"فراتر از یک وعده","YOUR TABLE AT TALOM":"رزرو میز در تالم","GATHER AROUND":"دورهمی در تالم","EVENTS & CATERING":"مراسم و پذیرایی","GOOD TO KNOW":"اطلاعات کاربردی","A GIFT FROM TALOM":"هدیه‌ای از تالم","NOTES FROM TALOM":"خبرهای تالم","JOIN OUR TEAM":"همکاری با تالم","COME SAY HELLO":"با ما در ارتباط باش"};if(map[t])el.textContent=map[t]});
document.querySelectorAll(".rx-service b").forEach((el,i)=>{el.textContent=["۰۱ / صرف در محل","۰۲ / بیرون‌بر","۰۳ / دورهمی خصوصی","۰۴ / نانوایی"][i]||el.textContent});
document.querySelectorAll(".rx-footer-links a").forEach(a=>{const map={"Café & Bakery":"کافه و نانوایی","Restaurant":"رستوران","Reservations":"رزرو میز","Private Events":"مراسم خصوصی","Newsletter":"خبرنامه","Careers":"فرصت‌های همکاری"};if(map[a.textContent.trim()])a.textContent=map[a.textContent.trim()]});
const nav=header?.querySelector(".talom-republique-trigger");
if(header&&!header.querySelector(".talom-header-reserve")){const reserve=document.createElement("a");reserve.className="talom-header-reserve";reserve.href="#reservation";reserve.textContent="رزرو میز";if(nav)header.insertBefore(reserve,nav)}
if(nav){nav.setAttribute("aria-label","باز کردن فهرست");nav.innerHTML='<span class="talom-republique-icon" aria-hidden="true"><i></i><i></i><i></i></span><span>فهرست</span>'}
const overlay=byId("talomRepubliqueOverlay");
if(overlay){const n=overlay.querySelector("nav");if(n){const pairs=[["#home","صفحه اصلی"],["#cafe-bakery","کافه و نانوایی"],["#restaurant","رستوران"],["#menu","منوی خوراکی‌ها"],["#menu","ثبت سفارش"],["#reservation","رزرو میز"],["#events","مراسم و دورهمی خصوصی"],["#our-story","داستان تالم"],["#gallery","گالری تصاویر"],["#contact-request","ارتباط با ما"]];n.innerHTML=pairs.map(([href,label])=>'<a href="'+href+'">'+label+'</a>').join("")}}
const side=overlay?.querySelector(".talom-republique-side");if(side)side.innerHTML='<strong>تالم · کافه و رستوران</strong><a href="#services">صرف در محل · بیرون‌بر · پذیرایی</a><a href="#event-request">مراسم خصوصی و دورهمی‌ها</a><a href="#faq">پرسش‌های پرتکرار</a><a href="#footer">شبکه‌های اجتماعی و تماس</a>';
document.querySelectorAll(".site-header.editorial-header .header-actions .header-cta").forEach(x=>x.remove());
const onScroll=()=>header?.classList.toggle("scrolled",window.scrollY>40);window.addEventListener("scroll",onScroll,{passive:true});onScroll();
})();