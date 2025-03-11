const cakeCount: number = 55;
const goodEmail: string = 'test@test.com';
const fullName: string = 'Testas Testauskas';
const phoneNumber: number = 99999999;
const comment: string = `Can you make it w/o chocolate and caramel? I'm allergic. Oh, and can you make it gluten free??`;
let cakePrice: number;
let shipPrice1: number;
let shipPrice2: number;
describe('Muffin purchase flow', () => {
  beforeEach(() => {
    cy.visit(
      'https://lightgrey-antelope-m7vwozwl8xf7l3y2.builder-preview.com/',
    );
  });

  it('Should buy some cupcakes', () => {
    cy.addProductToCart('Choco-Caramel Drizzle Cupcakes', cakeCount);

    // Capture item price
    cy.capturePrice('[data-qa="shoppingcart-text-price"]').then((price) => {
      cakePrice = price;
    });

    // Checkout
    cy.get('[data-qa="shoppingcart-btn-checkout"]').click();

    // Validate destination country selection
    cy.get('[data-qa="checkout-shippingdestination-select"]', { timeout: 5000 })
      .should('be.visible')
      .then((dropdown) => {
        if (!dropdown.text().includes('Lithuania')) {
          cy.wrap(dropdown).click(); // Open the dropdown

          cy.get('.v-list-item') // Adjust this selector if needed
            .contains('Lithuania')
            .click(); // Select Lithuania

          cy.log('🚨 Lithuania was not selected, now selecting it...');
        } else {
          cy.log('✅ Lithuania is already selected.');
        }
      });

    // Capture initial shipping price
    cy.capturePrice('[data-qa="checkout-cartsummary-shippingprice"]').then(
      (price) => {
        shipPrice1 = price;
      },
    );

    // Select shipping method and verify price change
    cy.selectShippingMethod();

    cy.get('[data-qa="checkout-cartsummary-shippingprice-name"]')
      .should('be.visible')
      .should('contain', 'LP Express');
    cy.capturePrice('[data-qa="checkout-cartsummary-shippingprice"]').then(
      (price) => {
        shipPrice2 = price;
        expect(shipPrice2).not.to.eq(shipPrice1);
      },
    );

    // Verify total price calculation
    cy.get('[data-qa="checkout-cartsummary-totalprice-value"]', {
      timeout: 10000,
    })
      .should('be.visible')
      .should('not.be.empty')
      .invoke('text')
      .then(() => {
        cy.get('[data-qa="checkout-cartsummary-totalprice-value"]').should(
          (total) => {
            const cartTotal = parseFloat(total.text().replace(/[^\d.]/g, ''));
            const expectedTotal = cakePrice * cakeCount + shipPrice2;

            expect(cartTotal).to.equal(expectedTotal);
          },
        );
      });

    // Proceed to contact info
    cy.get('[data-qa="checkout-shippingdetails-continue"]')
      .should('be.visible')
      .click();
    cy.fillContactInfo(goodEmail, fullName, phoneNumber, comment);
    cy.get('[data-qa="checkout-contactinformation-continue"]')
      .should('be.visible')
      .click();

    // Place order & verify confirmation
    cy.get('[data-qa="checkout-paymentmethods-placeorder"]')
      .should('be.visible')
      .click();
    cy.verifyPageContains('.payment-info__title', 'Thank you for your order');
    cy.get('.payment-info__button').should('be.visible').click();

    // Ensure return to shop
    cy.verifyPageContains(
      '[data-qa="builder-product-section-title"]',
      'Choco-Caramel Drizzle Cupcakes',
    );
  });
});
