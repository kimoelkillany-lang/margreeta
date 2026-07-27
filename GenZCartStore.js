(function(){
  const KEY = 'margreeta_genz_cart_v1';
  function read(){ try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e){ return []; } }
  function write(items){ try { localStorage.setItem(KEY, JSON.stringify(items)); } catch(e){} listeners.forEach(fn => fn(items)); }
  let listeners = [];
  const Store = {
    getItems(){ return read(); },
    add(dish, country){
      const items = read();
      const existing = items.find(i => i.slot === dish.slot);
      if (existing) existing.qty += 1;
      else items.push({ slot: dish.slot, name: dish.name, price: dish.price, country, qty: 1 });
      write(items);
    },
    setQty(slot, qty){
      let items = read();
      if (qty <= 0) items = items.filter(i => i.slot !== slot);
      else { const it = items.find(i => i.slot === slot); if (it) it.qty = qty; }
      write(items);
    },
    remove(slot){ write(read().filter(i => i.slot !== slot)); },
    clear(){ write([]); },
    total(){ return read().reduce((s,i) => s + i.price * i.qty, 0); },
    count(){ return read().reduce((s,i) => s + i.qty, 0); },
    subscribe(fn){ listeners.push(fn); return () => { listeners = listeners.filter(f => f !== fn); }; }
  };
  window.GenZCartStore = Store;
})();
