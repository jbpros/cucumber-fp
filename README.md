# Cucumber.js FP step definitions

This little library brings functional programming style step definitions to Cucumber.js.

## Install

    npm install --save-dev cucumber-fp

## Usage

Instead of using the regular step definition functions from Cucumber, call `withContext` to initialise a context and get FP-aware functions:

    import { withContext } from 'cucumber-fp'

    const { Given, When, Then } = withContext({ a: 0 })

    Given('a step', (ctx) => ({ ...ctx, a: 1 }))

    When('another step', (ctx) => ({ ...ctx, b: 2 }))

    Then('a third step', (ctx) => ({ ...ctx, c: 3 }))

A context (`ctx`) is expected to be returned from every step and is passed to the next as the first parameter, followed by the regular step parameters inferred from the Cucumber expression or regular expression.

A callback API is also available:

    const { withCallbacks: { Given, When, Then, defineStep } } = withContext({ a: 0 })

    Given('some step', (ctx, cb) => cb(null, { ...ctx, d: 9 }))