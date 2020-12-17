import * as cucumber from '@cucumber/cucumber'
import { withContext } from '../src/index'

export interface MyContext {
  a: number
  s?: string
  n?: number
}

const initialCtx: MyContext = { a: 0 }

const {
  Given,
  When,
  withCallbacks: { Given: GivenCb },
} = withContext(initialCtx)

Given('a step', (ctx) => ({ ...ctx, a: ctx.a + 1 }))

Given('a step with a {string}', (ctx, s: string) => ({ ...ctx, s }))

Given('a step with {int} {string}', (ctx, n: number, s: string) => ({
  ...ctx,
  s,
  n,
  r: 0, // TODO: can we prevent extra members?
}))

Given('an async step', async (ctx) => ctx)

GivenCb('a callback', (ctx, cb) => cb(null, { ...ctx, s: 'called back' }))

GivenCb('a failing callback', (_, cb) => cb(new Error('I fail')))

When('failure', () => {
  throw new Error('I fail')
})

cucumber.After(function (this: { ctx: MyContext }) {
  console.log(
    '\nContext after scenario run:\n',
    JSON.stringify(this.ctx, null, 2)
  )
})
