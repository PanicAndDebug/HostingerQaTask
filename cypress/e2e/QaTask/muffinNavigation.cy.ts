describe('Muffin shop navigation', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('baseUrl'));
  });

  it('Should load the homepage with correct title', () => {
    cy.title().should(
      'include',
      'Freshly Baked Muffins - Cozy Online Muffin Shop | Muffin',
    );
    cy.get('nav').should('be.visible');
    cy.get('[data-qa="navigationblock-page-active-home"]')
      .first()
      .should('be.visible');
  });

  it('Should navigate to shop and verify product list', () => {
    cy.navigateTo('shop');
    cy.verifyPageContains(
      '[data-qa="product-list-section-item-title"]',
      'Blueberry Burst Muffins',
    );
  });

  it('Should navigate to menu and verify muffin delights', () => {
    cy.navigateTo('menu');
    cy.verifyPageContains(
      '[data-qa="gridtextbox:z5f2az"] span',
      'Muffin Delights',
    );
  });

  it('Should navigate to about page and verify welcome message', () => {
    cy.navigateTo('about');
    cy.verifyPageContains(
      '[data-qa="gridtextbox:z51glb"]',
      'Welcome to Muffin',
    );
  });

  it('Should open the Shopping Bag and verify it is empty', () => {
    cy.get('[data-qa="header-btn-shoppingbag"]')
      .first()
      .should('be.visible')
      .click();
    cy.get('[data-qa="shoppingcart-text-emptystate"]').should('be.visible');
  });
});
