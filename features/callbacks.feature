Feature: Callbacks
  Scenario: Running a callback-based step
    Given a scenario with the following steps:
      """
      Given a callback
      """
    And the following step definitions:
      """
      const { withCallbacks: { Given } } = withContext({ a: 0 })
      Given('a callback', (ctx, cb) => cb(null, { ...ctx, s: 'called back' }))
      """
    When fp-Cucumber is run
    Then the step should pass
    And the context should equal:
      """
      { "a": 0, "s": "called back" }
      """