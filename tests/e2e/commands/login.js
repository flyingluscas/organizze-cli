const nixt = require('nixt')
const path = require('path')
const rimraf = require('rimraf')
const Preferences = require('preferences')
const { assert } = require('chai')

const {
  CLI_BIN,
  CLI_PREFERENCES_FILE,
} = require('../../../lib/config')

let organizze
const email = 'organizze-cli@mailinator.com'
const apiKey = 'e885145670bb089e162576b9ed80193dd0245556'
const tempDirectory = path.dirname(__dirname) + '/.temp'

describe('$ organizze login', () => {
  beforeEach(() => {
    process.env.HOME = tempDirectory

    organizze = nixt({ colors: false, newlines: false })
      .base(CLI_BIN + ' ')
      .env('HOME', tempDirectory)
      .run('login')
  })

  afterEach((done) => {
    rimraf(tempDirectory, { disableGlob: false }, (error) => {
      if (error) {
        throw error
      }

      done()
    })
  })

  describe('without e-mail', () => {
    it('should respond with error message', (done) => {
      organizze
        .expect(({ stdout }) =>
          assert.include(
            stdout,
            '? E-mail: >> This field is required'
          )
        )
        .on('? E-mail: ').respond('\n')
        .end(done)
    })
  })

  describe('without API key', () => {
    it('should respond with error message', (done) => {
      organizze
        .expect(({ stdout }) =>
          assert.include(
            stdout,
            '? API Key: [input is hidden] >> This field is required, you can find it at https://app.organizze.com.br/configuracoes/api-keys'
          )
        )
        .on('? E-mail: ').respond(`${email}\n`)
        .on('? API Key: [input is hidden] ').respond('\n')
        .end(done)
    })
  })

  describe('with invalid e-mail or API key', () => {
    it('should respond with error message', (done) => {
      organizze
        .expect(({ stdout }) =>
          assert.include(
            stdout,
            'Invalid credentials, please make sure you have an account at https://organizze.com.br with thoses credentials.'
          )
        )
        .on('? E-mail: ').respond(`${email}\n`)
        .on('? API Key: [input is hidden] ').respond('api_key_123\n')
        .end(done)
    })
  })

  describe('with valid e-mail and API key', () => {
    it('should greet the user with his name', (done) => {
      organizze
        .expect(({ stdout }) =>
          assert.include(
            stdout,
            "You've successfully log in, welcome Organizze CLI!"
          )
        )
        .on('? E-mail: ').respond(`${email}\n`)
        .on('? API Key: [input is hidden] ').respond(`${apiKey}\n`)
        .end(done)
    })

    it('should store the user access token under a preferences file', (done) => {
      organizze
        .expect(({ stdout }) => {
          const credentials = `${email}:${apiKey}`
          const preferences = new Preferences(CLI_PREFERENCES_FILE)
          const accessToken = Buffer.alloc(credentials.length, credentials).toString('base64')
          return assert.nestedPropertyVal(preferences, 'credentials.accessToken', accessToken)
        })
        .on('? E-mail: ').respond(`${email}\n`)
        .on('? API Key: [input is hidden] ').respond(`${apiKey}\n`)
        .end(done)
    })
  })
})
