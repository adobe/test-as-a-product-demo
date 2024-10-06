/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { faker } from "@faker-js/faker";
const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");

When("I select the article {string}", (articleName) => {
  cy.get("div#page-body h1").should("exist");
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
    cy.get("div#page-body h1").should("exist").contains(text);
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

  cy.get("div[data-testid='previous-comments']")
    .find("div.comment h4[data-testid='poster']")
    .should("exist");
  cy.get("div[data-testid='previous-comments']")
    .find("div.comment p[data-testid='post-text']")
    .should("exist");

  cy.get("div[data-testid='previous-comments']")
    .contains("div.comment h4[data-testid='poster']", name)
    .should("not.exist");
  cy.get("div[data-testid='previous-comments']")
    .contains("div.comment p[data-testid='post-text']", text)
    .should("not.exist");

  cy.get("div#add-comment-form").within(() => {
    cy.get("input[data-testid='name']").should("exist").type(name);
    cy.get("textarea[data-testid='commentText']").should("exist").type(text);
    cy.get("button[type='submit']").should("exist").click();
  });

  cy.get("div[data-testid='previous-comments']")
    .contains("div.comment h4[data-testid='poster']", name)
    .should("exist");
  cy.get("div[data-testid='previous-comments']")
    .contains("div.comment p[data-testid='post-text']", text)
    .should("exist");

  let call = {
    callContent: {
      article: {
        class: "com.bridgeservice.demo.backend.MyBlogBackEnd",
        method: "fetchLastComment",
        args: ["http://localhost:8000/", this.selectedArticle],
      },
    },
  };

  cy.task("bridgeService", call).then((result) => {
    expect(result.returnValues.article).to.not.be.empty;
    const resultData = result.returnValues.article;

    expect(Object.keys(resultData)).to.include.members(["postedBy", "text"]);

    expect(resultData.postedBy).to.equal(name);
    expect(resultData.text).to.equal(text);
  });
});

Given("there is an article {string} in the system", (text) => {
  let call = {
    callContent: {
      article: {
        class: "com.bridgeservice.demo.backend.MyBlogBackEnd",
        method: "fetchArticle",
        args: ["http://localhost:8000/", text],
      },
    },
  };
  cy.task("bridgeService", call).then((result) => {
    expect(result.returnValues.article).to.not.be.empty;
  });
});

Then("I should successfully upvote the article", () => {
  //Add backend check
  cy.get('button[data-testid="upvote-button"]').should("exist").click;
  //Add backend check
});

Then("the article should have been upvoted", () => {
  //Add backend check
  cy.get('button[data-testid="upvote-button"]').should("exist").click;
  //Add backend check
});
