const WHATSAPP_NUMBER = '201055788000';

function GenZCart(){
  const Store = window.GenZCartStore;
  const [items, setItems] = React.useState(Store.getItems());
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState('cart');
  const [fulfillment, setFulfillment] = React.useState('delivery');
  const [form, setForm] = React.useState({ name: '', phone: '', address: '', pickupLocation: '', pickupTime: '', payment: 'card', notes: '' });
  const [orderRef, setOrderRef] = React.useState(null);
  const [whatsappUrl, setWhatsappUrl] = React.useState(null);
  const fabRef = React.useRef(null);
  const audioCtxRef = React.useRef(null);
  const prevCountRef = React.useRef(Store.getItems().reduce((s, i) => s + i.qty, 0));
  const playAddSound = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      [[880, 0, 0.1], [1318.5, 0.07, 0.14]].forEach(([freq, delay, dur]) => {
        const start = now + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.28, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.02);
      });
    } catch (e) {}
  };
  const bumpFab = () => {
    const el = fabRef.current;
    if (!el) return;
    el.classList.remove('gz-cart-fab-bump');
    void el.offsetWidth;
    el.classList.add('gz-cart-fab-bump');
  };
  React.useEffect(() => Store.subscribe((newItems) => {
    setItems(newItems);
    const newCount = newItems.reduce((s, i) => s + i.qty, 0);
    if (newCount > prevCountRef.current) { bumpFab(); playAddSound(); }
    prevCountRef.current = newCount;
  }), []);
  React.useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener('margreeta:open-cart', openHandler);
    return () => window.removeEventListener('margreeta:open-cart', openHandler);
  }, []);
  const total = items.reduce((s,i) => s + i.price * i.qty, 0);
  const count = items.reduce((s,i) => s + i.qty, 0);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-hairline-soft)', fontFamily: 'var(--font-body)', fontSize: 15, background: '#fff', color: 'var(--ink-black)', marginTop: 6 };
  const labelStyle = { fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: 'var(--text-muted-on-light)', display: 'block' };
  const buildOrderMessage = (ref) => {
    const lines = [`New order ${ref}`, ''];
    items.forEach(i => lines.push(`${i.qty}x ${i.name} — ${i.price * i.qty} EGP`));
    lines.push('', `Total: ${total} EGP`, '');
    lines.push(`Name: ${form.name}`);
    lines.push(`Phone: ${form.phone}`);
    if (fulfillment === 'delivery') lines.push(`Delivery to: ${form.address}`);
    else { lines.push(`Pickup at: ${form.pickupLocation}`); lines.push(`Pickup time: ${form.pickupTime}`); }
    lines.push(`Payment: ${form.payment === 'card' ? 'Card' : 'Cash on delivery'}`);
    if (form.notes) lines.push(`Notes: ${form.notes}`);
    return lines.join('\n');
  };
  const pendingRef = orderRef || 'MG-PENDING';
  const orderUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderMessage(pendingRef))}`;
  const goToPayment = () => {
    setOrderRef('MG-' + Math.random().toString(36).slice(2,8).toUpperCase());
    setStep('payment');
  };
  const confirmOrder = () => {
    setWhatsappUrl(orderUrl);
    setStep('confirmed');
    Store.clear();
  };
  const resetAndClose = () => { setOpen(false); setStep('cart'); setOrderRef(null); setWhatsappUrl(null); setForm({ name: '', phone: '', address: '', pickupLocation: '', pickupTime: '', payment: 'card', notes: '' }); };
  return (
    <div>
      <button ref={fabRef} onClick={() => setOpen(true)} onAnimationEnd={() => fabRef.current && fabRef.current.classList.remove('gz-cart-fab-bump')} aria-label="Open cart" className="gz-cart-fab" style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 40, width: 62, height: 62, borderRadius: '50%', background: 'var(--gold-foil)', border: 'none', boxShadow: 'var(--shadow-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ink-bordeaux-900)" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        {count > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--brand-red)', color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>}
      </button>
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={resetAndClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)' }}></div>
          <div className="gz-cart-panel" style={{ position: 'relative', width: 420, maxWidth: '100vw', height: '100%', background: '#fff', overflowY: 'auto', padding: 28, boxShadow: '-8px 0 30px rgba(0,0,0,.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="gz-cart-title" style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--ink-black)' }}>{step === 'confirmed' ? 'Order placed!' : 'Your order'}</div>
              <button onClick={resetAndClose} className="gz-cart-close" style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--ink-black)' }}>&times;</button>
            </div>
            {step === 'cart' && (
              <div>
                {items.length === 0 && <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted-on-light)', padding: '40px 0', textAlign: 'center' }}>Your cart is empty. Add a pizza from any country stop!</div>}
                {items.map(item => (
                  <div key={item.slot} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '14px 0', borderBottom: '1px solid var(--border-hairline-soft)' }}>
                    <div>
                      <div className="gz-cart-item-name" style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: 'var(--ink-black)', textTransform: 'capitalize' }}>{item.name}</div>
                      <div className="gz-cart-item-price" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted-on-light)' }}>{item.price} EGP</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => Store.setQty(item.slot, item.qty - 1)} style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--border-hairline-soft)', background: '#fff', color: 'var(--ink-black)', cursor: 'pointer' }}>−</button>
                      <span style={{ minWidth: 18, textAlign: 'center', fontFamily: 'var(--font-body)', fontWeight: 600 }}>{item.qty}</span>
                      <button onClick={() => Store.setQty(item.slot, item.qty + 1)} style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--border-hairline-soft)', background: '#fff', color: 'var(--ink-black)', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                ))}
                {items.length > 0 && (
                  <div>
                    <div className="gz-cart-total" style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 17, color: 'var(--ink-black)' }}>
                      <span>Total</span><span>{total} EGP</span>
                    </div>
                    <button onClick={() => setStep('details')} style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: 'var(--gold-foil)', color: 'var(--ink-bordeaux-900)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Continue</button>
                  </div>
                )}
              </div>
            )}
            {step === 'details' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['delivery','pickup'].map(f => (
                    <button key={f} onClick={() => setFulfillment(f)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: fulfillment === f ? '2px solid var(--gold-foil)' : '1px solid var(--border-hairline-soft)', background: fulfillment === f ? 'var(--gold-highlight)' : '#fff', color: 'var(--ink-black)', fontFamily: 'var(--font-body)', fontWeight: 700, textTransform: 'capitalize', cursor: 'pointer' }}>{f}</button>
                  ))}
                </div>
                <label style={labelStyle}>Name<input style={inputStyle} value={form.name} onChange={set('name')} placeholder="Your name" /></label>
                <label style={labelStyle}>Phone<input style={inputStyle} value={form.phone} onChange={set('phone')} placeholder="01xxxxxxxxx" /></label>
                {fulfillment === 'delivery' ? (
                  <label style={labelStyle}>Delivery address<input style={inputStyle} value={form.address} onChange={set('address')} placeholder="Street, building, city" /></label>
                ) : (
                  <React.Fragment>
                    <label style={labelStyle}>Pickup location<input style={inputStyle} value={form.pickupLocation} onChange={set('pickupLocation')} placeholder="Nearest Margreeta stop" /></label>
                    <label style={labelStyle}>Pickup time<input style={inputStyle} value={form.pickupTime} onChange={set('pickupTime')} placeholder="e.g. Today, 7:30 PM" /></label>
                  </React.Fragment>
                )}
                <label style={labelStyle}>Order notes<input style={inputStyle} value={form.notes} onChange={set('notes')} placeholder="Extra spicy, no onions..." /></label>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button onClick={() => setStep('cart')} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid var(--border-hairline-soft)', background: '#fff', color: 'var(--ink-black)', fontFamily: 'var(--font-body)', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                  <button disabled={!form.name || !form.phone} onClick={goToPayment} style={{ flex: 2, padding: '12px', borderRadius: 10, border: 'none', background: (!form.name || !form.phone) ? '#ddd' : 'var(--gold-foil)', color: 'var(--ink-bordeaux-900)', fontFamily: 'var(--font-body)', fontWeight: 700, cursor: (!form.name || !form.phone) ? 'not-allowed' : 'pointer' }}>Continue to payment</button>
                </div>
              </div>
            )}
            {step === 'payment' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[['card','Card'],['cash','Cash on delivery']].map(([v,l]) => (
                    <button key={v} onClick={() => setForm(f => ({ ...f, payment: v }))} style={{ flex: 1, padding: '10px', borderRadius: 10, border: form.payment === v ? '2px solid var(--gold-foil)' : '1px solid var(--border-hairline-soft)', background: form.payment === v ? 'var(--gold-highlight)' : '#fff', color: 'var(--ink-black)', fontFamily: 'var(--font-body)', fontWeight: 700, cursor: 'pointer' }}>{l}</button>
                  ))}
                </div>
                {form.payment === 'card' && (
                  <React.Fragment>
                    <label style={labelStyle}>Card number<input style={inputStyle} placeholder="4242 4242 4242 4242" /></label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <label style={{ ...labelStyle, flex: 1 }}>Expiry<input style={inputStyle} placeholder="MM/YY" /></label>
                      <label style={{ ...labelStyle, flex: 1 }}>CVC<input style={inputStyle} placeholder="123" /></label>
                    </div>
                  </React.Fragment>
                )}
                <div className="gz-cart-total" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: 'var(--ink-black)' }}>
                  <span>Total</span><span>{total} EGP</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setStep('details')} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid var(--border-hairline-soft)', background: '#fff', color: 'var(--ink-black)', fontFamily: 'var(--font-body)', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                  <a href={orderUrl} target="_blank" rel="noopener noreferrer" onClick={confirmOrder} style={{ flex: 2, padding: '12px', borderRadius: 10, border: 'none', background: 'var(--gold-foil)', color: 'var(--ink-bordeaux-900)', fontFamily: 'var(--font-body)', fontWeight: 700, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'inline-block' }}>Place order</a>
                </div>
              </div>
            )}
            {step === 'confirmed' && (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div className="gz-cart-emoji" style={{ fontSize: 44 }}>📲</div>
                <div className="gz-cart-confirm-main" style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--ink-black)', marginTop: 12 }}>Almost there{form.name ? ', ' + form.name : ''}! We've opened WhatsApp with order <strong>{orderRef}</strong> filled in.</div>
                <div className="gz-cart-confirm-sub" style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-muted-on-light)', marginTop: 8 }}>Just hit <strong>Send</strong> in WhatsApp to confirm with Margreeta — {fulfillment === 'delivery' ? "we'll deliver it to " + (form.address || 'your address') : 'ready for pickup at ' + (form.pickupLocation || 'your chosen stop')}.</div>
                {whatsappUrl && (
                  <div className="gz-cart-confirm-sub" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted-on-light)', marginTop: 14 }}>
                    Didn't open? <a href={whatsappUrl} target="_blank" rel="noopener" style={{ color: 'var(--brand-red)', fontWeight: 700 }}>Open WhatsApp</a>
                  </div>
                )}
                <button onClick={resetAndClose} style={{ marginTop: 24, padding: '12px 28px', borderRadius: 10, border: 'none', background: 'var(--gold-foil)', color: 'var(--ink-bordeaux-900)', fontFamily: 'var(--font-body)', fontWeight: 700, cursor: 'pointer' }}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
window.GenZCart = GenZCart;
