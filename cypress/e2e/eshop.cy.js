const { ShopPage } = require("../support/shopPage")
const { SummaryOrderPage } = require("../support/summaryPage")

describe('Cypress cookie',function(){
    beforeEach(function(){
        cy.setCookie('Cookie', "true")
        cy.visit('http://localhost:3000/shop')
    })
    it('Cookies storage',function(){
    })
})

describe('Local storage',function(){
    beforeEach(function () {
        cy.setCookie('Cookie', "true")
        cy.visit('http://localhost:3000/shop')
    })
    it('Local stoage',function(){
        window.localStorage.setItem('Items', JSON.stringify([{ "idItems": 2, "amount": 1 }]))
        cy.get('button[data-type="header-cart-btn"]').click({ force: true })
    })
})

describe('Local storage priama navigacia', function () {
    beforeEach(function () {
        cy.setCookie('Cookie', "true")
        window.localStorage.setItem('Items', JSON.stringify([{ "idItems": 4, "amount": 1 }, { "idItems": 9, "amount": 1 }]))
        cy.visit('http://localhost:3000/cart')
    })
    it('Local stoage prepisany 3 case', function () {
        //overit produkty v kosiku
        cy.get('h5[data-type*="cart-item-title-"]').then(function (productName) {
            expect(productName.text()).to.include('Smartphone')
            expect(productName.text()).to.include('Sunglasses')
        })
    })
})

describe('Asynchronny kod',function(){
    beforeEach(function () {
        cy.setCookie('Cookie', "true")
        cy.visit('http://localhost:3000/shop')
    })
    it('Vysvetlenie asynchronneho kodu',function(){
        let sumaTricko 
        console.log('suma 1 ', sumaTricko)
        cy.get('[data-type="product-price-0"]').then(suma=>{
            sumaTricko = suma.text()
            cy.wrap(sumaTricko).as('suma')
            console.log('suma 2 ', sumaTricko)
        })
        console.log('suma 3 ', sumaTricko)
        cy.get('@suma').then(element=>{
            cy.log(element)
        })
    })
    it('Priklad asynchronneho kodu', function () {
        cy.get('[data-type="product-price-0"]').then(suma => {
            cy.wrap(suma.text()).as('suma')
        })
        cy.get('[data-type="product-cart-button-0"]').click()
        cy.get('[data-type="navigate-to-cart"]').click()
        cy.get('[data-type="cart-single-item-total-price-0"]').then(function(kosikCena){
            cy.get('@suma').then(obchodCena => {
                cy.wrap(kosikCena.text().split(' €')[0]).should('eq', obchodCena.split('€')[0])
            })
        })

    })
})

describe('Node script',function(){
        beforeEach(function () {
            cy.task('deleteOrderFile')
            cy.setCookie("Cookie", "true")
            window.localStorage.setItem("Items", JSON.stringify([{ "idItems": 3, "amount": 1 }]))
            window.localStorage.setItem("Shipping", JSON.stringify({ "shipping": "Personal pickup", "payment": "Credit / Debit Card" }))
            window.localStorage.setItem("Address", JSON.stringify({ "email": "asdf@fesaf.sdaf", "name": "asdf", "address": "asdfase", "country": "Algeria", "city": "asdfae", "post_code": "asdfaesf", "phone_number": "1616164647", "newsletter": false, "terms_and_condition": true, "bussiness_account": false, "compaty_reg_number": "", "VAT": "", "BIC": "", "IBAN": "", "bank_account_holder": "", "idUsers": "" }))
            cy.visit("http://localhost:3000/logIn")
        })
        it('Objednavka', function () {
            //prihlasenie
            cy.get('input[data-type="username-Input"]').clear().type('test1')
            cy.get('input[data-type="password-Input"]').clear().type('123456789')
            cy.get('input[data-type="log-in-button"]').click()
            cy.get('div[data-type="success-box"]').should('be.visible').and('have.text', 'Authorization was successful!')
            //vytvorit objednavku
            cy.visit("http://localhost:3000/Summary")
            cy.get('[data-type="summary-order"]').click()
            cy.get('[data-type="order-successful-icon"]').should('be.visible')
            //vybrat order ID
            cy.get('p[data-type="order-successful-id"]').then(function (identifier) {
                const wrappedID = identifier.text()
                const ID = wrappedID.match(/\d/g).join('')
                cy.wrap(ID).as('ID')
            })
            //navigacia do objednavok
            cy.get('button[data-type="header-item-my-orders"]').click()
            //verifikacia objednavky 
            cy.get("@ID").then(function (objednavka) {
                cy.get(`div[data-type="my-orders-single-items-div-${objednavka}"]`).should('be.visible')
            })
        })
})


describe.only('Page Objects + Custom command', function () {
    beforeEach(function () {
        cy.task('deleteOrderFile')
        cy.setCookie("Cookie", "true")
        window.localStorage.setItem("Items", JSON.stringify([{ "idItems": 3, "amount": 1 }]))
        window.localStorage.setItem("Shipping", JSON.stringify({ "shipping": "Personal pickup", "payment": "Credit / Debit Card" }))
        window.localStorage.setItem("Address", JSON.stringify({ "email": "asdf@fesaf.sdaf", "name": "asdf", "address": "asdfase", "country": "Algeria", "city": "asdfae", "post_code": "asdfaesf", "phone_number": "1616164647", "newsletter": false, "terms_and_condition": true, "bussiness_account": false, "compaty_reg_number": "", "VAT": "", "BIC": "", "IBAN": "", "bank_account_holder": "", "idUsers": "" }))
        cy.visit("http://localhost:3000/logIn")
    })
    it('Objednavka', function () {
        //prihlasenie
        cy.login('test1','123456789')
        // LogInPage.usernameInput().clear().type(username)
        // LogInPage.passwordInput().clear().type(password)
        // LogInPage.logInButton().click()
        // LogInPage.successBox().should('be.visible').and('have.text', 'Authorization was successful!')
        //vytvorit objednavku
        cy.visit("http://localhost:3000/Summary")
        SummaryOrderPage.summaryOrderButton().click()
        SummaryOrderPage.succesfullOrderIcon().should('be.visible')
        //vybrat order ID
        SummaryOrderPage.orderID().then(function (identifier) {
            const wrappedID = identifier.text()
            const ID = wrappedID.match(/\d/g).join('')
            cy.wrap(ID).as('ID')
        })
        //navigacia do objednavok
        ShopPage.headerMyOrdersButton().click()
        //verifikacia objednavky 
        cy.get("@ID").then(function (objednavka) {
            cy.get(`div[data-type="my-orders-single-items-div-${objednavka}"]`).should('be.visible')
        })
    })
})