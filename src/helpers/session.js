/* Bind this to Vue instance from the caller function */
async function logout () {
  this.$q.loading.show()
  await this.$apollo.getClient().clearStore()
  await this.$axios.get('auth/logout')
  this.$q.loading.hide()
  this.$router.replace({ name: 'login' })
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
