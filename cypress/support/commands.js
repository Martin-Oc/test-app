/// <reference types="cypress" />

import { LogInPage } from "./logInPage"
// const { LogInPage } = require("./loginPage")

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('login', (username, password)=>{
    LogInPage.usernameInput().clear().type(username)
    LogInPage.passwordInput().clear().type(password)
    LogInPage.logInButton().click()
    LogInPage.successBox().should('be.visible').and('have.text', 'Authorization was successful!')
})

Cypress.Commands.add("quickLogIn",(username,password)=>{
    cy.session(username,function(){
        cy.request({
            url: "http://localhost:3000/api/v1/login",
            method: "POST",
            body: { username: username, password: password }
        }).then(response => {
            window.localStorage.setItem("User", JSON.stringify({ "token": response.body.token, "username": response.body.username }))
        })
    })
})