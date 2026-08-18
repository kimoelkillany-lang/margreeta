const ACCENTS_STAMP = { italy: 'var(--accent-italy)', america: 'var(--accent-america)', egypt: 'var(--accent-egypt)', dessert: 'var(--accent-dessert)' };
function JourneyStamp({ country = 'italy', label, number = '01', size = 96 }) {
  const accent = ACCENTS_STAMP[country] || 'var(--gold-foil)';
  const displayLabel = label || country.charAt(0).toUpperCase() + country.slice(1);
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={visible ? 'gz-stamp-thud' : ''} style={{ width: size, height: size, borderRadius: '50%', border: `1.5px solid ${accent}`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: visible ? 1 : 0 }}>
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

const INGREDIENT_ICONS = [
  ['pepperoni', '🥓'], ['pastrami', '🥩'], ['salami', '🌶️'], ['mushroom', '🍄'],
  ['tomato', '🍅'], ['basil', '🌿'], ['parsley', '🌿'], ['arugula', '🥬'],
  ['olive', '🫒'], ['onion', '🧅'], ['pepper', '🫑'], ['honey', '🍯'],
  ['mozzarella', '🥛'], ['cheese', '🧀'], ['parmesan', '🧀'], ['provolone', '🧀']
];
function getIngredientIcon(text) {
  const lower = String(text).toLowerCase();
  const match = INGREDIENT_ICONS.find(([kw]) => lower.includes(kw));
  return match ? match[1] : null;
}
function Tag({ children, tone = 'outline' }) {
  const styles = {
    outline: { border: '1px solid var(--border-hairline-soft)', color: 'var(--ink-bordeaux-900)', background: 'transparent' },
    filled: { border: '1px solid transparent', color: 'var(--ink-bordeaux-900)', background: 'var(--gold-highlight)' }
  };
  const icon = getIngredientIcon(children);
  return (
    <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-sm)', fontWeight: 500, padding: 'var(--tag-pad)', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', gap: 5, letterSpacing: '0.01em', ...styles[tone] }}>
      {icon && <span aria-hidden="true" style={{ fontSize: '1.05em', lineHeight: 1 }}>{icon}</span>}
      {children}
    </span>
  );
}

const ORDER_NOW_COUNTRIES = [
  ['italy', 'Italy', 'assets/italy-bg.jpg', '-4deg'],
  ['america', 'America', 'assets/america-bg-nyc.webp', '2deg'],
  ['egypt', 'Egypt', 'assets/egypt-bg.jpg', '-2deg']
];
function OrderNowMenu({ onNav, variant = 'primary', size = 'md', label = 'Order now', align = 'center' }) {
  const [open, setOpen] = React.useState(false);
  const [panelTop, setPanelTop] = React.useState(0);
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
  const toggleOpen = () => {
    if (!open && ref.current) setPanelTop(ref.current.getBoundingClientRect().bottom + 16);
    setOpen(o => !o);
  };
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <Button variant={variant} size={size} onClick={toggleOpen}>{label}</Button>
      {open && (
        <React.Fragment>
          <div onClick={() => setOpen(false)} className="gz-ordernow-scrim" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', zIndex: 35 }}></div>
          <div className="gz-ordernow-panel" style={{
            position: align === 'right' ? 'absolute' : 'fixed',
            top: align === 'right' ? 'calc(100% + 16px)' : panelTop,
            ...menuPos, zIndex: 40,
            display: 'flex', gap: 14, maxWidth: 'calc(100vw - 24px)',
            padding: '8px 16px', background: 'transparent', border: 'none', boxShadow: 'none'
          }}>
            {ORDER_NOW_COUNTRIES.map(([key, text, photo, tilt], i) => (
              <div key={key} className="gz-ordernow-chip-in" style={{ animation: 'gzChipIn .5s var(--ease-bounce) both', animationDelay: `${i * 0.06}s` }}>
                <button onClick={() => { setOpen(false); onNav(key); }}
                  className="gz-ordernow-chip"
                  style={{
                    position: 'relative', width: 96, height: 122, margin: 0, padding: 0, borderRadius: 16, overflow: 'hidden',
                    border: '2px solid var(--gold-foil)', background: `url(${photo}) center/cover`, color: '#fff',
                    cursor: 'pointer', display: 'block', textAlign: 'left',
                    animation: 'gzChipFloat 3.4s ease-in-out infinite', animationDelay: `${i * 0.2}s`,
                    boxShadow: '0 0 16px -4px var(--gold-foil)',
                    transform: `rotate(${tilt})`,
                    transition: 'transform .2s var(--ease-bounce), box-shadow .2s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 24px 0 var(--gold-foil)'; e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 16px -4px var(--gold-foil)'; e.currentTarget.style.transform = `rotate(${tilt})`; }}
                >
                  <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,.85) 100%)' }}></span>
                  <span style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: 'var(--gold-foil)', color: 'var(--ink-bordeaux-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-stamp)', fontSize: 10, fontWeight: 700 }}>0{i + 1}</span>
                  <span style={{ position: 'absolute', bottom: 10, left: 10, right: 10, fontFamily: 'var(--font-stamp)', fontVariant: 'small-caps', letterSpacing: '0.02em', fontSize: 13 }}>{text}</span>
                </button>
              </div>
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
