@ui
Feature: SauceDemo Login
@ui
  Scenario: Successful login with valid credentials
    Given the user navigates to the SauceDemo login page
    When the user logs in with username "standard_user" and password "secret_sauce"
    Then the user should see the Products page