// Default configuration
const def = {
  CHROME_V: 74,
  SAFARI_V: 12,
  FIREFOX_V: 68
}

// Development configuration
const development = {
  VAPID_KEY: 'BJo1ZeE62MZqVkZN8g9TOSFXOCtxmpmejfId8JpLT5C52ASUqhabfpVpHqQrySWhD0PCgEWohR1vKpbRJ48boWA',
  WS_ENDPOINT: 'wss://192.168.0.2:8080/api/graphql'
}

// Production configuration
const production = {
  VAPID_KEY: 'BJo1ZeE62MZqVkZN8g9TOSFXOCtxmpmejfId8JpLT5C52ASUqhabfpVpHqQrySWhD0PCgEWohR1vKpbRJ48boWA'
}

module.exports = function (ctx) {
  const conf = ctx.dev ? development : production
  Object.assign(conf, def) // merge with default configuration
  for (let [key, value] of Object.entries(conf)) {
    conf[key] = JSON.stringify(value)
  }
  return conf
}
