/* IMPORTANT: Bind "this" to the Vue instance from the caller function */

/**
 * Function to detect platform compatibility
 */
function isBrowserCompatible () {
  // Desktop or Android
  if (this.$q.platform.is.desktop || this.$q.platform.is.android) {
    // Chrome
    if (this.$q.platform.is.chrome && this.$q.platform.is.versionNumber >= process.env.CHROME_V) {
      return true
    }
    // Firefox
    if (this.$q.platform.is.firefox && this.$q.platform.is.versionNumber >= process.env.FIREFOX_V) {
      return true
    }
  }
  // iOS
  if (this.$q.platform.is.ios) {
    // Safari
    if (this.$q.platform.is.safari && this.$q.platform.is.versionNumber >= process.env.SAFARI_V) {
      return true
    }
    // Chrome
    if (this.$q.platform.is.chrome && this.$q.platform.is.versionNumber >= process.env.CHROME_V) {
      return true
    }
  }
  return false
}

export const Agent = {
  isBrowserCompatible
}
