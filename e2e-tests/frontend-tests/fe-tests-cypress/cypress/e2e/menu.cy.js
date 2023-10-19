/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
describe('Menuss', () => {
  it('About Me', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Hello, welcome to my blog!')
    cy.contains('Home')
    cy.contains('About').click()
    cy.get("div[id='page-body'] h1").should('exist')
    cy.get("div[id='page-body'] h1").contains('About Me')
  }),
  it('Articles', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Hello, welcome to my blog!')
    cy.contains('Home')
    cy.contains('Articles').click()
    cy.get("div[id='page-body'] h1").should('exist')
    cy.get("div[id='page-body'] h1").contains('Articles')
  })
})