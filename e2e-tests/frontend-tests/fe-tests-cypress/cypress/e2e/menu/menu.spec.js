/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

Given("I am in the start page", () => {
    cy.visit('http://localhost:3000');
});

Then("we should have the expected home page information", () => {
    cy.contains('Hello, welcome to my blog!');
    cy.contains('Home');
});

Then("we should have the about information", () => {
    cy.get("div[id='page-body'] h1").should('exist');
    cy.get("div[id='page-body'] h1").contains('About Me');
});

When("I go to the about page", () => {
    cy.contains('About').click();
});

When("I go to the articles page", () => {
    cy.contains('Articles').click();
});

Then("I should have some articles", () => {
    cy.get("div[id='page-body'] h1").should('exist');
    cy.get("div[id='page-body'] h1").contains('Articles');
})