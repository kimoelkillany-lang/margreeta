const WHATSAPP_NUMBER = '201055788000';
const PICKUP_LOCATION = 'E1-4B Mountain View Chillout Park';
const COMPOUNDS = ['Mountain View Chillout Park', 'Grand Heights', 'Nyoum', 'Mountain View iCity', 'Green 5', 'SODIC October Plaza', 'Kayan'];

function GenZCart(){
  const Store = window.GenZCartStore;
  const { t, lang, dir } = window.useGenZLang();
  const [items, setItems] = React.useState(Store.getItems());
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState('cart');
  const [fulfillment, setFulfillment] = React.useState('delivery');
  const [form, setForm] = React.useState({ firstName: '', lastName: '', phone: '', address: '', compound: '', pickupLocation: PICKUP_LOCATION, pickupTime: '', notes: '' });
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
  const total = items.reduce((s,i) => s + i.price * i.qty, 0);
  const count = items.reduce((s,i) => s + i.qty, 0);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-hairline-soft)', fontFamily: 'var(--font-body)', fontSize: 15, background: '#fff', color: 'var(--ink-black)', marginTop: 6 };
  const labelStyle = { fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: 'var(--text-muted-on-light)', display: 'block' };
  const isFirstNameValid = form.firstName.trim().length >= 2;
  const isLastNameValid = form.lastName.trim().length >= 2;
  const isPhoneValid = /^[0-9]{11}$/.test(form.phone.trim());
  const isAddressValid = form.address.trim().length >= 5;
  const isCompoundValid = form.compound.trim().length > 0;
  const isPickupTimeValid = form.pickupTime.trim().length >= 2;
  const isFulfillmentValid = fulfillment === 'delivery' ? (isAddressValid && isCompoundValid) : isPickupTimeValid;
  const canContinue = isFirstNameValid && isLastNameValid && isPhoneValid && isFulfillmentValid;
  const invalidStyle = (touched, valid) => ({ ...inputStyle, ...(touched && !valid ? { border: '1px solid var(--brand-red)', outlineColor: 'var(--brand-red)' } : {}) });
  const firstNameInputStyle = invalidStyle(form.firstName, isFirstNameValid);
  const lastNameInputStyle = invalidStyle(form.lastName, isLastNameValid);
  const phoneInputStyle = invalidStyle(form.phone, isPhoneValid);
  const addressInputStyle = invalidStyle(form.address, isAddressValid);
  const compoundInputStyle = invalidStyle(true, isCompoundValid);
  const pickupTimeInputStyle = invalidStyle(form.pickupTime, isPickupTimeValid);
  const errorText = (msg) => <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brand-red)', marginTop: 4 }}>{msg}</div>;
  const buildOrderMessage = (ref) => {
    const lines = [`New order ${ref}`, ''];
    items.forEach(i => {
      lines.push(`${i.qty}x ${i.name} — ${i.price * i.qty} EGP`);
      if (i.extras && i.extras.length > 0) lines.push(`   + ${i.extras.map(e => e.name).join(', ')}`);
    });
    lines.push('', `Total: ${total} EGP`, '');
    lines.push(`Name: ${form.firstName} ${form.lastName}`);
    lines.push(`Phone: ${form.phone}`);
    if (fulfillment === 'delivery') { lines.push(`Delivery to: ${form.address}`); lines.push(`Compound: ${form.compound}`); }
    else { lines.push(`Pickup at: ${form.pickupLocation}`); lines.push(`Pickup time: ${form.pickupTime}`); }
    lines.push(`Payment: ${fulfillment === 'delivery' ? 'Cash on delivery' : 'Cash on pickup'}`);
    if (form.notes) lines.push(`Notes: ${form.notes}`);
    if (lang === 'ar') lines.push('', '(Ordered via Arabic site)');
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
  const resetAndClose = () => { setOpen(false); setStep('cart'); setOrderRef(null); setWhatsappUrl(null); setForm({ firstName: '', lastName: '', phone: '', address: '', compound: '', pickupLocation: PICKUP_LOCATION, pickupTime: '', notes: '' }); };
  return (
    <div>
      <button ref={fabRef} onClick={() => setOpen(true)} onAnimationEnd={() => fabRef.current && fabRef.current.classList.remove('gz-cart-fab-bump')} aria-label={t('cart.openCart')} className="gz-cart-fab" style={{ position: 'fixed', bottom: 24, insetInlineEnd: 24, zIndex: 40, width: 62, height: 62, borderRadius: '50%', background: 'var(--gold-foil)', border: 'none', boxShadow: 'var(--shadow-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ink-bordeaux-900)" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        {count > 0 && <span style={{ position: 'absolute', top: -4, insetInlineEnd: -4, background: 'var(--brand-red)', color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>}
      </button>
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={resetAndClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)' }}></div>
          <div className="gz-cart-panel" style={{ position: 'relative', width: 420, maxWidth: '100vw', height: '100%', background: '#fff', overflowY: 'auto', padding: 28, boxShadow: dir === 'rtl' ? '8px 0 30px rgba(0,0,0,.25)' : '-8px 0 30px rgba(0,0,0,.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="gz-cart-title" style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--ink-black)' }}>{step === 'confirmed' ? t('cart.orderPlaced') : t('cart.yourOrder')}</div>
              <button onClick={resetAndClose} className="gz-cart-close" style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--ink-black)' }}>&times;</button>
            </div>
            {step === 'cart' && (
              <div>
                {items.length === 0 && <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted-on-light)', padding: '40px 0', textAlign: 'center' }}>{t('cart.empty')}</div>}
                {items.map(item => (
                  <div key={item.cartKey || item.slot} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '14px 0', borderBottom: '1px solid var(--border-hairline-soft)' }}>
                    <div>
                      <div className="gz-cart-item-name" style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: 'var(--ink-black)', textTransform: 'capitalize' }}>{item.name}</div>
                      {item.extras && item.extras.length > 0 && (
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted-on-light)', marginTop: 2 }}>
                          + {item.extras.map(e => (lang === 'ar' ? (e.nameAr || e.name) : e.name)).join(', ')}
                        </div>
                      )}
                      <div className="gz-cart-item-price" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted-on-light)' }}>{item.price} {t('dish.priceUnit')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => Store.setQty(item.cartKey || item.slot, item.qty - 1)} style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--border-hairline-soft)', background: '#fff', color: 'var(--ink-black)', cursor: 'pointer' }}>−</button>
                      <span style={{ minWidth: 18, textAlign: 'center', fontFamily: 'var(--font-body)', fontWeight: 600 }}>{item.qty}</span>
                      <button onClick={() => Store.setQty(item.cartKey || item.slot, item.qty + 1)} style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--border-hairline-soft)', background: '#fff', color: 'var(--ink-black)', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                ))}
                {items.length > 0 && (
                  <div>
                    <div className="gz-cart-total" style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 17, color: 'var(--ink-black)' }}>
                      <span>{t('cart.total')}</span><span>{total} {t('dish.priceUnit')}</span>
                    </div>
                    <button onClick={() => setStep('details')} style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: 'var(--gold-foil)', color: 'var(--ink-bordeaux-900)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{t('cart.continue')}</button>
                  </div>
                )}
              </div>
            )}
            {step === 'details' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['delivery','pickup'].map(f => (
                    <button key={f} onClick={() => setFulfillment(f)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: fulfillment === f ? '2px solid var(--gold-foil)' : '1px solid var(--border-hairline-soft)', background: fulfillment === f ? 'var(--gold-highlight)' : '#fff', color: 'var(--ink-black)', fontFamily: 'var(--font-body)', fontWeight: 700, textTransform: 'capitalize', cursor: 'pointer' }}>{t('cart.' + f)}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <label style={{ ...labelStyle, flex: 1 }}>{t('cart.firstName')}<input style={firstNameInputStyle} value={form.firstName} onChange={set('firstName')} placeholder={t('cart.firstName')} />
                    {form.firstName && !isFirstNameValid && errorText(t('cart.minTwoChars'))}
                  </label>
                  <label style={{ ...labelStyle, flex: 1 }}>{t('cart.familyName')}<input style={lastNameInputStyle} value={form.lastName} onChange={set('lastName')} placeholder={t('cart.familyName')} />
                    {form.lastName && !isLastNameValid && errorText(t('cart.minTwoChars'))}
                  </label>
                </div>
                <label style={labelStyle}>{t('cart.phone')}<input style={phoneInputStyle} value={form.phone} onChange={set('phone')} placeholder={t('cart.phonePlaceholder')} inputMode="numeric" maxLength={11} />
                  {form.phone && !isPhoneValid && errorText(t('cart.phoneInvalid'))}
                </label>
                {fulfillment === 'delivery' ? (
                  <React.Fragment>
                    <label style={labelStyle}>{t('cart.deliveryAddress')}<input style={addressInputStyle} value={form.address} onChange={set('address')} placeholder={t('cart.addressPlaceholder')} />
                      {form.address && !isAddressValid && errorText(t('cart.addressInvalid'))}
                    </label>
                    <label style={labelStyle}>{t('cart.compound')}
                      <select style={compoundInputStyle} value={form.compound} onChange={set('compound')}>
                        <option value="" disabled>{t('cart.selectCompound')}</option>
                        {COMPOUNDS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {!isCompoundValid && errorText(t('cart.compoundInvalid'))}
                    </label>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div>
                      <div style={labelStyle}>{t('cart.pickupLocation')}</div>
                      <div style={{ ...inputStyle, background: 'var(--gold-highlight)', color: 'var(--ink-black)', fontWeight: 700 }}>{PICKUP_LOCATION}</div>
                    </div>
                    <label style={labelStyle}>{t('cart.pickupTime')}<input style={pickupTimeInputStyle} value={form.pickupTime} onChange={set('pickupTime')} placeholder={t('cart.pickupTimePlaceholder')} />
                      {form.pickupTime && !isPickupTimeValid && errorText(t('cart.pickupTimeInvalid'))}
                    </label>
                  </React.Fragment>
                )}
                <label style={labelStyle}>{t('cart.notes')}<input style={inputStyle} value={form.notes} onChange={set('notes')} placeholder={t('cart.notesPlaceholder')} /></label>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button onClick={() => setStep('cart')} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid var(--border-hairline-soft)', background: '#fff', color: 'var(--ink-black)', fontFamily: 'var(--font-body)', fontWeight: 700, cursor: 'pointer' }}>{t('cart.back')}</button>
                  <button disabled={!canContinue} onClick={goToPayment} style={{ flex: 2, padding: '12px', borderRadius: 10, border: 'none', background: !canContinue ? '#ddd' : 'var(--gold-foil)', color: 'var(--ink-bordeaux-900)', fontFamily: 'var(--font-body)', fontWeight: 700, cursor: !canContinue ? 'not-allowed' : 'pointer' }}>{t('cart.continueToPayment')}</button>
                </div>
              </div>
            )}
            {step === 'payment' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={labelStyle}>{t('cart.paymentMethod')}</div>
                  <div style={{ ...inputStyle, background: 'var(--gold-highlight)', color: 'var(--ink-black)', fontWeight: 700 }}>{fulfillment === 'delivery' ? t('cart.cashOnDelivery') : t('cart.cashOnPickup')}</div>
                  {fulfillment === 'delivery' && (
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted-on-light)', marginTop: 6 }}>{t('cart.instapayNote')}</div>
                  )}
                </div>
                <div className="gz-cart-total" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: 'var(--ink-black)' }}>
                  <span>{t('cart.total')}</span><span>{total} {t('dish.priceUnit')}</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setStep('details')} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid var(--border-hairline-soft)', background: '#fff', color: 'var(--ink-black)', fontFamily: 'var(--font-body)', fontWeight: 700, cursor: 'pointer' }}>{t('cart.back')}</button>
                  <a href={orderUrl} target="_blank" rel="noopener noreferrer" onClick={confirmOrder} style={{ flex: 2, padding: '12px', borderRadius: 10, border: 'none', background: 'var(--gold-foil)', color: 'var(--ink-bordeaux-900)', fontFamily: 'var(--font-body)', fontWeight: 700, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'inline-block' }}>{t('cart.placeOrder')}</a>
                </div>
              </div>
            )}
            {step === 'confirmed' && (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <span className="gz-confirm-glow"></span>
                  <div className="gz-cart-emoji" style={{ fontSize: 44, position: 'relative', animation: 'gzChipIn .5s var(--ease-bounce) both' }}>📲</div>
                </div>
                <div className="gz-cart-confirm-main" style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--ink-black)', marginTop: 12 }}>
                  {t('cart.confirmMain', { namePart: form.firstName ? (lang === 'ar' ? ' يا ' + form.firstName : ', ' + form.firstName) : '', ref: orderRef })}
                </div>
                <div className="gz-cart-confirm-sub" style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-muted-on-light)', marginTop: 8 }}>
                  {fulfillment === 'delivery'
                    ? t('cart.confirmSubDelivery', { target: form.address || t('cart.confirmSubDeliveryFallback') })
                    : t('cart.confirmSubPickup', { target: form.pickupLocation || t('cart.confirmSubPickupFallback') })}
                </div>
                {whatsappUrl && (
                  <div className="gz-cart-confirm-sub" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted-on-light)', marginTop: 14 }}>
                    {t('cart.notOpened')} <a href={whatsappUrl} target="_blank" rel="noopener" style={{ color: 'var(--brand-red)', fontWeight: 700 }}>{t('cart.openWhatsapp')}</a>
                  </div>
                )}
                <button onClick={resetAndClose} style={{ marginTop: 24, padding: '12px 28px', borderRadius: 10, border: 'none', background: 'var(--gold-foil)', color: 'var(--ink-bordeaux-900)', fontFamily: 'var(--font-body)', fontWeight: 700, cursor: 'pointer' }}>{t('cart.done')}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
window.GenZCart = GenZCart;
