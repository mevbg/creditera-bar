import creditera from './creditera.svg'

const LOCALE = 'fr-FR' // bg-BG

class CrediteraBar extends HTMLElement {
  constructor() {
    super()
    this.#shadowRoot = this.attachShadow({ mode: 'closed' })
    this.#selectedYears = null // Internal state for selected years
    this.render()
  }

  #shadowRoot
  #selectedYears

  // Vue-like data getter - returns reactive data based on attributes
  get data() {
    return {
      backgroundColor: this.getAttribute('background-color') || '#E6E6E6',
      primaryColor: this.getAttribute('primary-color') || '#00AA33',
      years: Math.min(30, Math.max(1, parseInt(this.getAttribute('years')) || 30)),
      price: parseFloat(this.getAttribute('price')),
      isValidPrice: this.getAttribute('price') && !isNaN(parseFloat(this.getAttribute('price')))
    }
  }

  // Vue-like computed properties
  get computed() {
    const data = this.data
    // Use selected years if available, otherwise fall back to data.years
    const currentYears = this.#selectedYears || data.years
    return {
      formattedPrice: `€ ${data.price.toLocaleString(LOCALE)}`,
      yearsText: `${data.years}${data.years !== 1 ? ' години' : ' година'}`,
      logoSrc: creditera,
      monthlyPayment: Math.round(data.price / (currentYears * 12)).toLocaleString(LOCALE),
      currentYears: currentYears,
      yearsOptions: Array.from({ length: data.years }, (_, i) => {
        const years = i + 1
        return {
          value: years,
          label: `${years} год`,
          selected: years === currentYears
        }
      })
    }
  }

  // Handle years selection change
  #handleYearsChange = (event) => {
    this.#selectedYears = parseInt(event.target.value)
    this.render()
  }

  // Vue-like template method
  template() {
    const { backgroundColor, primaryColor } = this.data
    const { formattedPrice, logoSrc, monthlyPayment, yearsOptions } = this.computed
    
    return `
      <style>
        .root {
          --color-content-dark: #000;
          --color-content-light: #fff;
          --color-primary: ${primaryColor};
          --color-background: ${backgroundColor};

          --typo-font-size-base: 18px;
          --typo-font-size-price: 32px;
          --typo-font-size-monthly-payment: 20px;
          --typo-font-size-button: 14px;
          --typo-font-weight-bold: 600;

          --space-base: 8px;

          --height: calc((calc(var(--space-base) * 1.5) * 2) + var(--typo-font-size-button));

          width: 100%;
          box-sizing: border-box;
          padding: calc(var(--space-base) * 1.25) calc(var(--space-base) * 2);
          background: var(--color-background);
          color: var(--color-content-dark);
          font-family: system-ui, sans-serif;
          font-size: var(--typo-font-size-base);
          line-height: 1;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          column-gap: calc(var(--space-base) * 3);
          row-gap: calc(var(--space-base) * 2);
          user-select: none;
          overflow: auto;
        }

        .root > * {
          display: flex;
          align-items: center;
        }

        .price {
          margin: 0;
          font-size: var(--typo-font-size-price);
          font-weight: var(--typo-font-weight-bold);
        }

        .monthly-payment-info {
          display: flex;
          align-items: center;
          column-gap: var(--space-base);
          row-gap: calc(var(--space-base) * 1.5);
          flex-wrap: wrap;
          height: auto;
        }

        .monthly-payment-info span {
          flex-shrink: 0
        }

        .monthly-payment {
          font-size: var(--typo-font-size-monthly-payment);
          color: var(--color-primary);
          font-weight: var(--typo-font-weight-bold);
        }

        img {
          width: 192px;
          height: auto;
          pointer-events: none;
        }

        .form {
          display: flex;
          align-items: center;
          gap: var(--space-base);
        }

        .years-select {
          margin: 0;
          padding: calc(var(--space-base) * 0.5) var(--space-base);
          font-size: var(--typo-font-size-base);
          font-family: inherit;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: white;
          color: var(--color-content-dark);
          cursor: pointer;
        }

        .years-select:focus {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        .button {
          background: var(--color-primary);
          color: var(--color-content-light);
          padding: var(--space-base) calc(var(--space-base) * 2);
          font-size: var(--typo-font-size-button);
          padding: calc(var(--space-base) * 1.5) calc(var(--space-base) * 3);
          border-radius: var(--height);
          text-transform: uppercase;
          text-decoration: none;
          letter-spacing: 0.05em;
          cursor: pointer;
        }
      </style>

      <div class="root">
        <div class="price">
          ${formattedPrice}
        </div>

        <div class="monthly-payment-info">
          <span>Купи за <strong class="monthly-payment">${monthlyPayment}</strong> €/мес. с</span>
          <img src="${logoSrc}" alt="Creditera.bg">
        </div>

        <div class="form">
          <select class="years-select" id="years-select">
            ${yearsOptions.map(option => 
              `<option value="${option.value}" ${option.selected ? 'selected' : ''}>${option.label}</option>`
            ).join('')}
          </select>
          <a class="button" href="https://creditera.bg" target="_blank">Заяви</a>
        </div>
      </div>
    `
  }

  // Vue-like render method that uses the template
  render() {
    // Validate required data
    if (!this.data.isValidPrice) {
      throw new Error('Price attribute is required and must be a valid number')
    }

    // Clear and render template
    this.#shadowRoot.innerHTML = this.template()
    
    // Add event listener to the select element
    const selectElement = this.#shadowRoot.getElementById('years-select')
    if (selectElement) {
      selectElement.addEventListener('change', this.#handleYearsChange)
    }
  }

  // Observe attribute changes
  static get observedAttributes() {
    return ['background-color', 'primary-color', 'years', 'price']
  }

  // Vue-like reactivity - re-render when dependencies change
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.#shadowRoot) {
      // Reset selected years when years attribute changes
      if (name === 'years') {
        this.#selectedYears = null
      }
      this.render()
    }
  }
}

customElements.define('creditera-bar', CrediteraBar)