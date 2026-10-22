function de(e,r){if(typeof document>"u")return;document.dispatchEvent(new CustomEvent(e,{detail:r}))}function Be(e,r){if(typeof document>"u")return()=>{return};let n=(t)=>{let{detail:o}=t;r(o)};return document.addEventListener(e,n),()=>document.removeEventListener(e,n)}
export{de,Be};
