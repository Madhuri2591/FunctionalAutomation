Feature: API Test
@api
  Scenario: Get request to public API
    Given I send a GET request to "https://jsonplaceholder.typicode.com/posts/1"
    Then the response status should be 200
    And the response should contain "userId"
