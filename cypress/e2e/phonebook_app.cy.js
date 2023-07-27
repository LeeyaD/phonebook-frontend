describe('Phonebook app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Adam Driver',
      username: 'Drive',
      password: 'gonebaby1'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user) 
    cy.visit('')
  })

  it('front page can be opened', function() {
    cy.contains('Phonebook')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })

  it('user can login', function () {
    cy.contains('login').click()
    cy.get('#username').type('Drive')
    cy.get('#password').type('gonebaby1')
    cy.get('#login-button').click()

    cy.contains('Adam Driver logged in')
  })

  it('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('Drive')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Adam Driver logged in')
  })


  describe('when logged in', function() {
    // We're 'bypassing the UI' & making an HTTP req to the backend to login b/c it's faster than filling out a form each time
    // Cypress also handled storing user info to local storage
    beforeEach(function() {
      cy.contains('login').click()
      cy.login({
        username: 'Drive', 
        password: 'gonebaby1'
      })
    })

    it('a new contact can be created', function() {
      cy.contains('new contact').click()
      cy.get('#name').type('Bently Williams')
      cy.get('#number').type('555-5555')
      cy.contains('add').click()
      cy.contains('Bently Williams')
    })

    describe('and a contact exists', function () {
      beforeEach(function () {
        cy.createContact({
          name: 'Barbie Malibu', 
          number: '123-4567'
        })
      })

      it('it can be edited', function () {
        cy.contains('new contact').click()
        cy.get('#name').type('Barbie Malibu')
        cy.get('#number').type('123-0000')
        cy.contains('add').click()

        
        cy.get('ul').contains('Barbie Malibu')
        cy.get('ul').contains('123-0000')
      })
    })
  })
})