module.exports = function (ctx) {
  const defaultConfig = require('./default')
  const modeConfig = ctx.dev ? require('./development') : require('./production')
  const conf = Object.assign({}, defaultConfig, modeConfig) // merge with default configuration
  for (const [key, value] of Object.entries(conf)) {
    conf[key] = JSON.stringify(value)
  }
  return conf
}
