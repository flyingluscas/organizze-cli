function validateEmail (email) {
  if (!email) {
    return 'This field is required'
  }

  return true
}

function validatePassword (password) {
  if (!password) {
    return 'This field is required, you can find it at https://app.organizze.com.br/configuracoes/api-keys'
  }

  return true
}

module.exports = {
  validateEmail,
  validatePassword,
}

