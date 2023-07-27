// ***********************************************
// This example commands.js shows you how to
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


// makes this repetitive command easier to call in different tests, only 1 place to update it!
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedPhonebookAppUser', JSON.stringify(body))
    cy.visit('')
  })
})

Cypress.Commands.add('createContact', ({ name, number }) => {
  cy.request({
    url: `${Cypress.env('BACKEND')}/persons`,
    method: 'POST',
    body: { name, number },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedPhonebookAppUser')).token}`
    }
  })

  cy.visit('')
})