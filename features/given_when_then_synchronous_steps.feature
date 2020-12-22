Feature: Synchronous steps
  Scenario: Given, When, Then, defineStep
    Given a scenario with the following steps:
      """
      Given a step
      When another step
      Then a third step
      And a fourth step
      """
    And the following step definitions:
      """
      interface MyContext { a: number }
      const initialContext: MyContext = { a: 0 }
      const { Given, When, Then, defineStep } = withContext(initialContext)
      Given('a step', (ctx) => ({ ...ctx, a: 1 }))
      When('another step', (ctx) => ({ ...ctx, b: 2 }))
      Then('a third step', (ctx) => ({ ...ctx, c: 3 }))
      defineStep('a fourth step', (ctx) => ({ ...ctx, d: 4 }))
      """
    When fp-Cucumber is run
    Then all 4 steps should pass
    And the context should equal:
      """
      { "a": 1, "b": 2, "c": 3, "d": 4 }
      """
