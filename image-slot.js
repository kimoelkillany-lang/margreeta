/**
 * <image-slot> — lightweight standalone stand-in for the Claude Design
 * omelette-hosted component. Shows a src image if given, a placeholder
 * caption otherwise, and lets a user drop/browse a local file to preview
 * it (session-only — no persistence outside the design host).
 * Attributes: id, shape ('rect'|'rounded'|'circle'|'pill'), placeholder, src.
 */
(() => {
  const stylesheet = `
    :host{display:block;position:relative;width:100%;height:100%;aspect-ratio:3/2;
      font:13px/1.3 system-ui,-apple-system,sans-serif;color:inherit;overflow:hidden}
    .frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.12);
      display:flex;align-items:center;justify-content:center;cursor:default}
    :host(:not([data-filled])) .frame{cursor:pointer}
    .frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
    .ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;opacity:.35}
    :host([data-filled]) .ring{display:none}
    :host([data-filled]) .empty{display:none}
    .empty{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;
      padding:12px;opacity:.6;user-select:none}
    .empty svg{opacity:.5}
    :host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;background:rgba(201,100,66,.10)}
  `;
  const icon = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';

  class ImageSlot extends HTMLElement {
    static get observedAttributes() { return ['shape', 'radius', 'placeholder', 'src']; }

    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${stylesheet}</style>
        <div class="frame" part="frame">
          <img part="image" alt="" draggable="false" style="display:none">
          <div class="empty" part="empty">${icon}<div class="cap"></div></div>
          <div class="ring" part="ring"></div>
        </div>
        <input type="file" accept="image/png,image/jpeg,image/webp" hidden>`;
      this._img = root.querySelector('img');
      this._cap = root.querySelector('.cap');
      this._frame = root.querySelector('.frame');
      this._input = root.querySelector('input');
      this._frame.addEventListener('click', () => {
        if (!this.hasAttribute('data-filled')) this._input.click();
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._setLocalFile(f);
        this._input.value = '';
      });
      ['dragenter', 'dragover'].forEach(evt => this.addEventListener(evt, (e) => {
        e.preventDefault();
        if (!this.hasAttribute('data-filled')) this.setAttribute('data-over', '');
      }));
      this.addEventListener('dragleave', () => this.removeAttribute('data-over'));
      this.addEventListener('drop', (e) => {
        e.preventDefault();
        this.removeAttribute('data-over');
        if (this.hasAttribute('data-filled')) return;
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._setLocalFile(f);
      });
    }

    connectedCallback() { this._render(); }

    attributeChangedCallback() { if (this.shadowRoot) this._render(); }

    _setLocalFile(file) {
      const url = URL.createObjectURL(file);
      this._img.src = url;
      this._img.style.display = 'block';
      this.setAttribute('data-filled', '');
    }

    _applyShape() {
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      const radius = this.getAttribute('radius');
      let r = radius ? `${radius}px` : '12px';
      if (shape === 'rect') r = '0';
      if (shape === 'circle' || shape === 'pill') r = '999px';
      this._frame.style.borderRadius = r;
    }

    _render() {
      this._applyShape();
      const placeholder = this.getAttribute('placeholder') || 'Drop an image';
      this._cap.textContent = placeholder;
      const src = this.getAttribute('src');
      if (src) {
        this._img.src = src;
        this._img.alt = placeholder.replace(/^Photo of /i, '');
        this._img.style.display = 'block';
        this.setAttribute('data-filled', '');
      }
    }
  }
  if (!customElements.get('image-slot')) customElements.define('image-slot', ImageSlot);
})();
