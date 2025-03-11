/* eslint-disable cypress/unsafe-to-chain-command */

Cypress.Commands.add('navigateTo', (page: string) => {
  cy.get(`[data-qa="navigationblock-page-${page}"]`, { timeout: 10000 })
    .first()
    .should('be.visible')
    .click();
  cy.get(`[data-qa="navigationblock-page-active-${page}"]`, { timeout: 10000 }).should(
    'be.visible',
  );
});

Cypress.Commands.add('verifyPageContains', (selector: string, text: string) => {
  cy.get(selector).should('be.visible').and('contain', text);
});

Cypress.Commands.add(
  'addProductToCart',
  (productName: string, quantity: number) => {
    cy.get('[data-qa="navigationblock-page-shop"]')
      .first()
      .should('be.visible')
      .click();
    cy.get('[data-qa="product-list-section-item-title"]')
      .contains(productName)
      .first()
      .click();
    cy.get('[data-qa="productpage-text-qty"]')
      .should('be.visible')
      .clear()
      .type(`${quantity}`);
    cy.get('[data-qa="productsection-btn-addtobag"]')
      .should('be.visible')
      .click();
  },
);

Cypress.Commands.add('capturePrice', (selector) => {
  return cy
    .get(selector, { timeout: 10000 })
    .should('be.visible')
    .invoke('text')
    .should('not.be.empty')
    .then((price) => {
      return parseFloat(price.replace(/[^\d.]/g, ''));
    });
});

Cypress.Commands.add('selectShippingMethod', () => {
  cy.get('[data-qa="checkout-shippingdetails-option-lpexpress"]')
    .should('be.visible')
    .click();
  cy.get('[data-qa="checkout-shippingoptions-parcelselect"]')
    .should('be.visible')
    .click();
  cy.get('.v-list-item')
    .contains('Express Market, K. Donelaičio g. 44a, Kaunas')
    .scrollIntoView()
    .should('be.visible')
    .click();
});

Cypress.Commands.add(
  'fillContactInfo',
  (email: string, fullName: string, phone: number, comment: string) => {
    cy.get('[placeholder="Email"]').first().should('be.visible').type(email);
    cy.get('[placeholder="Your full name"]')
      .first()
      .should('be.visible')
      .type(fullName);
    cy.get('[placeholder="Your phone number"]')
      .first()
      .should('be.visible')
      .type(`${phone}`);
    cy.get('[placeholder="Your comment"]')
      .first()
      .should('be.visible')
      .type(comment);
  },
);
