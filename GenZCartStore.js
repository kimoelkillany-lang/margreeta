(function(){
  const KEY = 'margreeta_genz_cart_v1';
  function read(){ try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e){ return []; } }
  function write(items){ try { localStorage.setItem(KEY, JSON.stringify(items)); } catch(e){} listeners.forEach(fn => fn(items)); }
  function cartKeyFor(dish){ return dish.slot + '::' + (dish.extras || []).map(e => e.key).sort().join(','); }
  let listeners = [];
  const Store = {
    getItems(){ return read(); },
    add(dish, country){
      const items = read();
      const extras = dish.extras || [];
      const cartKey = cartKeyFor(dish);
      const existing = items.find(i => i.cartKey === cartKey);
      if (existing) existing.qty += 1;
      else items.push({ cartKey, slot: dish.slot, name: dish.name, price: dish.price, extras, country, qty: 1 });
      write(items);
    },
    setQty(cartKey, qty){
      let items = read();
      if (qty <= 0) items = items.filter(i => (i.cartKey || i.slot) !== cartKey);
      else { const it = items.find(i => (i.cartKey || i.slot) === cartKey); if (it) it.qty = qty; }
      write(items);
    },
    remove(cartKey){ write(read().filter(i => (i.cartKey || i.slot) !== cartKey)); },
    clear(){ write([]); },
    total(){ return read().reduce((s,i) => s + i.price * i.qty, 0); },
    count(){ return read().reduce((s,i) => s + i.qty, 0); },
    subscribe(fn){ listeners.push(fn); return () => { listeners = listeners.filter(f => f !== fn); }; }
  };
  window.GenZCartStore = Store;
})();
