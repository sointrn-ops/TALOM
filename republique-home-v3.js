(()=>{"use strict";
if(document.body.dataset.page!=="home")return;
const $=(s,r=document)=>r.querySelector(s);
const setCopy=(el,fa,en)=>{if(!el)return;el.dataset.fa=fa;el.dataset.en=en;el.innerHTML=fa;};
const hero=$("#home"),experiences=$("#talom-home-experiences"),intro=$("#talom-home-intro"),events=$("#talom-home-events");
if(!hero||!experiences||!intro||!events)return;
hero.classList.add("rep-home-hero");
setCopy($(".full-hero-eyebrow",hero),"TALOM · کافه، نانوایی و رستوران","TALOM · CAFÉ, BAKERY & RESTAURANT");
setCopy($(".full-hero-content h1",hero),"به تالم خوش آمدی؛<br><em>جایی برای باهم‌بودن.</em>","WELCOME<br><em>to TALOM.</em>");
setCopy($(".full-hero-description",hero),"از نان تازه و قهوه صبحگاهی تا یک وعده خوب و دورهمی‌های طولانی؛ تجربه تالم را کشف کن.","From fresh bakery and morning coffee to a relaxed meal and time together — discover TALOM.");
const cta=$(".full-hero-actions a",hero);
if(cta){cta.href="/menu";cta.innerHTML='<span data-fa="دیدن منو" data-en="View the menu">دیدن منو</span><span aria-hidden="true">↗</span>';}
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
const introLink=$("a",intro);
if(introLink){introLink.dataset.fa="داستان تالم را بخوان ↗";introLink.dataset.en="Discover our story ↗";introLink.textContent=introLink.dataset.fa;}
events.classList.add("rep-home-events");
events.innerHTML='<div class="rep-home-events-photo" role="img" aria-label="فضای دورهمی و پذیرایی"></div><div class="rep-home-events-copy"><span class="rep-home-kicker">PRIVATE GATHERINGS / TALOM</span><h2 data-fa="برای لحظه‌های مهم،<br><em>میزبانت می‌شویم.</em>" data-en="MAKE ROOM FOR<br><em>special moments.</em>">برای لحظه‌های مهم،<br><em>میزبانت می‌شویم.</em></h2><p data-fa="برای دورهمی‌های دوستانه، جشن‌های کوچک و پذیرایی گروهی، درخواستت را با تیم تالم در میان بگذار." data-en="For private gatherings, small celebrations and group dining, tell our team what you have in mind.">برای دورهمی‌های دوستانه، جشن‌های کوچک و پذیرایی گروهی، درخواستت را با تیم تالم در میان بگذار.</p><a href="/events"><span data-fa="آشنایی با مراسم و دورهمی‌ها" data-en="Explore private events">آشنایی با مراسم و دورهمی‌ها</span><b>↗</b></a></div>';
})();