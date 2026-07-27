const STOPS = [
  { key: 'italy', number: '01', title: 'The classics, done properly.', line: "Cause we're as authentic as we are." },
  { key: 'america', number: '02', title: 'Bold, indulgent, done right.', line: 'Subtlety was never the American way.' },
  { key: 'egypt', number: '03', title: 'The local-favorite flavors.', line: 'Home turf, done right.' },
  { key: 'dessert', number: '04', title: 'Restraint has its limits.', line: "And Nutella is one of them." }
];
const STOP_BG = { italy: 'assets/italy-bg.jpg', america: 'assets/america-bg-nyc.webp', egypt: 'assets/egypt-bg.jpg', dessert: 'uploads/nutella-8a0b5573.jpg' };
function GenZStopCard({ s, onNav }) {
  const { JourneyStamp, Postcard, useIsMobile } = window.MargreetaDesignSystem_35c101;
  const [flipped, setFlipped] = React.useState(false);
  const canHoverRef = React.useRef(typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  const canHover = canHoverRef.current;
  const isMobile = useIsMobile();
  const frontStampSize = isMobile ? 46 : 64;
  const backStampSize = isMobile ? 34 : 48;
  const handleClick = () => {
    if (canHover) { onNav(s.key); return; }
    if (!flipped) { setFlipped(true); return; }
    onNav(s.key);
  };
  return (
    <div className="gz-stopcard" onClick={handleClick} onMouseEnter={() => canHover && setFlipped(true)} onMouseLeave={() => canHover && setFlipped(false)}
      style={{ cursor: 'pointer', height: 280, perspective: 1200 }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform .6s var(--ease-bounce)', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}>
          <Postcard eyebrow={`Stop No. ${s.number} — ${s.key[0].toUpperCase() + s.key.slice(1)}`} tone="white" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: flipped ? 'var(--shadow-card)' : 'var(--shadow-rest)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <div className="gz-stopcard-title" style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 19, color: 'var(--ink-black)' }}>{s.title}</div>
                <div className="gz-stopcard-line" style={{ fontFamily: 'var(--font-script)', fontStyle: 'italic', fontSize: 15, color: 'var(--text-muted-on-light)', marginTop: 10 }}>{s.line}</div>
              </div>
              <div style={{ position: 'relative', width: frontStampSize, height: frontStampSize, flexShrink: 0 }}>
                <span style={{ position: 'absolute', inset: -16, borderRadius: '50%', background: 'var(--gold-highlight)', transform: flipped ? 'scale(1)' : 'scale(0)', opacity: flipped ? 0.4 : 0, transition: 'transform .5s var(--ease-bounce), opacity .4s var(--ease-smooth)' }}></span>
                <JourneyStamp country={s.key} number={s.number} size={frontStampSize} />
              </div>
            </div>
          </Postcard>
        </div>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          {STOP_BG[s.key]
            ? <img src={STOP_BG[s.key]} alt={s.key} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <image-slot id={`stop-back-${s.key}`} placeholder={`Photo of ${s.key}`} style={{ width: '100%', height: '100%', display: 'block' }}></image-slot>}
          <div className="gz-stopcard-back" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.05) 35%, rgba(0,0,0,.88) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 4, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
              <JourneyStamp country={s.key} number={s.number} size={backStampSize} />
              <div className="gz-stopcard-country" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: '#fff', textTransform: 'capitalize' }}>{s.key}</div>
            </div>
            {!canHover && <div className="gz-stopcard-hint" style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,.85)', letterSpacing: '0.02em' }}>Tap again to explore →</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
function GenZHome({ onNav }) {
  const { JourneyStamp, Postcard, Button, SectionEyebrow, OrderNowMenu } = window.MargreetaDesignSystem_35c101;
  return (
    <div>
      <section className="gz-hero-section" style={{ background: 'var(--surface-cream)', padding: '96px 48px 120px', textAlign: 'center' }}>
        <img className="gz-hero-logo" src="assets/logo-lockup-transparent.png" alt="Margreeta" style={{ width: 340, maxWidth: '100%', height: 'auto', marginBottom: 8 }} />
        <div className="gz-hero-headline" style={{ maxWidth: 640, margin: '40px auto 0', fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 36, color: 'var(--text-on-red)', lineHeight: 1.25 }}>
          The dough honors Naples — pizza's original home. The toppings explore the globe.
        </div>
        <div className="gz-hero-copy" style={{ maxWidth: 640, margin: '32px auto 0', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-on-red-muted)', lineHeight: 'var(--lh-body)' }}>
          <p>Authentic 48-hour fermented Neapolitan dough, topped with premium ingredients. No shortcuts. Just honest flavor.</p>
          <p className="gz-script-accent" style={{ fontFamily: 'var(--font-script)', fontStyle: 'italic', fontSize: 19, color: 'var(--gold-highlight)', marginTop: 20 }}>One dough. Endless destinations.</p>
        </div>
        <div style={{ marginTop: 32, display: 'flex', gap: 16, justifyContent: 'center' }}>
          <OrderNowMenu onNav={onNav} variant="primary" />
          <Button variant="dark" onClick={() => {
            const el = document.getElementById('world-tour-section');
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' });
          }}>See the World Tour</Button>
        </div>
      </section>

      <section id="world-tour-section" className="gz-worldtour-section" style={{ background: 'var(--surface-cream)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto 56px' }}>
          <SectionEyebrow accent="gold">Let's explore the flavors of each country</SectionEyebrow>
          <div className="gz-section-heading" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--text-on-red)' }}>Same dough. Every stamp a different country.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28, maxWidth: 1080, margin: '0 auto', alignItems: 'stretch' }}>
          {STOPS.map((s, i) => (
            <GenZReveal key={s.key} delay={i * 0.08}>
              <GenZStopCard s={s} onNav={onNav} />
            </GenZReveal>
          ))}
        </div>
      </section>

      <section id="concept-section" className="gz-concept-section" style={{ background: 'var(--surface-deep-red)', padding: '64px 48px', boxShadow: 'inset 0 12px 24px -12px rgba(0,0,0,.45), inset 0 -12px 24px -12px rgba(0,0,0,.45)', borderTop: '1px solid rgba(0,0,0,.35)', borderBottom: '1px solid rgba(0,0,0,.35)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto 40px' }}>
          <SectionEyebrow accent="gold">The anchor</SectionEyebrow>
          <div className="gz-section-heading" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--text-on-red)' }}>Four ingredients. Zero compromise.</div>
          <div className="gz-script-accent" style={{ fontFamily: 'var(--font-script)', fontStyle: 'italic', fontSize: 17, color: 'var(--gold-highlight)', marginTop: 14 }}>That's the anchor. Everything else is a postcard.</div>
        </div>
        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(440px, 100%), 1fr))', gap: 24 }}>
          {[
            { key: 'dough', num: '01', title: 'The dough', image: 'ingredient-dough.jpg', copy: '48-hour fermented, hand-stretched the Neapolitan way — blistered crust, open crumb, never rushed.' },
            { key: 'tomato', num: '02', title: 'The tomato sauce', image: 'ingredient-tomato.jpg', copy: 'Fresh organic tomatoes, simmered simple. No shortcuts, no concentrate, no preservatives, no added sugar.' },
            { key: 'cheese', num: '03', title: 'Fresh bufflo mozzarella', image: 'ingredient-cheese.jpg', copy: "Mozzarella made fresh daily — milky, elastic, gone before it's a day old." },
            { key: 'toppings', num: '04', title: 'The toppings', image: 'ingredient-toppings.webp', copy: 'Premium, sourced ingredients — the only thing that changes from one stop to the next.' }
          ].map((item, i) => (
            <GenZReveal key={item.key} delay={i * 0.06} className="gz-ingredient-row" style={{
              display: 'flex', gap: 20, alignItems: 'center', padding: 20, borderRadius: 'var(--radius-md)',
              background: 'rgba(0,0,0,.18)', border: '1px solid rgba(255,255,255,.08)', transition: 'transform .3s var(--ease-bounce), background .25s ease'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'rgba(0,0,0,.28)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.background = 'rgba(0,0,0,.18)'; }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <image-slot className="gz-ingredient-img" id={`ingredient-${item.key}`} src={`assets/${item.image}`} placeholder={`Photo of ${item.title.toLowerCase()}`} shape="rounded" style={{ width: 108, height: 108, display: 'block' }}></image-slot>
                <span className="gz-ingredient-badge" style={{ position: 'absolute', top: -8, left: -8, width: 28, height: 28, borderRadius: '50%', background: 'var(--gold-foil)', color: 'var(--ink-bordeaux-900)', fontFamily: 'var(--font-stamp)', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(0,0,0,.3)' }}>{item.num}</span>
              </div>
              <div>
                <div className="gz-ingredient-title" style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18, color: 'var(--text-on-red)', marginBottom: 6 }}>{item.title}</div>
                <div className="gz-ingredient-copy" style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-on-red-muted)', lineHeight: 1.45 }}>{item.copy}</div>
              </div>
            </GenZReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
window.GenZHome = GenZHome;
