(()=>{"use strict";
const base="/TALOM/";
const pageNames=new Set(["cafe-bakery","restaurant","menu","events","about","reservation","contact"]);
function rewrite(anchor){
 const raw=anchor.getAttribute("href");
 if(!raw||raw.startsWith("#")||/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw))return;
 let url;
 try{url=new URL(raw,location.href);}catch{return;}
 if(url.origin!==location.origin)return;
 let path=url.pathname;
 if(path==="/"||path==="/TALOM"||path==="/TALOM/"){path=base+"index.html";}
 else{
  if(!path.startsWith(base))path=base+path.replace(/^\/+/, "");
  let slug=path.slice(base.length).replace(/\/$/,"");
  if(pageNames.has(slug.toLowerCase()))path=base+slug+".html";
 }
 anchor.setAttribute("href",path+url.search+url.hash);
}
function scan(root=document){
 if(root.matches?.("a[href]"))rewrite(root);
 root.querySelectorAll?.("a[href]").forEach(rewrite);
}
scan();
new MutationObserver(records=>records.forEach(record=>{
 if(record.type==="attributes")rewrite(record.target);
 record.addedNodes?.forEach(node=>{if(node.nodeType===1)scan(node);});
})).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["href"]});
})();