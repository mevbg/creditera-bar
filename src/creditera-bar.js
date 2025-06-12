import creditera from '../public/creditera.svg'

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
    const alignment = this.getAttribute('alignment') || 'left'
    return {
      backgroundColor: this.getAttribute('background-color') || '#E6E6E6',
      primaryColor: this.getAttribute('primary-color') || '#00AA33',
      years: Math.min(30, Math.max(1, parseInt(this.getAttribute('years')) || 30)),
      price: parseFloat(this.getAttribute('price')),
      annualInterestRate: parseFloat(this.getAttribute('interest')) || 2.19,
      isValidPrice: this.getAttribute('price') && !isNaN(parseFloat(this.getAttribute('price'))),
      alignment: alignment === 'center' ? 'center' : 'left' // Validate alignment value
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
      monthlyPayment: this.#calculateMonthlyPayment({ principal: data.price, annualInterestRate: data.annualInterestRate, loanTermYears: currentYears }).toLocaleString(LOCALE),
      currentYears: currentYears,
      yearsOptions: Array.from({ length: data.years - 3 }, (_, i) => {
        const years = i + 4
        return {
          value: years,
          label: `${years} год`,
          selected: years === currentYears
        }
      })
    }
  }

  #calculateMonthlyPayment = ({ principal, annualInterestRate, loanTermYears }) => {
    const r = (annualInterestRate / 100) / 12;
    const n = loanTermYears * 12;

    const monthlyPayment =
      principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    return Number(monthlyPayment.toFixed(2));
  }

  // Handle years selection change
  #handleYearsChange = (event) => {
    this.#selectedYears = parseInt(event.target.value)
    this.render()
  }

  // Vue-like template method
  template() {
    const { backgroundColor, primaryColor, alignment, price } = this.data
    const { formattedPrice, logoSrc, monthlyPayment, yearsOptions, currentYears } = this.computed
    
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
          justify-content: ${alignment === 'center' ? 'center' : 'flex-start'};
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
          justify-content: ${alignment === 'center' ? 'center' : 'flex-start'};
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
          padding: calc(var(--space-base) * 0.5) calc(var(--space-base) * 3.5) calc(var(--space-base) * 0.5) calc(var(--space-base) * 1.5);
          font-size: var(--typo-font-size-base);
          font-family: inherit;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: white;
          color: var(--color-content-dark);
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg stroke='%23AA1731' fill='none' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'%3e%3cpolyline points='6,9 12,15 18,9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right calc(var(--space-base) * 0.6) center;
          background-size: 20px;
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
          <a class="button" href="https://creditera.app.finbryte.com/form/3d182075-e6be-4d48-9ac6-3af5ab3f8a2c?years=${currentYears}&amount=${price}" target="_blank">Заяви</a>
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
    return ['background-color', 'primary-color', 'years', 'price', 'alignment', 'interest']
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