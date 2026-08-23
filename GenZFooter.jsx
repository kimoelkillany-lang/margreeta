function GenZFooter() {
  const { t } = window.useGenZLang();
  return (
    <footer style={{ background: 'var(--surface-cream)', borderTop: '1px solid var(--border-hairline-soft)', padding: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
      <img className="gz-footer-logo" src="assets/logo-lockup-transparent.png" alt="Margreeta" style={{ height: 56 }} />
      <div className="gz-footer-text" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-on-red-muted)', letterSpacing: '0.04em' }}>{t('footer.line')}</div>
    </footer>
  );
}
window.GenZFooter = GenZFooter;
