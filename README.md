# Creditera Bar

> Web component representing an interactive bar for calculating monthly loan payments

[![npm version][npm-version-src]][npm-version-href]
[![License][license-src]][license-href]

## 🎯 Overview

`creditera-bar` is a [**Custom HTML Element**](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) *(web component)* that provides an interactive bar for calculating monthly loan payments. The component automatically calculates the monthly payment based on property price, annual interest rate, and payment period, as well as providing direct redirection to an application form through [CREDITERA.BG](https://creditera.bg/).

## 📦 Setup

There are two ways of implementation:

### 1. Node module installation

#### npm

```bash
npm install @mevbg/creditera-bar
```

#### pnpm

```bash
pnpm add @mevbg/creditera-bar
```

#### yarn

```bash
yarn add @mevbg/creditera-bar
```

### 2. Manually

Download the `creditera-bar.js` file and add it to your page:

```html
<script src="./path/to/creditera-bar.js"></script>
```

## ⚙️ Usage

Configure the component through the supported arguments and according to the appropriate context, then place it on the page where you want the bar to appear. Here are two examples:

### Basic Example

```html
<creditera-bar 
  price="200000" 
  redirect-url="https://creditera.app.finbryte.com/form/3d182075-e6be-4d48-9ac6-3af5ab3f8a2c">
</creditera-bar>
```

### Full Example with All Arguments

```html
<creditera-bar 
  price="150000"
  redirect-url="https://creditera.app.finbryte.com/form/3d182075-e6be-4d48-9ac6-3af5ab3f8a2c"
  max-period="25"
  interest="2.5"
  loan-cap-percent="80"
  background-color="#F0F0F0"
  primary-color="#0066CC"
  alignment="center">
</creditera-bar>
```

## 📋 Arguments

### `price`

- **Description**: Property price in euros (€)
- **Type**: integer
- **Required**: YES
- **Default value**: none
- **Example**: `price="200000"`

### `redirect-url`

- **Description**: URL address to the loan application form
- **Type**: text (URL)
- **Required**: YES
- **Default value**: none
- **Example**: `redirect-url="https://creditera.app.finbryte.com/form/3d182075-e6be-4d48-9ac6-3af5ab3f8a2c"`

### `max-period`

- **Description**: Upper limit of the loan period in years
- **Type**: integer
- **Required**: NO
- **Default value**: `30`
- **Constraints**: minimum 4, maximum 30
- **Example**: `years="25"`

### `interest`

- **Description**: Annual interest rate in percent
- **Type**: number
- **Required**: NO
- **Default value**: `2.19`
- **Example**: `interest="2.5"`

### `loan-cap-percent`

- **Description**: Maximum percentage of the property price that can be granted as a loan
- **Type**: number
- **Required**: NO
- **Default value**: `85`
- **Constraints**: maximum 85
- **Example**: `loan-cap-percent="80"`

### `background-color`

- **Description**: Background color of the bar
- **Type**: HEX color
- **Required**: NO
- **Default value**: `#E6E6E6`
- **Example**: `background-color="#F0F0F0"`

### `primary-color`

- **Description**: Accent color (for monthly payment amount and button)
- **Type**: HEX color
- **Required**: NO
- **Default value**: `#00AA33`
- **Example**: `primary-color="#0066CC"`

### `alignment`

- **Description**: Content alignment within the bar
- **Type**: text
- **Required**: NO
- **Default value**: `left`
- **Possible values**: `left`, `center`
- **Example**: `alignment="center"`

## ⚡ Functionality

### Automatic Calculation

The component automatically calculates the monthly payment using the annuity repayment formula based on a certain percentage of the provided price (by default 85% or a value provided through the `loan-cap-percent` attribute, according to the regulatory restriction of the Bulgarian National Bank that the mortgage loan amount cannot exceed 85% of the property's market price):

```text
M = P × [r × (1 + r)^n] / [(1 + r)^n - 1]
```

Where:

- M = monthly payment
- P = loan amount *(loan-cap-percent of the provided price)*
- r = monthly interest rate *(interest / 12 / 100)*
- n = total number of payments *(years × 12)*

### Interactivity

- **APPLY** button that leads to the link provided through `redirect-url` to the application form (automatically adds `years` and `amount` query arguments);
- Dynamic updating of the monthly payment when years are changed.

### Validation

- The `price` argument is required and must be a valid number;
- The `redirect-url` argument is required and must be a valid URL address;
- The `max-period` argument is limited between 4 years and the provided upper limit (default 30 years);
- The `loan-cap-percent` argument is limited to a maximum of 85% (according to the regulatory requirements of the Bulgarian National Bank);
- The `alignment` argument accepts only `left` or `center` values.

## 🛠️ Technical Specifications

- Compatible with modern browsers that support Web Components;
- Does not require additional library/framework scripts;
- Automatically registers as a `creditera-bar` HTML element, no need to call a global function/method.

## 🤝🏻 Contributing

This is a personal work and no contributions are expected.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/%40mevbg%2Fcreditera-bar/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@mevbg/creditera-bar
[license-src]: https://img.shields.io/npm/l/%40mevbg%2Fcreditera-bar.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://github.com/mevbg/creditera-bar/blob/main/LICENSE
