(()=>{"use strict";
const base="/TALOM/";
const pages=new Set(["cafe-bakery","restaurant","menu","events","about","reservation","contact"]);
function normalizePath(path){
 if(path==="/"||path==="/TALOM"||path==="/TALOM/")return base+"index.html";
 let slug;
 if(path.startsWith(base))slug=path.slice(base.length);
 else if(path.startsWith("/"))slug=path.slice(1);
 else return path;
 while(slug.endsWith("/"))slug=slug.slice(0,-1);
 if(slug.endsWith(".html"))slug=slug.slice(0,-5);
 if(slug==="index")return base+"index.html";
 if(pages.has(slug.toLowerCase()))return base+slug.toLowerCase()+".html";
 return path.startsWith(base)?path:base+slug;
}
function rewrite(anchor){
 const raw=anchor.getAttribute("href");
 if(!raw||raw.startsWith("#")||raw.startsWith("//"))return;
 let url;
 try{url=new URL(raw,location.href)}catch{return}
 if(url.origin!==location.origin)return;
 const next=normalizePath(url.pathname);
 if(next!==url.pathname)anchor.setAttribute("href",next+url.search+url.hash);
}
function scan(root=document){
 if(root.matches&&root.matches("a[href]"))rewrite(root);
 if(root.querySelectorAll)root.querySelectorAll("a[href]").forEach(rewrite);
}
scan();
document.addEventListener("click",event=>{
 const anchor=event.target&&event.target.closest?event.target.closest("a[href]"):null;
 if(!anchor)return;
 const raw=anchor.getAttribute("href");
 if(!raw||raw.startsWith("#")||raw.startsWith("//"))return;
 let url;try{url=new URL(raw,location.href)}catch{return}
 if(url.origin!==location.origin)return;
 const next=normalizePath(url.pathname);
 if(next!==url.pathname){
  event.preventDefault();
  location.assign(next+url.search+url.hash);
 }
},true);
new MutationObserver(records=>records.forEach(record=>{
 if(record.type==="attributes")rewrite(record.target);
 if(record.addedNodes)record.addedNodes.forEach(node=>{if(node.nodeType===1)scan(node)});
})).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["href"]});
})();