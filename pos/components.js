/* @ds-bundle: {"format":4,"namespace":"Margreeta","components":[{"name":"Button"},{"name":"StatusBadge"},{"name":"Ribbon"},{"name":"CategoryTabs"},{"name":"MenuItemTile"},{"name":"SizePicker"},{"name":"OrderLine"},{"name":"OrderTotals"},{"name":"Keypad"},{"name":"TableTile"},{"name":"KitchenTicket"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function money(n, cur, decimals) {
    if (n == null || n === '') return '';
    var d = decimals == null ? 0 : decimals;
    var s = Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: 2 });
    return cur ? cur + ' ' + s : s;
  }
  function omit(o, keys) { var r = {}; for (var k in o) if (keys.indexOf(k) < 0) r[k] = o[k]; return r; }

  /* Icons: 16px stroke glyphs in currentColor. */
  var PATHS = {
    dot: [['circle', { cx: 8, cy: 8, r: 4, fill: 'currentColor', stroke: 'none' }]],
    clock: [['circle', { cx: 8, cy: 8, r: 6 }], ['path', { d: 'M8 4.5V8l2.5 1.5' }]],
    check: [['path', { d: 'M3 8.5l3 3 7-7' }]],
    checkCircle: [['circle', { cx: 8, cy: 8, r: 6.5 }], ['path', { d: 'M5 8.2l2 2 4-4' }]],
    alert: [['path', { d: 'M8 1.8l6.6 11.7H1.4z' }], ['path', { d: 'M8 6.2v3.3' }], ['circle', { cx: 8, cy: 11.6, r: 0.6, fill: 'currentColor' }]],
    x: [['path', { d: 'M4 4l8 8M12 4l-8 8' }]],
    pause: [['path', { d: 'M6 4v8M10 4v8' }]],
    ban: [['circle', { cx: 8, cy: 8, r: 6 }], ['path', { d: 'M3.8 12.2l8.4-8.4' }]],
    send: [['path', { d: 'M2 8h10M8.5 4.5L12 8l-3.5 3.5' }]],
    back: [['path', { d: 'M6 3.5h7.5v9H6L2 8z' }], ['path', { d: 'M8 6l3 4M11 6l-3 4' }]],
    user: [['circle', { cx: 8, cy: 5.5, r: 2.5 }], ['path', { d: 'M3 13.5c.6-2.6 2.6-4 5-4s4.4 1.4 5 4' }]],
    circle: [['circle', { cx: 8, cy: 8, r: 5.5 }]],
    receipt: [['path', { d: 'M4 1.8h8v12.4l-2-1.2-2 1.2-2-1.2-2 1.2z' }], ['path', { d: 'M6 5.5h4M6 8.5h4' }]],
    flame: [['path', { d: 'M8 14c-2.8 0-4.5-1.9-4.5-4.3 0-2.6 2.2-3.8 2.7-6.7 1.6 1 2.3 2.4 2.3 3.6.6-.4 1-1.1 1.1-2 1.6 1.3 2.9 3.1 2.9 5.1C12.5 12.1 10.8 14 8 14z' }]],
    star: [['path', { d: 'M8 1.5l1.9 4.1 4.4.5-3.3 3 .9 4.4L8 11.3 4.1 13.5 5 9.1 1.7 6.1l4.4-.5z' }]]
  };
  function Icon(props) {
    var parts = PATHS[props.name] || PATHS.dot;
    return h('svg', { className: cx('ps-icon', props.large && 'ps-icon-lg'), viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
      parts.map(function (p, i) { return h(p[0], Object.assign({ key: i }, p[1])); }));
  }
  /* The menu's four-point sparkle, used between ribbon words. */
  function Sparkle() { return h('svg', { className: 'ps-ribbon-star', viewBox: '0 0 10 10', 'aria-hidden': true }, h('path', { d: 'M5 0C5.4 3.2 6.8 4.6 10 5 6.8 5.4 5.4 6.8 5 10 4.6 6.8 3.2 5.4 0 5 3.2 4.6 4.6 3.2 5 0z' })); }

  /* ---------- Button ---------- */
  function Button(props) {
    var variant = props.variant || 'secondary';
    var rest = omit(props, ['variant', 'size', 'block', 'icon', 'amount', 'children', 'className']);
    return h('button', Object.assign({ type: 'button' }, rest, {
      className: cx('ps-btn', 'ps-press', 'ps-btn-' + variant, props.size === 'lg' && 'ps-btn-lg', props.block && 'ps-btn-block', props.className)
    }),
      props.icon ? h(Icon, { name: props.icon, large: true }) : null,
      h('span', null, props.children),
      props.amount != null ? h('span', { className: 'ps-btn-amount' }, props.amount) : null);
  }

  /* ---------- StatusBadge (sticker) ---------- */
  var STATUS = {
    'new': ['New', 'dot'], firing: ['Firing', 'clock'], ready: ['Ready', 'check'], late: ['Late', 'alert'],
    held: ['On hold', 'pause'], paid: ['Paid', 'checkCircle'], 'void': ['Void', 'x'], soldout: ['Sold out', 'ban'],
    spicy: ['Spicy', 'flame'], chefs: ["Chef's pick", 'star'], neutral: ['Draft', 'circle']
  };
  function StatusBadge(props) {
    var key = STATUS[props.status] ? props.status : 'neutral';
    var s = STATUS[key];
    return h('span', { className: cx('ps-badge', 'sticker', 'ps-badge-' + key, props.className) },
      props.noIcon ? null : h(Icon, { name: s[1] }), h('span', null, props.children || s[0]));
  }

  /* ---------- Ribbon ---------- */
  function Ribbon(props) {
    var words = props.words || ['Margreeta'];
    var n = props.repeat || 8, out = [];
    for (var i = 0; i < n; i++) words.forEach(function (w, j) { out.push(h(React.Fragment, { key: i + '-' + j }, h('span', null, w), h(Sparkle))); });
    return h('div', { className: cx('ps-ribbon', props.tone === 'ink' && 'ps-ribbon-ink', props.tilt && 'ps-ribbon-tilt', props.className), 'aria-label': words.join(', ') },
      h('div', { className: 'ps-ribbon-track sticker', 'aria-hidden': true }, out));
  }

  /* ---------- CategoryTabs ---------- */
  function CategoryTabs(props) {
    var items = props.items || [];
    var st = React.useState(props.defaultValue != null ? props.defaultValue : (items[0] && items[0].id));
    var value = props.value != null ? props.value : st[0];
    function pick(id) { if (props.value == null) st[1](id); if (props.onChange) props.onChange(id); }
    return h('div', { className: cx('ps-tabs', props.className), role: 'tablist', 'aria-label': props.label || 'Menu' },
      items.map(function (it) {
        var on = it.id === value;
        return h('button', { key: it.id, type: 'button', role: 'tab', 'aria-selected': on ? 'true' : 'false', className: 'ps-tab ps-press', onClick: function () { pick(it.id); } },
          it.stop ? h('span', { className: 'ps-tab-stop' }, it.stop) : null, h('span', null, it.label));
      }));
  }

  /* ---------- MenuItemTile ---------- */
  function MenuItemTile(props) {
    var qty = props.qty || 0;
    var tags = props.tags || [];
    return h('button', {
      type: 'button', disabled: !!props.soldOut, onClick: props.onClick,
      className: cx('ps-tile', 'ps-press', qty > 0 && 'ps-tile-in', props.className),
      'aria-label': props.name + (props.soldOut ? ', sold out' : '') + (qty ? ', ' + qty + ' in order' : '')
    },
      props.image ? h('img', { className: 'ps-tile-photo', src: props.image, alt: '' }) : null,
      tags.length || props.soldOut ? h('span', { className: 'ps-tile-tags' },
        props.soldOut ? h(StatusBadge, { status: 'soldout', noIcon: true }) : tags.map(function (t) { return h(StatusBadge, { key: t, status: t, noIcon: true }); })) : null,
      h('span', { className: 'ps-col', style: { gap: '0' } },
        h('span', { className: 'ps-tile-name item' }, props.name),
        props.nameAr ? h('span', { className: 'ps-tile-ar item-ar', lang: 'ar' }, props.nameAr) : null),
      h('span', { className: 'ps-tile-foot' },
        props.fromLabel !== false ? h('span', { className: 'ps-tile-from sticker' }, props.fromLabel || 'from') : h('span'),
        h('span', { className: 'ps-tile-price price ps-num' }, money(props.price))),
      qty > 0 ? h('span', { className: 'ps-tile-qty', 'aria-hidden': true }, qty) : null);
  }

  /* ---------- SizePicker ---------- */
  function SizePicker(props) {
    var sizes = props.sizes || [];
    var st = React.useState(props.defaultValue != null ? props.defaultValue : (sizes.length ? sizes[sizes.length - 1].id : null));
    var value = props.value != null ? props.value : st[0];
    function pick(id) { if (props.value == null) st[1](id); if (props.onChange) props.onChange(id); }
    return h('div', { className: cx('ps-sizes', props.className), role: 'radiogroup', 'aria-label': props.label || 'Size' },
      sizes.map(function (s) {
        var on = s.id === value;
        return h('button', { key: s.id, type: 'button', role: 'radio', 'aria-checked': on ? 'true' : 'false', className: 'ps-size ps-press', onClick: function () { pick(s.id); } },
          h('span', { className: 'sticker' }, s.label),
          h('span', { className: 'price ps-num' }, money(s.price)));
      }));
  }

  /* ---------- OrderLine ---------- */
  var LINE_STATE = { 'new': ['Not sent', 'circle'], sent: ['Sent', 'check'], held: ['On hold', 'pause'], 'void': ['Void', 'x'] };
  function OrderLine(props) {
    var state = props.state || 'new';
    var st = LINE_STATE[state] || LINE_STATE['new'];
    var mods = props.modifiers || [];
    return h('button', { type: 'button', onClick: props.onClick, 'aria-pressed': props.selected ? 'true' : 'false',
      className: cx('ps-line', 'ps-line-' + state, props.selected && 'ps-line-selected', props.className) },
      h('span', { className: 'ps-line-qty' }, props.qty != null ? props.qty : 1),
      h('span', { className: 'ps-line-body' },
        h('span', { className: 'ps-line-name item' }, props.name),
        mods.length ? h('span', { className: 'ps-line-mods body' }, mods.join(' · ')) : null,
        props.note ? h('span', { className: 'ps-line-note note' }, props.note) : null),
      h('span', { className: 'ps-line-side' },
        h('span', { className: 'ps-line-price price ps-num' }, money(props.price)),
        h('span', { className: 'ps-line-state sticker' }, h(Icon, { name: st[1] }), st[0])));
  }

  /* ---------- OrderTotals ---------- */
  function OrderTotals(props) {
    var cur = props.currency || 'EGP';
    var rows = [['Subtotal', props.subtotal]];
    if (props.discount) rows.push([props.discountLabel || 'Discount', -Math.abs(props.discount), true]);
    if (props.delivery != null) rows.push([props.deliveryLabel || 'Delivery', props.delivery]);
    if (props.service != null) rows.push([props.serviceLabel || 'Service 12%', props.service]);
    if (props.vat != null) rows.push([props.vatLabel || 'VAT 14%', props.vat]);
    var total = props.total != null ? props.total : rows.reduce(function (a, r) { return a + (Number(r[1]) || 0); }, 0);
    return h('div', { className: cx('ps-totals', 'ps-card', props.className) },
      rows.map(function (r) {
        return h('div', { key: r[0], className: cx('ps-totals-row body', r[2] && 'ps-is-discount') },
          h('span', null, r[0]), h('span', null, (r[1] < 0 ? '− ' : '') + money(Math.abs(r[1]))));
      }),
      h('div', { className: 'ps-totals-due' },
        h('span', { className: 'sticker', style: { textTransform: 'uppercase' } }, props.dueLabel || 'Total due'),
        h('span', { className: 'amount' }, h('span', { className: 'ps-totals-cur sticker' }, cur), money(total))));
  }

  /* ---------- Keypad ---------- */
  function Keypad(props) {
    var st = React.useState(props.defaultValue || '');
    var value = props.value != null ? String(props.value) : st[0];
    var decimals = props.mode === 'qty' ? 0 : 2;
    function set(v) { if (props.value == null) st[1](v); if (props.onChange) props.onChange(v); }
    function press(k) {
      if (k === 'back') return set(value.slice(0, -1));
      if (k === '.') { if (!decimals || value.indexOf('.') >= 0) return; return set((value || '0') + '.'); }
      var dot = value.indexOf('.');
      if (dot >= 0 && value.length - dot > decimals) return;
      if (value === '0') return set(k);
      if (value.replace('.', '').length >= 7) return;
      set(value + k);
    }
    var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', decimals ? '.' : '', '0', 'back'];
    var shown = value === '' ? '0' : value;
    return h('div', { className: cx('ps-keypad', 'ps-card', props.className) },
      h('div', { className: 'ps-keypad-display', 'aria-live': 'polite' },
        h('span', { className: 'sticker', style: { textTransform: 'uppercase', color: 'var(--ink-muted)' } }, props.label || (decimals ? 'Cash received' : 'Quantity')),
        h('span', { className: 'amount', style: { fontSize: '32px', lineHeight: '36px' } }, shown)),
      props.quick && props.quick.length ? h('div', { className: 'ps-keypad-quick' },
        props.quick.map(function (q) { return h('button', { key: q, type: 'button', className: 'ps-key ps-key-quick ps-press', onClick: function () { set(String(q)); } }, String(q)); })) : null,
      h('div', { className: 'ps-keypad-grid' },
        keys.map(function (k, i) {
          if (!k) return h('span', { key: i });
          return h('button', { key: k, type: 'button', className: 'ps-key ps-press', onClick: function () { press(k); }, 'aria-label': k === 'back' ? 'Delete' : k },
            k === 'back' ? h(Icon, { name: 'back', large: true }) : k);
        })),
      props.submitLabel ? h(Button, { variant: 'primary', size: 'lg', block: true, disabled: value === '' || Number(value) === 0, onClick: function () { if (props.onSubmit) props.onSubmit(value); } }, props.submitLabel) : null);
  }

  /* ---------- TableTile ---------- */
  var TABLE = { free: ['Free', 'circle'], seated: ['Seated', 'user'], ordered: ['Ordered', 'clock'], bill: ['Bill out', 'receipt'], dirty: ['To clear', 'x'] };
  function TableTile(props) {
    var status = TABLE[props.status] ? props.status : 'free';
    var s = TABLE[status];
    var meta = status === 'free' ? (props.seats + ' seats') : ((props.guests != null ? props.guests : props.seats) + '/' + props.seats + (props.minutes != null ? ' · ' + props.minutes + 'm' : ''));
    return h('button', { type: 'button', onClick: props.onClick,
      className: cx('ps-table', 'ps-press', 'ps-table-' + status, props.shape === 'round' && 'ps-table-round', props.className),
      'aria-label': 'Table ' + props.name + ', ' + s[0] },
      h('span', { className: 'title' }, props.name),
      h('span', { className: 'ps-table-meta meta' }, meta),
      h('span', { className: 'sticker', style: { display: 'inline-flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', whiteSpace: 'nowrap' } }, h(Icon, { name: s[1] }), s[0]));
  }

  /* ---------- KitchenTicket ---------- */
  function KitchenTicket(props) {
    var m = props.minutes || 0;
    var warnAt = props.warnAt || 10, lateAt = props.lateAt || 15;
    var tone = props.status === 'ready' ? 'ready' : m >= lateAt ? 'late' : m >= warnAt ? 'warn' : (props.status === 'new' ? 'new' : 'plain');
    var badge = props.status === 'ready' ? 'ready' : tone === 'late' ? 'late' : props.status === 'new' ? 'new' : 'firing';
    var items = props.items || [];
    return h('article', { className: cx('ps-ticket', 'ps-card', 'ps-ticket-' + tone, props.className) },
      h('header', { className: 'ps-ticket-head' },
        h('div', null,
          h('div', { className: 'order-no' }, props.number),
          h('div', { className: 'ps-ticket-src meta' }, props.source)),
        h('div', { className: 'ps-ticket-time' },
          h('span', null, String(Math.floor(m)).padStart(2, '0') + ':' + String(props.seconds || 0).padStart(2, '0')),
          h(StatusBadge, { status: badge }))),
      h('ul', { className: 'ps-ticket-items' },
        items.map(function (it, i) {
          return h('li', { key: i, className: cx('ps-ticket-item', it.done && 'ps-ticket-done') },
            h('div', { className: 'ps-ticket-item-main' },
              it.done ? h(Icon, { name: 'check', large: true }) : h('span', { style: { width: '20px', flex: 'none' } }),
              h('span', { className: 'ticket' }, (it.qty || 1) + '× ' + it.name + (it.size ? ' · ' + it.size : ''))),
            it.mods && it.mods.length ? h('div', { className: 'ps-ticket-mods note' }, it.mods.map(function (md, j) { return h('div', { key: j }, md); })) : null);
        })),
      props.onBump !== false ? h('div', { className: 'ps-ticket-foot' },
        h(Button, { variant: props.status === 'ready' ? 'secondary' : 'send', block: true, onClick: typeof props.onBump === 'function' ? props.onBump : undefined },
          props.status === 'ready' ? 'Recall' : 'Bump')) : null);
  }

  var NS = { Button: Button, StatusBadge: StatusBadge, Ribbon: Ribbon, CategoryTabs: CategoryTabs, MenuItemTile: MenuItemTile, SizePicker: SizePicker, OrderLine: OrderLine, OrderTotals: OrderTotals, Keypad: Keypad, TableTile: TableTile, KitchenTicket: KitchenTicket, Icon: Icon, formatMoney: money };
  window.Margreeta = Object.assign(window.Margreeta || {}, NS);
})();
