Cypress.Commands.add('navigateTo', (page: string) => {
  cy.get(`[data-qa="navigationblock-page-${page}"]`, { timeout: 10000 })
    .first()
    .should('be.visible')
    .click();
  cy.get(`[data-qa="navigationblock-page-active-${page}"]`, {
    timeout: 10000,
  }).should('be.visible');
});

Cypress.Commands.add('verifyPageContains', (selector: string, text: string) => {
  cy.get(selector).should('be.visible').and('contain', text, { timeout: 1000 });
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
    cy.get('[data-qa="productpage-text-qty"]').clear().type(`${quantity}`);
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

Cypress.Commands.add('ensureShippingToLithuania', () => {
  cy.get('[data-qa="checkout-shippingdestination-select"]', { timeout: 5000 })
    .should('be.visible')
    .then((dropdown) => {
      if (!dropdown.text().includes('Lithuania')) {
        cy.wrap(dropdown).click();
        cy.get('.v-list-item').contains('Lithuania').click();
        cy.log('🚨 Lithuania was not selected, now selecting it...');
      } else {
        cy.log('✅ Lithuania is already selected.');
      }
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
