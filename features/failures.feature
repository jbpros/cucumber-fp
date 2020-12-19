Feature: Failures
  Scenario: A failing synchronous step
    Given a scenario with the following steps:
      """
      Given a failure
      """
    And the following step definitions:
      """
      const { Given } = withContext({ a: 0 })
      Given('a failure', () => { throw new Error('I fail') })
      """
    When fp-Cucumber is run
    Then the step should fail
    And the context should equal:
      """
      { "a": 0 }
      """

  Scenario: A failing asynchronous step
    Given a scenario with the following steps:
      """
      Given an asynchronous failure
      """
    And the following step definitions:
      """
      const { Given } = withContext({ r: 9 })
      Given('an asynchronous failure', async () => { throw new Error('I fail') })
      """
    When fp-Cucumber is run
    Then the step should fail
    And the context should equal:
      """
      { "r": 9 }
      """

  Scenario: A failing callback-based step
    Given a scenario with the following steps:
      """
      Given a failure in a callback step
      """
    And the following step definitions:
      """
      const { withCallbacks: { Given } } = withContext({ a: 0 })
      Given('a failure in a callback step', (_, cb) => cb(new Error('I fail')))
      """
    When fp-Cucumber is run
    Then the step should fail
    And the context should equal:
      """
      { "a": 0 }
      """

