(()=>{"use strict";
const base="/TALOM/";
const routes=new Set(["cafe-bakery","restaurant","menu","events","about","reservation","contact"]);
function rewrite(anchor){
 const href=anchor.getAttribute("href");
 if(!href||!href.startsWith("/")||href.startsWith("//")||href.startsWith(base))return;
 const match=href.match(/^\/([^?#]*)([?#].*)?$/);
 if(!match)return;
 let path=match[1],suffix=match[2]||"";
 if(!path){anchor.setAttribute("href",base+suffix);return;}
 if(routes.has(path))path+=".html";
 anchor.setAttribute("href",base+path+suffix);
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