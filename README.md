# Cucumber.js FP step definitions

[![build](https://github.com/jbpros/cucumber-fp/workflows/build/badge.svg)](https://github.com/jbpros/cucumber-fp/actions?query=workflow%3Abuild)

This little library brings functional programming style step definitions to Cucumber.js.

## Install

    npm install --save-dev cucumber-fp

Install Cucumber.js if you haven't done so already:

    npm install --save-dev @cucumber/cucumber

## Usage

Instead of using the regular step definition functions from Cucumber, call `withContext` to initialise a context and get FP-aware functions:

```typescript
import { withContext } from 'cucumber-fp'

const { Given, When, Then } = withContext({ a: 0 })

Given('a step', (ctx) => ({ ...ctx, a: 1 }))
When('another step', (ctx) => ({ ...ctx, b: 2 }))
Then('a third step', (ctx) => ({ ...ctx, c: 3 }))
```

A context (`ctx`) is expected to be returned from every step and is passed to the next as the first parameter, followed by the regular step parameters inferred from the Cucumber expression or regular expression. The context is used to store and share state between steps. In other words, it replaces the usual [World](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/world.md) instance used in regular Cucumber steps.

Promises are supported:

```typescript
Given('a step', async (ctx) => {
  await someAsyncFunction(ctx.someState)
  return { ...ctx, a: 1 }
})
```

And old-school callbacks are also supported:

```typescript
const { withCallbacks: { Given, When, Then } } = withContext({ a: 0 })

Given('some step', (ctx, cb) => cb(null, { ...ctx, d: 9 }))
```

### Steps that don't change context

Often, step definitions do not make any changes to the context. That's especially true for `Then` steps that usually only contain assertions. In such cases, you can use the `tap` function to avoid returning the original context:

```typescript
import { withContext } from 'cucumber-fp'

const { Given, tap } = withContext({ a: 0 })

Then('c should exist', tap((ctx) => assert(ctx.c)))
Then('d should equal {int}', tap((ctx, expected) => assert.equal(ctx.d, expected)))
```

_Note_: `tap()` does **not** work with callbacks.