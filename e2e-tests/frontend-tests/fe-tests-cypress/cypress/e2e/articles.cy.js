import {faker} from '@faker-js/faker';

describe('Article', () => {
  it('About Me', () => {
    Cypress.on('uncaught:exception', () => { return false })
    cy.visit('http://localhost:3000')
    cy.contains('Home')
    cy.get('nav li a').contains('Articles').click()
    cy.get("div#page-body h1").should('exist')
    cy.get("div#page-body a[data-testid='learn-swedish']").should('exist').click()
    cy.get("div#page-body h1").should('exist').contains('Learn swedish')
    cy.get("div.upvotes-section button").should('exist').contains('Upvote');
    cy.get("div#page-body div.upvotes-section p").invoke('text').should('match',/^This article has /)
    cy.get("div#add-comment-form").should('exist')
    cy.get("div#add-comment-form").within(() => {
      cy.get("input[data-testid='name']").should('exist')
      cy.get("textarea[data-testid='commentText']").should('exist')

    })
  }),
  it('Should allow us to fill a form', () => {
    cy.on('uncaught:exception', () => { return false })
    cy.visit('http://localhost:3000/articles')
    cy.get("div#page-body a[data-testid='learn-swedish']").should('exist').click()
    var name = faker.person.fullName()
    var text = faker.lorem.paragraph();

    cy.get("div#add-comment-form").should('exist')
    cy.get("div[data-testid='previous-comments']").should('exist')

    cy.get("div[data-testid='previous-comments']").find("div.comment h4[data-testid='poster']").should('exist')
    cy.get("div[data-testid='previous-comments']").find("div.comment p[data-testid='post-text']").should('exist')

    cy.get("div[data-testid='previous-comments']").contains("div.comment h4[data-testid='poster']",name).should('not.exist')
    cy.get("div[data-testid='previous-comments']").contains("div.comment p[data-testid='post-text']", text).should('not.exist')


    cy.get("div#add-comment-form").within(() => {
      cy.get("input[data-testid='name']").should('exist').type(name)
      cy.get("textarea[data-testid='commentText']").should('exist').type(text)
      cy.get("button[type='submit']").should('exist').click()
    })
    
    cy.get("div[data-testid='previous-comments']").contains("div.comment h4[data-testid='poster']",name).should('exist')
    cy.get("div[data-testid='previous-comments']").contains("div.comment p[data-testid='post-text']", text).should('exist')

  })
})