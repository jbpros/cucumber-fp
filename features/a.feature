Feature: Function step definitions
  Scenario: synchronous steps
    Given A
    And A
    When a step with a "string that contains stuff"

  Scenario: asynchronous steps
    Given a promised step

  Scenario: failure
    When failure