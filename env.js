// Default configuration
const def = {
  CHROME_V: 74,
  SAFARI_V: 12,
  FIREFOX_V: 68
}

// Development configuration
const development = {
  VAPID_PUBLIC_KEY: 'BJo1ZeE62MZqVkZN8g9TOSFXOCtxmpmejfId8JpLT5C52ASUqhabfpVpHqQrySWhD0PCgEWohR1vKpbRJ48boWA',
  WS_ENDPOINT: 'wss://192.168.0.2:8080/api/graphql'
}

// Production configuration
const production = {
  VAPID_PUBLIC_KEY: 'BCmYhh00E-9sqJ3YG2F6FEAaHJ2DcXHd7wbIV-XfMP49oQnIKu282eY9m9oy51I1-Ofgfm1dc4iGyWNF2Lvc3j0',
  WS_ENDPOINT: 'wss://hlfapp.sytes.net/api/graphql'
}

module.exports = function (ctx) {
  const conf = Object.assign({}, def, ctx.dev ? development : production) // merge with default configuration
  for (let [key, value] of Object.entries(conf)) {
    conf[key] = JSON.stringify(value)
  }
  return conf
}
