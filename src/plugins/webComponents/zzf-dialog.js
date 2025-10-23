class ZzfDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this._isOpen = false;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  static get observedAttributes() {
    return ['title'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'title' && this.shadowRoot) {
      const titleEl = this.shadowRoot.querySelector('.title');
      if (titleEl) {
        titleEl.textContent = newValue;
      }
    }
  }

  render() {
    const title = this.getAttribute('title') || '对话框';

    this.shadowRoot.innerHTML = `
      <style>
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: none;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .overlay.open {
          display: flex;
        }
        .dialog {
          background: white;
          border-radius: 8px;
          padding: 0;
          min-width: 400px;
          max-width: 90vw;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: between;
          align-items: center;
        }
        .title {
          margin: 0;
          font-size: 1.2em;
          font-weight: bold;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5em;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
        }
        .content {
          padding: 20px;
        }
        .footer {
          padding: 16px 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
      </style>
      <div class="overlay">
        <div class="dialog">
          <div class="header">
            <h2 class="title">${title}</h2>
            <button class="close-btn">&times;</button>
          </div>
          <div class="content">
            <slot></slot>
          </div>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const overlay = this.shadowRoot.querySelector('.overlay');
    const closeBtn = this.shadowRoot.querySelector('.close-btn');

    closeBtn.addEventListener('click', () => this.close());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.close();
      }
    });
  }

  // 公共方法
  open() {
    this._isOpen = true;
    this.shadowRoot.querySelector('.overlay').classList.add('open');
    this.dispatchEvent(new CustomEvent('modal-open'));
  }

  close() {
    this._isOpen = false;
    this.shadowRoot.querySelector('.overlay').classList.remove('open');
    this.dispatchEvent(new CustomEvent('modal-close'));
  }

  // 属性访问器
  get isOpen() {
    return this._isOpen;
  }
}

customElements.define('zzf-dialog', ZzfDialog);