const {
  bin,
  description,
  version,
} = require('../package')

const config = {}

// CLI
config.CLI_BIN = bin
config.CLI_DESCRIPTION = description
config.CLI_PREFERENCES_FILE = 'organizze-cli'
config.CLI_VERSION = version

// API
config.API_ENDPOINT = 'https://api.organizze.com.br/rest/v2'

module.exports = config

