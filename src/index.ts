import * as cucumber from '@cucumber/cucumber'

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
    const params = new Array(fn.length > 1 ? fn.length - 1 : 0)
      .fill('')
      .map((_, i) => `p${i}`)
    FPWorld.fns.push(fn)
    const sfn = new Function(
      ...[
        ...params,
        `Promise.resolve(this.fns[${
          FPWorld.fns.length - 1
        }](this.ctx, ${params.join(', ')})).then(v => { this.ctx = v })`,
      ]
    )
    cucumber.defineStep(pattern, sfn)
  }

  const defineStepCb = (pattern: string | RegExp, fn: StepDefCb<C>): void => {
    if (fn.length === 0)
      throw new Error('Your step definition is missing a callback')
    const params = new Array(fn.length === 1 ? 0 : fn.length - 2)
      .fill('')
      .map((_, i) => `p${i}`)
    FPWorld.fnCbs.push(fn)
    const body = `const cb = (err, ctx) => { this.ctx = ctx; originalCb(err) }
    this.fnCbs[${FPWorld.fnCbs.length - 1}](this.ctx, ${[...params, 'cb'].join(
      ', '
    )})`
    const sfn = new Function(...[...params, 'originalCb', body])
    cucumber.defineStep(pattern, sfn)
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
