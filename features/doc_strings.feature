Feature: DocStrings
  Scenario: A DocString step
    Given a scenario with the following steps:
      """
      Given a DocString:
        \"\"\"
        This spans
        multiple lines
        \"\"\"
      """
     And the following step definitions:
      """
      const { Given, When, Then, defineStep } = withContext({ a: 0 })
      Given('a DocString:', (ctx, docString) => ({ ...ctx, docString }))
      """
    When fp-Cucumber is run
    Then the step should pass
    And the context should equal:
      """
      { "a": 0, "docString": "This spans\nmultiple lines" }
      """