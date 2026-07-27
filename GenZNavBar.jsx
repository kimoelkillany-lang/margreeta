function GenZNavCountry({ c, current, onNav }) {
  const [hover, setHover] = React.useState(false);
  const active = hover || current === c;
  return (
    <span onClick={() => onNav(c)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: 'relative', cursor: 'pointer', opacity: active ? 1 : 0.72, textTransform: 'capitalize', padding: '10px 20px', transition: 'opacity .25s ease' }}
    >
      <span style={{ position: 'absolute', inset: 0, borderRadius: 999, border: '1.5px solid var(--gold-highlight)', transform: active ? 'scale(1)' : 'scale(0.85)', opacity: active ? 1 : 0, transition: 'transform .35s var(--ease-smooth), opacity .3s var(--ease-smooth)', pointerEvents: 'none' }}></span>
      <span style={{ position: 'relative' }}>{c}</span>
    </span>
  );
}
function GenZNavBar({ current, onNav }) {
  const { OrderNowMenu } = window.MargreetaDesignSystem_35c101;
  const [open, setOpen] = React.useState(false);
  const go = (target) => { setOpen(false); onNav(target); };
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', position: 'sticky', top: 0, background: 'var(--surface-cream)', zIndex: 10, borderBottom: '1px solid var(--border-hairline-soft)' }}>
      <div style={{ cursor: 'pointer' }} onClick={() => onNav('home')}><img className="gz-nav-logo" src="assets/logo-lockup-transparent.png" alt="Margreeta" style={{ height: 40 }} /></div>
      <div className="gz-nav-links" style={{ display: 'flex', gap: 28, fontFamily: 'var(--font-stamp)', fontVariant: 'small-caps', letterSpacing: '0.06em', fontSize: 16, color: 'var(--text-on-red)' }}>
        <span onClick={() => onNav('concept')} style={{ cursor: 'pointer', opacity: 0.85, borderBottom: '1px solid transparent', paddingBottom: 2, transition: 'opacity .2s ease, border-color .2s ease' }} onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderColor = 'var(--gold-foil)'; }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.85; e.currentTarget.style.borderColor = 'transparent'; }}>Concept</span>
        {['italy', 'america', 'egypt', 'dessert'].map(c => (
          <GenZNavCountry key={c} c={c} current={current} onNav={onNav} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <OrderNowMenu onNav={onNav} variant="dark" size="sm" align="right" />
        <button className="gz-nav-burger" onClick={() => setOpen(o => !o)} aria-label="Menu" style={{ display: 'none', width: 40, height: 40, borderRadius: 999, border: '1px solid var(--border-hairline-soft)', background: 'transparent', cursor: 'pointer', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <span style={{ width: 18, height: 2, background: 'var(--text-on-red)', borderRadius: 2, transition: 'transform .25s ease', transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }}></span>
          <span style={{ width: 18, height: 2, background: 'var(--text-on-red)', borderRadius: 2, opacity: open ? 0 : 1, transition: 'opacity .2s ease' }}></span>
          <span style={{ width: 18, height: 2, background: 'var(--text-on-red)', borderRadius: 2, transition: 'transform .25s ease', transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }}></span>
        </button>
      </div>
      {open && (
        <div className="gz-nav-mobile-menu" style={{ display: 'flex', position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--surface-cream)', borderBottom: '1px solid var(--border-hairline-soft)', flexDirection: 'column', padding: '8px 20px 20px', gap: 4, fontFamily: 'var(--font-stamp)', fontVariant: 'small-caps', letterSpacing: '0.06em', fontSize: 16, color: 'var(--text-on-red)', boxShadow: 'var(--shadow-card)' }}>
          {[['concept', 'Concept'], ['italy', 'Italy'], ['america', 'America'], ['egypt', 'Egypt'], ['dessert', 'Dessert']].map(([key, label]) => (
            <span key={key} onClick={() => go(key)} className="gz-nav-menu-item" style={{ cursor: 'pointer', padding: '12px 8px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>{label}</span>
          ))}
        </div>
      )}
    </nav>
  );
}
window.GenZNavBar = GenZNavBar;
