const { join, pipe, props, invoker } = require('ramda')

const generateAccessToken = pipe(
  props(['email', 'password']),
  join(':'),
  Buffer.from,
  invoker(1, 'toString')('base64')
)

module.exports = generateAccessToken
