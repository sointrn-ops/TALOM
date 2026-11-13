(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s),page=document.body.dataset.page||"home";
const navItems=[
["/","خانه","Home"],["/cafe-bakery","کافه و نانوایی","Café & Bakery"],
["/restaurant","رستوران","Restaurant"],["/menu","منو و سفارش","Menu & Order"],
["/events","مراسم و دورهمی","Private Events"],["/about","داستان تالم","Our Story"],
["/reservation","رزرو میز","Reservations"],["/contact","تماس","Contact"]
];
const links=()=>navItems.map(([url,fa,en])=>'<a href="'+url+'" data-fa="'+fa+'" data-en="'+en+'">'+fa+'</a>').join("");
const header=$("#siteHeader");
if(header){
 let trigger=header.querySelector(".talom-republique-trigger");
 if(!trigger){trigger=document.createElement("button");trigger.type="button";trigger.className="talom-republique-trigger";trigger.setAttribute("aria-expanded","false");trigger.setAttribute("aria-controls","talomRepubliqueOverlay");header.insertBefore(trigger,header.firstChild);}
 trigger.innerHTML='<span class="talom-republique-icon" aria-hidden="true"><i></i><i></i><i></i></span><span data-fa="فهرست" data-en="Menu">فهرست</span>';
 let overlay=$("#talomRepubliqueOverlay");
 if(!overlay){overlay=document.createElement("div");overlay.id="talomRepubliqueOverlay";overlay.className="talom-republique-overlay";overlay.setAttribute("aria-hidden","true");overlay.innerHTML='<button class="talom-overlay-close" type="button" aria-label="Close menu">×</button><nav aria-label="Site menu">'+links()+'</nav><aside class="talom-republique-side"><strong data-fa="تالم · کافه و رستوران" data-en="TALOM · Café & Restaurant">تالم · کافه و رستوران</strong><a href="/cafe-bakery" data-fa="قهوه، نانوایی و برانچ" data-en="Coffee, bakery & brunch">قهوه، نانوایی و برانچ</a><a href="/restaurant" data-fa="ناهار و شام" data-en="Lunch & dinner">ناهار و شام</a><a href="/events" data-fa="مراسم و دورهمی‌ها" data-en="Private gatherings">مراسم و دورهمی‌ها</a><a href="/contact" data-fa="اطلاعات تماس" data-en="Contact details">اطلاعات تماس</a></aside></div>';document.body.append(overlay);}
 const actions=header.querySelector(".header-actions"),side=overlay.querySelector(".talom-republique-side");
 if(actions&&side&&!side.contains(actions)){
   const cta=actions.querySelector(".header-cta");
   if(cta){cta.href="/reservation";cta.innerHTML='<span data-fa="رزرو میز" data-en="Reserve a table">رزرو میز</span><span class="cta-arrow">↗</span>';header.append(cta);}
   actions.classList.add("talom-utility-actions");side.append(actions);
 }
 const mainNav=$("#mainNav");if(mainNav)mainNav.innerHTML=links();
 const overlayNav=$("nav",overlay);if(overlayNav)overlayNav.innerHTML=links();
 const footer=$("#footer");if(footer){let f=footer.querySelector(".talom-footer-links");if(!f){f=document.createElement("nav");f.className="talom-footer-links";footer.append(f);}f.innerHTML=links();}
 const open=()=>{overlay.classList.add("is-open");overlay.setAttribute("aria-hidden","false");trigger.setAttribute("aria-expanded","true");document.body.classList.add("talom-menu-open");const first=$("nav a",overlay);first?.focus();};
 const close=()=>{overlay.classList.remove("is-open");overlay.setAttribute("aria-hidden","true");trigger.setAttribute("aria-expanded","false");document.body.classList.remove("talom-menu-open");trigger.focus();};
 trigger.addEventListener("click",()=>overlay.classList.contains("is-open")?close():open());
 $(".talom-overlay-close",overlay)?.addEventListener("click",close);
 overlay.addEventListener("click",e=>{if(e.target===overlay)close();});
 overlay.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>{overlay.classList.remove("is-open");overlay.setAttribute("aria-hidden","true");trigger.setAttribute("aria-expanded","false");document.body.classList.remove("talom-menu-open");}));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&overlay.classList.contains("is-open"))close();});
}
const setCopy=(el,fa,en)=>{if(!el)return;el.dataset.fa=fa;el.dataset.en=en;el.innerHTML=fa;};
const routeCopy={
cafe:["TALOM · کافه و نانوایی","صبح‌های آرام،<br><em>با قهوه و نان تازه.</em>","قهوه روزانه، شیرینی تازه و انتخاب‌هایی برای صبحانه و برانچ.","TALOM · CAFÉ & BAKERY","MORNINGS MADE BETTER,<br><em>one cup at a time.</em>","Fresh coffee, bakery favourites and relaxed breakfast and brunch.","مشاهده منو","View the menu"],
restaurant:["TALOM · رستوران","برای ناهار و شام،<br><em>سر میز تالم.</em>","انتخاب‌های آشپزخانه تالم را ببین و برای حضورت درخواست رزرو بفرست.","TALOM · THE RESTAURANT","A GOOD MEAL,<br><em>worth sitting down for.</em>","Explore the kitchen menu and send a table request before your visit.","مشاهده منو","View the menu"],
menu:["TALOM · منو","از منوی تالم،<br><em>انتخاب کن.</em>","محصولات را جست‌وجو کن، جزئیات را ببین و به سبد خرید اضافه کن.","TALOM · THE MENU","FIND YOUR NEXT<br><em>favourite.</em>","Search the menu, explore each item and add your choices to the bag.","رفتن به منو","Explore the menu"],
events:["TALOM · مراسم و دورهمی","برای دورهمی‌های خوب،<br><em>جایی در تالم هست.</em>","برای جشن‌های کوچک، دورهمی‌ها و پذیرایی رویدادها با ما هماهنگ کن.","TALOM · PRIVATE GATHERINGS","MAKE ROOM FOR<br><em>good company.</em>","Tell us about your gathering, celebration or group dining plans.","ثبت درخواست مراسم","Send an event request"],
about:["TALOM · داستان ما","تالم؛<br><em>برای لحظه‌های باهم‌بودن.</em>","از قهوه اول صبح تا گفت‌وگوهای طولانی؛ اینجا برای مکث کردن ساخته شده.","TALOM · OUR STORY","A PLACE TO PAUSE,<br><em>a place to belong.</em>","From the first coffee to long conversations, discover the story of TALOM.","داستان ما را بخوان","Read our story"],
reservation:["TALOM · رزرو میز","میزت را<br><em>از قبل هماهنگ کن.</em>","اطلاعاتت را ثبت کن تا تیم تالم برای تأیید زمان و ظرفیت با تو تماس بگیرد.","TALOM · RESERVATIONS","YOUR TABLE,<br><em>thoughtfully arranged.</em>","Send a reservation request and our team will contact you to confirm availability.","رفتن به فرم رزرو","Go to reservation form"],
contact:["TALOM · ارتباط با ما","در تماس باش،<br><em>ما اینجاییم.</em>","برای پرسش، پیشنهاد یا همکاری، از راه‌های ارتباطی تالم استفاده کن.","TALOM · SAY HELLO","LET'S KEEP<br><em>in touch.</em>","For questions, feedback or collaboration, reach out to the TALOM team.","ارسال پیام","Send a message"]
};
const route=routeCopy[page],hero=$("#talom-route-hero");
if(route&&hero){setCopy($(".talom-route-copy>span",hero),route[0],route[3]);setCopy($(".talom-route-copy h1",hero),route[1],route[4]);setCopy($(".talom-route-copy>p",hero),route[2],route[5]);setCopy($(".talom-route-copy>a",hero),route[6]+" ↗",route[7]+" ↗");}
const home=$("#home"),experiences=$("#talom-home-experiences"),intro=$("#talom-home-intro"),events=$("#talom-home-events");
if(page==="home"&&home&&experiences&&intro&&events){
 home.classList.add("rep-home-hero");
 setCopy($(".full-hero-eyebrow",home),"TALOM · کافه، نانوایی و رستوران","TALOM · CAFÉ, BAKERY & RESTAURANT");
 setCopy($(".full-hero-content h1",home),"به تالم خوش آمدی؛<br><em>جایی برای باهم‌بودن.</em>","WELCOME<br><em>to TALOM.</em>");
 setCopy($(".full-hero-description",home),"از نان تازه و قهوه صبحگاهی تا یک وعده خوب و دورهمی‌های طولانی؛ تجربه تالم را کشف کن.","From fresh bakery and morning coffee to a relaxed meal and time together — discover TALOM.");
 const cta=$(".full-hero-actions a",home);if(cta){cta.href="/menu";setCopy($("span",cta),"دیدن منو","View the menu");}
 experiences.classList.add("rep-home-experiences");
 const cards=[
 {href:"/cafe-bakery",code:"01 / BAKERY",fa:"نانوایی و شیرینی",en:"Bakery & pastry",alt:"نان تازه و شیرینی",src:"https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1100&q=88"},
 {href:"/cafe-bakery",code:"02 / BRUNCH",fa:"صبحانه و برانچ",en:"Brunch",alt:"صبحانه و برانچ",src:"https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=88"},
 {href:"/cafe-bakery",code:"03 / COFFEE",fa:"قهوه",en:"Coffee",alt:"قهوه تازه",src:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=88"},
 {href:"/restaurant",code:"04 / DINING",fa:"ناهار و شام",en:"Dining",alt:"غذای رستوران",src:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=88"},
 {href:"/menu",code:"05 / SIGNATURES",fa:"انتخاب‌های ویژه",en:"TALOM signatures",alt:"نوشیدنی ویژه",src:"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=88"}
 ];
 experiences.innerHTML='<div class="rep-home-wrap"><div class="rep-home-section-head"><span class="rep-home-kicker">TALOM / OUR EXPERIENCES</span><p data-fa="پنج تجربه، یک میزبان" data-en="Five experiences, one place">پنج تجربه، یک میزبان</p></div><div class="rep-home-experience-grid">'+cards.map(c=>'<a class="rep-home-card" href="'+c.href+'"><img src="'+c.src+'" alt="'+c.alt+'" loading="lazy"><span>'+c.code+'</span><h2 data-fa="'+c.fa+'" data-en="'+c.en+'">'+c.fa+'</h2><b data-fa="کشف کن ↗" data-en="Discover ↗">کشف کن ↗</b></a>').join("")+'</div></div>';
 intro.classList.add("rep-home-intro");
 setCopy($("h2",intro),"یک خانه برای طعم‌ها؛<br><em>یک میز برای همه.</em>","A place for good food;<br><em>a table for everyone.</em>");
 setCopy($("p",intro),"تالم فقط یک فنجان قهوه نیست. اینجا می‌توانی روزت را با صبحانه شروع کنی، برای ناهار بمانی، عصر قهوه بنوشی و شب را کنار آدم‌های مورد علاقه‌ات تمام کنی.","TALOM is more than a cup of coffee. Start with breakfast, stay for lunch, take an afternoon coffee and make an evening of it.");
 const introLink=$("a",intro);if(introLink){introLink.href="/about";setCopy(introLink,"داستان تالم را بخوان ↗","Discover our story ↗");}
 events.classList.add("rep-home-events");
 events.innerHTML='<div class="rep-home-events-photo" role="img" aria-label="فضای دورهمی و پذیرایی"></div><div class="rep-home-events-copy"><span class="rep-home-kicker">PRIVATE GATHERINGS / TALOM</span><h2 data-fa="برای لحظه‌های مهم،<br><em>میزبانت می‌شویم.</em>" data-en="MAKE ROOM FOR<br><em>special moments.</em>">برای لحظه‌های مهم،<br><em>میزبانت می‌شویم.</em></h2><p data-fa="برای دورهمی‌های دوستانه، جشن‌های کوچک و پذیرایی گروهی، درخواستت را با تیم تالم در میان بگذار." data-en="For private gatherings, small celebrations and group dining, tell our team what you have in mind.">برای دورهمی‌های دوستانه، جشن‌های کوچک و پذیرایی گروهی، درخواستت را با تیم تالم در میان بگذار.</p><a href="/events"><span data-fa="آشنایی با مراسم و دورهمی‌ها" data-en="Explore private events">آشنایی با مراسم و دورهمی‌ها</span><b>↗</b></a></div>';
}
})();