const product: string = 'Choco-Caramel Drizzle Cupcakes';
const cakeCount: number = 55;
const goodEmail: string = 'test@test.com';
const badEmails: string[] = ['test', '@test.com'];
const fullName: string = 'Testas Testauskas';
const phoneNumbers = {
  valid: 99999999,
  short: 9,
  long: 154154165165,
};
const comment: string = `Can you make it w/o chocolate and caramel? I'm allergic. Oh, and can you make it gluten free??`;

const selectors = {
  productPrice: '[data-qa="shoppingcart-text-price"]',
  checkoutBtn: '[data-qa="shoppingcart-btn-checkout"]',
  shippingPrice: '[data-qa="checkout-cartsummary-shippingprice"]',
  shippingMethod: '[data-qa="checkout-cartsummary-shippingprice-name"]',
  totalPrice: '[data-qa="checkout-cartsummary-totalprice-value"]',
  continueToContact: '[data-qa="checkout-shippingdetails-continue"]',
  emailInput: '[placeholder="Email"]',
  emailError: '#email-messages',
  phoneInput: '[placeholder="Your phone number"]',
  phoneError: '[data-qa="checkout-contactinformation-phone"]',
  requiredFieldErrors: {
    email: '#email-messages',
    name: '#name-messages',
    phone: '[data-qa="checkout-contactinformation-phone"]',
    comment: '#customFieldValue-messages',
  },
};

// Function to go through checkout process
const goToCheckout = (productName: string, quantity: number): void => {
  cy.addProductToCart(productName, quantity);

  cy.capturePrice(selectors.productPrice).then((cakePrice: number) => {
    cy.get(selectors.checkoutBtn).click();
    cy.ensureShippingToLithuania();

    cy.capturePrice(selectors.shippingPrice).then((shipPrice1: number) => {
      cy.selectShippingMethod();

      cy.get(selectors.shippingMethod)
        .should('be.visible')
        .should('contain', 'LP Express');

      cy.capturePrice(selectors.shippingPrice).then((shipPrice2: number) => {
        expect(shipPrice2).not.to.eq(shipPrice1);
        // Not adding separate price checking tests, as the price tends to spike before settling to the correct value.
        // The implicit checks during the flow are sufficient to validate that the price is correct.
        cy.get(selectors.totalPrice)
          .should('be.visible')
          .invoke('text')
          .should((totalText: string) => {
            const cartTotal: number = parseFloat(
              totalText.replace(/[^\d.]/g, ''),
            );
            const expectedTotal: number = cakePrice * quantity + shipPrice2;
            expect(cartTotal).to.equal(expectedTotal);
          });
      });
    });
  });

  cy.get(selectors.continueToContact).click();
};

describe('Muffin purchase flow', () => {
  beforeEach(() => {
    cy.log('Base URL:', Cypress.env('baseUrl')); // Debugging
    cy.visit(Cypress.env('baseUrl'));
  });

  it('Should complete checkout successfully', () => {
    goToCheckout(product, cakeCount);
    cy.fillContactInfo(goodEmail, fullName, phoneNumbers.valid, comment);
    cy.get('[data-qa="checkout-contactinformation-continue"]').click();
    cy.get('[data-qa="checkout-paymentmethods-placeorder"]').click();
    cy.verifyPageContains('.payment-info__title', 'Thank you for your order');
    cy.get('.payment-info__button').click();
    cy.verifyPageContains('[data-qa="builder-product-section-title"]', product);
  });

  it('Should validate email format', () => {
    goToCheckout(product, cakeCount);
    //the errors appear when you start writing in the next input field after the one of concern,
    //so I'm just reusing cy.fillContactInfo. If run time was a major concern partial filling should be implemented
    cy.fillContactInfo(badEmails[0], fullName, phoneNumbers.valid, comment);
    cy.get(selectors.emailError).should('contain', 'Enter a valid email');

    cy.get(selectors.emailInput).first().clear().type(badEmails[1]);
    cy.get(selectors.emailError).should('contain', 'Enter a valid email');
  });

  it('Should validate phone number format', () => {
    goToCheckout(product, cakeCount);

    cy.fillContactInfo(goodEmail, fullName, phoneNumbers.short, comment);
    cy.get(selectors.phoneError).should(
      'contain',
      'Enter a valid phone number',
    );

    cy.get(selectors.phoneInput).clear().type(phoneNumbers.long.toString());
    cy.get(selectors.phoneError).should(
      'contain',
      'Enter a valid phone number',
    );
  });

  it('Should require all necessary fields before proceeding', () => {
    goToCheckout(product, cakeCount);
    cy.get('[data-qa="checkout-contactinformation-continue"]').click();

    cy.get(selectors.requiredFieldErrors.email).should(
      'contain',
      'Enter a valid email',
    );
    cy.get(selectors.requiredFieldErrors.name).should(
      'contain',
      'Enter a full name',
    );
    cy.get(selectors.requiredFieldErrors.phone).should(
      'contain',
      'Enter a phone number',
    );
    cy.get(selectors.requiredFieldErrors.comment).should(
      'contain',
      'Do you have any special requests or dietary restrictions we should be aware of? (e.g., gluten-free, nut allergies) is required',
    );
  });
});
