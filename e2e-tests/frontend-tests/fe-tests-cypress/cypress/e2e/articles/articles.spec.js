/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import {faker} from '@faker-js/faker';
const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

When('I select the article {string}', (text) => {
  cy.get("div#page-body h1").should('exist')
  cy.get(`div#page-body a[data-testid="${text}"]`).should('exist').click();
});

Then('The article with the title {string} should have the expected elements', (text) => {
  cy.get("div#page-body h1").should('exist').contains(text)
  cy.get("div.upvotes-section button").should('exist').contains('Upvote');
  cy.get("div#page-body div.upvotes-section p").invoke('text').should('match',/^This article has /)
  cy.get("div#add-comment-form").should('exist')
  cy.get("div#add-comment-form").within(() => {
    cy.get("input[data-testid='name']").should('exist')
    cy.get("textarea[data-testid='commentText']").should('exist')
  })
});

Then('I should be able to add a comment', () => {
  var name = faker.person.fullName();
  var text = faker.lorem.paragraph();

  cy.get("div#add-comment-form").should('exist');
  cy.get("div[data-testid='previous-comments']").should('exist');

  cy.get("div[data-testid='previous-comments']").find("div.comment h4[data-testid='poster']").should('exist');
  cy.get("div[data-testid='previous-comments']").find("div.comment p[data-testid='post-text']").should('exist');

  cy.get("div[data-testid='previous-comments']").contains("div.comment h4[data-testid='poster']",name).should('not.exist');
  cy.get("div[data-testid='previous-comments']").contains("div.comment p[data-testid='post-text']", text).should('not.exist');


  cy.get("div#add-comment-form").within(() => {
    cy.get("input[data-testid='name']").should('exist').type(name);
    cy.get("textarea[data-testid='commentText']").should('exist').type(text);
    cy.get("button[type='submit']").should('exist').click();
  })
  
  cy.get("div[data-testid='previous-comments']").contains("div.comment h4[data-testid='poster']",name).should('exist')
  cy.get("div[data-testid='previous-comments']").contains("div.comment p[data-testid='post-text']", text).should('exist')

});

Given('I have created old comments for the article {string}', (text) => {
  let calls = {
    callContent: {
      addComment: {
        class: 'com.bridgeservice.demo.backend.MyBlogBackEnd',
        method: 'addCommentToArticle',
        args: ['http://localhost:8000/', faker.person.fullName(), faker.lorem.paragraph(), text],
      },
    },
  }
  cy.task('bridgeService', calls).then((result) => {
    expect(result.returnValues).to.not.be.empty
    expect(result.returnValues.addComment).to.equal(true);
  })
}); 
  
Then('I should successfully upvote the article', () => {
  //Add backend check
  cy.get('button[data-testid="upvote-button"]').should('exist').click;
  //Add backend check
});