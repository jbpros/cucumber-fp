import * as cucumber from '@cucumber/cucumber'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StepDef<C> = (ctx: C, ...args: any[]) => C | Promise<C>
type DefineStep<C> = (pattern: string | RegExp, fn: StepDef<C>) => void

type WithContext<C> = {
  defineStep: DefineStep<C>
  Given: DefineStep<C>
  When: DefineStep<C>
  Then: DefineStep<C>
}

export const withContext = <C>(initialCtx: C): WithContext<C> => {
  class FPWorld {
    public ctx = initialCtx
    public static fns: StepDef<C>[] = []
    get fns() {
      return FPWorld.fns
    }
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
  return {
    defineStep,
    Given: defineStep,
    When: defineStep,
    Then: defineStep,
  }
}
