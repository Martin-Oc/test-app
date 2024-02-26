export class SummaryOrderPage{
    //summary page
    static summaryOrderButton(){
        return cy.get('[data-type="summary-order"]')
    }
    //order page
    static succesfullOrderIcon() {
        return cy.get('[data-type="order-successful-icon"]')
    }
    static orderID(){
        return cy.get('p[data-type="order-successful-id"]')
    }
    
}