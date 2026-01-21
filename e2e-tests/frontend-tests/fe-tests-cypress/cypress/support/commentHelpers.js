/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

/**
 * Helper functions for comment-related Cypress operations
 */

/**
 * Verifies that page body header exists
 */
export function verifyPageBodyHeaderExists() {
  cy.get("div#page-body h1").should("exist");
}

/**
 * Verifies that the article title contains specific text
 * @param {string} text - The text that should be contained in the h1 element
 */
export function verifyArticleTitle(text) {
  cy.get("div#page-body h1").should("exist").contains(text);
}

/**
 * Verifies that comment poster elements exist
 */
export function verifyCommentPostersExist() {
  cy.get("div[data-testid='previous-comments']")
    .find("div.comment h4[data-testid='poster']")
    .should("exist");
}

/**
 * Verifies that comment text elements exist
 */
export function verifyCommentTextsExist() {
  cy.get("div[data-testid='previous-comments']")
    .find("div.comment p[data-testid='post-text']")
    .should("exist");
}

/**
 * Verifies that a specific comment poster does not exist
 * @param {string} name - The poster name to check
 */
export function verifyCommentPosterNotExists(name) {
  cy.get("div[data-testid='previous-comments']")
    .contains("div.comment h4[data-testid='poster']", name)
    .should("not.exist");
}

/**
 * Verifies that a specific comment text does not exist
 * @param {string} text - The comment text to check
 */
export function verifyCommentTextNotExists(text) {
  cy.get("div[data-testid='previous-comments']")
    .contains("div.comment p[data-testid='post-text']", text)
    .should("not.exist");
}

/**
 * Verifies that a specific comment poster exists
 * @param {string} name - The poster name to check
 */
export function verifyCommentPosterExists(name) {
  cy.get("div[data-testid='previous-comments']")
    .contains("div.comment h4[data-testid='poster']", name)
    .should("exist");
}

/**
 * Verifies that a specific comment text exists
 * @param {string} text - The comment text to check
 */
export function verifyCommentTextExists(text) {
  cy.get("div[data-testid='previous-comments']")
    .contains("div.comment p[data-testid='post-text']", text)
    .should("exist");
}
