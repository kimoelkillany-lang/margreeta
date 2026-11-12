(function () {
  'use strict';
  var h = React.createElement, M = window.Margreeta;
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;
  /* Photos and logo live as files in img/ (they used to be inlined as base64). */
  var LOGO = 'img/logo.png';
  var PHOTOS = {};
  ['margherita', 'diavola', 'veggi', 'funghi', 'marinara', 'hot-honey-pepperoni', 'cheese-lovers', 'pastrami', 'nutella-star'].forEach(function (id) { PHOTOS[id] = 'img/' + id + '.jpg'; });

  /* ------------------------------------------------------------------ firebase (config comes from firebase-config.js) */
  var CFG = window.MARGREETA_FIREBASE || {};
  var NEEDS_SETUP = !CFG.apiKey || /PASTE/i.test(CFG.apiKey);
  var FB = (function () {
    if (NEEDS_SETUP || !window.firebase) return null; // SDK didn't load: run on this device only
    try {
      firebase.initializeApp(CFG);
      var auth = firebase.auth(), db = firebase.firestore();
      if (CFG.emulator) { auth.useEmulator('http://' + CFG.emulator.auth, { disableWarnings: true }); var p = CFG.emulator.firestore.split(':'); db.useEmulator(p[0], Number(p[1])); }
      // Offline persistence: orders are kept on the device and synced when the connection comes back.
      db.enablePersistence({ synchronizeTabs: true }).catch(function (e) { if (window.console) console.warn('Offline persistence is off on this device:', e && e.code); });
      return { auth: auth, db: db };
    } catch (e) { if (window.console) console.error('Firebase failed to start', e); return null; }
  })();

  /* ------------------------------------------------------------------ menu (from the World Tour menu) */
  var CATS = [
    { id: 'italy', stop: '01', label: 'Italy' }, { id: 'america', stop: '02', label: 'America' },
    { id: 'egypt', stop: '03', label: 'Egypt' }, { id: 'nutella', stop: '04', label: 'Nutella World' }, { id: 'drinks', label: 'Drinks' }
  ];
  var SIZES = ['Mini', 'Medium', 'Regular'];
  var MAKE_IT_YOURS = [['Buffalo mozzarella', 30], ['Parmesan', 35], ['Mushroom', 30], ['Olive oil', 20], ['Chili flakes', 15]];
  var NUTELLA_TOPS = [['Nuts', 45], ['Marshmallows', 45], ["M&M's", 45]];
  var MENU = [
    { id: 'margherita', cat: 'italy', name: 'Margherita', ar: 'مارجريتا', prices: [60, 160, 260], extra: ['Extra basil', 15], desc: 'Tomato sauce · Parmesan · Buffalo mozzarella · Fresh basil · Extra virgin olive oil' },
    { id: 'diavola', cat: 'italy', name: 'Diavola', ar: 'ديابولا', prices: [80, 220, 360], extra: ['Extra spicy salami', 35], tags: ['spicy'], desc: 'Tomato sauce · Parmesan · Buffalo mozzarella · Spicy salami · Olive oil' },
    { id: 'veggi', cat: 'italy', name: 'Veggi', ar: 'فيجي', prices: [65, 180, 290], extra: ['Extra arugula', 20], desc: 'Tomato sauce · Parmesan · Buffalo mozzarella · Fresh basil · Olive oil · Onion · Green pepper · Arugula' },
    { id: 'funghi', cat: 'italy', name: 'Funghi', ar: 'فونجي', prices: [75, 210, 340], tags: ['chefs'], desc: 'Tomato sauce · Parmesan · Buffalo mozzarella · Fresh basil · Extra virgin olive oil · Fresh mushroom' },
    { id: 'marinara', cat: 'italy', name: 'Marinara', ar: 'مارينارا', prices: [50, 135, 215], extra: ['Extra garlic', 15], desc: 'Tomato sauce · Parmesan · Fresh basil · Extra virgin olive oil · Garlic' },
    { id: 'hot-honey-pepperoni', cat: 'america', name: 'Hot Honey Pepperoni', short: 'Hot Honey Pep', ar: 'بيبروني بالعسل الحار', prices: [85, 240, 390], extra: ['Extra pepperoni', 30], tags: ['chefs', 'spicy'], desc: 'Tomato sauce · Parmesan · Buffalo mozzarella · Pepperoni · Hot honey sauce' },
    { id: 'cheese-lovers', cat: 'america', name: 'Cheese Lovers', ar: 'عشاق الجبنة', prices: [80, 215, 350], extra: ['Extra blue cheese', 35], desc: 'Tomato sauce · Mozzarella · Parmesan · Blue cheese' },
    { id: 'pastrami', cat: 'egypt', name: 'Pastrami', ar: 'باسترامي', prices: [80, 225, 365], extra: ['Extra pastrami', 40], tags: ['chefs'], desc: 'Tomato sauce · Buffalo mozzarella · Premium pastrami · Fresh parsley · Extra virgin olive oil' },
    { id: 'nutella-star', cat: 'nutella', name: 'Nutella Star', ar: 'نجمة نوتيلا', prices: [null, 165, 270], toppings: true, desc: 'Authentic Nutella · Nutella-filled crust · Neapolitan-style dough · Powdered sugar' },
    { id: 'sodas', cat: 'drinks', name: 'Sodas', ar: 'مشروبات غازية', price: 40, variants: ['Pepsi', 'Pepsi Diet', '7Up', 'Coca-Cola', 'Coca-Cola Zero', 'Sprite'], desc: '330ml can' },
    { id: 'schweppes', cat: 'drinks', name: 'Schweppes', ar: 'شويبس', price: 45, variants: ['Pomegranate', 'Tangerine'], desc: 'Sparkling · can' },
    { id: 'fayrouz', cat: 'drinks', name: 'Fayrouz', ar: 'فيروز', price: 45, variants: ['Pineapple', 'Apple', 'Pear'], desc: 'Malt drink · 330ml' },
    { id: 'water', cat: 'drinks', name: 'Water', ar: 'مياه معدنية', price: 25, variants: ['Still'], desc: 'Mineral · 600ml' }
  ];
  var BY_ID = {}; MENU.forEach(function (m) { BY_ID[m.id] = m; });
  var CHANNELS = [['pickup', 'Pickup'], ['delivery', 'Delivery'], ['website', 'margreeta.com'], ['talabat', 'Talabat'], ['clubhouse', 'Clubhouse']]; // all channels, for labels and reports
  var COUNTER_CHANNELS = ['clubhouse', 'pickup', 'delivery']; // the choices under New order, in this order
  var COMPOUNDS = ['Mountain View Chillout Park', 'Grand Heights', 'Green 5', 'NEOM October'];

  /* ------------------------------------------------------------------ helpers */
  function uid(n) { var s = ''; var c = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'; for (var i = 0; i < (n || 6); i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function fmt(n) { return M.formatMoney(n); }
  function egp(n) { return 'EGP ' + fmt(n); }
  function lineTotal(l) { return l.state === 'void' ? 0 : l.unit * l.qty; }
  function grossTotal(o) { return (o.lines || []).reduce(function (a, l) { return a + lineTotal(l); }, 0); }
  // Website promo codes (LOYAL10/LOYAL20) arrive as an order-level discount.
  function orderTotal(o) { return Math.max(0, grossTotal(o) - (Number(o.discount) || 0)); }
  // Checkout discounts (Take payment): none, 10%, 15% or 20% of the items. Website promo codes (LOYAL10/LOYAL20) map onto the same choices.
  var DISCOUNTS = [0, 10, 15, 20];
  function promoPct(code) { var m = /(\d+)$/.exec(code || ''); return m ? Number(m[1]) : 0; }
  function startPct(o) { var p = o.discountPct != null ? Number(o.discountPct) : promoPct(o.promoCode); return DISCOUNTS.indexOf(p) >= 0 ? p : 0; }
  function discountFor(gross, pct) { return Math.round(gross * pct / 100); }
  function discountLabel(o) { var p = o.discountPct != null ? Number(o.discountPct) : promoPct(o.promoCode); return (p ? 'Discount ' + p + '%' : 'Discount') + (o.promoCode && promoPct(o.promoCode) === p ? ' · ' + o.promoCode : ''); }
  // Record the discount chosen at payment on the order.
  function applyDiscount(o, d) {
    o.discountPct = d.pct; o.discount = d.amount;
    if (o.promoCode && promoPct(o.promoCode) !== d.pct) o.promoCode = '';
    o.total = orderTotal(o); return o;
  }
  // Customer details rules (Counter): full name = at least two names; phone = exactly 11 digits (e.g. 01012345678).
  function nameOk(n) { return String(n || '').trim().split(/\s+/).filter(function (w) { return w.length >= 2; }).length >= 2; }
  function cleanPhone(v) { return String(v || '').replace(/[\u0660-\u0669]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); }).replace(/[\u06F0-\u06F9]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); }).replace(/\D/g, '').slice(0, 11); }
  function phoneOk(p) { return /^[0-9]{11}$/.test(String(p || '')); }
  function chanLabel(id) { var c = CHANNELS.filter(function (x) { return x[0] === id; })[0]; return c ? c[1] : id; }
  function source(o) {
    if (o.channel === 'website' && o.fulfillment) return 'margreeta.com' + (o.customer ? ' · ' + o.customer : '') + (o.fulfillment === 'delivery' ? ' · Delivery ' + (o.compound ? o.compound.replace('Mountain View ', '') : '') : ' · Pickup' + (o.pickupTime ? ' ' + o.pickupTime : ''));
    if (o.channel === 'delivery') return 'Delivery · ' + (o.compound ? o.compound.replace('Mountain View ', '') : '') + (o.unit ? ' ' + o.unit : '');
    if (o.channel === 'pickup') return 'Pickup' + (o.customer ? ' · ' + o.customer : '');
    return chanLabel(o.channel) + (o.customer ? ' · ' + o.customer : '');
  }
  function clock(ts) { var d = new Date(ts); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
  function sizeShort(s) { return s === 'Medium' ? 'Med' : s === 'Regular' ? 'Reg' : s; }
  function fromPrice(m) { return m.prices.filter(function (p) { return p != null; })[0]; }
  function isToday(ts) { var a = new Date(ts), b = new Date(); return a.toDateString() === b.toDateString(); }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ------------------------------------------------------------------ store: shared db when available, this browser otherwise */
  /* Firestore can't store arrays inside arrays, so a line's extras ([[name, price]] in the app)
     are stored as [{name, price}] in the database and turned back into pairs when read. */
  function toDb(o) { o = clone(o); (o.lines || []).forEach(function (l) { l.extras = (l.extras || []).map(function (e) { return Array.isArray(e) ? { name: e[0], price: e[1] } : e; }); }); return o; }
  function fromDb(o) {
    (o.lines || []).forEach(function (l) { l.extras = (l.extras || []).map(function (e) { return Array.isArray(e) ? e : [e.name, e.price]; }); });
    // Website orders carry Firebase's own receive time. Use it instead of the customer's phone clock, which may be off.
    if (o.receivedAt && typeof o.receivedAt.toMillis === 'function') {
      var r = o.receivedAt.toMillis(), sent = o.createdAt;
      o.receivedAt = r;
      if (o.channel === 'website') { o.createdAt = r; if (o.firedAt === sent) o.firedAt = r; (o.lines || []).forEach(function (l) { if (l.firedAt === sent) l.firedAt = r; }); }
    }
    return o;
  }
  function monthStart(y, m) { return new Date(y, m, 1).getTime(); }

  /* Live listener covers this month and last month (Today, Kitchen and the recent Month reports).
     Older months are fetched once when you open them in the Month report, so the app stays fast as orders pile up. */
  var Store = { mode: 'connecting', orders: {}, soldOut: {}, db: null, subs: [], live: {}, older: {}, loaded: {}, since: 0, fromCache: true, unsub: [] };
  function emit() { Store.subs.forEach(function (f) { f(); }); }
  function useStore() { var s = useState(0); useEffect(function () { var f = function () { s[1](function (x) { return x + 1; }); }; Store.subs.push(f); return function () { Store.subs = Store.subs.filter(function (g) { return g !== f; }); }; }, []); return Store; }
  function loadLocal() { Store.orders = lsGet('mg-pos-orders', {}); Store.soldOut = lsGet('mg-pos-soldout', {}); }
  function goLocal() { stopStore(); Store.db = null; Store.mode = 'local'; loadLocal(); emit(); }
  function mergeOrders() { Store.orders = Object.assign({}, Store.older, Store.live); }
  function updateMode() { if (!Store.db) return; Store.mode = navigator.onLine && !Store.fromCache ? 'live' : 'offline'; }
  window.addEventListener('online', function () { updateMode(); emit(); });
  window.addEventListener('offline', function () { updateMode(); emit(); });
  var onAccessDenied = null;
  function storeError(e) {
    if (e && e.code === 'permission-denied') { if (onAccessDenied) onAccessDenied(); return; }
    goLocal(); toast('Lost the shared order list. Working on this device only — reload when the connection is back.');
  }
  function stopStore() { Store.unsub.forEach(function (u) { try { u(); } catch (e) {} }); Store.unsub = []; }
  function initStore() {
    stopStore();
    if (!FB) { goLocal(); return; }
    var db = FB.db, d = new Date();
    Store.db = db; Store.orders = {}; Store.live = {}; Store.older = {}; Store.loaded = {}; Store.soldOut = {};
    Store.since = monthStart(d.getFullYear(), d.getMonth() - 1); Store.fromCache = true; Store.mode = 'connecting'; emit();
    Store.unsub.push(db.collection('orders').where('createdAt', '>=', Store.since).onSnapshot({ includeMetadataChanges: true }, function (snap) {
      var o = {}; snap.docs.forEach(function (doc) { o[doc.id] = fromDb(doc.data()); });
      Store.live = o; Store.fromCache = snap.metadata.fromCache; mergeOrders(); updateMode(); emit();
    }, storeError));
    Store.unsub.push(db.doc('menu/state').onSnapshot(function (s) { Store.soldOut = (s.exists && s.data().soldOut) || {}; emit(); }, function () {}));
  }
  /* Load an older month (before the live window) for the Month report. */
  function ensureMonth(ym) {
    var start = monthStart(ym[0], ym[1]), key = ym[0] + '-' + ym[1];
    if (!Store.db || start >= Store.since || Store.loaded[key]) return;
    Store.loaded[key] = true;
    Store.db.collection('orders').where('createdAt', '>=', start).where('createdAt', '<', monthStart(ym[0], ym[1] + 1)).get().then(function (snap) {
      var older = Object.assign({}, Store.older); snap.docs.forEach(function (doc) { older[doc.id] = fromDb(doc.data()); });
      Store.older = older; mergeOrders(); emit();
    }).catch(function () { Store.loaded[key] = false; toast('Couldn\'t load ' + MONTHS[ym[1]] + '. Check the connection.'); });
  }
  function saveOrder(o) {
    o = clone(o); o.updatedAt = Date.now();
    if (Store.db) { var bucket = o.createdAt >= Store.since ? 'live' : 'older'; Store[bucket] = Object.assign({}, Store[bucket]); Store[bucket][o.id] = o; }
    var next = Object.assign({}, Store.orders); next[o.id] = o; Store.orders = next; emit();
    if (Store.db) return Store.db.doc('orders/' + o.id).set(toDb(o)).catch(function (e) { toast(e && e.code === 'resource-exhausted' ? 'Firebase limit reached: ' + o.id + ' was not saved. Check the Firebase plan.' : e && e.code === 'permission-denied' ? 'Not allowed to save ' + o.id + '. Sign in again.' : 'Could not save ' + o.id + '. Check the connection and try again.'); });
    lsSet('mg-pos-orders', Store.orders); return Promise.resolve();
  }
  function deleteAll() {
    var ids = Object.keys(Store.orders); Store.orders = {}; Store.live = {}; Store.older = {}; emit();
    if (Store.db) {
      var db = Store.db;
      return db.collection('orders').get().then(function (snap) {
        var all = {}; ids.forEach(function (id) { all[id] = true; }); snap.docs.forEach(function (doc) { all[doc.id] = true; });
        var keys = Object.keys(all), jobs = [];
        for (var i = 0; i < keys.length; i += 400) { var b = db.batch(); keys.slice(i, i + 400).forEach(function (id) { b.delete(db.doc('orders/' + id)); }); jobs.push(b.commit()); }
        return Promise.all(jobs);
      }).catch(function () { toast('Some orders could not be cleared. Try again.'); });
    }
    lsSet('mg-pos-orders', {}); return Promise.resolve();
  }
  function setSoldOut(id, on) {
    var s = Object.assign({}, Store.soldOut); if (on) s[id] = true; else delete s[id]; Store.soldOut = s; emit();
    if (Store.db) Store.db.doc('menu/state').set({ soldOut: s }).catch(function () { toast('Could not update sold-out list.'); });
    else lsSet('mg-pos-soldout', s);
  }

  /* toast */
  var toastFn = null; function toast(t) { if (toastFn) toastFn(t); }
  function Toast() {
    var s = useState(null);
    useEffect(function () { toastFn = function (t) { s[1]({ t: t, k: Date.now() }); }; }, []);
    useEffect(function () { if (!s[0]) return; var id = setTimeout(function () { s[1](null); }, 3200); return function () { clearTimeout(id); }; }, [s[0]]);
    return s[0] ? h('div', { className: 'toast ps-card', role: 'status' }, s[0].t) : null;
  }

  /* ------------------------------------------------------------------ item sheet */
  function ItemSheet(props) {
    var item = props.item, isDrink = !!item.variants, editing = props.line;
    var sz = useState(editing ? editing.size : (isDrink ? item.variants[0] : 'Regular'));
    var ex = useState(editing ? editing.extras.map(function (e) { return e[0]; }) : []);
    var qty = useState(editing ? editing.qty : 1);
    var note = useState(editing ? editing.note || '' : '');
    var extrasList = isDrink ? [] : item.toppings ? NUTELLA_TOPS : (item.extra ? [item.extra] : []).concat(MAKE_IT_YOURS);
    var basePrice = isDrink ? item.price : item.prices[SIZES.indexOf(sz[0])];
    var chosen = extrasList.filter(function (e) { return ex[0].indexOf(e[0]) >= 0; });
    var unit = basePrice + chosen.reduce(function (a, e) { return a + e[1]; }, 0);
    function toggle(n) { ex[1](ex[0].indexOf(n) >= 0 ? ex[0].filter(function (x) { return x !== n; }) : ex[0].concat([n])); }
    function add() {
      props.onAdd({ key: editing ? editing.key : uid(8), itemId: item.id, name: item.name, short: item.short || item.name, size: sz[0], extras: chosen, note: note[0].trim(), qty: qty[0], unit: unit, state: editing ? editing.state : 'new' });
    }
    useEffect(function () { var f = function (e) { if (e.key === 'Escape') props.onClose(); }; window.addEventListener('keydown', f); return function () { window.removeEventListener('keydown', f); }; }, []);
    var sizes = isDrink ? item.variants.map(function (v) { return { id: v, label: v, price: item.price }; }) : SIZES.map(function (s, i) { return { id: s, label: s, price: item.prices[i] }; }).filter(function (s) { return s.price != null; });
    return h('div', { className: 'scrim', onClick: function (e) { if (e.target === e.currentTarget) props.onClose(); } },
      h('div', { className: 'sheet ps-card', role: 'dialog', 'aria-modal': 'true', 'aria-label': item.name },
        h('div', { className: 'sheet-head' },
          PHOTOS[item.id] ? h('img', { className: 'ps-tile-photo sheet-photo', src: PHOTOS[item.id], alt: '' }) : null,
          h('div', { className: 'ps-col', style: { gap: '2px', minWidth: 0 } },
            h('h2', { className: 'title ps-up', style: { margin: 0 } }, item.name),
            h('span', { className: 'item-ar', style: { color: 'var(--arabic-ink)' }, lang: 'ar', dir: 'rtl' }, item.ar),
            h('span', { className: 'body', style: { color: 'var(--ink-muted)' } }, item.desc)),
          h('button', { className: 'close ps-press', onClick: props.onClose, 'aria-label': 'Close' }, h(M.Icon, { name: 'x', large: true }))),
        h('div', { className: 'sheet-sec' },
          h('div', { className: 'sticker sec-label' }, isDrink ? 'Flavour' : 'Size'),
          h('div', { className: 'size-wrap' }, h(M.SizePicker, { sizes: sizes, value: sz[0], onChange: sz[1], label: isDrink ? 'Flavour' : 'Size' }))),
        extrasList.length ? h('div', { className: 'sheet-sec' },
          h('div', { className: 'sticker sec-label' }, item.toppings ? 'Top it with' : 'Make it yours'),
          item.extra ? h('div', { className: 'note', style: { color: 'var(--brand-red)', marginBottom: '6px' } }, 'psst… add ' + item.extra[0].toLowerCase() + ' +' + item.extra[1]) : null,
          h('div', { className: 'chips' }, extrasList.map(function (e) {
            var on = ex[0].indexOf(e[0]) >= 0;
            return h('button', { key: e[0], type: 'button', className: 'chip ps-press' + (on ? ' on' : ''), 'aria-pressed': on, onClick: function () { toggle(e[0]); } },
              on ? h(M.Icon, { name: 'check' }) : null, h('span', null, e[0]), h('span', { className: 'chip-p' }, '+' + e[1]));
          }))) : null,
        h('div', { className: 'sheet-sec' },
          h('label', { className: 'sticker sec-label', htmlFor: 'line-note' }, 'Note for the kitchen'),
          h('input', { id: 'line-note', className: 'field', value: note[0], placeholder: 'e.g. cut in 8, well done', onChange: function (e) { note[1](e.target.value); } })),
        h('div', { className: 'sheet-foot' },
          h('div', { className: 'stepper' },
            h('button', { className: 'ps-key ps-press', onClick: function () { qty[1](Math.max(1, qty[0] - 1)); }, 'aria-label': 'One less' }, '−'),
            h('span', { className: 'price', 'aria-live': 'polite' }, qty[0]),
            h('button', { className: 'ps-key ps-press', onClick: function () { qty[1](qty[0] + 1); }, 'aria-label': 'One more' }, '+')),
          h(M.Button, { variant: 'send', size: 'lg', onClick: add, amount: egp(unit * qty[0]), className: 'grow' }, editing ? 'Update' : 'Add')),
        !editing ? h('button', { className: 'link', onClick: function () { setSoldOut(item.id, true); props.onClose(); toast(item.name + ' marked sold out'); } }, 'Mark ' + item.name + ' sold out') : null));
  }

  /* ------------------------------------------------------------------ pay sheet */
  function PaySheet(props) {
    var gross = grossTotal(props.order);
    var pct = useState(startPct(props.order));
    var discount = discountFor(gross, pct[0]), total = gross - discount;
    var method = useState('cash'), cash = useState(''), done = useState(null);
    var r50 = Math.ceil(total / 50) * 50, r100 = Math.ceil(total / 100) * 100, r200 = Math.ceil((total + 1) / 200) * 200;
    var quick = [total, r50 === total ? r50 + 50 : r50, r100 > r50 ? r100 : r100 + 100, r200].filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 3);
    var tendered = Number(cash[0] || 0);
    function finish(m, t) { var res = { method: m, tendered: t, change: Math.max(0, t - total) }; done[1](Object.assign({ total: total }, res)); props.onPaid(res, { pct: pct[0], amount: discount }); }
    useEffect(function () { var f = function (e) { if (e.key === 'Escape' && !done[0]) props.onClose(); }; window.addEventListener('keydown', f); return function () { window.removeEventListener('keydown', f); }; }, [done[0]]);
    if (done[0]) {
      return h('div', { className: 'scrim' }, h('div', { className: 'sheet ps-card paid', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Paid' },
        h(M.Ribbon, { words: ['Paid', 'Grazie'], repeat: 8 }),
        h('div', { className: 'paid-body' },
          h('div', { className: 'order-no' }, props.orderId),
          done[0].method === 'cash' ? h(React.Fragment, null,
            h('div', { className: 'sticker', style: { color: 'var(--ink-muted)' } }, 'CHANGE DUE'),
            h('div', { className: 'amount big-change' }, egp(done[0].change)),
            h('div', { className: 'body', style: { color: 'var(--ink-muted)' } }, 'Received ' + egp(done[0].tendered) + ' for ' + egp(done[0].total))) :
            h('div', { className: 'title' }, egp(done[0].total) + ' by ' + (done[0].method === 'card' ? 'card' : 'InstaPay')),
          h('div', { className: 'body' }, props.sentNote)),
        h('div', { className: 'sheet-foot' }, h(M.Button, { variant: 'send', size: 'lg', block: true, onClick: props.onClose, icon: 'send' }, 'New order'))));
    }
    return h('div', { className: 'scrim', onClick: function (e) { if (e.target === e.currentTarget) props.onClose(); } },
      h('div', { className: 'sheet ps-card pay', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Take payment' },
        h('div', { className: 'sheet-head' },
          h('div', { className: 'ps-col', style: { gap: '2px' } }, h('h2', { className: 'title ps-up', style: { margin: 0 } }, 'Take payment'), h('span', { className: 'meta', style: { color: 'var(--ink-muted)' } }, props.orderId + ' · ' + props.sourceText)),
          h('button', { className: 'close ps-press', onClick: props.onClose, 'aria-label': 'Close' }, h(M.Icon, { name: 'x', large: true }))),
        h('div', { className: 'pay-grid' },
          h('div', { className: 'ps-col', style: { gap: '16px' } },
            h('div', { className: 'ps-col', style: { gap: '6px' } },
              h('span', { className: 'sticker sec-label' }, 'Discount'),
              h('div', { className: 'ps-sizes', role: 'radiogroup', 'aria-label': 'Discount' }, DISCOUNTS.map(function (p) {
                return h('button', { key: p, role: 'radio', 'aria-checked': pct[0] === p ? 'true' : 'false', className: 'ps-size ps-press', onClick: function () { pct[1](p); } }, h('span', { className: 'price' }, p ? p + '%' : 'None'));
              }))),
            h(M.OrderTotals, { subtotal: gross, discount: discount, discountLabel: discountLabel({ discountPct: pct[0], promoCode: props.order.promoCode }), total: total }),
            h('div', { className: 'ps-sizes', role: 'radiogroup', 'aria-label': 'Payment method' }, [['cash', 'Cash'], ['card', 'Card'], ['instapay', 'InstaPay']].map(function (m) {
              return h('button', { key: m[0], role: 'radio', 'aria-checked': method[0] === m[0] ? 'true' : 'false', className: 'ps-size ps-press', onClick: function () { method[1](m[0]); } }, h('span', { className: 'price' }, m[1]));
            })),
            method[0] === 'cash' ? h('div', { className: 'ps-col', style: { gap: '2px' } },
              h('span', { className: 'sticker', style: { color: 'var(--ink-muted)' } }, 'CHANGE'),
              h('span', { className: 'amount' }, tendered >= total ? fmt(tendered - total) : '—'),
              tendered > 0 && tendered < total ? h('span', { className: 'meta', style: { color: 'var(--red-ink)' } }, 'Short by ' + egp(total - tendered)) : null) :
              h(M.Button, { variant: 'primary', size: 'lg', block: true, onClick: function () { finish(method[0], total); } }, 'Confirm ' + (method[0] === 'card' ? 'card' : 'InstaPay') + ' paid')),
          method[0] === 'cash' ? h(M.Keypad, { value: cash[0], onChange: function (v) { cash[1](v.replace(/\..*/, '')); }, quick: quick, label: 'Cash received', submitLabel: 'Take cash', onSubmit: function () { if (tendered < total) { toast('Cash received is less than the total.'); return; } finish('cash', tendered); } }) : null)));
  }

  /* ------------------------------------------------------------------ counter */
  function emptyDraft() { var d = lsGet('mg-pos-draft-meta', {}); return { id: null, channel: COUNTER_CHANNELS.indexOf(d.channel) >= 0 ? d.channel : 'clubhouse', customer: '', phone: '', compound: '', unit: '', lines: [] }; }
  function Counter(props) {
    var S = useStore();
    var cat = useState(lsGet('mg-pos-cat', 'italy'));
    var draft = props.draft, setDraft = props.setDraft;
    var sheet = useState(null), sel = useState(null), pay = useState(null), err = useState(''), checked = useState(false);
    var railRef = useRef(null);
    var items = MENU.filter(function (m) { return m.cat === cat[0]; });
    var qtyOf = {}; draft.lines.forEach(function (l) { if (l.state !== 'void') qtyOf[l.itemId] = (qtyOf[l.itemId] || 0) + l.qty; });
    var total = orderTotal(draft);
    var unsent = draft.lines.filter(function (l) { return l.state === 'new'; }).length;
    var existing = draft.id ? S.orders[draft.id] : null;
    var soldIds = Object.keys(S.soldOut || {}).filter(function (k) { return BY_ID[k]; });
    function set(p) { setDraft(Object.assign({}, draft, p)); }
    function addLine(l) {
      var lines = draft.lines.slice(), i = lines.findIndex(function (x) { return x.key === l.key; });
      if (i >= 0) lines[i] = l; else lines.push(l);
      set({ lines: lines }); sheet[1](null); sel[1](null);
    }
    function selLine() { return draft.lines.filter(function (l) { return l.key === sel[0]; })[0]; }
    function changeSel(fn) { set({ lines: draft.lines.map(function (l) { return l.key === sel[0] ? fn(Object.assign({}, l)) : l; }).filter(Boolean) }); }
    function validate() {
      if (!draft.lines.some(function (l) { return l.state !== 'void'; })) { err[1]('Add at least one item.'); return false; }
      if (!nameOk(draft.customer)) { err[1]('Enter the customer\u2019s full name: at least two names.'); checked[1](true); return false; }
      if (!phoneOk(draft.phone)) { err[1]('Enter an 11-digit phone number, e.g. 01012345678.'); checked[1](true); return false; }
      if (draft.channel === 'delivery' && !draft.compound) { err[1]('Pick the compound for this delivery.'); return false; }
      err[1](''); checked[1](false); return true;
    }
    function buildOrder(sendNow) {
      var now = Date.now(), base = existing ? clone(existing) : { id: draft.id || ('MG-' + uid(6)), createdAt: now, status: 'open', paid: false };
      ['channel', 'customer', 'phone', 'compound', 'unit'].forEach(function (k) { base[k] = draft[k]; });
      var hasNew = draft.lines.some(function (l) { return l.state === 'new'; });
      base.lines = draft.lines.map(function (l) { return sendNow && l.state === 'new' ? Object.assign({}, l, { state: 'sent', firedAt: now }) : l; });
      if (sendNow && hasNew) { var keep = existing && existing.status === 'kitchen' && existing.firedAt; base.firedAt = keep || now; base.status = 'kitchen'; }
      base.total = orderTotal(base);
      return base;
    }
    function send() {
      if (!validate()) return;
      var o = buildOrder(true); saveOrder(o);
      toast(o.id + ' sent to the kitchen'); lsSet('mg-pos-draft-meta', { channel: draft.channel }); setDraft(emptyDraft()); sel[1](null);
    }
    function charge() { if (!validate()) return; var o = buildOrder(false); if (!draft.id) set({ id: o.id }); pay[1](o); }
    function onPaid(res, d) {
      var o = applyDiscount(buildOrder(true), d); o.paid = true; o.paidAt = Date.now(); o.payment = res;
      if (o.status === 'open') o.status = 'done';
      saveOrder(o);
    }
    var sel0 = selLine();
    return h('div', { className: 'counter' },
      h('section', { className: 'menu-side', 'aria-label': 'Menu' },
        h(M.CategoryTabs, { items: CATS, value: cat[0], onChange: function (v) { cat[1](v); lsSet('mg-pos-cat', v); } }),
        soldIds.length ? h('div', { className: 'sold-row' }, h('span', { className: 'sticker', style: { color: 'var(--ink-muted)' } }, 'SOLD OUT · TAP TO RESTORE'),
          soldIds.map(function (id) { return h('button', { key: id, className: 'chip ps-press', onClick: function () { setSoldOut(id, false); toast(BY_ID[id].name + ' is back on'); } }, h(M.Icon, { name: 'ban' }), BY_ID[id].name); })) : null,
        h('div', { className: 'tile-grid' }, items.map(function (m) {
          return h(M.MenuItemTile, { key: m.id, name: m.name, nameAr: m.ar, price: m.variants ? m.price : fromPrice(m), fromLabel: m.variants ? (m.variants.length > 1 ? 'each' : false) : 'from', image: PHOTOS[m.id], tags: m.tags, qty: qtyOf[m.id] || 0, soldOut: !!S.soldOut[m.id], onClick: function () { sheet[1]({ item: m }); } });
        }))),
      h('aside', { className: 'rail ps-card', ref: railRef, 'aria-label': 'Current order' },
        h('div', { className: 'rail-head' },
          h('div', { className: 'rail-title' },
            h('span', { className: 'title ps-up' }, draft.id ? draft.id : 'New order'),
            existing ? h(M.StatusBadge, { status: existing.paid ? 'paid' : existing.status === 'ready' ? 'ready' : existing.status === 'kitchen' ? 'firing' : 'neutral' }, existing.paid ? 'Paid' : existing.status === 'kitchen' ? 'In kitchen' : existing.status === 'ready' ? 'Ready' : 'Open') : null),
          h('div', { className: 'chan-row', role: 'radiogroup', 'aria-label': 'Channel' }, CHANNELS.filter(function (c) { return COUNTER_CHANNELS.indexOf(c[0]) >= 0; }).sort(function (a, b) { return COUNTER_CHANNELS.indexOf(a[0]) - COUNTER_CHANNELS.indexOf(b[0]); }).map(function (c) {
            return h('button', { key: c[0], role: 'radio', 'aria-checked': draft.channel === c[0] ? 'true' : 'false', className: 'chan ps-press', onClick: function () { set({ channel: c[0] }); } }, c[1]);
          })),
          h('div', { className: 'fields' },
            h('input', { id: 'cust-name', className: 'field', placeholder: 'Customer full name', autoComplete: 'off', value: draft.customer, onChange: function (e) { set({ customer: e.target.value }); }, 'aria-label': 'Customer full name', 'aria-invalid': checked[0] && !nameOk(draft.customer) ? 'true' : undefined }),
            h('input', { id: 'cust-phone', className: 'field', placeholder: 'Phone (11 digits)', inputMode: 'numeric', autoComplete: 'off', value: draft.phone, onChange: function (e) { set({ phone: cleanPhone(e.target.value) }); }, 'aria-label': 'Phone, 11 digits', 'aria-invalid': checked[0] && !phoneOk(draft.phone) ? 'true' : undefined }),
            draft.channel === 'delivery' ? h('select', { id: 'compound', className: 'field', value: draft.compound, onChange: function (e) { set({ compound: e.target.value }); }, 'aria-label': 'Compound' },
              h('option', { value: '' }, 'Compound…'), COMPOUNDS.map(function (c) { return h('option', { key: c, value: c }, c); })) : null,
            draft.channel === 'delivery' ? h('input', { id: 'unit', className: 'field', placeholder: 'Unit / building', value: draft.unit, onChange: function (e) { set({ unit: e.target.value }); }, 'aria-label': 'Unit' }) : null)),
        h('div', { className: 'lines' }, draft.lines.length ? draft.lines.map(function (l) {
          var mods = [l.size].concat(l.extras.map(function (e) { return e[0]; }));
          return h(M.OrderLine, { key: l.key, qty: l.qty, name: l.name, modifiers: mods, note: l.note, price: lineTotal(l) || l.unit * l.qty, state: l.state, selected: sel[0] === l.key, onClick: function () { sel[1](sel[0] === l.key ? null : l.key); } });
        }) : h('div', { className: 'empty' }, h('div', { className: 'note', style: { color: 'var(--brand-red)' } }, 'first stop: pick a pizza'), h('div', { className: 'meta', style: { color: 'var(--ink-muted)' } }, 'Tap a tile to choose size and extras.'))),
        sel0 ? h('div', { className: 'line-actions' },
          h('button', { className: 'ps-key ps-press mini', onClick: function () { changeSel(function (l) { if (l.qty > 1) l.qty--; return l; }); }, disabled: sel0.state !== 'new', 'aria-label': 'One less' }, '−'),
          h('button', { className: 'ps-key ps-press mini', onClick: function () { changeSel(function (l) { l.qty++; return l; }); }, disabled: sel0.state !== 'new', 'aria-label': 'One more' }, '+'),
          sel0.state === 'new' ? h(M.Button, { onClick: function () { sheet[1]({ item: BY_ID[sel0.itemId], line: sel0 }); } }, 'Edit') : null,
          sel0.state === 'new' || sel0.state === 'held' ? h(M.Button, { variant: 'quiet', icon: 'pause', onClick: function () { changeSel(function (l) { l.state = l.state === 'held' ? 'new' : 'held'; return l; }); } }, sel0.state === 'held' ? 'Release' : 'Hold') : null,
          sel0.state === 'new' ? h(M.Button, { variant: 'danger', icon: 'x', onClick: function () { set({ lines: draft.lines.filter(function (l) { return l.key !== sel[0]; }) }); sel[1](null); } }, 'Remove') :
            sel0.state !== 'void' ? h(M.Button, { variant: 'danger', icon: 'x', onClick: function () { changeSel(function (l) { l.state = 'void'; return l; }); sel[1](null); toast(sel0.name + ' voided'); } }, 'Void') : null) : null,
        h('div', { className: 'rail-foot' },
          h(M.OrderTotals, { subtotal: grossTotal(draft), discount: draft.discount || 0, discountLabel: discountLabel(draft), total: total }),
          err[0] ? h('div', { className: 'meta', role: 'alert', style: { color: 'var(--red-ink)' } }, err[0]) : null,
          h('div', { className: 'foot-btns' },
            existing && existing.paid ? h(M.Button, { size: 'lg', onClick: function () { setDraft(emptyDraft()); } }, 'Done') :
              h(M.Button, { variant: 'primary', size: 'lg', amount: egp(total), disabled: !total, onClick: charge }, 'Charge'),
            h(M.Button, { variant: 'send', size: 'lg', icon: 'send', disabled: !unsent, onClick: send }, unsent ? 'Send to kitchen' : 'Nothing to send')),
          draft.lines.length || draft.id ? h('button', { className: 'link', onClick: function () { setDraft(emptyDraft()); sel[1](null); err[1](''); checked[1](false); } }, draft.id ? 'Close this order' : 'Clear order') : null)),
      total ? h('button', { className: 'jump ps-press', onClick: function () { railRef.current && railRef.current.scrollIntoView({ behavior: 'smooth' }); } }, h('span', null, draft.lines.length + ' items'), h('span', { className: 'price' }, egp(total))) : null,
      sheet[0] ? h(ItemSheet, { item: sheet[0].item, line: sheet[0].line, onAdd: addLine, onClose: function () { sheet[1](null); } }) : null,
      pay[0] ? h(PaySheet, { order: pay[0], orderId: pay[0].id, sourceText: source(pay[0]), sentNote: unsent ? 'Unsent items went to the kitchen.' : '', onPaid: onPaid, onClose: function () { var wasPaid = Store.orders[pay[0].id] && Store.orders[pay[0].id].paid; pay[1](null); if (wasPaid) { lsSet('mg-pos-draft-meta', { channel: draft.channel }); setDraft(emptyDraft()); } } }) : null);
  }

  /* ------------------------------------------------------------------ kitchen */
  function Kitchen() {
    var S = useStore(), t = useState(Date.now());
    useEffect(function () { var id = setInterval(function () { t[1](Date.now()); }, 1000); return function () { clearInterval(id); }; }, []);
    var all = Object.keys(S.orders).map(function (k) { return S.orders[k]; });
    var firing = all.filter(function (o) { return o.status === 'kitchen'; }).sort(function (a, b) { return a.firedAt - b.firedAt; });
    var ready = all.filter(function (o) { return o.status === 'ready'; }).sort(function (a, b) { return a.readyAt - b.readyAt; });
    function ticket(o, isReady) {
      var since = Math.max(0, (isReady ? o.readyAt - o.firedAt : t[0] - o.firedAt) / 1000); // never below 00:00 (tablet clocks can differ slightly)
      var items = (o.lines || []).filter(function (l) { return l.state === 'sent' || l.state === 'held'; }).map(function (l) {
        return { qty: l.qty, name: (l.short || l.name), size: BY_ID[l.itemId] && BY_ID[l.itemId].variants ? l.size : sizeShort(l.size), mods: l.extras.map(function (e) { return e[0].toLowerCase(); }).concat(l.note ? [l.note] : []).concat(l.state === 'held' ? ['hold — wait for call'] : []), done: isReady };
      });
      var newish = !isReady && since < 60;
      return h('div', { key: o.id, className: 'ticket-wrap' },
        h(M.KitchenTicket, { number: o.id, source: source(o), minutes: Math.floor(since / 60), seconds: Math.floor(since % 60), status: isReady ? 'ready' : newish ? 'new' : 'firing', items: items,
          onBump: function () { var n = clone(o); if (isReady) { n.status = 'kitchen'; delete n.readyAt; } else { n.status = 'ready'; n.readyAt = Date.now(); } saveOrder(n); } }),
        isReady ? h(M.Button, { variant: 'primary', block: true, onClick: function () { var n = clone(o); n.status = 'done'; n.doneAt = Date.now(); saveOrder(n); toast(o.id + (o.channel === 'delivery' ? ' out for delivery' : ' handed over')); } }, o.channel === 'delivery' ? 'Out for delivery' : 'Picked up') : null,
        !o.paid ? h('div', { className: 'unpaid sticker' }, 'NOT PAID YET') : null);
    }
    return h('div', { className: 'kitchen' },
      h('div', { className: 'k-head' },
        h('h2', { className: 'headline ps-pop' }, 'On the fire'),
        h('div', { className: 'k-stats' }, h(M.StatusBadge, { status: 'firing' }, firing.length + ' firing'), h(M.StatusBadge, { status: 'ready' }, ready.length + ' ready'))),
      firing.length ? h('div', { className: 'tickets' }, firing.map(function (o) { return ticket(o, false); })) :
        h('div', { className: 'k-empty' }, h('div', { className: 'note', style: { color: 'var(--gold)' } }, 'ovens are hot, no tickets yet'), h('div', { className: 'meta', style: { color: 'var(--ink-muted)' } }, 'Orders sent from the counter appear here, oldest first.')),
      ready.length ? h(React.Fragment, null, h(M.Ribbon, { words: ['Ready at the pass'], repeat: 10 }), h('div', { className: 'tickets' }, ready.map(function (o) { return ticket(o, true); }))) : null);
  }

  /* ------------------------------------------------------------------ orders */
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var PAY_LABEL = { cash: 'Cash', card: 'Card', instapay: 'InstaPay' };
  function inMonth(ts, ym) { var d = new Date(ts); return d.getFullYear() === ym[0] && d.getMonth() === ym[1]; }
  function isPizza(l) { return BY_ID[l.itemId] && !BY_ID[l.itemId].variants; }
  function live(o) { return o.status !== 'void'; }
  function summarize(list) {
    var orders = list.filter(live), paid = orders.filter(function (o) { return o.paid; });
    var revenue = paid.reduce(function (a, o) { return a + orderTotal(o); }, 0);
    var pizzas = 0; orders.forEach(function (o) { (o.lines || []).forEach(function (l) { if (l.state !== 'void' && isPizza(l)) pizzas += l.qty; }); });
    return { orders: orders, paid: paid, revenue: revenue, pizzas: pizzas, avg: paid.length ? Math.round(revenue / paid.length) : 0 };
  }
  function StatTiles(props) {
    return h('div', { className: 'stats' }, props.tiles.map(function (s) {
      return h('div', { key: s[0], className: 'stat ps-card' }, h('div', { className: 'sticker', style: { color: 'var(--ink-muted)' } }, s[0].toUpperCase()), h('div', { className: 'amount stat-n' }, s[1]), s[2] ? h('div', { className: 'meta', style: { color: 'var(--ink-muted)' } }, s[2]) : null);
    }));
  }
  function DayChart(props) {
    var ym = props.ym, days = new Date(ym[0], ym[1] + 1, 0).getDate(), by = [];
    for (var i = 0; i < days; i++) by.push(0);
    props.paid.forEach(function (o) { by[new Date(o.paidAt || o.createdAt).getDate() - 1] += orderTotal(o); });
    var max = Math.max.apply(null, by.concat([1])), W = 700, H = 200, L = 8, B = 26, T = 22, bw = (W - L * 2) / days;
    var now = new Date(), todayIdx = now.getFullYear() === ym[0] && now.getMonth() === ym[1] ? now.getDate() - 1 : -1;
    var best = by.indexOf(Math.max.apply(null, by));
    return h('div', { className: 'ps-card chart-card' },
      h('div', { className: 'card-h' }, h('span', { className: 'title ps-up' }, 'Paid by day'), max > 1 ? h('span', { className: 'meta', style: { color: 'var(--ink-muted)' } }, 'Best day: ' + (best + 1) + ' ' + MONTHS[ym[1]].slice(0, 3) + ' · ' + egp(by[best])) : null),
      h('svg', { className: 'chart', viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Paid revenue for each day of ' + MONTHS[ym[1]] },
        h('line', { className: 'c-axis', x1: L, x2: W - L, y1: H - B, y2: H - B }),
        by.map(function (v, i) {
          var bh = v ? Math.max(3, (H - B - T) * v / max) : 0, x = L + i * bw + 2;
          return h('g', { key: i },
            v ? h('rect', { className: 'c-bar' + (i === todayIdx ? ' today' : ''), x: x, y: H - B - bh, width: Math.max(2, bw - 4), height: bh, rx: 3 }, h('title', null, (i + 1) + ' ' + MONTHS[ym[1]] + ': ' + egp(v))) : null,
            (i === 0 || (i + 1) % 5 === 0) ? h('text', { className: 'c-lbl', x: x + (bw - 4) / 2, y: H - 8, textAnchor: 'middle' }, i + 1) : null,
            i === best && v ? h('text', { className: 'c-val', x: Math.min(W - 40, Math.max(30, x + (bw - 4) / 2)), y: H - B - bh - 6, textAnchor: 'middle' }, fmt(v)) : null);
        })));
  }
  function Breakdown(props) {
    return h('div', { className: 'ps-card table-card' },
      h('div', { className: 'card-h' }, h('span', { className: 'title ps-up' }, props.title), props.note ? h('span', { className: 'meta', style: { color: 'var(--ink-muted)' } }, props.note) : null),
      h('div', { className: 'tbl-wrap' }, h('table', { className: 'tbl' },
        h('thead', null, h('tr', null, props.cols.map(function (c, i) { return h('th', { key: i, className: 'sticker' + (i ? ' num' : '') }, c); }))),
        h('tbody', null, props.rows.length ? props.rows.map(function (r, i) { return h('tr', { key: i, className: r.total ? 'tot' : '' }, r.cells.map(function (c, j) { return h('td', { key: j, className: j ? 'num' : '' }, c); })); }) :
          h('tr', null, h('td', { colSpan: props.cols.length, className: 'meta', style: { color: 'var(--ink-muted)' } }, 'Nothing this month yet.'))))));
  }
  function MonthReport(props) {
    var ym = props.ym, all = props.list, s = summarize(all);
    var label = MONTHS[ym[1]] + ' ' + ym[0];
    var items = {}, ordersCount = s.orders.length;
    s.orders.forEach(function (o) { (o.lines || []).forEach(function (l) {
      if (l.state === 'void') return;
      var k = l.itemId; var it = items[k] || (items[k] = { name: l.name, drink: !isPizza(l), Mini: 0, Medium: 0, Regular: 0, qty: 0, rev: 0, paidRev: 0 });
      if (!it.drink) it[l.size] = (it[l.size] || 0) + l.qty; it.qty += l.qty; it.rev += l.unit * l.qty;
    }); });
    var pizzaRows = MENU.filter(function (m) { return items[m.id] && !items[m.id].drink; }).map(function (m) { var it = items[m.id]; return it; }).sort(function (a, b) { return b.qty - a.qty; });
    var drinkRows = MENU.filter(function (m) { return items[m.id] && items[m.id].drink; }).map(function (m) { return items[m.id]; }).sort(function (a, b) { return b.qty - a.qty; });
    var sum = function (arr, k) { return arr.reduce(function (a, x) { return a + x[k]; }, 0); };
    var pay = {}; s.paid.forEach(function (o) { var m = (o.payment && o.payment.method) || 'cash'; pay[m] = pay[m] || { n: 0, v: 0 }; pay[m].n++; pay[m].v += orderTotal(o); });
    var chan = {}; s.orders.forEach(function (o) { chan[o.channel] = chan[o.channel] || { n: 0, v: 0 }; chan[o.channel].n++; chan[o.channel].v += orderTotal(o); });
    var unpaid = s.orders.filter(function (o) { return !o.paid; }), voided = all.filter(function (o) { return !live(o); });
    var unpaidV = unpaid.reduce(function (a, o) { return a + orderTotal(o); }, 0);
    return h('div', { className: 'month' },
      h(StatTiles, { tiles: [['Orders', ordersCount, unpaid.length ? unpaid.length + ' not paid yet' : 'all paid'], ['Paid revenue', egp(s.revenue)], ['Pizzas sold', s.pizzas, ordersCount ? (s.pizzas / ordersCount).toFixed(1) + ' per order' : ''], ['Average order', s.paid.length ? egp(s.avg) : '—', 'paid orders']] }),
      h(DayChart, { ym: ym, paid: s.paid }),
      h('div', { className: 'two-col' },
        h(Breakdown, { title: 'Pizzas', note: 'by size, all non-void orders', cols: ['Pizza', 'Mini', 'Med', 'Reg', 'Total', 'EGP'],
          rows: pizzaRows.map(function (r) { return { cells: [r.name, r.Mini || '–', r.Medium || '–', r.Regular || '–', r.qty, fmt(r.rev)] }; }).concat(pizzaRows.length ? [{ total: true, cells: ['Total', sum(pizzaRows, 'Mini'), sum(pizzaRows, 'Medium'), sum(pizzaRows, 'Regular'), sum(pizzaRows, 'qty'), fmt(sum(pizzaRows, 'rev'))] }] : []) }),
        h('div', { className: 'ps-col', style: { gap: '24px' } },
          h(Breakdown, { title: 'Money in', note: 'paid orders', cols: ['Method', 'Orders', 'EGP'],
            rows: ['cash', 'card', 'instapay'].filter(function (m) { return pay[m]; }).map(function (m) { return { cells: [PAY_LABEL[m], pay[m].n, fmt(pay[m].v)] }; }).concat(s.paid.length ? [{ total: true, cells: ['Total', s.paid.length, fmt(s.revenue)] }] : []) }),
          h(Breakdown, { title: 'Channels', cols: ['Channel', 'Orders', 'EGP'],
            rows: CHANNELS.filter(function (c) { return chan[c[0]]; }).map(function (c) { return { cells: [c[1], chan[c[0]].n, fmt(chan[c[0]].v)] }; }) }),
          drinkRows.length ? h(Breakdown, { title: 'Drinks', cols: ['Drink', 'Qty', 'EGP'], rows: drinkRows.map(function (r) { return { cells: [r.name, r.qty, fmt(r.rev)] }; }) }) : null)),
      unpaid.length || voided.length ? h('div', { className: 'ps-card flag-card' },
        unpaid.length ? h('div', null, h('span', { className: 'title ps-up' }, 'Not paid yet · ' + egp(unpaidV)), h('div', { className: 'meta', style: { color: 'var(--ink-muted)' } }, 'Not counted in paid revenue. Take payment or void them before closing the month.'),
          h('div', { className: 'flag-ids' }, unpaid.map(function (o) { return h('button', { key: o.id, className: 'chip ps-press', onClick: function () { props.focus(o.id); } }, h('span', { className: 'order-no', style: { fontSize: '14px' } }, o.id), h('span', { className: 'chip-p' }, fmt(orderTotal(o)))); }))) : null,
        voided.length ? h('div', { className: 'meta', style: { color: 'var(--ink-muted)' } }, voided.length + ' voided order' + (voided.length > 1 ? 's' : '') + ' (' + egp(voided.reduce(function (a, o) { return a + orderTotal(o); }, 0)) + ') left out of every total above.') : null) : null,
      h('div', { className: 'export-row' },
        h(M.Button, { icon: 'receipt', onClick: function () { props.exportCsv(label); }, disabled: !all.length }, 'Export ' + MONTHS[ym[1]] + ' to spreadsheet'),
        h('span', { className: 'meta', style: { color: 'var(--ink-muted)' } }, 'CSV, one row per item sold. Opens in Excel or Google Sheets.')));
  }
  function csvFor(list) {
    var esc = function (v) { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var rows = [['Date', 'Time', 'Order ID', 'Channel', 'Customer', 'Phone', 'Compound', 'Unit', 'Order status', 'Paid', 'Payment method', 'Item', 'Size / flavour', 'Extras', 'Note', 'Qty', 'Unit price (EGP)', 'Line total (EGP)', 'Line voided', 'Order total (EGP)', 'Order discount (EGP)']];
    list.slice().sort(function (a, b) { return a.createdAt - b.createdAt; }).forEach(function (o) {
      var d = new Date(o.createdAt), date = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      (o.lines || []).forEach(function (l) {
        rows.push([date, clock(o.createdAt), o.id, chanLabel(o.channel), o.customer, o.phone, o.compound, o.unit, o.status === 'void' ? 'Void' : o.status === 'done' ? 'Done' : o.status === 'ready' ? 'Ready' : o.status === 'kitchen' ? 'In kitchen' : 'Open',
          o.paid ? 'Yes' : 'No', o.paid ? PAY_LABEL[(o.payment && o.payment.method) || 'cash'] : '', l.name, l.size, l.extras.map(function (e) { return e[0] + ' +' + e[1]; }).join('; '), l.note, l.qty, l.unit, l.state === 'void' ? 0 : l.unit * l.qty, l.state === 'void' ? 'Yes' : 'No', orderTotal(o), Number(o.discount) || 0]);
      });
    });
    return '﻿' + rows.map(function (r) { return r.map(esc).join(','); }).join('\r\n');
  }
  function Orders(props) {
    var S = useStore(), filt = useState('all'), open = useState(null), confirm = useState(false), paying = useState(null);
    var range = useState(lsGet('mg-pos-range', 'today'));
    var now = new Date(), ym = useState([now.getFullYear(), now.getMonth()]);
    useEffect(function () { if (range[0] === 'month') ensureMonth(ym[0]); }, [range[0], ym[0][0], ym[0][1]]);
    var list = Object.keys(S.orders).map(function (k) { return S.orders[k]; }).sort(function (a, b) { return b.createdAt - a.createdAt; });
    var scoped = range[0] === 'today' ? list.filter(function (o) { return isToday(o.createdAt); }) : list.filter(function (o) { return inMonth(o.createdAt, ym[0]); });
    var shown = scoped.filter(function (o) { return filt[0] === 'all' || (filt[0] === 'unpaid' ? !o.paid && o.status !== 'void' : filt[0] === 'active' ? (o.status === 'kitchen' || o.status === 'ready' || o.status === 'open') : o.status === 'done'); });
    var t = summarize(scoped);
    function setRange(r) { range[1](r); lsSet('mg-pos-range', r); }
    function shift(n) { var y = ym[0][0], m = ym[0][1] + n; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } ym[1]([y, m]); }
    var isCurrent = ym[0][0] === now.getFullYear() && ym[0][1] === now.getMonth();
    function exportCsv(label) {
      var monthList = list.filter(function (o) { return inMonth(o.createdAt, ym[0]); });
      var name = 'margreeta-orders-' + ym[0][0] + '-' + String(ym[0][1] + 1).padStart(2, '0') + '.csv';
      try {
        // Plain browser download. csvFor() starts with a UTF-8 BOM so Excel shows Arabic names correctly.
        var url = URL.createObjectURL(new Blob([csvFor(monthList)], { type: 'text/csv;charset=utf-8' }));
        var a = document.createElement('a'); a.href = url; a.download = name; a.style.display = 'none';
        document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1000);
        toast(label + ' exported');
      } catch (e) { toast('Couldn\'t export the file here.'); }
    }
    function st(o) { return o.status === 'void' ? ['void', 'Void'] : o.status === 'kitchen' ? ['firing', 'In kitchen'] : o.status === 'ready' ? ['ready', 'Ready'] : o.status === 'done' ? ['paid', 'Done'] : ['neutral', 'Open']; }
    return h('div', { className: 'orders' },
      h('div', { className: 'range-row' },
        h('div', { className: 'ps-sizes', role: 'radiogroup', 'aria-label': 'Period' }, [['today', 'Today'], ['month', 'Month']].map(function (r) {
          return h('button', { key: r[0], role: 'radio', 'aria-checked': range[0] === r[0] ? 'true' : 'false', className: 'ps-size ps-press range-btn', onClick: function () { setRange(r[0]); } }, h('span', { className: 'price' }, r[1]));
        })),
        range[0] === 'month' ? h('div', { className: 'month-nav' },
          h('button', { className: 'ps-key ps-press mini', onClick: function () { shift(-1); }, 'aria-label': 'Previous month' }, '‹'),
          h('span', { className: 'title ps-up month-name' }, MONTHS[ym[0][1]] + ' ' + ym[0][0]),
          h('button', { className: 'ps-key ps-press mini', onClick: function () { shift(1); }, disabled: isCurrent, 'aria-label': 'Next month' }, '›')) :
          h('span', { className: 'title ps-up month-name' }, now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }))),
      range[0] === 'today' ? h(StatTiles, { tiles: [['Orders today', t.orders.length], ['Paid today', egp(t.revenue)], ['Pizzas today', t.pizzas], ['Average order', t.paid.length ? egp(t.avg) : '—']] }) :
        h(MonthReport, { ym: ym[0], list: scoped, exportCsv: exportCsv, focus: function (id) { filt[1]('all'); open[1](id); setTimeout(function () { var el = document.getElementById('o-' + id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50); } }),
      h('div', { className: 'list-head' }, h('span', { className: 'title ps-up' }, range[0] === 'today' ? 'Today\'s orders' : 'All ' + MONTHS[ym[0][1]] + ' orders'),
        h('div', { className: 'filters', role: 'radiogroup', 'aria-label': 'Filter orders' }, [['all', 'All'], ['active', 'Active'], ['unpaid', 'Unpaid'], ['done', 'Done']].map(function (f) {
          return h('button', { key: f[0], role: 'radio', 'aria-checked': filt[0] === f[0] ? 'true' : 'false', className: 'chan ps-press', onClick: function () { filt[1](f[0]); } }, f[1]);
        }))),
      h('div', { className: 'olist ps-card' }, shown.length ? shown.map(function (o) {
        var s = st(o), isOpen = open[0] === o.id;
        return h('div', { key: o.id, id: 'o-' + o.id, className: 'orow' + (isOpen ? ' open' : '') },
          h('button', { className: 'orow-main', onClick: function () { open[1](isOpen ? null : o.id); }, 'aria-expanded': isOpen },
            h('span', { className: 'order-no' }, o.id),
            h('span', { className: 'meta o-src' }, (range[0] === 'month' ? new Date(o.createdAt).getDate() + ' ' + MONTHS[new Date(o.createdAt).getMonth()].slice(0, 3) + ' ' : '') + clock(o.createdAt) + ' · ' + source(o)),
            h('span', { className: 'o-tags' }, h(M.StatusBadge, { status: s[0] }, s[1]), o.status !== 'void' ? h(M.StatusBadge, { status: o.paid ? 'paid' : 'held', noIcon: !o.paid }, o.paid ? PAY_LABEL[(o.payment && o.payment.method) || 'cash'] : 'Unpaid') : null),
            h('span', { className: 'price o-tot' }, fmt(orderTotal(o)))),
          isOpen ? h('div', { className: 'orow-detail' },
            h('ul', { className: 'body o-lines' }, (o.lines || []).map(function (l) { return h('li', { key: l.key, style: l.state === 'void' ? { textDecoration: 'line-through', color: 'var(--ink-muted)' } : null }, l.qty + '× ' + l.name + ' · ' + l.size + (l.extras.length ? ' · ' + l.extras.map(function (e) { return e[0]; }).join(', ') : '') + (l.note ? ' — “' + l.note + '”' : '') + '  ' + fmt(l.unit * l.qty)); })),
            o.phone ? h('div', { className: 'meta' }, 'Phone: ' + o.phone) : null,
            o.discount ? h('div', { className: 'meta', style: { color: 'var(--basil)' } }, discountLabel(o) + ' · −' + egp(o.discount) + ' (items ' + egp(grossTotal(o)) + ')') : null,
            o.channel === 'website' && o.fulfillment ? h('div', { className: 'meta' }, 'Website order · ' + (o.fulfillment === 'delivery' ? 'Delivery to ' + [o.unit, o.compound].filter(Boolean).join(', ') : 'Pickup' + (o.pickupTime ? ' at ' + o.pickupTime : '')) + ' · Customer pays ' + (o.websitePayment === 'instapay' ? 'by InstaPay' : 'cash') + (o.notes ? ' · Note: ' + o.notes : '')) : null,
            h('div', { className: 'o-actions' },
              !o.paid && o.status !== 'void' ? h(M.Button, { onClick: function () { props.openInCounter(o); } }, 'Open in counter') : null,
              !o.paid && o.status !== 'void' ? h(M.Button, { variant: 'primary', onClick: function () { paying[1](o); } }, 'Take payment') : null,
              o.status !== 'void' && !o.paid ? h(M.Button, { variant: 'danger', icon: 'x', onClick: function () { var n = clone(o); n.status = 'void'; saveOrder(n); toast(o.id + ' voided'); } }, 'Void order') : null)) : null);
      }) : h('div', { className: 'empty' }, h('div', { className: 'note', style: { color: 'var(--brand-red)' } }, 'no orders here yet'), h('div', { className: 'meta', style: { color: 'var(--ink-muted)' } }, range[0] === 'today' ? 'Ring one up on the Counter and send it to the kitchen.' : 'Nothing was rung up in ' + MONTHS[ym[0][1]] + '.'))),
      h('div', { className: 'danger-zone' }, confirm[0] ?
        h(React.Fragment, null, h('span', { className: 'body' }, 'Delete all ' + list.length + ' orders, from every month and every screen? This can\'t be undone.'), h(M.Button, { variant: 'danger', onClick: function () { deleteAll(); confirm[1](false); toast('All test orders cleared'); } }, 'Delete all'), h(M.Button, { variant: 'quiet', onClick: function () { confirm[1](false); } }, 'Keep them')) :
        list.length ? h('button', { className: 'link', onClick: function () { confirm[1](true); } }, 'Clear all test orders') : null),
      props.user ? h('div', { className: 'danger-zone' }, h('span', { className: 'meta', style: { color: 'var(--ink-muted)' } }, 'Signed in as ' + props.user), h('button', { className: 'link', onClick: props.onSignOut }, 'Sign out')) : null,
      paying[0] ? h(PaySheet, { order: paying[0], orderId: paying[0].id, sourceText: source(paying[0]), sentNote: '', onPaid: function (res, d) { var n = applyDiscount(clone(paying[0]), d); n.paid = true; n.paidAt = Date.now(); n.payment = res; if (n.status === 'open') n.status = 'done'; saveOrder(n); }, onClose: function () { paying[1](null); } }) : null);
  }

  /* ------------------------------------------------------------------ app shell */
  var VIEWS = [['counter', 'Counter'], ['kitchen', 'Kitchen'], ['orders', 'Orders']];
  function App(props) {
    var S = useStore();
    // No #hash in the URL (e.g. opened from the home-screen icon): reopen the screen this device used last.
    var view = useState(function () { var v = (location.hash || '').slice(1) || lsGet('mg-pos-view', ''); return VIEWS.some(function (x) { return x[0] === v; }) ? v : 'counter'; });
    useEffect(function () { lsSet('mg-pos-view', view[0]); }, [view[0]]);
    // Keep the screen awake on the Kitchen view. Quietly does nothing where Wake Lock isn't supported.
    useEffect(function () {
      if (view[0] !== 'kitchen' || !navigator.wakeLock) return;
      var lock = null, stopped = false;
      function ask() {
        if (stopped || document.visibilityState !== 'visible' || (lock && !lock.released)) return;
        try { navigator.wakeLock.request('screen').then(function (l) { if (stopped) l.release().catch(function () {}); else lock = l; }).catch(function () {}); } catch (e) {}
      }
      ask(); document.addEventListener('visibilitychange', ask);
      return function () { stopped = true; document.removeEventListener('visibilitychange', ask); if (lock) lock.release().catch(function () {}); };
    }, [view[0]]);
    var draft = useState(function () { return lsGet('mg-pos-draft', null) || emptyDraft(); });
    var now = useState(Date.now());
    useEffect(function () { lsSet('mg-pos-draft', draft[0]); }, [draft[0]]);
    useEffect(function () { var id = setInterval(function () { now[1](Date.now()); }, 30000); var f = function () { var v = location.hash.slice(1); if (VIEWS.some(function (x) { return x[0] === v; })) view[1](v); }; window.addEventListener('hashchange', f); return function () { clearInterval(id); window.removeEventListener('hashchange', f); }; }, []);
    function go(v) { view[1](v); try { history.replaceState(null, '', '#' + v); } catch (e) {} window.scrollTo(0, 0); }
    var firing = Object.keys(S.orders).filter(function (k) { return S.orders[k].status === 'kitchen'; }).length;
    var ready = Object.keys(S.orders).filter(function (k) { return S.orders[k].status === 'ready'; }).length;
    function openInCounter(o) { draft[1]({ id: o.id, channel: o.channel, customer: o.customer || '', phone: o.phone || '', compound: o.compound || '', unit: o.unit || '', discount: o.discount || 0, discountPct: o.discountPct, promoCode: o.promoCode || '', lines: clone(o.lines || []) }); go('counter'); }
    var mode = S.mode === 'live' ? ['Live · synced', 'ready'] : S.mode === 'offline' ? ['Offline · will sync', 'held'] : S.mode === 'local' ? ['This device only', 'held'] : ['Connecting…', 'neutral'];
    return h('div', { className: 'app', 'data-theme': view[0] === 'kitchen' ? 'dark' : 'light' },
      h('header', { className: 'bar' },
        h('div', { className: 'bar-in' },
          h('img', { className: 'logo', src: LOGO, alt: 'Margreeta' }),
          h('nav', { className: 'views', 'aria-label': 'Screens' }, VIEWS.map(function (v) {
            var n = v[0] === 'kitchen' ? firing + ready : 0;
            return h('button', { key: v[0], className: 'view-btn ps-press', 'aria-current': view[0] === v[0] ? 'page' : undefined, onClick: function () { go(v[0]); } }, v[1], n ? h('span', { className: 'count' }, n) : null);
          })),
          h('div', { className: 'bar-right' }, h(M.StatusBadge, { status: mode[1] }, mode[0]), h('span', { className: 'time-chip price' }, clock(now[0]))))),
      h('main', { className: 'main' },
        view[0] === 'counter' ? h(Counter, { draft: draft[0], setDraft: draft[1] }) : view[0] === 'kitchen' ? h(Kitchen) : h(Orders, { openInCounter: openInCounter, user: props.user, onSignOut: props.onSignOut })),
      h(Toast));
  }

  /* ------------------------------------------------------------------ staff login */
  function Shell(props) {
    return h('div', { className: 'app', 'data-theme': 'light' },
      h('header', { className: 'bar' }, h('div', { className: 'bar-in' }, h('img', { className: 'logo', src: LOGO, alt: 'Margreeta' }))),
      h('main', { className: 'main' }, props.children));
  }
  function authMessage(e) {
    var c = (e && e.code) || '';
    if (/invalid-credential|wrong-password|user-not-found|invalid-email|invalid-login/.test(c)) return 'That email or password is wrong.';
    if (/too-many-requests/.test(c)) return 'Too many tries. Wait a minute, then try again.';
    if (/network-request-failed/.test(c)) return 'No internet. Connect to the Wi-Fi to sign in.';
    if (/user-disabled/.test(c)) return 'This account is switched off in Firebase.';
    return 'Couldn\'t sign in' + (c ? ' (' + c + ')' : '') + '.';
  }
  function Login(props) {
    var email = useState(lsGet('mg-pos-email', '')), pw = useState(''), busy = useState(false), err = useState(props.message || '');
    function submit(e) {
      e.preventDefault();
      if (!email[0].trim() || !pw[0]) { err[1]('Enter the staff email and password.'); return; }
      busy[1](true); err[1]('');
      FB.auth.signInWithEmailAndPassword(email[0].trim(), pw[0]).then(function () { lsSet('mg-pos-email', email[0].trim()); })
        .catch(function (x) { err[1](authMessage(x)); busy[1](false); });
    }
    return h(Shell, null,
      h('form', { className: 'login ps-card', onSubmit: submit, noValidate: true },
        h(M.Ribbon, { words: ['Staff only', 'Margreeta POS'], repeat: 6 }),
        h('div', { className: 'login-body' },
          h('h1', { className: 'headline ps-pop' }, 'Sign in'),
          h('div', { className: 'note', style: { color: 'var(--ink-muted)' } }, 'ovens on? let’s go'),
          h('label', { className: 'sticker sec-label', htmlFor: 'login-email' }, 'Email'),
          h('input', { id: 'login-email', className: 'field', type: 'email', autoComplete: 'username', inputMode: 'email', autoCapitalize: 'none', value: email[0], onChange: function (e) { email[1](e.target.value); } }),
          h('label', { className: 'sticker sec-label', htmlFor: 'login-password' }, 'Password'),
          h('input', { id: 'login-password', className: 'field', type: 'password', autoComplete: 'current-password', value: pw[0], onChange: function (e) { pw[1](e.target.value); } }),
          err[0] ? h('div', { className: 'meta', role: 'alert', style: { color: 'var(--red-ink)' } }, err[0]) : null,
          h(M.Button, { type: 'submit', variant: 'primary', size: 'lg', block: true, disabled: busy[0] }, busy[0] ? 'Signing in…' : 'Sign in'))));
  }
  function SetupNeeded() {
    return h(Shell, null, h('div', { className: 'login ps-card' }, h('div', { className: 'login-body' },
      h('h1', { className: 'title ps-up', style: { margin: 0 } }, 'Firebase isn’t connected yet'),
      h('p', { className: 'body', style: { margin: 0 } }, 'Paste your Firebase web config into pos/firebase-config.js, then publish the site again.'))));
  }
  function Root() {
    var st = useState(FB ? 'checking' : 'local'), user = useState(null), msg = useState('');
    useEffect(function () {
      if (!FB) { initStore(); return; }
      onAccessDenied = function () { msg[1]('This account isn’t allowed to use the POS. Use the staff login.'); FB.auth.signOut(); };
      return FB.auth.onAuthStateChanged(function (u) {
        if (u) { user[1](u.email); initStore(); st[1]('in'); }
        else { stopStore(); Store.orders = {}; Store.live = {}; Store.older = {}; Store.soldOut = {}; Store.db = null; Store.mode = 'connecting'; st[1]('out'); }
      });
    }, []);
    if (st[0] === 'checking') return h(Shell);
    if (st[0] === 'out') return h(Login, { message: msg[0] });
    return h(App, { user: user[0], onSignOut: function () { msg[1](''); FB.auth.signOut(); } });
  }

  ReactDOM.createRoot(document.getElementById('pos-root')).render(NEEDS_SETUP ? h(SetupNeeded) : h(Root));

  /* Offline app shell: the service worker keeps the POS files cached so a reload works without Wi-Fi. */
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
