export class LogInPage{
    static usernameInput(){
        return cy.get('input[data-type="username-Input"]')
    }
    static passwordInput(){
        return cy.get('input[data-type="password-Input"]')
    }
    static logInButton(){
        return cy.get('input[data-type="log-in-button"]')
    }
    static successBox(){
        return cy.get('div[data-type="success-box"]')
    }

}