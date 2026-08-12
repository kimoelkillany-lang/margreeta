function GenZNavBar({ current, onNav }) {
  const { OrderNowMenu } = window.MargreetaDesignSystem_35c101;
  const [open, setOpen] = React.useState(false);
  const [hoverKey, setHoverKey] = React.useState(null);
  const [underline, setUnderline] = React.useState({ left: 0, width: 0, opacity: 0 });
  const linksRef = React.useRef(null);
  const itemRefs = React.useRef({});
  const activeKey = hoverKey || current;

  const updateUnderline = React.useCallback((key) => {
    const container = linksRef.current;
    const el = itemRefs.current[key];
    if (!container || !el) { setUnderline(u => ({ ...u, opacity: 0 })); return; }
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setUnderline({ left: eRect.left - cRect.left, width: eRect.width, opacity: 1 });
  }, []);

  React.useEffect(() => { updateUnderline(activeKey); }, [activeKey, updateUnderline]);
  React.useEffect(() => {
    const onResize = () => updateUnderline(activeKey);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeKey, updateUnderline]);

  const go = (target) => { setOpen(false); onNav(target); };
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', position: 'sticky', top: 0, background: 'var(--paper-white)', zIndex: 10, borderBottom: '1px solid var(--border-hairline-soft)' }}>
      <div style={{ cursor: 'pointer' }} onClick={() => onNav('home')}><img className="gz-nav-logo" src="assets/logo-lockup-transparent.png" alt="Margreeta" style={{ height: 40 }} /></div>
      <div className="gz-nav-links" ref={linksRef} style={{ position: 'relative', display: 'flex', gap: 28, fontFamily: 'var(--font-stamp)', fontVariant: 'small-caps', letterSpacing: '0.06em', fontSize: 16, color: 'var(--ink-black)' }}>
        <span onClick={() => onNav('concept')} style={{ cursor: 'pointer', opacity: 0.85, borderBottom: '1px solid transparent', paddingBottom: 2, transition: 'opacity .2s ease, border-color .2s ease' }} onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderColor = 'var(--gold-foil)'; }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.85; e.currentTarget.style.borderColor = 'transparent'; }}>Concept</span>
        {['italy', 'america', 'egypt'].map(c => (
          <span key={c} ref={el => { itemRefs.current[c] = el; }} onClick={() => onNav(c)} onMouseEnter={() => setHoverKey(c)} onMouseLeave={() => setHoverKey(null)}
            style={{ cursor: 'pointer', opacity: activeKey === c ? 1 : 0.72, textTransform: 'capitalize', padding: '10px 20px', transition: 'opacity .25s ease' }}
          >{c}</span>
        ))}
        <span className="gz-nav-underline" style={{ left: underline.left, width: underline.width, opacity: underline.opacity }}></span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <OrderNowMenu onNav={onNav} variant="dark" size="sm" align="right" />
        <button className="gz-nav-burger" onClick={() => setOpen(o => !o)} aria-label="Menu" style={{ display: 'none', width: 40, height: 40, borderRadius: 999, border: '1px solid var(--border-hairline-soft)', background: 'transparent', cursor: 'pointer', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <span style={{ width: 18, height: 2, background: 'var(--ink-black)', borderRadius: 2, transition: 'transform .25s ease', transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }}></span>
          <span style={{ width: 18, height: 2, background: 'var(--ink-black)', borderRadius: 2, opacity: open ? 0 : 1, transition: 'opacity .2s ease' }}></span>
          <span style={{ width: 18, height: 2, background: 'var(--ink-black)', borderRadius: 2, transition: 'transform .25s ease', transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }}></span>
        </button>
      </div>
      {open && (
        <div className="gz-nav-mobile-menu" style={{ display: 'flex', position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--paper-white)', borderBottom: '1px solid var(--border-hairline-soft)', flexDirection: 'column', padding: '8px 20px 20px', gap: 4, fontFamily: 'var(--font-stamp)', fontVariant: 'small-caps', letterSpacing: '0.06em', fontSize: 16, color: 'var(--ink-black)', boxShadow: 'var(--shadow-card)' }}>
          {[['concept', 'Concept'], ['italy', 'Italy'], ['america', 'America'], ['egypt', 'Egypt']].map(([key, label]) => (
            <span key={key} onClick={() => go(key)} className="gz-nav-menu-item" style={{ cursor: 'pointer', padding: '12px 8px', borderBottom: '1px solid rgba(0,0,0,.08)' }}>{label}</span>
          ))}
        </div>
      )}
    </nav>
  );
}
window.GenZNavBar = GenZNavBar;
