import { CartPage } from "../support/cartPage"
import { ShopPage } from "../support/shopPage"

describe('Uloha1',function(){
    beforeEach(function(){
        cy.visit("http://localhost:3000/shop")
    })

    it('Scenar 1', function () {
        //kliknut na detaily v cookie
        cy.get('button[data-type="cookie-banner-header-details-btn"]').click()
        //odcheknut preferencies a Stats
        cy.get('input#Preferencies').uncheck({force:true})
        cy.get('input#Stats').uncheck({force: true})
        //potvrdit cookie
        cy.get('button[data-type="cookie-banner-allow-btn"]').click()
        //overit ci cookie neexistuje
        cy.get('div[data-type="cookie-banner"]').should('not.exist')
    })

    it('Scenar 2',function(){
        //cookie banner 
        cy.get('button[data-type="cookie-banner-allow-btn"]').click()
        // cy.get('div[data-type="product-wrapper"]').children().should('have.length', 10)
        //overenie 10 produktov
        cy.get('div[data-type*="single-product-"]').should('have.length',10)
        //kliknutie na clothing a overenie 2 produktov
        cy.get('button[data-type="filter-category-button-Clothing"]').click()
        cy.get('div[data-type*="single-product-"]').should('have.length',2)
        //napisanie do filtra T-shirt a overenie jedneho produktu
        cy.get('input[data-type="filter-search-input"]').type('T-Shirt')
        cy.get('div[data-type*="single-product-"]').should('have.length', 1)
    })

    it('Scenar 3a', function () {
        //cookie banner 
        cy.get('button[data-type="cookie-banner-allow-btn"]').click()
        //pridat do kosika sunglasses a smartphone
        cy.get('div[data-type="product-cart-button-3"]').click()
        cy.get('button[data-type="back-to-shoping"]').click()
        cy.get('div[data-type="product-cart-button-8"]').click()
        //prejst do kosiku
        cy.get('button[data-type="navigate-to-cart"]').click()
        //overit ze su pridane itemy
        cy.get('h5[data-type="cart-item-title-0"]').should('have.text','Smartphone')
        cy.get('h5[data-type="cart-item-title-1"]').should('have.text','Sunglasses')
    })

    it('Scenar 3b', function () {
        //cookie banner 
        cy.get('button[data-type="cookie-banner-allow-btn"]').click()
        //pridat do kosika sunglasses a smartphone
        cy.get('div[data-type*="single-product-"]').each(function(produkt){
            cy.wrap(produkt).find('h5[data-type*="product-title-"]').then(function(element){
                if (element.text() == 'Smartphone' || element.text() == 'Sunglasses'){
                    cy.wrap(produkt).find('div[data-type*="product-cart-button-"]').click()
                    cy.get('button[data-type="back-to-shoping"]').click()
                }
            })
        })
        //prejst do kosika
        cy.get('button[data-type="header-cart-btn"]').click({force:true})
        //overit produkty v kosiku
        cy.get('h5[data-type*="cart-item-title-"]').then(function(productName){
            expect(productName.text()).to.include('Smartphone')
            expect(productName.text()).to.include('Sunglasses')
        })
    })
})

describe('Uloha 2',function(){
    context('Scenar4',function(){
        beforeEach(function(){
            cy.setCookie("Cookie","true")
            window.localStorage.setItem("Items", JSON.stringify([{ "idItems": 3, "amount": 1 }]))
            window.localStorage.setItem("Shipping", JSON.stringify({ "shipping": "Personal pickup", "payment": "Credit / Debit Card" }))
            window.localStorage.setItem("Address", JSON.stringify({ "email": "asdf@fesaf.sdaf", "name": "asdf", "address": "asdfase", "country": "Algeria", "city": "asdfae", "post_code": "asdfaesf", "phone_number": "1616164647", "newsletter": false, "terms_and_condition": true, "bussiness_account": false, "compaty_reg_number": "", "VAT": "", "BIC": "", "IBAN": "", "bank_account_holder": "", "idUsers": "" }))
            cy.visit("http://localhost:3000/Summary")
        })
        it('Objednavka',function(){
            cy.get('[data-type="summary-order"]').click()
            cy.get('[data-type="order-successful-icon"]').should('be.visible')
        })
    })


    context('Scenar 5',function(){
        beforeEach(function(){
            cy.visit("http://localhost:3000/shop")
        })
        it("Prvy end - to - end test",function(){
            //cookie banner 
            cy.get('button[data-type="cookie-banner-allow-btn"]').click()
            //overit ci cookie neexistuje
            cy.get('div[data-type="cookie-banner"]').should('not.exist')
            //prihlasenie
            cy.get('button[data-type="header-item-logIn"]').click()
            cy.get('input[data-type="username-Input"]').clear().type('test1')
            cy.get('input[data-type="password-Input"]').clear().type('123456789')
            cy.get('input[data-type="log-in-button"]').click()
            cy.get('div[data-type="success-box"]').should('be.visible').and('have.text','Authorization was successful!')
            //prejst do obchodu
            cy.get('button[data-type="header-item-shop"]').click()
            //pridat do kosika sunglasses a smartphone
            cy.get('div[data-type*="single-product-"]').each(function (produkt) {
                cy.wrap(produkt).find('h5[data-type*="product-title-"]').then(function (element) {
                    if (element.text() == 'T-Shirt' || element.text() == 'Sneakers') {
                        cy.wrap(produkt).find('div[data-type*="product-cart-button-"]').click()
                        cy.get('button[data-type="back-to-shoping"]').click()
                    }
                })
            })
            //prejst do kosika
            cy.get('button[data-type="header-cart-btn"]').click({ force: true })
            //overit produkty v kosiku
            cy.get('h5[data-type*="cart-item-title-"]').then(function (productName) {
                expect(productName.text()).to.include('T-Shirt')
                expect(productName.text()).to.include('Sneakers')
            })
            //spocitat cenu
            let celkovaCena = 0
            cy.get('h4[data-type*="cart-single-item-total-price-"]').each(function(cena){
                celkovaCena = Number(cena.text().split(' €')[0]) + celkovaCena
                cy.wrap(Math.round(celkovaCena * 100) / 100).as('cenaBezDane')
            })
            //overit medzisuce
            cy.get('p[data-type="cart-price-without-DPH-price"]').then(function(medziSucet){
                cy.get('@cenaBezDane').then(function(cenaBezDane){
                    expect(medziSucet.text()).to.contain(cenaBezDane)
                })
            })
            //overit total
            cy.get('h4[data-type="cart-total-price-price"]').then(function(totalCena){
                cy.get('@cenaBezDane').then(function(cenaBezDane){
                    expect(totalCena.text()).to.contain(Math.round(cenaBezDane * 1.2 * 100) / 100)
                    cy.wrap(totalCena.text()).as('totalCena')
                })
            })
            //shipping 
            cy.get('button[data-type="cart-billing-navigation"]').click()
            cy.get('input[data-type="shippig-personal-pick-up-input"]').check()
            cy.get('input[data-type="shippig-card-input"]').click()
            //address
            cy.get('button[data-type="shipping-address-navigation"]').click()
            //summary
            cy.get('input[data-type="save-values-btn"]').click()
            cy.get('h5[data-type*="summary-item-title-"]').then(function (productName) {
                expect(productName.text()).to.include('T-Shirt')
                expect(productName.text()).to.include('Sneakers')
            })
            cy.get('h4[data-type="summary-total-price-price"]').then(function(total){
                cy.get('@totalCena').then(function (totalKosik) {
                    expect(total.text()).eq(totalKosik)
                })
            })
            //urobit a overit objednavku
            cy.get('button[data-type="summary-order"]').click()
            cy.get('div[data-type="order-successful-icon"]').should('exist')
            //vybrat order ID
            cy.get('p[data-type="order-successful-id"]').then(function (identifier){
                const wrappedID = identifier.text()
                const ID = wrappedID.match(/\d/g).join('')
                cy.wrap(ID).as('ID')
            })
            //navigacia do objednavok
            cy.get('button[data-type="header-item-my-orders"]').click()
            //verifikacia objednavky 
            cy.get("@ID").then(function(objednavka){
                cy.get(`div[data-type="my-orders-single-items-div-${objednavka}"]`).should('be.visible')
            })
        })
    })
})

describe('Scenar 6',function(){
    beforeEach(function () {
        cy.visit("http://localhost:3000/shop")
    })

    it('Page objects (Scenar 3)', function () {
        //cookie banner 
        ShopPage.cookieAllow().click()
        //pridat do kosika sunglasses a smartphone
        ShopPage.smartphoneCartButton().click()
        ShopPage.modalContinueShopping().click()
        ShopPage.sunglassesCartButton().click()
        //prejst do kosiku
        ShopPage.modalCartNavigation().click()
        //overit ze su pridane itemy
        CartPage.cartItemTitle('0').should('have.text', 'Smartphone')
        CartPage.cartItemTitle('1').should('have.text', 'Sunglasses')
    })
})
