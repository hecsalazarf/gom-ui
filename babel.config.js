module.exports = function (api) {
  api.cache(true)

  const presets = [
    '@quasar/babel-preset-app'
  ]

  return {
    presets
  }
}
