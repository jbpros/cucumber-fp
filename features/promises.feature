Feature: Promise-based steps
  Scenario: Running a promise-based step
    Given a scenario with the following steps:
      """
      Given an async step
      """
    And the following step definitions:
      """
      const { Given } = withContext({ a: 0 })
      Given('an async step', async (ctx) => ({ ...ctx, b: 2 }))
      """
    When fp-Cucumber is run
    Then the step should pass
    And the context should equal:
      """
      { "a": 0, "b": 2 }
      """