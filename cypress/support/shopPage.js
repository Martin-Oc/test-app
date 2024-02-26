export class ShopPage{
    static cookieAllow(){
        return cy.get('button[data-type="cookie-banner-allow-btn"]');
    }
    static cookieModal(){
        return cy.get('div[data-type="cookie-banner"]')
    }

    static smartphoneCartButton(){
        return cy.get('div[data-type="product-cart-button-3"]')
    }
    static sunglassesCartButton(){
        return cy.get('div[data-type="product-cart-button-8"]')
    }

    //navigation modal
    static modalContinueShopping(){
        return cy.get('button[data-type="back-to-shoping"]')
    }
    static modalCartNavigation(){
        return cy.get('button[data-type="navigate-to-cart"]')
    }


    //header elements 
    static headerLogInButton(){
        return cy.get('div[data-type="cookie-banner"]')
    }
    static headerMyOrdersButton(){
        return cy.get('button[data-type="header-item-my-orders"]')
    }
}