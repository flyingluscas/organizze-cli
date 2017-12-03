const { expect } = require('chai')
const generateAccessToken = require('../../../lib/login/generate-access-token')

describe.only('Generate access token', () => {
  const credentials = {
    email: 'bender@planet.express',
    password: 'biteMyShinyMetalAss!',
  }

  it('should return an base64 encoded string from the credentials', () => {
    expect(generateAccessToken(credentials)).to.equal('YmVuZGVyQHBsYW5ldC5leHByZXNzOmJpdGVNeVNoaW55TWV0YWxBc3Mh')
  })
})

