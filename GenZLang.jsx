function useGenZLang() {
  const Store = window.GenZLangStore;
  const [lang, setLangState] = React.useState(Store.get());
  React.useEffect(() => Store.subscribe(setLangState), []);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const t = React.useCallback((path, vars) => window.genzTranslate(lang, path, vars), [lang]);
  const pick = React.useCallback((obj) => window.genzPick(obj, lang), [lang]);
  return { lang, dir, t, pick, toggle: Store.toggle, setLang: Store.set };
}

function GenZLangToggle({ style }) {
  const { lang, toggle, t } = useGenZLang();
  return (
    <button onClick={toggle} aria-label={t('cart.switchLang')} className="gz-lang-toggle" style={{
      display: 'inline-flex', alignItems: 'center', borderRadius: 999, border: '1px solid var(--border-hairline-soft)',
      background: 'transparent', padding: 3, cursor: 'pointer', fontFamily: 'var(--font-stamp)', fontSize: 12,
      letterSpacing: '0.04em', flexShrink: 0, ...style
    }}>
      <span style={{ padding: '5px 11px', borderRadius: 999, background: lang === 'en' ? 'var(--gold-foil)' : 'transparent', color: lang === 'en' ? 'var(--ink-bordeaux-900)' : 'var(--ink-black)', transition: 'background .2s ease' }}>EN</span>
      <span style={{ padding: '5px 11px', borderRadius: 999, background: lang === 'ar' ? 'var(--gold-foil)' : 'transparent', color: lang === 'ar' ? 'var(--ink-bordeaux-900)' : 'var(--ink-black)', transition: 'background .2s ease' }}>AR</span>
    </button>
  );
}

window.useGenZLang = useGenZLang;
window.GenZLangToggle = GenZLangToggle;
