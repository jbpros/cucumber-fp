import * as cucumber from '@cucumber/cucumber'
import { withContext } from '../src/index'

export type MyContext = { a: number; s?: string }

const initialCtx: MyContext = { a: 0 }

const { Given, When } = withContext(initialCtx)

Given('A', (ctx) => ({ ...ctx, a: ctx.a + 1 }))
Given('a step with a {string}', (ctx, s: string) => ({ ...ctx, s }))

When('failure', () => {
  throw new Error('I fail')
})

cucumber.After(function (this: { ctx: MyContext }) {
  console.log('\nContext after scenario run:\n', JSON.stringify(this.ctx, null, 2))
})
