/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    navigateTo(page: string): Chainable<void>;
    verifyPageContains(selector: string, text: string): Chainable<void>;
    addProductToCart(productName: string, quantity: number): Chainable<void>;
    capturePrice(selector: string): Chainable<number>;
    selectShippingMethod(): Chainable<void>;
    fillContactInfo(
      email: string,
      fullName: string,
      phone: number,
      comment: string,
    ): Chainable<void>;
    ensureShippingToLithuania(): Chainable<void>;
  }
}
