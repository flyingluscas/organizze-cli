const nixt = require('nixt')
const { version, bin } = require('../../../package')

let organizze
const base = nixt().base(bin + ' ')

describe('$ organizze --version', () => {
  beforeEach(() => {
    organizze = base.clone()
  })

  it('show the current CLI version', (done) => {
    organizze
      .run('--version')
      .stdout(version)
      .end(done)
  })
})
