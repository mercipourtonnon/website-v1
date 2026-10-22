function Je(n){let e=n.currentTarget,t=e instanceof Element&&(e.matches('[data-pending="true"]')||e.querySelector('[data-pending="true"]')!==null);if(t)n.preventDefault();return t}
export{Je};
