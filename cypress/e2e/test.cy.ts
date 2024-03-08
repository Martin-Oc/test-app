describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    cy.get('[data-type="cookie-banner-allow-btn"]').click()
    cy.get('[data-type="product-cart-button-0"]').click()
    cy.get('[data-type="navigate-to-cart"]').click()
    cy.get('[data-type="cart-single-item-total-price-0"]').should('have.text','15.99 €')

  })
})