Feature: Function step definitions
  Scenario: synchronous steps
    Given a step
    And a step
    When a step with a "string that contains stuff"

  Scenario: multiple parameters
    When a step with 4 "strings of characters"

  Scenario: asynchronous steps
    Given an async step

  Scenario: callback step
    Given a callback

  Scenario: failure
    When failure

  Scenario: failing callback step
    Given a failing callback