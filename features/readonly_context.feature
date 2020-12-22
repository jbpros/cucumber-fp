Feature: Read-only context

  Scenario: Prevent context mutation in synchronous step
    Given a scenario with the following steps:
      """
      Given a step
      """
    And the following step definitions:
      """
      const { Given } = withContext({ a: 0 })
      Given('a step', (ctx) => {
        ctx.a = 2
        return ctx
      })
      """
    When fp-Cucumber is run
    Then compilation should fail with "Cannot assign to 'a' because it is a read-only property"

  Scenario: Prevent context mutation in callback step
    Given a scenario with the following steps:
      """
      Given a step
      """
    And the following step definitions:
      """
      const { withCallbacks: { Given } } = withContext({ a: 0 })
      Given('a step', (ctx, cb) => {
        ctx.a = 2
        cb(undefined, ctx)
      })
      """
    When fp-Cucumber is run
    Then compilation should fail with "Cannot assign to 'a' because it is a read-only property"

  Scenario: Prevent deep context mutations
    Given a scenario with the following steps:
      """
      Given a step
      """
    And the following step definitions:
      """
      const initialCtx: { a: string[] } = { a: ['x'] }
      const { Given } = withContext(initialCtx)
      Given('a step', (ctx) => {
        ctx.a.push('y')
        return ctx
      })
      """
    When fp-Cucumber is run
    Then compilation should fail with "Property 'push' does not exist on type 'readonly string[]'"