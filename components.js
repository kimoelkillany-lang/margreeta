const ACCENTS_STAMP = { italy: 'var(--accent-italy)', america: 'var(--accent-america)', egypt: 'var(--accent-egypt)', dessert: 'var(--accent-dessert)' };
function JourneyStamp({ country = 'italy', label, number = '01', size = 96 }) {
  const accent = ACCENTS_STAMP[country] || 'var(--gold-foil)';
  const displayLabel = label || country.charAt(0).toUpperCase() + country.slice(1);
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', border: `1.5px solid ${accent}`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', border: `1px solid ${accent}`, opacity: 0.6 }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <span style={{ fontFamily: 'var(--font-stamp)', fontVariant: 'small-caps', letterSpacing: 'var(--ls-stamp)', fontSize: size * 0.14, color: accent, textTransform: 'uppercase' }}>Stop No.</span>
        <span style={{ fontFamily: 'var(--font-stamp)', fontSize: size * 0.28, color: accent, lineHeight: 1 }}>{number}</span>
        <span style={{ fontFamily: 'var(--font-stamp)', fontVariant: 'small-caps', letterSpacing: 'var(--ls-stamp)', fontSize: size * 0.13, color: accent }}>{displayLabel}</span>
      </div>
    </div>
  );
}

function Postcard({ eyebrow, children, tone = 'cream', style }) {
  const bg = tone === 'white' ? 'var(--paper-white)' : 'var(--surface-cream)';
  return (
    <div style={{ background: bg, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-rest)', padding: 'var(--space-6)', position: 'relative', ...style }}>
      {eyebrow && (
        <div style={{ fontFamily: 'var(--font-stamp)', fontVariant: 'small-caps', letterSpacing: 'var(--ls-eyebrow)', textTransform: 'uppercase', fontSize: 'var(--text-eyebrow)', color: 'var(--brand-red)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-hairline-soft)', paddingBottom: 'var(--space-2)' }}>{eyebrow}</div>
      )}
      {children}
    </div>
  );
}

function Wordmark({ color, tagline = true, size = 'md' }) {
  const sizes = { sm: 22, md: 34, lg: 56 };
  const fs = sizes[size] || sizes.md;
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: fs, letterSpacing: '0.01em', color: color || 'var(--gold-foil)', lineHeight: 1 }}>MARGREETA</span>
      {tagline && (
        <span style={{ fontFamily: 'var(--font-script)', fontStyle: 'italic', fontWeight: 500, fontSize: Math.round(fs * 0.32), color: color || 'var(--gold-foil)', opacity: 0.85 }}>Neapolitan inspired, world driven</span>
      )}
    </div>
  );
}

const BUTTON_SIZES = { sm: { pad: 'var(--btn-pad-sm)', fs: 'var(--btn-fs-sm)' }, md: { pad: 'var(--btn-pad-md)', fs: 'var(--btn-fs-md)' }, lg: { pad: 'var(--btn-pad-lg)', fs: 'var(--btn-fs-lg)' } };
function Button({ children, variant = 'primary', size = 'md', disabled = false, onClick }) {
  const s = BUTTON_SIZES[size] || BUTTON_SIZES.md;
  const base = { fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: s.fs, padding: s.pad, borderRadius: 'var(--radius-sm)', letterSpacing: '0.02em', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.45 : 1, transition: 'transform .15s ease, background .2s ease, border-color .2s ease', border: '1px solid transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 };
  const variants = {
    primary: { background: 'var(--gold-foil)', color: 'var(--ink-bordeaux-900)' },
    secondary: { background: 'transparent', color: 'var(--warm-cream)', borderColor: 'var(--border-hairline)' },
    dark: { background: 'var(--ink-bordeaux-900)', color: 'var(--warm-cream)', borderColor: 'var(--ink-bordeaux-900)' },
    ghost: { background: 'transparent', color: 'var(--ink-bordeaux-900)', textDecoration: 'underline', textUnderlineOffset: 4 }
  };
  return (
    <button disabled={disabled} onClick={onClick} style={{ ...base, ...variants[variant] }}
      onMouseEnter={e => { if (!disabled && variant === 'primary') e.currentTarget.style.background = 'var(--gold-highlight)'; if (!disabled && variant === 'secondary') e.currentTarget.style.borderColor = 'var(--gold-highlight)'; }}
      onMouseLeave={e => { if (variant === 'primary') e.currentTarget.style.background = 'var(--gold-foil)'; if (variant === 'secondary') e.currentTarget.style.borderColor = 'var(--border-hairline)'; }}
    >{children}</button>
  );
}

function Input({ label, placeholder, type = 'text' }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)' }}>
      {label && <span style={{ fontSize: 'var(--text-eyebrow)', letterSpacing: 'var(--ls-eyebrow)', textTransform: 'uppercase', color: 'var(--text-muted-on-light)' }}>{label}</span>}
      <input type={type} placeholder={placeholder} style={{ font: 'inherit', fontSize: 'var(--text-body-md)', padding: '10px 2px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-hairline)', color: 'var(--ink-black)', outline: 'none' }} />
    </label>
  );
}

const EYEBROW_ACCENTS = { italy: 'var(--accent-italy)', america: 'var(--accent-america)', egypt: 'var(--ink-black)', dessert: 'var(--accent-dessert)', gold: 'var(--gold-foil)' };
function SectionEyebrow({ children, accent = 'gold' }) {
  const color = EYEBROW_ACCENTS[accent] || EYEBROW_ACCENTS.gold;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-4)' }}>
      <span style={{ width: 28, height: 1, background: color, opacity: 0.7 }}></span>
      <span style={{ fontFamily: 'var(--font-stamp)', fontVariant: 'small-caps', letterSpacing: 'var(--ls-eyebrow)', textTransform: 'uppercase', fontSize: 'var(--text-eyebrow)', color }}>{children}</span>
    </div>
  );
}

function Tag({ children, tone = 'outline' }) {
  const styles = {
    outline: { border: '1px solid var(--border-hairline-soft)', color: 'var(--ink-bordeaux-900)', background: 'transparent' },
    filled: { border: '1px solid transparent', color: 'var(--ink-bordeaux-900)', background: 'var(--gold-highlight)' }
  };
  return (
    <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-sm)', fontWeight: 500, padding: 'var(--tag-pad)', borderRadius: 'var(--radius-sm)', display: 'inline-block', letterSpacing: '0.01em', ...styles[tone] }}>{children}</span>
  );
}

const ORDER_NOW_COUNTRIES = [
  ['italy', 'Italy', 'var(--accent-italy)'],
  ['america', 'America', 'var(--accent-america)'],
  ['egypt', 'Egypt', 'var(--accent-egypt)'],
  ['dessert', 'Dessert', 'var(--accent-dessert)']
];
function OrderNowMenu({ onNav, variant = 'primary', size = 'md', label = 'Order now', align = 'center' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDocPointer = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDocPointer);
    document.addEventListener('touchstart', onDocPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocPointer);
      document.removeEventListener('touchstart', onDocPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  const menuPos = align === 'right' ? { right: 0 } : { left: '50%', transform: 'translateX(-50%)' };
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <Button variant={variant} size={size} onClick={() => setOpen(o => !o)}>{label}</Button>
      {open && (
        <React.Fragment>
          <div onClick={() => setOpen(false)} className="gz-ordernow-scrim" style={{ position: 'fixed', inset: 0, background: 'rgba(10,4,20,.5)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 35 }}></div>
          <div className="gz-ordernow-panel" style={{
            position: 'absolute', top: 'calc(100% + 16px)', ...menuPos, zIndex: 40,
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12,
            padding: 16, borderRadius: 24,
            background: 'linear-gradient(160deg, rgba(26,19,51,.94), rgba(26,19,51,.82))',
            border: '1px solid rgba(255,224,102,.4)',
            boxShadow: '0 0 0 1px rgba(255,177,0,.15), 0 24px 60px rgba(0,0,0,.55), 0 0 46px -10px rgba(255,177,0,.4)'
          }}>
            {ORDER_NOW_COUNTRIES.map(([key, text, accent], i) => (
              <button key={key} onClick={() => { setOpen(false); onNav(key); }}
                className="gz-ordernow-chip"
                style={{
                  width: 76, height: 76, margin: 0, borderRadius: '50%', border: `1.5px solid ${accent}`,
                  background: 'rgba(255,255,255,.05)', color: '#fff',
                  fontFamily: 'var(--font-stamp)', fontVariant: 'small-caps', letterSpacing: '0.04em', fontSize: 13,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                  animation: 'gzChipIn .5s var(--ease-bounce) both', animationDelay: `${i * 0.05}s`,
                  boxShadow: `0 0 18px -3px ${accent}`,
                  transition: 'transform .2s var(--ease-bounce), box-shadow .2s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = `0 0 26px 0px ${accent}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 0 18px -3px ${accent}`; }}
              >{text}</button>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function useIsMobile(breakpoint = 720) {
  const query = `(max-width:${breakpoint}px) and (orientation: portrait)`;
  const [isMobile, setIsMobile] = React.useState(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia(query).matches);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener ? mql.addEventListener('change', onChange) : mql.addListener(onChange);
    return () => (mql.removeEventListener ? mql.removeEventListener('change', onChange) : mql.removeListener(onChange));
  }, [query]);
  return isMobile;
}

window.MargreetaDesignSystem_35c101 = { JourneyStamp, Postcard, Wordmark, Button, Input, SectionEyebrow, Tag, useIsMobile, OrderNowMenu };
