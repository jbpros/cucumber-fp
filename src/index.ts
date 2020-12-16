import * as cucumber from '@cucumber/cucumber'

export type Context = { a: number; s?: string }

type StepArgs = any[]

const initialCtx = { a: 0 }

export class FPWorld {
  public ctx: Context = initialCtx
  public static fns: StepDef[] = []
  get fns() {
    return FPWorld.fns
  }
}

type StepDef = (ctx: Context, ...args: StepArgs) => Context

cucumber.setWorldConstructor(FPWorld)

export const defineStep = (pattern: string | RegExp, fn: StepDef): void => {
  const params = new Array(fn.length > 1 ? fn.length - 1 : 0).fill('').map((_, i) => `p${i}`)
  FPWorld.fns.push(fn)
  const sfn = new Function(
    ...[...params, `this.ctx = this.fns[${FPWorld.fns.length - 1}](this.ctx, ${params.join(', ')})`]
  )
  cucumber.defineStep(pattern, sfn)
}
export const Given = defineStep
export const When = defineStep
export const Then = defineStep
