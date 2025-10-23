class ZzfButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });

    this.shadowRoot.innerHTML = `
      <style>
        button {
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s;
        }
        button:hover {
          background: #0056b3;
        }
        button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
      </style>
      <button><slot></slot></button>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('button').addEventListener('click', this.handleClick);
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('button').removeEventListener('click', this.handleClick);
  }

  handleClick = () => {
    this.dispatchEvent(new CustomEvent('zzf-click', {
      detail: {
        message: '按钮被点击了!',
        timestamp: new Date().toISOString(),
      },
      bubbles: true
    }));
  }
}

customElements.define('zzf-button', ZzfButton);