const DATA = {
  italy: { number: '01', title: 'Italy', line: "The classics, done properly, cause we're as authentic as we are.", accent: 'italy', dishes: [
    { slot: 'italy-1', image: 'italy-1.png', name: 'Margherita', price: 250, tags: ['Tomato sauce', 'Parmesan', 'Buffalo mozzarella', 'Fresh basil', 'Extra virgin olive oil'] },
    { slot: 'italy-2', image: 'italy-2.jpg', name: 'Diavola', price: 350, tags: ['Tomato sauce', 'Parmesan', 'Buffalo mozzarella', 'Spicy salami', 'Olive oil'] },
    { slot: 'italy-3', image: 'italy-3.jpg', name: 'Veggi', price: 280, tags: ['Tomato sauce', 'Parmesan', 'Buffalo mozzarella', 'Fresh basil', 'Extra virgin olive oil', 'Fresh onion', 'Green pepper', 'Fresh arugula'] },
    { slot: 'italy-4', image: 'italy-4.jpg', name: 'funghi', price: 330, recommended: true, tags: ['Tomato sauce', 'Parmesan', 'Buffalo mozzarella', 'Fresh basil', 'Extra virgin olive oil', 'Fresh mushroom'] },
    { slot: 'italy-5', image: 'italy-5.jpg', name: 'Marinara', price: 205, tags: ['Tomato sauce', 'Parmesan', 'Fresh basil', 'Extra virgin olive oil'] }
  ]},
  america: { number: '02', title: 'America', line: 'Bolder, because subtlety was never the American way.', accent: 'america', dishes: [
    { slot: 'america-1', image: 'america-1.jpg', name: 'hot honey pepperoni', price: 380, spicy: true, recommended: true, tags: ['Tomato sauce', 'Parmesan cheese', 'Buffalo mozzarella', 'Pepperoni', 'Hot honey sauce'] },
    { slot: 'america-2', image: 'america-2.jpg', name: 'cheese lovers', price: 340, tags: ['Four cheeses', 'Mozzarella', 'Parmesan', 'Blue cheese', 'Provolone'] }
  ]},
  egypt: { number: '03', title: 'Egypt', line: 'The local-favorite flavors, home turf done right.', accent: 'egypt', dishes: [
    { slot: 'egypt-1', image: 'egypt-1.jpeg', name: 'Pastrami', price: 355, recommended: true, tags: ['Tomato sauce', 'Buffalo mozzarella', 'Premium pastrami', 'Red onion', 'Fresh parsley', 'Extra virgin olive oil'] }
  ]},
  dessert: { number: '04', title: 'Dessert', line: "Restraint has its limits, and Nutella is one of them.", accent: 'dessert', dishes: [
    { slot: 'dessert-1', image: 'dessert-1.jpg', name: 'Nutella bites', price: 180, tags: ['Neapolitan dough', 'Fresh cream', 'Nutella chocolate'] }
  ]}
};
function GenZCountryStop({ country, onNav }) {
  const { JourneyStamp, Postcard, Tag, SectionEyebrow, Button } = window.MargreetaDesignSystem_35c101;
  const d = DATA[country] || DATA.italy;
  return (
    <div>
      <section style={{ background: 'var(--surface-cream)', padding: '80px 48px', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', justifyContent: 'center', borderBottom: '1px solid var(--border-hairline-soft)' }}>
        <div style={{ transition: 'transform .3s ease' }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06) rotate(-2deg)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) rotate(0)'; }}>
          <JourneyStamp country={d.accent} number={d.number} size={120} />
        </div>
        <GenZReveal>
        <div style={{ maxWidth: 480 }}>
          <SectionEyebrow accent={d.accent}>Stop No. {d.number}</SectionEyebrow>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 44, color: 'var(--text-on-red)' }}>{d.title}</div>
          <div style={{ fontFamily: 'var(--font-script)', fontStyle: 'italic', fontSize: 18, color: 'var(--gold-highlight)', marginTop: 12 }}>{d.line}</div>
        </div>
        </GenZReveal>
      </section>
      <section style={{ background: 'var(--surface-cream)', padding: '64px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 320px))', gap: 28, maxWidth: 1080, margin: '0 auto', justifyContent: 'center' }}>
        {d.dishes.map((dish, i) => (
          <GenZReveal key={dish.slot} delay={i * 0.08}
            style={country === 'egypt' && dish.name === 'Pastrami' ? { width: 336 } : undefined}
          >
          <div
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = dish.recommended ? '0 0 0 2px var(--gold-foil), var(--shadow-card)' : 'var(--shadow-card)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = dish.recommended ? '0 0 0 2px var(--gold-foil)' : ''; }}
            style={{ transition: 'transform .25s ease, box-shadow .25s ease', borderRadius: 'var(--radius-md)', position: 'relative', boxShadow: dish.recommended ? '0 0 0 2px var(--gold-foil)' : undefined }}
          >
          {dish.recommended && (
            <div style={{ position: 'absolute', top: -12, left: 20, zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--gold-foil)', color: 'var(--ink-bordeaux-900)', fontFamily: 'var(--font-stamp)', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '5px 10px', borderRadius: 999, boxShadow: '0 3px 8px rgba(0,0,0,.25)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#7A1128"><path d="M12 2l2.9 6.26L21.8 9l-5 4.87L18 21l-6-3.5L6 21l1.2-7.13-5-4.87 6.9-.74z"/></svg>
              Recommended
            </div>
          )}
          <Postcard tone="white" style={country === 'egypt' && dish.name === 'Pastrami' ? { width: 336, height: 541 } : undefined}>
            <image-slot id={dish.slot} src={`uploads/${dish.image}`} placeholder={`Photo of ${dish.name}`} shape="rounded" style={country === 'egypt' && dish.name === 'Pastrami' ? { width: 287, height: 241, display: 'block', marginBottom: 16 } : { width: '100%', height: 220, display: 'block', marginBottom: 16 }}></image-slot>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--ink-black)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {dish.spicy && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-label="Spicy" style={{ flexShrink: 0 }}>
                    <path d="M12 2c1.5 2.5-1 4-1 6.5 0 1.4 1.1 2.5 2.5 2.5S16 9.9 16 8.5c1.5 2 2.5 4.5 2.5 6.5a6.5 6.5 0 1 1-13 0C5.5 10 8 7 9 4.5 9.6 3 10.6 2.3 12 2z" fill="#FF3D2E"/>
                  </svg>
                )}
                {dish.name}
              </span>
              <span style={{ color: 'var(--brand-red)', fontSize: 17, whiteSpace: 'nowrap' }}>{dish.price} EGP</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
              {dish.tags.map(t => <Tag key={t}>{t}</Tag>)}
            </div>
            <button onClick={() => window.GenZCartStore.add(dish, country)} style={{ marginTop: 14, width: '100%', padding: '11px', borderRadius: 10, border: 'none', background: 'var(--gold-foil)', color: 'var(--ink-bordeaux-900)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'transform .15s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
            >Add to order</button>
          </Postcard>
          </div>
          </GenZReveal>
        ))}
      </section>
      <div style={{ textAlign: 'center', padding: '0 0 64px' }}>
        <Button variant="dark" onClick={() => onNav('home')}>Back to the tour</Button>
      </div>
    </div>
  );
}
window.GenZCountryStop = GenZCountryStop;
