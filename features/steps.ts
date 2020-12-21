import {
  Before,
  Given,
  setWorldConstructor,
  Then,
  When,
} from '@cucumber/cucumber'
import { messages } from '@cucumber/messages'
import { spawnSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { assertThat, equalTo } from 'hamjest'
import * as mkdirp from 'mkdirp'
import { join } from 'path'
import * as rimraf from 'rimraf'

const { FAILED, PASSED } = messages.TestStepFinished.TestStepResult.Status

const tmpDir = join(__dirname, '..', 'tmp', 'features')

const writeFile = (fileName: string, content: string) => {
  mkdirp.sync(tmpDir)
  writeFileSync(join(tmpDir, fileName), content)
}

class FPWorld {
  public stdout = ''
  public stderr = ''
  public status: number | null = null
  public envelopes: messages.Envelope[] = []
}

setWorldConstructor(FPWorld)

Before(() => rimraf.sync(tmpDir))

Given('a scenario with the following steps:', (stepSource: string) =>
  writeFile('some.feature', `Feature:\nScenario:\n${stepSource}`)
)

Given('the following step definitions:', (stepDefinitions: string) =>
  writeFile(
    'steps.ts',
    `import { appendFileSync, writeFileSync } from 'fs'\n\
    import { After } from '@cucumber/cucumber'\n\
    import { withContext } from '../../lib'\n
    const log = (data: string) => appendFileSync('${tmpDir}/logs', \`\${data}\\n\`)\n\n
    ${stepDefinitions}\n\
    After(function (this: any) {\
      writeFileSync('${tmpDir}/context', JSON.stringify(this.ctx, null, 2))\
    })`
  )
)

When('fp-Cucumber is run', function (this: FPWorld) {
  const result = spawnSync(
    '../../node_modules/.bin/cucumber-js',
    [
      '--require-module',
      'ts-node/register',
      '--require',
      `*.ts`,
      '--format',
      'message',
      '--format',
      `progress:out`,
      '--publish-quiet',
      tmpDir,
    ],
    { timeout: 5000, cwd: tmpDir }
  )

  this.stdout = result.output[1].toString()
  this.stderr = result.output[2].toString()
  this.status = result.status
  this.envelopes = this.stdout
    .split('\n')
    .reduce<messages.Envelope[]>((m: messages.Envelope[], line: string) => {
      if (!line.trim()) return m
      const envelope = messages.Envelope.fromObject(JSON.parse(line))
      return [...m, envelope]
    }, [])
})

const stepsShouldPass = (envelopes: messages.Envelope[], stepCount: number) =>
  assertThat(
    getStepStatuses(envelopes),
    equalTo(Array(stepCount + 1).fill(PASSED))
  )

Then('the step should pass', function (this: FPWorld) {
  stepsShouldPass(this.envelopes, 1)
})

Then(
  'all {int} steps should pass',
  function (this: FPWorld, stepCount: number) {
    stepsShouldPass(this.envelopes, stepCount)
  }
)

Then('the step should fail', function (this: FPWorld) {
  assertThat(getStepStatuses(this.envelopes)[0], equalTo(FAILED))
})

Then('the context should equal:', function (context: string) {
  assertThat(
    JSON.parse(readFileSync(join(tmpDir, 'context')).toString()),
    equalTo(JSON.parse(context))
  )
})

Then('the logs should be:', function (logs: string) {
  assertThat(readFileSync(join(tmpDir, 'logs')).toString(), equalTo(logs))
})

const getStepStatuses = (envelopes: messages.Envelope[]) =>
  envelopes.reduce(
    (statuses, envelope) =>
      envelope.testStepFinished
        ? [
            ...statuses,
            envelope.testStepFinished.testStepResult?.status ||
              messages.TestStepFinished.TestStepResult.Status.UNKNOWN,
          ]
        : statuses,
    [] as messages.TestStepFinished.TestStepResult.Status[]
  )
