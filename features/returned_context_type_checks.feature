Feature: Returned context type checks
  TypeScript [is not able to enforce excess property checks](https://thesoftwaresimpleton.com/blog/2019/03/03/return-body-ts)
  on implicit return types in our step definitions. It means the return type of the step definition must be explicitly
  specified to avoid excess properties on context objects.

  Scenario: Explicit return type checks
    Given a scenario with the following steps:
      """
      Given a step
      """
    And the following step definitions:
      """
      interface MyContext { a: number }
      const initialContext: MyContext = { a: 0 }
      const { Given } = withContext(initialContext)
      Given('a step', (ctx): MyContext => {
        return { ...ctx, b: 3 }
      })
      """
    When fp-Cucumber is run
    Then compilation should fail with "Object literal may only specify known properties, and 'b' does not exist in type 'MyContext'."

  Scenario: Implicit return type widening
    Given a scenario with the following steps:
      """
      Given a step
      """
    And the following step definitions:
      """
      interface MyContext { a: number }
      const initialContext: MyContext = { a: 0 }
      const { Given } = withContext(initialContext)
      Given('a step', (ctx) => { // no explicit return type here!
        return { ...ctx, b: 3 }
      })
      """
    When fp-Cucumber is run
    Then the step should pass

  Scenario: Explicit return type checks with promises
    Given a scenario with the following steps:
      """
      Given a step
      """
    And the following step definitions:
      """
      interface MyContext { a: number }
      const initialContext: MyContext = { a: 0 }
      const { Given } = withContext(initialContext)
      Given('a step', async (ctx): Promise<MyContext> => {
        return { ...ctx, b: 3 }
      })
      """
    When fp-Cucumber is run
    Then compilation should fail with "Object literal may only specify known properties, and 'b' does not exist in type 'MyContext'."

