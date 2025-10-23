class ZzfCard extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'avatar', 'email', 'role'];
  }

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const name = this.getAttribute('name') || '匿名用户';
    const avatar = this.getAttribute('avatar') || '';
    const email = this.getAttribute('email') || '';
    const role = this.getAttribute('role') || '用户';

    this.shadowRoot.innerHTML = `
      <style>
        .user-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }
        .info {
          flex: 1;
        }
        .name {
          font-weight: 600;
          margin: 0 0 4px 0;
          font-size: 16px;
        }
        .email {
          color: #666;
          margin: 0 0 4px 0;
          font-size: 14px;
        }
        .role {
          display: inline-block;
          background: #e9ecef;
          color: #495057;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
      </style>
      <div class="user-card">
        <img class="avatar" src="${avatar}" alt="${name}">
        <div class="info">
          <h3 class="name">${name}</h3>
          <p class="email">${email}</p>
          <span class="role">${role}</span>
        </div>
        <slot name="actions"></slot>
      </div>
    `;
  }
}

customElements.define('zzf-card', ZzfCard);