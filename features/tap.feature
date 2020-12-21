Feature: tap function
  Sometimes, the context does not need to be modified at all. To avoid the hassle
  of returning the unchanged context, you can use the tap function to automatically
  return the unchanged context.

  Scenario: tap on a simple step
    Given a scenario with the following steps:
      """
      Given a step that does not change the context
      """
    And the following step definitions:
      """
      const { Given, tap } = withContext({ a: 'initial' })
      Given('a step that does not change the context', tap((ctx) => log(ctx.a)))
      """
    When fp-Cucumber is run
    Then the step should pass
    And the context should equal:
      """
      { "a": "initial" }
      """
    And the logs should be:
      """
      initial

      """

  Scenario: tap with step parameters
    Given a scenario with the following steps:
      """
      Given a step that does not change the context with 1 "string of characters"
      """
    And the following step definitions:
      """
      const { Given, tap } = withContext({ a: 'initial' })
      Given(
        'a step that does not change the context with {int} {string}',
        tap((ctx, number, string) => log(`${number}-${string}`))
      )
      """
    When fp-Cucumber is run
    Then the step should pass
    And the context should equal:
      """
      { "a": "initial" }
      """
    And the logs should be:
      """
      1-string of characters

      """

  Scenario: tap with promises
    Given a scenario with the following steps:
      """
      Given a promised step that does not change the context with 1 "string of characters"
      Given a synchronous step that logs
      """
    And the following step definitions:
      """
      const { Given, tap } = withContext({ a: 'initial' })
      Given(
        'a promised step that does not change the context with {int} {string}',
        tap((ctx, number, string) => new Promise<void>(resolve =>
          setTimeout(() => {
            log(`first step: ${number}-${string}`)
            resolve()
          }, 10)
        ))
      )
      Given(
        'a synchronous step that logs',
        tap(() => log('second step'))
      )
      """
    When fp-Cucumber is run
    Then all 2 steps should pass
    And the context should equal:
      """
      { "a": "initial" }
      """
    And the logs should be:
      """
      first step: 1-string of characters
      second step

      """
