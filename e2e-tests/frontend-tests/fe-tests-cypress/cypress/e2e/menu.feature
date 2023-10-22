Feature: Menus

    Scenario: I should successfully reach the home page
        Given I am in the start page
        Then we should have the expected home page information

    Scenario: I should be able to reach the About page
        Given I am in the start page
        When I go to the about page
        Then we should have the about information

    Scenario: I should eb able to reach the articles page
        Given I am in the start page
        When I go to the articles page
        Then I should have some articles