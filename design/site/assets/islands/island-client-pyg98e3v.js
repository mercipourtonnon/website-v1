function us(r){if(r==null)return"";if(typeof r==="string")return r;try{return JSON.stringify(r)}catch{return String(r)}}
export{us};
