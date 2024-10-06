Feature: Articles

    Scenario: Articles should have the necessary features
        Given I am in the start page
        When I go to the articles page
        When I select the article "learn-german"
        Then The article with the title "How to learn german quickly" should have the expected elements

    Scenario: I should be able to upvote an article
        Given I am in the start page
        When I go to the articles page
        When I select the article "learn-german"
        Then I should successfully upvote the article

    ## Demo

    Scenario: I can post a comment
        Given I am in the start page
        Given there is an article "learn-german" in the system
        When I go to the articles page
        When I select the article "learn-german"
        Then I should be able to add a comment

