function Rl(t,n){return t.getAnimations(n).filter((e)=>{let i=e.effect?.getTiming();return i?.duration!==1/0&&i?.iterations!==1/0})}
export{Rl};
