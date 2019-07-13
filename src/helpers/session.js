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
    message: 'Ups algo salió mal, inténtalo más tarde :(',
    icon: 'report_problem'
  })
}

export const SessionHelper = {
  logout,
  notifyOnError
}
