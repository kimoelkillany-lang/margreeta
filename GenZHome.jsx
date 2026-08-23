const STOP_NUMBERS = { italy: '01', america: '02', egypt: '03' };
const STOP_BG = { italy: 'assets/italy-bg.jpg', america: 'assets/america-bg-nyc.webp', egypt: 'assets/egypt-bg.jpg' };
function GenZStopCard({ s, onNav, autoFlipped }) {
  const { JourneyStamp, Postcard, useIsMobile } = window.MargreetaDesignSystem_35c101;
  const { t } = window.useGenZLang();
  const [manualFlipped, setManualFlipped] = React.useState(false);
  const flipped = autoFlipped || manualFlipped;
  const canHoverRef = React.useRef(typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  const canHover = canHoverRef.current;
  const isMobile = useIsMobile();
  const frontStampSize = isMobile ? 46 : 64;
  const backStampSize = isMobile ? 34 : 48;
  const handleClick = () => {
    if (canHover) { onNav(s.key); return; }
    if (!flipped) { setManualFlipped(true); return; }
    onNav(s.key);
  };
  return (
    <div className="gz-stopcard" onClick={handleClick} onMouseEnter={() => canHover && setManualFlipped(true)} onMouseLeave={() => canHover && setManualFlipped(false)}
      style={{ cursor: 'pointer', height: 280, perspective: 1200 }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform .6s var(--ease-bounce)', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}>
          <Postcard eyebrow={`${t('common.stopNo')} ${s.number} — ${t('countries.' + s.key)}`} tone="white" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: flipped ? 'var(--shadow-card)' : 'var(--shadow-rest)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <div className="gz-stopcard-title" style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 19, color: 'var(--ink-black)' }}>{t('stops.' + s.key + '.title')}</div>
                <div className="gz-stopcard-line" style={{ fontFamily: 'var(--font-script)', fontStyle: 'italic', fontSize: 15, color: 'var(--text-muted-on-light)', marginTop: 10 }}>{t('stops.' + s.key + '.line')}</div>
              </div>
              <div style={{ position: 'relative', width: frontStampSize, height: frontStampSize, flexShrink: 0 }}>
                <span style={{ position: 'absolute', inset: -16, borderRadius: '50%', background: 'var(--gold-highlight)', transform: flipped ? 'scale(1)' : 'scale(0)', opacity: flipped ? 0.4 : 0, transition: 'transform .5s var(--ease-bounce), opacity .4s var(--ease-smooth)' }}></span>
                <JourneyStamp country={s.key} number={s.number} size={frontStampSize} />
              </div>
            </div>
            <div className="gz-stopcard-frontcue" style={{
              marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 7, alignSelf: 'flex-start',
              padding: '6px 12px', borderRadius: 999,
              background: 'linear-gradient(90deg, rgba(255,177,0,.14), rgba(255,61,110,.1))',
              border: '1px solid rgba(255,177,0,.4)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.02em', color: 'var(--brand-red)'
            }}>
              {canHover ? `${t('worldTour.clickToExplore')} ${t('stops.' + s.key + '.hintTarget')}` : `${t('worldTour.tapToExplore')} ${t('stops.' + s.key + '.hintTarget')}`}
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
              <div className="gz-stopcard-country" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: '#fff', textTransform: 'capitalize' }}>{t('countries.' + s.key)}</div>
            </div>
            <div className="gz-stopcard-hint" style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: 'var(--gold-highlight)', letterSpacing: '0.01em' }}>
              <svg className="gz-stopcard-hint-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="3.2" fill="currentColor" />
                <circle cx="12" cy="12" r="7.2" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
                <circle cx="12" cy="12" r="10.6" stroke="currentColor" strokeWidth="1.6" opacity="0.28" />
              </svg>
              {canHover ? t('worldTour.clickHint') : t('worldTour.tapHint')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const ANCHOR_ITEMS = [
  { key: 'dough', num: '01', image: 'ingredient-dough.jpg' },
  { key: 'tomato', num: '02', image: 'ingredient-tomato.jpg' },
  { key: 'cheese', num: '03', image: 'ingredient-cheese.jpg' }
];
function GenZHome({ onNav }) {
  const { JourneyStamp, Postcard, Button, SectionEyebrow, OrderNowMenu } = window.MargreetaDesignSystem_35c101;
  const { t, dir } = window.useGenZLang();
  const [autoFlipped, setAutoFlipped] = React.useState(false);
  React.useEffect(() => {
    const timer = setInterval(() => setAutoFlipped(v => !v), 3000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div>
      <section className="gz-hero-section" style={{ background: 'var(--surface-cream)', padding: '96px 48px 120px', textAlign: 'center' }}>
        <img className="gz-hero-logo" src="assets/logo-lockup-transparent.png" alt="Margreeta" style={{ width: 340, maxWidth: '100%', height: 'auto', marginBottom: 8 }} />
        <div className="gz-hero-headline" style={{ maxWidth: 640, margin: '40px auto 0', fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 36, color: 'var(--text-on-red)', lineHeight: 1.25 }}>
          {t('hero.headline')}
        </div>
        <div className="gz-hero-copy" style={{ maxWidth: 640, margin: '32px auto 0', textAlign: 'start', fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-on-red-muted)', lineHeight: 'var(--lh-body)' }}>
          <p>{t('hero.copy')}</p>
          <p className="gz-script-accent" style={{ fontFamily: 'var(--font-script)', fontStyle: 'italic', fontSize: 19, color: 'var(--gold-highlight)', marginTop: 20 }}>{t('hero.accent')}</p>
        </div>
        <div style={{ marginTop: 32, display: 'flex', gap: 16, justifyContent: 'center' }}>
          <OrderNowMenu onNav={onNav} variant="primary" />
          <Button variant="dark" onClick={() => {
            const el = document.getElementById('world-tour-section');
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' });
          }}>{t('hero.worldTourBtn')}</Button>
        </div>
      </section>

      <section id="world-tour-section" className="gz-worldtour-section" style={{ background: 'var(--surface-cream)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto 56px' }}>
          <SectionEyebrow accent="gold">{t('worldTour.eyebrow')}</SectionEyebrow>
          <div className="gz-section-heading" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--text-on-red)' }}>{t('worldTour.heading')}</div>
        </div>
        <div className="gz-swipe-hint" style={{ display: 'none', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '-10px 0 18px', fontFamily: "'Fraunces', serif", fontWeight: 700, color: 'var(--gold-highlight)' }}>
          {t('worldTour.swipeHint')}
          <svg className="gz-swipe-arrow" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === 'rtl' ? 'scaleX(-1)' : 'none' }}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </div>
        <div className="gz-worldtour-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28, maxWidth: 1080, margin: '0 auto', alignItems: 'stretch' }}>
          {['italy', 'america', 'egypt'].map((key, i) => (
            <GenZReveal key={key} delay={i * 0.08} className="gz-worldtour-item">
              <GenZStopCard s={{ key, number: STOP_NUMBERS[key] }} onNav={onNav} autoFlipped={autoFlipped} />
            </GenZReveal>
          ))}
        </div>
      </section>

      <section id="concept-section" className="gz-concept-section" style={{ background: 'var(--surface-deep-red)', padding: '64px 48px', boxShadow: 'inset 0 12px 24px -12px rgba(0,0,0,.45), inset 0 -12px 24px -12px rgba(0,0,0,.45)', borderTop: '1px solid rgba(0,0,0,.35)', borderBottom: '1px solid rgba(0,0,0,.35)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto 40px' }}>
          <SectionEyebrow accent="gold">{t('anchor.eyebrow')}</SectionEyebrow>
          <div className="gz-section-heading" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--text-on-red)' }}>{t('anchor.heading')}</div>
          <div className="gz-script-accent" style={{ fontFamily: 'var(--font-script)', fontStyle: 'italic', fontSize: 17, color: 'var(--gold-highlight)', marginTop: 14 }}>{t('anchor.accent')}</div>
        </div>
        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(440px, 100%), 1fr))', gap: 24 }}>
          {ANCHOR_ITEMS.map((item, i) => (
            <GenZReveal key={item.key} delay={i * 0.06} className="gz-ingredient-row" style={{
              display: 'flex', gap: 20, alignItems: 'center', padding: 20, borderRadius: 'var(--radius-md)',
              background: 'rgba(0,0,0,.18)', border: '1px solid rgba(255,255,255,.08)', transition: 'transform .3s var(--ease-bounce), background .25s ease'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'rgba(0,0,0,.28)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.background = 'rgba(0,0,0,.18)'; }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <image-slot className="gz-ingredient-img" id={`ingredient-${item.key}`} src={`assets/${item.image}`} placeholder={`${t('anchor.' + item.key + '.title')}`} shape="rounded" style={{ width: 108, height: 108, display: 'block' }}></image-slot>
                <span className="gz-ingredient-badge" style={{ position: 'absolute', top: -8, insetInlineStart: -8, width: 28, height: 28, borderRadius: '50%', background: 'var(--gold-foil)', color: 'var(--ink-bordeaux-900)', fontFamily: 'var(--font-stamp)', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(0,0,0,.3)' }}>{item.num}</span>
              </div>
              <div>
                <div className="gz-ingredient-title" style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18, color: 'var(--text-on-red)', marginBottom: 6 }}>{t('anchor.' + item.key + '.title')}</div>
                <div className="gz-ingredient-copy" style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-on-red-muted)', lineHeight: 1.45 }}>{t('anchor.' + item.key + '.copy')}</div>
              </div>
            </GenZReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
window.GenZHome = GenZHome;
