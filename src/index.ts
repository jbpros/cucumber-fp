import * as cucumber from '@cucumber/cucumber'
import arity = require('util-arity')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StepDef<C> = (ctx: C, ...args: any[]) => C | Promise<C>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ParamsAndCb<C> = [...x: any, cb: Callback<C>]
type StepDefCb<C> = (ctx: C, ...args: ParamsAndCb<C>) => void
type DefineStep<C> = (pattern: string | RegExp, fn: StepDef<C>) => void
type DefineStepCb<C> = (pattern: string | RegExp, fn: StepDefCb<C>) => void
type Callback<C> = (error: Error | undefined, ctx: C) => void

type WithContext<C> = {
  defineStep: DefineStep<C>
  Given: DefineStep<C>
  When: DefineStep<C>
  Then: DefineStep<C>
  withCallbacks: {
    defineStep: DefineStepCb<C>
    Given: DefineStepCb<C>
    When: DefineStepCb<C>
    Then: DefineStepCb<C>
  }
}

export const withContext = <C>(initialCtx: C): WithContext<C> => {
  class FPWorld {
    public ctx = initialCtx
    get fns() {
      return FPWorld.fns
    }
    get fnCbs() {
      return FPWorld.fnCbs
    }
    public static fns: StepDef<C>[] = []
    public static fnCbs: StepDefCb<C>[] = []
  }

  cucumber.setWorldConstructor(FPWorld)

  const defineStep = (pattern: string | RegExp, fn: StepDef<C>): void => {
    const argsCount = Math.max(0, fn.length - 1)
    cucumber.defineStep(
      pattern,
      arity(argsCount, async function (this: FPWorld, ...args: any[]) {
        this.ctx = await fn.call(this, this.ctx, ...args)
      })
    )
  }

  const defineStepCb = (pattern: string | RegExp, fn: StepDefCb<C>): void => {
    if (fn.length < 1)
      throw new Error('Your step definition is missing a callback')

    const argsCount = Math.max(0, fn.length - 1)
    cucumber.defineStep(
      pattern,
      arity(argsCount, function (this: FPWorld, ...args: any[]) {
        const cb = args.pop()
        fn.call(this, this.ctx, ...args, (err: Error, ctx: C) => {
          if (err) return cb(err)
          this.ctx = ctx
          cb()
        })
      })
    )
  }

  return {
    defineStep,
    Given: defineStep,
    When: defineStep,
    Then: defineStep,
    withCallbacks: {
      defineStep: defineStepCb,
      Given: defineStepCb,
      When: defineStepCb,
      Then: defineStepCb,
    },
  }
}
