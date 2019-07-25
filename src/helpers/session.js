/*
* IMPORTANT: Bind "this" to the Vue instance from the caller function
*/

async function logout () {
  this.$q.loading.show()
  await this.$apollo.getClient().clearStore() // clear Apollo state
  this.$user.clear() // clear user info
  this.$ability.update([]) // clear CASL ability
  await this.$axios.get('auth/logout') // Clear all cookies and finish session
  this.$q.loading.hide()
  this.$router.replace({ name: 'login' }) // Go to login page
}

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
  notifyOnError
}
