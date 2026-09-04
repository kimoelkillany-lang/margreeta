const NEXT_COUNTRY = { italy: 'america', america: 'egypt' };
const TAG = (key, en, ar) => ({ key, en, ar });
const TAGS = {
  tomato: TAG('tomato', 'Tomato sauce', 'صلصة الطماطم'),
  parmesan: TAG('parmesan', 'Parmesan', 'بارميزان'),
  parmesanCheese: TAG('parmesan', 'Parmesan cheese', 'بارميزان'),
  buffaloMozz: TAG('mozzarella', 'Buffalo mozzarella', 'موتزاريلا جاموسي'),
  basil: TAG('basil', 'Fresh basil', 'ريحان طازج'),
  oliveOilExtra: TAG('olive', 'Extra virgin olive oil', 'زيت زيتون بكر ممتاز'),
  oliveOil: TAG('olive', 'Olive oil', 'زيت زيتون'),
  spicySalami: TAG('salami', 'Spicy salami', 'سلامي حار'),
  onion: TAG('onion', 'Fresh onion', 'بصل طازج'),
  greenPepper: TAG('pepper', 'Green pepper', 'فلفل أخضر'),
  arugula: TAG('arugula', 'Fresh arugula', 'جرجير طازج'),
  mushroom: TAG('mushroom', 'Fresh mushroom', 'فطر طازج'),
  pepperoni: TAG('pepperoni', 'Pepperoni', 'بيبروني'),
  hotHoney: TAG('honey', 'Hot honey sauce', 'صلصة العسل الحار'),
  mozzarella: TAG('mozzarella', 'Mozzarella', 'موتزاريلا'),
  blueCheese: TAG('blue cheese', 'Blue cheese', 'جبنة زرقاء'),
  premiumPastrami: TAG('pastrami', 'Premium pastrami', 'باسترامي فاخر'),
  parsley: TAG('parsley', 'Fresh parsley', 'بقدونس طازج'),
  garlic: TAG('garlic', 'Garlic', 'ثوم')
};
const EXTRAS = [
  { key: 'extraMozz', icon: 'mozzarella', en: 'Extra buffalo mozzarella', ar: 'موتزاريلا إضافية', price: 30 },
  { key: 'extraParmesan', icon: 'parmesan', en: 'Extra parmesan', ar: 'بارميزان إضافي', price: 35 },
  { key: 'extraOliveOil', icon: 'olive', en: 'Extra olive oil', ar: 'زيت زيتون إضافي', price: 20 },
  { key: 'extraMushroom', icon: 'mushroom', en: 'Extra mushroom', ar: 'فطر إضافي', price: 30 },
  { key: 'chiliFlakes', icon: 'chili', en: 'Chili flakes', ar: 'رقائق الفلفل الحار', price: 15 }
];
function ExtrasDropdown({ extrasList, selectedExtras, onToggle, lang, t }) {
  const { getIngredientIcon } = window.MargreetaDesignSystem_35c101;
  const [open, setOpen] = React.useState(false);
  const count = selectedExtras.length;
  return (
    <div style={{ marginTop: 14 }}>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-hairline-soft)',
          background: open ? 'rgba(0,0,0,.04)' : '#fff', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: 'var(--ink-black)', transition: 'background .15s ease'
        }}
      >
        <span>{t('dish.extrasLabel')}{count > 0 ? ` (${count})` : ''}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease' }}><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div style={{ marginTop: 6, border: '1px solid var(--border-hairline-soft)', borderRadius: 10, padding: 4, background: 'rgba(0,0,0,.03)' }}>
          {extrasList.map(extra => {
            const icon = getIngredientIcon(extra.icon);
            const checked = selectedExtras.includes(extra.key);
            return (
              <label key={extra.key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 6px', borderRadius: 8, cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <input type="checkbox" checked={checked} onChange={() => onToggle(extra.key)} style={{ width: 16, height: 16, accentColor: 'var(--gold-foil)', cursor: 'pointer', flexShrink: 0 }} />
                {icon && (typeof icon === 'object'
                  ? <img src={icon.img} alt="" aria-hidden="true" style={{ width: '1.2em', height: '1.2em', objectFit: 'cover', borderRadius: '50%', flexShrink: 0 }} />
                  : <span aria-hidden="true" style={{ fontSize: '1.1em', lineHeight: 1 }}>{icon}</span>)}
                <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--ink-black)' }}>{extra[lang] || extra.en}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12.5, color: '#B8860B', whiteSpace: 'nowrap' }}>+{extra.price} {t('dish.priceUnit')}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
const DATA = {
  italy: { number: '01', accent: 'italy', dishes: [
    { slot: 'italy-1', image: 'italy-1.jpg', name: { en: 'Margherita', ar: 'مارجريتا' }, price: 250, tags: [TAGS.tomato, TAGS.parmesan, TAGS.buffaloMozz, TAGS.basil, TAGS.oliveOilExtra], extras: [{ key: 'dishBasil', icon: 'basil', en: 'Extra basil', ar: 'ريحان إضافي', price: 15 }] },
    { slot: 'italy-2', image: 'italy-2.jpg', name: { en: 'Diavola', ar: 'ديابولا' }, price: 350, tags: [TAGS.tomato, TAGS.parmesan, TAGS.buffaloMozz, TAGS.spicySalami, TAGS.oliveOil], extras: [{ key: 'dishSalami', icon: 'salami', en: 'Extra spicy salami', ar: 'سلامي حار إضافي', price: 35 }] },
    { slot: 'italy-3', image: 'italy-3.jpg', name: { en: 'Veggi', ar: 'فيجي' }, price: 280, tags: [TAGS.tomato, TAGS.parmesan, TAGS.buffaloMozz, TAGS.basil, TAGS.oliveOilExtra, TAGS.onion, TAGS.greenPepper, TAGS.arugula], extras: [{ key: 'dishArugula', icon: 'arugula', en: 'Extra arugula', ar: 'جرجير إضافي', price: 20 }] },
    { slot: 'italy-4', image: 'italy-4.jpg', name: { en: 'funghi', ar: 'فونجي' }, price: 330, recommended: true, tags: [TAGS.tomato, TAGS.parmesan, TAGS.buffaloMozz, TAGS.basil, TAGS.oliveOilExtra, TAGS.mushroom] },
    { slot: 'italy-5', image: 'italy-5.jpg', name: { en: 'Marinara', ar: 'مارينارا' }, price: 205, tags: [TAGS.tomato, TAGS.parmesan, TAGS.basil, TAGS.oliveOilExtra, TAGS.garlic], extras: [{ key: 'dishGarlic', icon: 'garlic', en: 'Extra garlic', ar: 'ثوم إضافي', price: 15 }] }
  ]},
  america: { number: '02', accent: 'america', dishes: [
    { slot: 'america-1', image: 'america-1.jpg', name: { en: 'hot honey pepperoni', ar: 'بيبروني بالعسل الحار' }, price: 380, spicy: true, recommended: true, tags: [TAGS.tomato, TAGS.parmesanCheese, TAGS.buffaloMozz, TAGS.pepperoni, TAGS.hotHoney], extras: [{ key: 'dishPepperoni', icon: 'pepperoni', en: 'Extra pepperoni', ar: 'بيبروني إضافي', price: 30 }] },
    { slot: 'america-2', image: 'america-2.jpg', name: { en: 'cheese lovers', ar: 'عشاق الجبنة' }, price: 340, tags: [TAGS.tomato, TAGS.mozzarella, TAGS.parmesan, TAGS.blueCheese], extras: [{ key: 'dishBlueCheese', icon: 'blue cheese', en: 'Extra blue cheese', ar: 'جبنة زرقاء إضافية', price: 35 }] }
  ]},
  egypt: { number: '03', accent: 'egypt', dishes: [
    { slot: 'egypt-1', image: 'egypt-1.jpeg', name: { en: 'Pastrami', ar: 'باسترامي' }, price: 355, recommended: true, tags: [TAGS.tomato, TAGS.buffaloMozz, TAGS.premiumPastrami, TAGS.parsley, TAGS.oliveOilExtra], extras: [{ key: 'dishPastrami', icon: 'pastrami', en: 'Extra pastrami', ar: 'باسترامي إضافي', price: 40 }] }
  ]}
};
function GenZDishCard({ dish, country, isEgyptPastrami }) {
  const { Postcard, Tag } = window.MargreetaDesignSystem_35c101;
  const { t, lang, dir } = window.useGenZLang();
  const [added, setAdded] = React.useState(false);
  const [selectedExtras, setSelectedExtras] = React.useState([]);
  const timeoutRef = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timeoutRef.current), []);
  const toggleExtra = (key) => setSelectedExtras(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  const allExtras = React.useMemo(() => [...EXTRAS, ...(dish.extras || [])], [dish]);
  const chosenExtras = allExtras.filter(e => selectedExtras.includes(e.key));
  const extrasTotal = chosenExtras.reduce((s, e) => s + e.price, 0);
  const totalPrice = dish.price + extrasTotal;
  const handleAdd = () => {
    window.GenZCartStore.add({
      ...dish,
      name: dish.name.en,
      price: totalPrice,
      extras: chosenExtras.map(e => ({ key: e.key, name: e.en, nameAr: e.ar, price: e.price }))
    }, country);
    setAdded(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAdded(false), 1200);
  };
  const wideStyle = isEgyptPastrami ? { width: 'min(336px, calc(100vw - 40px))' } : undefined;
  const dishName = dish.name[lang] || dish.name.en;
  return (
    <div
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = dish.recommended ? '0 0 0 2px var(--gold-foil), var(--shadow-card)' : 'var(--shadow-card)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = dish.recommended ? '0 0 0 2px var(--gold-foil)' : ''; }}
      style={{ transition: 'transform .25s ease, box-shadow .25s ease', borderRadius: 'var(--radius-md)', position: 'relative', boxShadow: dish.recommended ? '0 0 0 2px var(--gold-foil)' : undefined }}
    >
      {dish.recommended && (
        <div className="gz-recommended-badge" style={{ position: 'absolute', top: -12, insetInlineStart: 20, zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--gold-foil)', color: 'var(--ink-bordeaux-900)', fontFamily: 'var(--font-stamp)', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '5px 10px', borderRadius: 999, boxShadow: '0 3px 8px rgba(0,0,0,.25)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#7A1128"><path d="M12 2l2.9 6.26L21.8 9l-5 4.87L18 21l-6-3.5L6 21l1.2-7.13-5-4.87 6.9-.74z"/></svg>
          {t('dish.recommended')}
          <span className="gz-recommended-shine"></span>
        </div>
      )}
      <Postcard tone="white" style={wideStyle}>
        <image-slot id={dish.slot} src={`uploads/${dish.image}`} placeholder={`Photo of ${dishName}`} shape="rounded" style={isEgyptPastrami ? { width: 'min(287px, calc(100vw - 104px))', aspectRatio: '287 / 241', height: 'auto', display: 'block', marginBottom: 16 } : { width: '100%', height: 220, display: 'block', marginBottom: 16 }}></image-slot>
        <div className="gz-dish-name" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--ink-black)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {dish.spicy && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-label={t('dish.spicy')} style={{ flexShrink: 0 }}>
                <path d="M12 2c1.5 2.5-1 4-1 6.5 0 1.4 1.1 2.5 2.5 2.5S16 9.9 16 8.5c1.5 2 2.5 4.5 2.5 6.5a6.5 6.5 0 1 1-13 0C5.5 10 8 7 9 4.5 9.6 3 10.6 2.3 12 2z" fill="#FF3D2E"/>
              </svg>
            )}
            {dishName}
          </span>
          <span className="gz-dish-price" style={{ color: 'var(--brand-red)', fontSize: 17, whiteSpace: 'nowrap' }}>{totalPrice} {t('dish.priceUnit')}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
          {dish.tags.map(tag => <Tag key={tag.key + tag.en} iconKey={tag.key}>{tag[lang] || tag.en}</Tag>)}
        </div>
        <ExtrasDropdown extrasList={allExtras} selectedExtras={selectedExtras} onToggle={toggleExtra} lang={lang} t={t} />
        <button className={`gz-dish-addbtn${added ? ' gz-dish-addbtn-added' : ''}`} onClick={handleAdd}
          style={{ marginTop: 14, width: '100%', padding: '11px', borderRadius: 10, border: 'none', background: added ? 'linear-gradient(135deg, var(--accent-italy), #12a866)' : 'var(--gold-foil)', color: added ? '#fff' : 'var(--ink-bordeaux-900)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'transform .15s ease, background .2s ease', boxShadow: added ? '0 0 16px -2px var(--accent-italy)' : 'none' }}
          onMouseEnter={e => { if (!added) e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
        >
          {added ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 12.5L9 17.5L20 6.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {t('dish.added')}
            </span>
          ) : t('dish.addToOrder')}
        </button>
      </Postcard>
    </div>
  );
}
function GenZCountryStop({ country, onNav }) {
  const { JourneyStamp, SectionEyebrow, Button, useIsMobile } = window.MargreetaDesignSystem_35c101;
  const { t, dir } = window.useGenZLang();
  const d = DATA[country] || DATA.italy;
  const isMobile = useIsMobile();
  return (
    <div>
      <button onClick={() => onNav('home')} aria-label={t('countryStop.backHome')} className="gz-back-fab" style={{ position: 'fixed', insetInlineStart: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 30, width: 48, height: 48, borderRadius: '50%', background: 'var(--gold-foil)', border: 'none', boxShadow: 'var(--shadow-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-bordeaux-900)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === 'rtl' ? 'scaleX(-1)' : 'none' }}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <section className="gz-country-hero" style={{ background: 'var(--surface-cream)', padding: '80px 48px', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'nowrap', justifyContent: 'center', borderBottom: '1px solid var(--border-hairline-soft)' }}>
        <div style={{ transition: 'transform .3s ease', flexShrink: 0 }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06) rotate(-2deg)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) rotate(0)'; }}>
          <JourneyStamp country={d.accent} number={d.number} size={isMobile ? 64 : 120} />
        </div>
        <GenZReveal style={{ minWidth: 0 }}>
        <div style={{ maxWidth: 480 }}>
          <SectionEyebrow accent={d.accent}>{t('common.stopNoLabel', { number: d.number })}</SectionEyebrow>
          <div className="gz-country-heading" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 44, color: 'var(--text-on-red)' }}>{t('countries.' + country)}</div>
          <div className="gz-country-line" style={{ fontFamily: 'var(--font-script)', fontStyle: 'italic', fontSize: 18, color: 'var(--gold-highlight)', marginTop: 12 }}>{t('countryStop.stopLine.' + country)}</div>
        </div>
        </GenZReveal>
      </section>
      <section className="gz-dish-grid-section" style={{ background: 'var(--surface-cream)', padding: '64px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 320px))', gap: 28, maxWidth: 1080, margin: '0 auto', justifyContent: 'center' }}>
        {d.dishes.map((dish, i) => (
          <GenZReveal key={dish.slot} delay={i * 0.08}
            style={country === 'egypt' && dish.name.en === 'Pastrami' ? { width: 'min(336px, calc(100vw - 40px))' } : undefined}
          >
            <GenZDishCard dish={dish} country={country} isEgyptPastrami={country === 'egypt' && dish.name.en === 'Pastrami'} />
          </GenZReveal>
        ))}
      </section>
      <div style={{ textAlign: 'center', padding: '0 0 64px' }}>
        {NEXT_COUNTRY[country] ? (
          <Button variant="dark" onClick={() => onNav(NEXT_COUNTRY[country])}>
            {t('countryStop.exploreNext', { country: t('countries.' + NEXT_COUNTRY[country]) })}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === 'rtl' ? 'scaleX(-1)' : 'none' }}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Button>
        ) : (
          <Button variant="dark" onClick={() => onNav('home')}>{t('countryStop.backToTour')}</Button>
        )}
      </div>
    </div>
  );
}
window.GenZCountryStop = GenZCountryStop;
