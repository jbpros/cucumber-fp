import * as cucumber from '@cucumber/cucumber'
import { Context, FPWorld, Given, When } from '../src/index'

Given('A', (ctx: Context) => ({ ...ctx, a: ctx.a + 1 }))
Given('a step with a {string}', (ctx: Context, s: string) => ({ ...ctx, s }))

When('failure', () => {
  throw new Error('I fail')
})

cucumber.After(function (this: FPWorld) {
  console.log('\nContext after scenario run:\n', JSON.stringify(this.ctx, null, 2))
})
