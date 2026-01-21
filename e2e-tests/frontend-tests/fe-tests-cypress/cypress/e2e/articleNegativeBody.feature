Feature: Articles Negative Body

    Scenario: Articles should fail here because of the final step
        Given I am in the start page
        When I go to the articles page
        When I select the article "learn-german"
        Then The article with the title "How to learn german slowly" should have the expected elements
