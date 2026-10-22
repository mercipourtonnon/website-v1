import{te,f}from"./island-client-spke4qqd.js";function re(e){let t=te(n,e).current;return t.next=e,f(t.effect),t}function n(e){let t={current:e,next:e,effect:()=>{t.current=t.next}};return t}
export{re};
