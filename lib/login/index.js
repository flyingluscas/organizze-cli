const fetch = require('node-fetch')
const { prompt } = require('inquirer')
const Preferences = require('preferences')

const { validateEmail, validatePassword } = require('./validate')
const {
  API_ENDPOINT,
  CLI_PREFERENCES_FILE,
} = require('../config')

function askForCredentials () {
  return prompt([
    {
      type: 'input',
      name: 'email',
      message: 'E-mail:',
      validate: validateEmail,
    },
    {
      type: 'password',
      name: 'password',
      message: 'API Key:',
      validate: validatePassword,
    },
  ])
}

function generateAccessToken ({ email, password }) {
  const credentials = `${email}:${password}`
  return Buffer.alloc(credentials.length, credentials).toString('base64')
}

function storeAccessToken (accessToken) {
  const preferences = new Preferences(CLI_PREFERENCES_FILE, {
    credentials: { accessToken },
  })

  return preferences.credentials.accessToken
}

function fetchUsersFromOrganizze (accessToken) {
  return fetch(`${API_ENDPOINT}/users`, {
    headers: { Authorization: accessToken },
  })
}

function checkForInvalidCredentials (response) {
  if (response.status === 401 || response.status === 500) {
    throw new Error('Invalid credentials, please make sure you have an account at https://organizze.com.br with thoses credentials.')
  }

  return response.json()
}

function greetUser ([{ name }]) {
  console.log(`You've successfully log in, welcome ${name}!`)
}

function logErrors ({ message }) {
  console.log(message)
}

function login () {
  return askForCredentials()
    .then(generateAccessToken)
    .then(storeAccessToken)
    .then(fetchUsersFromOrganizze)
    .then(checkForInvalidCredentials)
    .then(greetUser)
    .catch(logErrors)
}

module.exports = login
