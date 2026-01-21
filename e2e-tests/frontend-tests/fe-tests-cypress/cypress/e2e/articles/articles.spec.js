/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { faker } from "@faker-js/faker";
import {
  verifyCommentPostersExist as vcPostersExist,
  verifyCommentTextsExist,
  verifyCommentPosterNotExists,
  verifyCommentTextNotExists,
  verifyCommentPosterExists,
  verifyCommentTextExists,
  verifyPageBodyHeaderExists,
  verifyArticleTitle,
} from "../../support/commentHelpers";
const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");

When("I select the article {string}", (articleName) => {
  verifyPageBodyHeaderExists();
  cy.get(`div#page-body a[data-testid="${articleName}"]`)
    .should("exist")
    .click();
  cy.then(() => {
    this.selectedArticle = articleName;
  });
});

Then(
  "The article with the title {string} should have the expected elements",
  (text) => {
    verifyArticleTitle(text);
    cy.get("div.upvotes-section button").should("exist").contains("Upvote");
    cy.get("div#page-body div.upvotes-section p")
      .invoke("text")
      .should("match", /^This article has /);
    cy.get("div#add-comment-form").should("exist");
    cy.get("div#add-comment-form").within(() => {
      cy.get("input[data-testid='name']").should("exist");
      cy.get("textarea[data-testid='commentText']").should("exist");
    });
  }
);

Then("I should be able to add a comment", () => {
  const name = faker.person.fullName();
  const text = faker.lorem.paragraph();

  cy.get("div#add-comment-form").should("exist");
  cy.get("div[data-testid='previous-comments']").should("exist");

  vcPostersExist();
  verifyCommentTextsExist();

  verifyCommentPosterNotExists(name);
  verifyCommentTextNotExists(text);

  cy.get("div#add-comment-form").within(() => {
    cy.get("input[data-testid='name']").should("exist").type(name);
    cy.get("textarea[data-testid='commentText']").should("exist").type(text);
    cy.get("button[type='submit']").should("exist").click();
  });

  verifyCommentPosterExists(name);
  verifyCommentTextExists(text);
});

Then("I should successfully upvote the article", () => {
  //Add backend check
  cy.get('button[data-testid="upvote-button"]').should("exist").click;
  //Add backend check
});
