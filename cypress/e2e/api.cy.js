
describe('API vysvetlenie',()=>{
    it('Items',()=>{
        cy.request('http://localhost:3000/api/v1/items').then(response=>{
            cy.log(response)
        })
    })

    it('Orders GET',()=>{
        cy.request({
            url: 'http://localhost:3000/api/v1/login', method: "POST", body: { username: "test1", password: "123456789" }
        }).then(token => {

            cy.request({ 
                url: 'http://localhost:3000/api/v1/order', 
                method: 'GET', 
                headers: { Authorization: `Bearer ${token.body.token}`}
        }).then(response =>{
                cy.log(response)
            })
        
        })
    })

    it('Prihlasenie pomocou API a navstivenie stranky',()=>{
        cy.quickLogIn('test1','123456789')
        cy.visit("http://localhost:3000/shop")
    })
    it('Prihlasenie pomocou API a session',()=>{
        cy.quickLogIn('test1','123456789')
        cy.visit("http://localhost:3000/shop")
    })
})

describe('API security testy',()=>{
    it("API bez tokenu",()=>{
        cy.request({
            url: 'http://localhost:3000/api/v1/order',
            method: 'GET',
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.eq(403)
            expect(response.body.msg).to.eq("Not authorized!")

        })
    })
    it("API Invalid token", () => {
        cy.request({
            url: 'http://localhost:3000/api/v1/order',
            method: 'GET',
            headers: { Authorization: `Bearer eyasFsdgrdsfgdsfg.sdfgsregdsfgwaershd` },
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.eq(403)
            expect(response.body.msg).to.eq("Not authorized!")

        })
    })

    it('Valid token', () => {
        cy.request({
            url: 'http://localhost:3000/api/v1/login', method: "POST", body: { username: "test1", password: "123456789" }
        }).then(token => {

            cy.request({
                url: 'http://localhost:3000/api/v1/order',
                method: 'GET',
                headers: { Authorization: `Bearer ${token.body.token}` }
            }).then(response => {
                cy.log(response)
            })

        })
    })
})

describe('API verifikacia odpovede', () => {
    it('Items', () => {
        cy.request('http://localhost:3000/api/v1/items').then(response => {
            cy.wrap(response.body).each(element=>{
                expect(element).to.have.property('category')
                expect(element).to.have.property('description')
                expect(element).to.have.property('idItems')
                expect(element).to.have.property('image')
                expect(element.image).to.contain('data:image/jpeg;base64')
                expect(element).to.have.property('price')
                expect(element).to.have.property('title')
            })
        })
    })
})

describe('Intercept prikaz',()=>{
    beforeEach(function(){
        cy.quickLogIn('test1', '123456789')
        cy.setCookie("Cookie", "true")
    })
    it.skip('Intercept waiting', { defaultCommandTimeout: 10000 },()=>{
        cy.intercept('**/api/v1/order').as('orders')
        cy.visit("http://localhost:3000/my-orders")
        cy.wait('@orders')
        // cy.wait(5000)
        cy.get('[data-type="my-orders-single-items-headline-div-0"]').should('be.visible')
    })

    it('Intercept mocking',() => {
        cy.intercept('**/api/v1/user', 
        {
            "idUsers": 1,
            "email": "asdf@asdf.sk",
            "name": "Janko sdfjghisdfgh",
            "address": "dsafasdf 56",
            "city": "Tatralandia",
            "post_code": "84 475",
            "country": "Slovakia",
            "phone_number": "0909 959 959",
            "newsletter": false,
            "terms_and_condition": true,
            "bussiness_account": false,
            "compaty_reg_number": null,
            "BIC": null,
            "VAT": null,
            "IBAN": null,
            "bank_account_holder": null
        })
        cy.visit("http://localhost:3000/user-profile")
    })
})
