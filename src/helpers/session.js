
/* IMPORTANT: Bind "this" to the Vue instance from the caller function */

/**
 * Clear app state
 */
async function clearState () {
  await this.$apollo.getClient().clearStore() // clear Apollo store
  await this.$store.dispatch('GomState/clearAll') // clear Vuex store
  this.$user.clear() // clear user info
  this.$ability.update([]) // clear CASL ability
}

/**
 * Log out
 */
async function logout () {
  this.$q.loading.show()
  try {
    await clearState.call(this)
    await this.$axios.get('auth/logout') // Clear all cookies and finish session
    this.$router.replace({ name: 'login' }) // Go to login page
  } catch (err) {
    notifyOnError.call(this)
  } finally {
    this.$q.loading.hide()
  }
}

/**
 * Generic function to notify an error
 */
function notifyOnError () {
  this.$q.loading.hide() // hide any loading window
  this.$q.notify({
    color: 'negative',
    message: this.$t('notifications.error.generic'),
    icon: 'report_problem'
  })
}

export const Session = {
  logout,
  notifyOnError,
  clearState
}
