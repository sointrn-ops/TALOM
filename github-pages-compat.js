(()=>{"use strict";
const base="/TALOM/";
const pageNames=new Set(["cafe-bakery","restaurant","menu","events","about","reservation","contact"]);
function rewrite(anchor){
 const raw=anchor.getAttribute("href");
 if(!raw||raw.startsWith("#")||/^(?:[a-z][a-z0-9+.-]*:|\\/\\/)/i.test(raw))return;
 let url;
 try{url=new URL(raw,location.href);}catch{return;}
 if(url.origin!==location.origin)return;
 let path=url.pathname;
 const inProject=path===base.slice(0,-1)||path.startsWith(base);
 if(path==="/"||path===base.slice(0,-1)||path===base){path=base+"index.html";}
 else{
  let slug;
  if(inProject)slug=path.slice(base.length).replace(/\\/$/,"");
  else if(path.startsWith("/"))slug=path.replace(/^\\//,"").replace(/\\/$/,"");
  else return;
  const clean=slug.replace(/\\.html?$/i,"").toLowerCase();
  if(pageNames.has(clean))path=base+clean+".html";
  else if(clean==="index")path=base+"index.html";
  else if(!inProject)return;
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