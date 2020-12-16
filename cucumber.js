const commonFlags = [
  '--require-module ts-node/register',
  `--require '${__dirname}/features/*.ts'`,
  `--publish-quiet`,
].join(' ')

module.exports = {
  default: `${commonFlags} --tags "not @wip"`,
  wip: `${commonFlags} --tags @wip`,
}
