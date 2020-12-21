import {
  defineStep as cucumberDefineStep,
  setWorldConstructor,
} from '@cucumber/cucumber'
import arity = require('util-arity')

// TODO: can we get rid of those any types everywhere?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StepDef<C> = (ctx: C, ...args: any[]) => C | Promise<C>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ParamsAndCb<C> = [...x: any, cb: Callback<C>]
type StepDefCb<C> = (ctx: C, ...args: ParamsAndCb<C>) => void
type DefineStep<C> = (pattern: string | RegExp, fn: StepDef<C>) => void
type DefineStepCb<C> = (pattern: string | RegExp, fn: StepDefCb<C>) => void
type Callback<C> =
  | ((error: Error) => void)
  | ((error: undefined, ctx: C) => void)

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
  tap: Tap<C>
}

type Tap<C> = (
  fn: (ctx: C, ...args: any[]) => unknown
) => (ctx: C, ...args: any[]) => C

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

  setWorldConstructor(FPWorld)

  const tap: Tap<C> = (fn: (ctx: C, ...args: any[]) => any) =>
    arity(fn.length, async (ctx: C, ...args: any[]) => {
      await fn(ctx, ...args)
      return ctx
    })

  const defineStep = (pattern: string | RegExp, fn: StepDef<C>): void => {
    const argsCount = Math.max(0, fn.length - 1)
    cucumberDefineStep(
      pattern,
      arity(argsCount, async function (this: FPWorld, ...args: unknown[]) {
        this.ctx = await fn.call(this, this.ctx, ...args)
      })
    )
  }

  const defineStepCb = (pattern: string | RegExp, fn: StepDefCb<C>): void => {
    if (fn.length < 1)
      throw new Error('Your step definition is missing a callback')

    const argsCount = Math.max(0, fn.length - 1)
    cucumberDefineStep(
      pattern,
      arity(argsCount, function (this: FPWorld, ...args: unknown[]) {
        const cb = args.pop() as (err?: Error) => void
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
    tap,
  }
}
