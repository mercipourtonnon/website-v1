var Rd="https://sovrium.invalid",r=(t)=>{if(typeof t!=="string"||t==="")return!1;if(!t.startsWith("/"))return!1;if(t.startsWith("//")||t.startsWith("/\\"))return!1;try{return new URL(t,"https://sovrium.invalid/").origin==="https://sovrium.invalid"}catch{return!1}},q=(t)=>{if(!r(t))return;try{return new URL(t,"https://sovrium.invalid/").href.slice(23)}catch{return}};
export{Rd,q};
