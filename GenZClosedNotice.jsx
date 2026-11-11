// "Temporarily closed" message, shown on every visit while window.MARGREETA_ORDERING_OPEN is false (see site-status.js).
// Shows English and Arabic together so every visitor can read it.
function GenZClosedNotice(){
  const [open, setOpen] = React.useState(window.MARGREETA_ORDERING_OPEN === false);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="gz-closed-scrim" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(26,19,51,.62)', display: 'grid', placeItems: 'center', padding: 20, overflowY: 'auto' }}>
      <div role="dialog" aria-modal="true" aria-labelledby="gz-closed-title" className="gz-closed-card"
        style={{ width: 'min(460px, 100%)', background: 'var(--paper-white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', overflow: 'hidden', textAlign: 'center', animation: 'gzClosedIn .45s var(--ease-bounce)' }}>
        <div style={{ background: 'var(--surface-deep-red)', padding: '26px 24px 20px' }}>
          <img src="assets/logo-lockup-transparent.png" alt="Margreeta" style={{ height: 52, width: 'auto', maxWidth: '100%' }} />
        </div>
        <div style={{ padding: '24px 26px 26px', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-stamp)', fontSize: 12, letterSpacing: '0.08em', color: 'var(--ink-black)', background: 'var(--gold-foil)', borderRadius: 999, padding: '6px 14px' }}>TEMPORARILY CLOSED</span>
          <h2 id="gz-closed-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 30, lineHeight: 1.1, margin: '6px 0 0', color: 'var(--ink-black)' }}>Something big is in the oven</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.5, margin: 0, color: 'var(--text-muted-on-light)' }}>
            Online ordering is paused for now. We're making something big at <strong style={{ color: 'var(--ink-black)' }}>Grand Heights Clubhouse</strong>, inshallah. See you very soon!
          </p>
          <div aria-hidden="true" style={{ width: 48, height: 2, background: 'var(--border-hairline-soft)', margin: '6px 0' }}></div>
          <div lang="ar" dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-black)' }}>مغلق مؤقتًا</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.7, margin: 0, color: 'var(--text-muted-on-light)' }}>
              الطلب أونلاين متوقف مؤقتًا، لأننا بنحضّر لحاجة كبيرة في <strong style={{ color: 'var(--ink-black)' }}>كلوب هاوس جراند هايتس</strong>، إن شاء الله. نشوفكم قريب جدًا!
            </p>
          </div>
          <button type="button" autoFocus onClick={() => setOpen(false)}
            style={{ marginTop: 12, width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: 'var(--gold-foil)', color: 'var(--ink-black)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            Got it · تمام
          </button>
        </div>
      </div>
      <style>{'@keyframes gzClosedIn{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}@media (prefers-reduced-motion: reduce){.gz-closed-card{animation:none!important}}'}</style>
    </div>
  );
}
window.GenZClosedNotice = GenZClosedNotice;
