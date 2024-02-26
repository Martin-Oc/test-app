export class CartPage{
    static cartItemTitle(number){
        return cy.get(`h5[data-type="cart-item-title-${number}"]`)
    }
}