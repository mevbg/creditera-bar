import creditera from './creditera.svg'

class CrediteraBar extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.render()
  }

  render() {
    // Get attributes with defaults
    const backgroundColor = this.getAttribute('background-color') || '#E6E6E6'
    const primaryColor = this.getAttribute('primary-color') || '#00AA33'
    const years = Math.min(30, Math.max(1, parseInt(this.getAttribute('years')) || 30))
    const price = parseFloat(this.getAttribute('price'))

    // Validate required price attribute
    if (!this.getAttribute('price') || isNaN(price)) {
      throw new Error('Price attribute is required and must be a valid number')
    }

    const container = document.createElement('div')
    container.classList.add('container')

    const img = document.createElement('img')
    img.src = creditera
    img.alt = 'Creditera'

    const priceInfo = document.createElement('div')
    priceInfo.classList.add('price-info')
    
    const priceDisplay = document.createElement('p')
    priceDisplay.classList.add('price')
    priceDisplay.textContent = `€${price.toLocaleString()}`
    
    const yearsDisplay = document.createElement('p')
    yearsDisplay.classList.add('years')
    yearsDisplay.textContent = `${years} ${years !== 1 ? 'години' : 'година'}`

    const style = document.createElement('style')
    style.textContent = `
      .container {
        width: 100%;
        box-sizing: border-box;
        padding: 16px;
        background: ${backgroundColor};
        border: 1px solid #ccc;
        border-radius: 8px;
        font-family: inherit, sans-serif;
        display: inline-flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      img {
        width: 192px;
        height: auto;
      }
      .price-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .price {
        margin: 0;
        font-size: 1.2em;
        font-weight: bold;
        color: ${primaryColor};
      }
      .years {
        margin: 0;
        font-size: 0.9em;
        color: #666;
      }
    `

    // Clear shadow root and append new content
    this.shadowRoot.innerHTML = ''
    this.shadowRoot.append(style, container)
    container.append(img, priceInfo)
    priceInfo.append(priceDisplay, yearsDisplay)
  }

  // Observe attribute changes
  static get observedAttributes() {
    return ['background-color', 'primary-color', 'years', 'price']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Re-render when attributes change
    if (oldValue !== newValue && this.shadowRoot) {
      this.render()
    }
  }
}

customElements.define('creditera-bar', CrediteraBar)