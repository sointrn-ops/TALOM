"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const toast=$("#toast");let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200)}
let bag=0;$$(".add").forEach(btn=>btn.addEventListener("click",()=>{bag++;$("#count").textContent=bag.toLocaleString("fa-IR");notify(btn.dataset.name+" به کیف خرید اضافه شد.")}));
$$("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{const filter=btn.dataset.filter;$$(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===filter));$$(".product").forEach(card=>card.hidden=filter!=="all"&&card.dataset.gender!==filter)}));
const models={women:{src:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=90",label:"WOMENSWEAR / LOOK 01",alt:"پیش‌نمایش مدل زنانه"},men:{src:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=90",label:"MENSWEAR / LOOK 01",alt:"پیش‌نمایش مدل مردانه"}};
$$("[data-model]").forEach(btn=>btn.addEventListener("click",()=>{const key=btn.dataset.model;$$("[data-model]").forEach(x=>x.classList.toggle("active",x===btn));const img=$("#modelImage");img.style.opacity="0";setTimeout(()=>{img.src=models[key].src;img.alt=models[key].alt;$("#modelLabel").textContent=models[key].label;img.style.opacity="1"},180)}));
$("#theme").addEventListener("click",()=>{const root=document.documentElement;root.dataset.theme=root.dataset.theme==="dark"?"light":"dark"});
$("#lang").addEventListener("click",()=>notify("نسخه انگلیسی در مرحله بعد تکمیل می‌شود."));
$("#bag").addEventListener("click",()=>notify(bag?bag+" آیتم در کیف خرید شماست.":"کیف خرید شما خالی است."));
$("#menuToggle").addEventListener("click",()=>$("#nav").classList.toggle("open"));
$$(".nav a").forEach(a=>a.addEventListener("click",()=>$("#nav").classList.remove("open")));
