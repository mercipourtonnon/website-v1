import{q}from"./island-client-v7a2dzca.js";var r=/^https?:\/\//,Ht=(t)=>{if(typeof t!=="string"||t==="")return;if(t.startsWith("/"))return q(t);if(!r.test(t))return;try{let n=new URL(t);if(n.protocol!=="http:"&&n.protocol!=="https:")return;if(n.username!==""||n.password!=="")return;return n.href}catch{return}};
export{Ht};
