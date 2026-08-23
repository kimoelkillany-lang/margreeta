(function(){
  const KEY = 'margreeta_genz_lang_v1';
  function read(){
    try {
      const v = localStorage.getItem(KEY);
      return (v === 'ar' || v === 'en') ? v : 'en';
    } catch(e){ return 'en'; }
  }
  function applyDom(lang){
    try {
      document.documentElement.setAttribute('lang', lang === 'ar' ? 'ar' : 'en');
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    } catch(e){}
  }
  let current = read();
  applyDom(current);
  let listeners = [];
  const Store = {
    get(){ return current; },
    set(lang){
      if (lang !== 'ar' && lang !== 'en') return;
      current = lang;
      try { localStorage.setItem(KEY, lang); } catch(e){}
      applyDom(lang);
      listeners.forEach(fn => fn(current));
    },
    toggle(){ Store.set(current === 'ar' ? 'en' : 'ar'); },
    subscribe(fn){ listeners.push(fn); return () => { listeners = listeners.filter(f => f !== fn); }; }
  };
  window.GenZLangStore = Store;
})();
