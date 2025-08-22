Feature: User Info UI and API Validation
@apiui
  Scenario: Validate mocked API response and UI rendering
    Given the API is mocked to return user data
    When I fetch the user data from the API
    Then the API response should contain:
      | name     | John Doe      |
      | email    | john@example.com |
      | username | johndoe       |
      | phone    | 1234567890    |
    When I open the user info UI page
    Then the UI should display:
      | name     | John Doe      |
      | email    | john@example.com |
      | username | johndoe       |
      | phone    | ******7890    |
