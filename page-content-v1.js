(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s),page=document.body.dataset.page||"home",main=$("main");
if(!main||page==="home")return;
const wrap=(kicker,title,copy)=>'<div class="tp-wrap"><span class="tp-kicker">'+kicker+'</span><h2>'+title+'</h2><p>'+copy+'</p></div>';
const section=(id,cls,html)=>{let el=$("#"+id);if(!el){el=document.createElement("section");el.id=id;el.className=cls;main.append(el);}el.innerHTML=html;el.className=cls;return el;};
const img=(url,alt)=>'<img src="'+url+'" alt="'+alt+'" loading="lazy">';
const cafe={
intro:section("tp-cafe-intro","tp-editorial-intro",'<div class="tp-wrap tp-intro-grid"><div><span class="tp-kicker">01 / CAFÉ & BAKERY</span><h2>صبح را با عطر نان،<br><em>و قهوه شروع کن.</em></h2></div><p>از قهوه‌های روزانه تا نان و شیرینی و انتخاب‌های صبحانه؛ اینجا بخش کافه و نانوایی تالم است. محصولات و قیمت‌های قابل سفارش را در منوی زنده پایین صفحه ببین.</p></div>'),
bakery:section("tp-cafe-bakery","tp-feature-split",'<div class="tp-feature-image">'+img("https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1500&q=88","نان تازه و شیرینی")+'</div><div class="tp-feature-copy"><span class="tp-kicker">02 / FROM THE BAKERY</span><h2>تازه از نانوایی،<br><em>برای میز تو.</em></h2><p>انتخاب‌های نانوایی و شیرینی تالم را کنار قهوه یا برای یک میان‌وعده سبک کشف کن. موجودی واقعی از منوی آنلاین نمایش داده می‌شود.</p><a href="#menu">دیدن نان و شیرینی‌ها ↗</a></div>'),
coffee:section("tp-cafe-coffee","tp-feature-split tp-feature-reverse",'<div class="tp-feature-image">'+img("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1500&q=88","قهوه تازه")+'</div><div class="tp-feature-copy"><span class="tp-kicker">03 / COFFEE & BRUNCH</span><h2>برای مکث‌های کوتاه،<br><em>و صبح‌های طولانی.</em></h2><p>قهوه گرم، نوشیدنی سرد و انتخاب‌های صبحانه را در منو مرور کن. با فیلترها می‌توانی دسته موردنظرت را سریع‌تر پیدا کنی.</p><a href="#menu">کشف منوی کافه ↗</a></div>'),
menu:section("tp-cafe-menu-lead","tp-menu-lead",'<div class="tp-wrap"><span class="tp-kicker">04 / THE CAFÉ MENU</span><h2>منوی کافه و نانوایی</h2><p>فقط انتخاب‌های مربوط به کافه، صبحانه، نوشیدنی و شیرینی را مرور کن.</p></div>')
};
const restaurant={
intro:section("tp-restaurant-intro","tp-editorial-intro",'<div class="tp-wrap tp-intro-grid"><div><span class="tp-kicker">01 / THE RESTAURANT</span><h2>یک میز برای غذا،<br><em>یک دلیل برای ماندن.</em></h2></div><p>بخش رستوران تالم برای انتخاب یک وعده کامل و گذراندن وقت کنار همراهانت است. در منوی پایین، دسته‌های مخصوص آشپزخانه را ببین؛ محصولات از فهرست واقعی و فعال تالم دریافت می‌شوند.</p></div>'),
ambience:section("tp-restaurant-ambience","tp-feature-split",'<div class="tp-feature-image">'+img("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1500&q=88","فضای غذاخوری و چیدمان میز")+'</div><div class="tp-feature-copy"><span class="tp-kicker">02 / THE TABLE</span><h2>برای ناهار، شام،<br><em>و دورهمی‌های خوب.</em></h2><p>از یک وعده دونفره تا جمع دوستانه، تجربه رستوران را با منوی به‌روز تالم شروع کن. اطلاعاتی مانند ترکیبات، قیمت و موجودی هر آیتم در جزئیات همان محصول نمایش داده می‌شود.</p><a href="#menu">رفتن به منوی رستوران ↗</a></div>'),
menuLead:section("tp-restaurant-menu-lead","tp-menu-lead",'<div class="tp-wrap"><span class="tp-kicker">03 / THE RESTAURANT MENU</span><h2>منوی رستوران تالم</h2><p>پیش‌غذا، غذای اصلی و دیگر دسته‌های ثبت‌شده رستوران را جست‌وجو کن. محصولات کافه در این فهرست نمایش داده نمی‌شوند.</p><div class="tp-category-links"><a href="#menu" data-tp-category="restaurant">همه غذاهای رستوران</a><a href="#menu" data-tp-category="appetizer">پیش‌غذا</a><a href="#menu" data-tp-category="main">غذای اصلی</a><a href="#menu" data-tp-category="pasta">پاستا</a><a href="#menu" data-tp-category="pizza">پیتزا</a><a href="#menu" data-tp-category="burger">برگر</a></div></div>'),
reserve:section("tp-restaurant-reserve","tp-reserve-banner",'<div class="tp-wrap"><span class="tp-kicker">04 / YOUR TABLE</span><h2>میزت را از قبل هماهنگ کن.</h2><p>درخواست رزرو را ثبت کن؛ تیم تالم پس از بررسی ظرفیت برای تأیید با تو تماس می‌گیرد.</p><a href="#reservation">درخواست رزرو میز ↗</a></div>')
};
const menuLead=section("tp-menu-intro","tp-menu-lead",'<div class="tp-wrap"><span class="tp-kicker">TALOM / THE MENU</span><h2>منو را به سلیقه خودت کشف کن.</h2><p>بین نوشیدنی‌ها، نانوایی، صبحانه و غذاهای رستوران جست‌وجو کن. هر محصول اطلاعات و قیمت خودش را دارد و می‌توانی آن را به سبد خرید اضافه کنی.</p></div>');
const events={
intro:section("tp-events-intro","tp-editorial-intro",'<div class="tp-wrap tp-intro-grid"><div><span class="tp-kicker">01 / PRIVATE EVENTS</span><h2>برای مناسبت‌ها،<br><em>میزبان دورهمی‌تانیم.</em></h2></div><p>برای یک جمع دوستانه، جشن کوچک یا برنامه گروهی، جزئیات اولیه را بفرست. تیم تالم پس از بررسی تاریخ، تعداد مهمان‌ها و امکان میزبانی با تو هماهنگ می‌کند.</p></div>'),
types:section("tp-events-types","tp-event-grid",'<article>'+img("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=88","میز جشن و دورهمی")+'<div><span class="tp-kicker">01 / CELEBRATIONS</span><h2>جشن‌ها و مناسبت‌های کوچک</h2><p>برای دورهمی‌های خانوادگی و دوستانه، تاریخ و تعداد مهمان‌ها را در فرم درخواست بنویس.</p></div></article><article>'+img("https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=88","پذیرایی گروهی")+'<div><span class="tp-kicker">02 / GROUP DINING</span><h2>پذیرایی و جمع‌های گروهی</h2><p>برای برنامه‌های گروهی و پذیرایی، نوع برنامه و نیازهای اولیه را توضیح بده.</p></div></article>'),
formLead:section("tp-events-form-lead","tp-menu-lead",'<div class="tp-wrap"><span class="tp-kicker">03 / MAKE AN ENQUIRY</span><h2>درباره برنامه‌ات با ما صحبت کن.</h2><p>فرم درخواست مراسم را تکمیل کن. ارسال درخواست به معنی تأیید قطعی رزرو نیست.</p></div>')
};
const about={
intro:section("tp-about-intro","tp-editorial-intro",'<div class="tp-wrap tp-intro-grid"><div><span class="tp-kicker">01 / OUR STORY</span><h2>تالم؛<br><em>برای کنار هم بودن.</em></h2></div><p>تالم را به‌عنوان فضایی برای قهوه، نانوایی، غذا و دیدارهای روزمره می‌شناسیم. هدف این صفحه معرفی تجربه و شیوه میزبانی مجموعه است؛ جزئیات تاریخی و اطلاعات تیم فقط پس از دریافت اطلاعات رسمی اضافه می‌شوند.</p></div>'),
story:section("tp-about-story","tp-feature-split",'<div class="tp-feature-image">'+img("https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1500&q=88","فضای داخلی کافه")+'</div><div class="tp-feature-copy"><span class="tp-kicker">02 / THE PLACE</span><h2>از قهوه صبحگاهی<br><em>تا وعده‌های طولانی.</em></h2><p>یک مجموعه، چند تجربه: کافه و نانوایی برای ساعت‌های آرام روز، رستوران برای وعده‌های کامل و فضایی برای دورهمی‌ها. منو و خدمات را در بخش‌های مربوط به خودشان ببین.</p><a href="/cafe-bakery">کشف بخش کافه ↗</a></div>'),
values:section("tp-about-values","tp-values",'<div class="tp-wrap"><span class="tp-kicker">03 / WHAT MATTERS</span><div class="tp-value-grid"><article><b>01</b><h3>میزبانی</h3><p>توجه به تجربه مهمان از انتخاب تا حضور.</p></article><article><b>02</b><h3>انتخاب</h3><p>منوی قابل مرور با جزئیات و قیمت هر محصول.</p></article><article><b>03</b><h3>باهم‌بودن</h3><p>فضایی برای قهوه، غذا و دیدار.</p></article></div></div>')
};
const reservation={
intro:section("tp-reservation-intro","tp-editorial-intro",'<div class="tp-wrap tp-intro-grid"><div><span class="tp-kicker">01 / RESERVATIONS</span><h2>برای میزت،<br><em>درخواست بفرست.</em></h2></div><p>تاریخ، ساعت و تعداد مهمان‌ها را ثبت کن. درخواست پس از بررسی ظرفیت توسط تیم تالم تأیید می‌شود؛ تکمیل فرم به معنی رزرو قطعی نیست.</p></div>'),
steps:section("tp-reservation-steps","tp-values",'<div class="tp-wrap"><span class="tp-kicker">02 / HOW IT WORKS</span><div class="tp-value-grid"><article><b>01</b><h3>ثبت اطلاعات</h3><p>نام، شماره تماس، تاریخ و تعداد نفرات را وارد کن.</p></article><article><b>02</b><h3>بررسی ظرفیت</h3><p>تیم تالم زمان پیشنهادی را بررسی می‌کند.</p></article><article><b>03</b><h3>تأیید نهایی</h3><p>پس از تماس و هماهنگی، رزرو نهایی می‌شود.</p></article></div></div>')
};
const contact={
intro:section("tp-contact-intro","tp-editorial-intro",'<div class="tp-wrap tp-intro-grid"><div><span class="tp-kicker">01 / CONTACT</span><h2>پیامت را<br><em>با ما در میان بگذار.</em></h2></div><p>برای پرسش درباره منو، سفارش، رزرو یا همکاری، فرم پیام را تکمیل کن. نشانی، شماره و ساعات کاری تا زمان دریافت اطلاعات رسمی به‌صورت فرضی نمایش داده نمی‌شوند.</p></div>')
};
const menu=$("#menu"),reservationForm=$("#reservation"),eventForm=$("#event-request"),contactForm=$("#contact-request");
const restaurantIds=["talom-route-hero","tp-restaurant-intro","tp-restaurant-ambience","tp-restaurant-menu-lead","menu","tp-restaurant-reserve","reservation"];
const cafeIds=["talom-route-hero","tp-cafe-intro","tp-cafe-bakery","tp-cafe-coffee","tp-cafe-menu-lead","menu","signature-banner"];
const ids={
cafe:cafeIds,
restaurant:restaurantIds,
menu:["talom-route-hero","tp-menu-intro","menu"],
events:["talom-route-hero","tp-events-intro","tp-events-types","tp-events-form-lead","events","event-request","gallery"],
about:["talom-route-hero","tp-about-intro","tp-about-story","tp-about-values","our-story","services"],
reservation:["talom-route-hero","tp-reservation-intro","tp-reservation-steps","reservation"],
contact:["talom-route-hero","tp-contact-intro","contact-request","contact"]
}[page]||[];
const keep=new Set(ids);
[...main.children].forEach(el=>{if(el.id==="talomExperience"||el.tagName==="FOOTER")return;el.hidden=!keep.has(el.id);});
ids.forEach(id=>{const el=$("#"+id);if(el&&el.parentElement===main)main.append(el);});
if(menu){
 const title=$(".section-heading h2",menu),desc=$(".section-heading>p",menu);
 const set=(el,fa,en)=>{if(el){el.dataset.fa=fa;el.dataset.en=en;el.innerHTML=fa;}};
 if(page==="restaurant"){set(title,"منوی <em>رستوران تالم</em>","THE <em>RESTAURANT MENU</em>");set(desc,"غذاهای رستوران را بر اساس دسته‌بندی انتخاب کن.","Explore the restaurant menu by category.");}
 if(page==="cafe"){set(title,"منوی <em>کافه و نانوایی</em>","THE <em>CAFÉ & BAKERY MENU</em>");set(desc,"قهوه، صبحانه، نان و شیرینی‌های تالم.","Coffee, brunch, bakery and pastry.");}
 if(page==="menu"){set(title,"منوی کامل <em>TALOM</em>","THE COMPLETE <em>TALOM MENU</em>");set(desc,"همه انتخاب‌های کافه و رستوران در یک‌جا.","All café and restaurant selections in one place.");}
 const tabs=$("#categoryTabs");
 if(tabs&&["restaurant","cafe"].includes(page)){
  const allowed=page==="restaurant"?["restaurant","appetizer","main","pasta","pizza","burger","sandwich","food"]:["cafe","coffee","cold","special","breakfast","bakery","dessert"];
  tabs.querySelectorAll("[data-category]").forEach(b=>b.hidden=!allowed.includes(b.dataset.category));
 }
}
document.querySelectorAll("[data-tp-category]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();const key=a.dataset.tpCategory,tab=$('#categoryTabs [data-category="'+key+'"]');if(tab){tab.click();$("#menu")?.scrollIntoView({behavior:"smooth"});}}));
const setFormHeading=(id,heading,copy)=>{const s=$("#"+id);if(!s)return;const h=$("h2",s),p=$("p",s);if(h)h.textContent=heading;if(p)p.textContent=copy;};
if(page==="restaurant")setFormHeading("reservation","رزرو میز رستوران","برای صرف غذا در رستوران، تاریخ و تعداد مهمان‌ها را ثبت کن. تیم تالم پس از بررسی ظرفیت با تو تماس می‌گیرد.");
if(page==="reservation")setFormHeading("reservation","درخواست رزرو میز در TALOM","تاریخ و ساعت پیشنهادی و تعداد مهمان‌ها را ثبت کن. رزرو پس از تأیید تیم تالم قطعی می‌شود.");
if(page==="events")setFormHeading("event-request","درخواست میزبانی مراسم","نوع برنامه، تاریخ پیشنهادی و تعداد مهمان‌ها را بنویس تا امکان میزبانی بررسی شود.");
if(page==="contact"){const f=$("#contact-request");if(f){const h=$("h2",f);if(h)h.textContent="ارسال پیام به تیم TALOM";}}
document.querySelectorAll('a[href^="#"]').forEach(a=>{const id=a.getAttribute("href").slice(1);if(!$("#"+id))return;if(a.closest("#tp-"))return;});
document.addEventListener("DOMContentLoaded",()=>{if(!["restaurant","cafe"].includes(page))return;const allowed=page==="restaurant"?["restaurant","appetizer","main","pasta","pizza","burger","sandwich","food"]:["cafe","coffee","cold","special","breakfast","bakery","dessert"];$("#categoryTabs")?.querySelectorAll("[data-category]").forEach(b=>b.hidden=!allowed.includes(b.dataset.category));});

})();