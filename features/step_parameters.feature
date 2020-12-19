Feature: Step parameters
  Scenario: Steps with parameters
    Given a scenario with the following steps:
      """
      Given a step with a "string that contains stuff"
      When a step with 4 "strings of characters"
      """
    And the following step definitions:
      """
      const { Given } = withContext({ a: 0 })
      Given('a step with a {string}', (ctx, s: string) => ({ ...ctx, s }))
      Given('a step with {int} {string}', (ctx, n: number, s: string) => ({ ...ctx, s, n, r: 0 }))
      """
    When fp-Cucumber is run
    Then all 2 steps should pass
    And the context should equal:
      """
      {
        "a": 0,
        "s": "strings of characters",
        "n": 4,
        "r": 0
      }
      """