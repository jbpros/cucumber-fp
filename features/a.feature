Feature: Function step definitions
  Scenario: synchronous steps
    Given a step
    And a step
    When a step with a "string that contains stuff"

  Scenario: asynchronous steps
    Given an async step

  Scenario: failure
    When failure