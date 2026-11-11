(()=>{"use strict";
const main=document.querySelector("main"),header=document.getElementById("siteHeader");
if(!main||main.dataset.talomV3==="ready")return;main.dataset.talomV3="ready";
const byId=id=>document.getElementById(id);
const hero=main.querySelector("#home"),menu=byId("menu"),signature=main.querySelector(".editorial-signature"),gallery=byId("gallery"),contact=byId("contact");
const rep=byId("talomRepSections"),exp=byId("talomExperience");
const sections={};[...(rep?.children||[]),...(exp?.children||[])].forEach(node=>{if(node.id)sections[node.id]=node});
const order=["cafe-bakery","restaurant","menu","signature","our-story","services","reservation","events","event-request","gift-request","talom-team","faq","gallery","newsletter","career-request","contact-request","contact"];
const nodes={"signature":signature,"gallery":gallery,"contact":contact,...sections,menu};
if(hero)main.append(hero);
const highlight=document.createElement("section");highlight.id="talom-highlights";highlight.className="rx-section rx-highlights";
highlight.innerHTML='<div class="rx-wrap"><div class="rx-highlight-head"><div><span class="rx-kicker">A TASTE OF TALOM</span><h2 class="rx-heading">هر ساعت روز،<br><em>یک انتخاب تازه.</em></h2></div><a class="rx-highlight-link" href="#menu">مشاهده منو <span>↗</span></a></div><div class="rx-highlight-grid"><a class="rx-highlight-card" href="#menu"><img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85" alt="نان تازه"><span>01 / BAKERY</span><h3>شیرینی و نان تازه</h3></a><a class="rx-highlight-card" href="#menu"><img src="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=85" alt="صبحانه"><span>02 / BRUNCH</span><h3>صبحانه و برانچ</h3></a><a class="rx-highlight-card" href="#menu"><img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=85" alt="غذای رستوران"><span>03 / RESTAURANT</span><h3>ناهار و شام</h3></a><a class="rx-highlight-card" href="#menu"><img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85" alt="قهوه"><span>04 / COFFEE</span><h3>قهوه و نوشیدنی</h3></a><a class="rx-highlight-card" href="#menu"><img src="https://images.unsplash.com/photo-1513558161293-cbdd765d2bef?auto=format&fit=crop&w=1000&q=85" alt="نوشیدنی خنک"><span>05 / SIGNATURES</span><h3>ترکیب‌های امضایی</h3></a></div></div>';
if(hero)hero.after(highlight);
const used=new Set([hero,highlight]);
for(const id of order){const node=nodes[id];if(node&&!used.has(node)){main.append(node);used.add(node)}}
[rep,exp].forEach(wrapper=>{if(wrapper&&wrapper.isConnected)wrapper.remove()});
const nav=header?.querySelector(".talom-republique-trigger");
if(header&&!header.querySelector(".talom-header-reserve")){const reserve=document.createElement("a");reserve.className="talom-header-reserve";reserve.href="#reservation";reserve.textContent="RESERVE";if(nav)header.insertBefore(reserve,nav)}
const overlay=byId("talomRepubliqueOverlay");
if(overlay){const n=overlay.querySelector("nav");if(n){const pairs=[["#home","HOME"],["#cafe-bakery","CAFÉ & BAKERY"],["#restaurant","RESTAURANT"],["#menu","MENUS"],["#menu","ORDER ONLINE"],["#reservation","RESERVATIONS"],["#events","PRIVATE EVENTS"],["#our-story","OUR STORY"],["#gallery","GALLERY"],["#contact-request","CONTACT"]];n.innerHTML=pairs.map(([href,label])=>'<a href="'+href+'">'+label+'</a>').join("")}}
const side=overlay?.querySelector(".talom-republique-side");if(side)side.innerHTML='<strong>TALOM · CAFÉ & RESTAURANT</strong><a href="#services">Dine in · Takeaway · Catering</a><a href="#event-request">Private events & group dining</a><a href="#faq">Visitor information</a><a href="#footer">Social & contact</a>';
document.querySelectorAll(".site-header.editorial-header .header-actions .header-cta").forEach(x=>x.remove());
const onScroll=()=>header?.classList.toggle("scrolled",window.scrollY>40);window.addEventListener("scroll",onScroll,{passive:true});onScroll();
})();