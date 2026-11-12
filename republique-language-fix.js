(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s);
const page=document.body.dataset.page||"home";
const navItems=[
["/","خانه","Home"],["/cafe-bakery","کافه و نانوایی","Café & Bakery"],
["/restaurant","رستوران","Restaurant"],["/menu","منو و سفارش","Menu & Order"],
["/events","مراسم و دورهمی","Private Events"],["/about","داستان تالم","Our Story"],
["/reservation","رزرو میز","Reservations"],["/contact","تماس","Contact"]
];
const makeLinks=()=>navItems.map(([url,fa,en])=>'<a href="'+url+'" data-fa="'+fa+'" data-en="'+en+'">'+fa+'</a>').join("");
const nav=$("#mainNav");if(nav)nav.innerHTML=makeLinks();
const overlayNav=$("#talomRepubliqueOverlay nav");if(overlayNav)overlayNav.innerHTML=makeLinks();
const footerNav=$(".talom-footer-links");if(footerNav)footerNav.innerHTML=makeLinks();
const setCopy=(el,fa,en)=>{if(!el)return;el.dataset.fa=fa;el.dataset.en=en;el.innerHTML=fa;};
const headerCta=$("#siteHeader .header-cta");
if(headerCta){headerCta.href="/reservation";headerCta.innerHTML='<span data-fa="رزرو میز" data-en="Reserve a table">رزرو میز</span><span class="cta-arrow">↗</span>';}
const trigger=$("#siteHeader .talom-republique-trigger");
if(trigger)trigger.innerHTML='<span class="talom-republique-icon" aria-hidden="true"><i></i><i></i><i></i></span><span data-fa="فهرست" data-en="Menu">فهرست</span>';
const side=$("#talomRepubliqueOverlay .talom-republique-side");
if(side){const strong=$("strong",side);setCopy(strong,"تالم · کافه و رستوران","TALOM · Café & Restaurant");const sideLinks=[["#services","صرف در محل · بیرون‌بر · پذیرایی","Dine-in · Takeaway · Catering"],["#gallery","فضا و حال‌وهوای تالم","The TALOM space"],["#faq","اطلاعات کاربردی","Useful information"],["#footer","شبکه‌های اجتماعی و تماس","Social & Contact"]];[...side.querySelectorAll("a")].slice(0,4).forEach((a,i)=>{a.href=sideLinks[i][0];a.dataset.fa=sideLinks[i][1];a.dataset.en=sideLinks[i][2];a.textContent=sideLinks[i][1];});}
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
if(route&&hero){const span=$(".talom-route-copy>span",hero),h=$(".talom-route-copy h1",hero),p=$(".talom-route-copy>p",hero),a=$(".talom-route-copy>a span",hero);setCopy(span,route[0],route[3]);setCopy(h,route[1],route[4]);setCopy(p,route[2],route[5]);setCopy(a,route[6],route[7]);}
})();