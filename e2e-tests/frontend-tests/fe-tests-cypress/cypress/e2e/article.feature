Feature: Articles

    Scenario: Articles should have the necessary features
        Given I am in the start page
        When I go to the articles page
        When I select the article "learn-swedish"
        Then The article with the title "Learn swedish" should have the expected elements

  Scenario: I should be able to upvote an article
        Given I am in the start page
        When I go to the articles page
        When I select the article "learn-swedish"
        Then I should successfully upvote the article


    Scenario: I can post a comment
        Given I am in the start page
        When I go to the articles page
        When I select the article "learn-swedish"
        Then I should be able to add a comment

