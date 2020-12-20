# Cucumber.js FP step definitions

This little library brings functional programming style step definitions to Cucumber.js.

## Install

    npm install --save-dev cucumber-fp

Install Cucumber.js if you haven't done so already:

    npm install --save-dev @cucumber/cucumber

## Usage

Instead of using the regular step definition functions from Cucumber, call `withContext` to initialise a context and get FP-aware functions:

    import { withContext } from 'cucumber-fp'

    const { Given, When, Then } = withContext({ a: 0 })

    Given('a step', (ctx) => ({ ...ctx, a: 1 }))

    When('another step', (ctx) => ({ ...ctx, b: 2 }))

    Then('a third step', (ctx) => ({ ...ctx, c: 3 }))

A context (`ctx`) is expected to be returned from every step and is passed to the next as the first parameter, followed by the regular step parameters inferred from the Cucumber expression or regular expression. The context is used to store and share state between steps. In other words, it replaces the usual [World](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/world.md) instance used in regular Cucumber steps.

Promises are supported:

    Given('a step', async (ctx) => {
      await someAsyncFunction(ctx.someState)
      return { ...ctx, a: 1 }
    })

And old-school callbacks are also supported:

    const { withCallbacks: { Given, When, Then, defineStep } } = withContext({ a: 0 })

    Given('some step', (ctx, cb) => cb(null, { ...ctx, d: 9 }))