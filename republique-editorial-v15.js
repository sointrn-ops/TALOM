(()=>{"use strict";
function initTALOMIndex(){
 const trigger=document.getElementById("talomIndexToggle");
 const panel=document.getElementById("talomIndexPanel");
 const close=document.getElementById("talomIndexClose");
 if(!trigger||!panel||trigger.dataset.indexReady==="1") return;
 trigger.dataset.indexReady="1";
 const setOpen=(open)=>{
  panel.classList.toggle("open",open);
  panel.setAttribute("aria-hidden",String(!open));
  trigger.setAttribute("aria-expanded",String(open));
  panel.style.visibility=open?"visible":"hidden";
  panel.style.transform=open?"translateX(0)":"translateX(105%)";
  panel.style.pointerEvents=open?"auto":"none";
  document.body.classList.toggle("talom-index-open",open);
 };
 trigger.addEventListener("click",(event)=>{event.preventDefault();event.stopPropagation();setOpen(panel.getAttribute("aria-hidden")==="true"||!panel.classList.contains("open"));});
 close?.addEventListener("click",(event)=>{event.preventDefault();setOpen(false);});
 panel.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener("click",()=>setOpen(false)));
 document.addEventListener("keydown",event=>{if(event.key==="Escape")setOpen(false);});
 document.addEventListener("click",event=>{if(panel.classList.contains("open")&&!panel.contains(event.target)&&!trigger.contains(event.target))setOpen(false);});
 setOpen(false);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initTALOMIndex,{once:true});else initTALOMIndex();
})();