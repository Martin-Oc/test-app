describe('Zakladne funkcie', function(){
  beforeEach(function(){
    cy.visit("https://rahulshettyacademy.com/AutomationPractice/")
  })

  it('Oznacit radiobuttony', function(){
    cy.get("input[value='radio1']").check()
    cy.get("input[value='radio2']").check()
    cy.get("input[value='radio3']").check()
  })

  it('Pisanie a klikanie',function(){
    cy.get('#autocomplete').type('Slov')
    // cy.get('#ui-id-1 .ui-menu-item:first-child div[id*="ui-id-"]').click()
    // cy.get('#ui-id-1').find('div[id*="ui-id-"]').eq(0).click()
    cy.contains("Slovakia (Slovak Republic)").click()
    cy.get('#autocomplete').should('have.value','Slovakia (Slovak Republic)')
  })

  it('Selection input',function(){
    cy.get('div.cen-right-align fieldset legend').should('have.text', 'Dropdown Example')
    cy.get('#dropdown-class-example').select('option1')
    cy.get('#dropdown-class-example').should('have.value','option1')
  })

  it('Checbkox priklad',function(){
    cy.get('#checkbox-example legend').should('have.text','Checkbox Example')
    // cy.get('#checkBoxOption1').click()
    // cy.get('#checkBoxOption1').click()
    // cy.get('#checkBoxOption1').check()
    cy.get('input[type="checkbox"]').check(["option1",'option2'])
    cy.get('#checkBoxOption1').should("be.checked")
  })

  it('Zmena origin prikazu',function(){
    cy.get('a#opentab').invoke('removeAttr','target')
    cy.get('a#opentab').click()
    cy.origin('https://www.qaclickacademy.com/',function(){
      cy.contains('Access all our Courses').click()
    })
  })

  it('Cyklus each',function(){
    cy.get('table[name="courses"] tr td:last-child').each(function(riadok){
      cy.log(riadok.text())
    })

  })
})
