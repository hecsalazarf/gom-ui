/* IMPORTANT: Bind "this" to the Vue instance from the caller function */

/**
 * Generic function to notify an error
 */
function notifyError () {
  this.$q.notify({
    color: 'negative',
    message: this.$t('notifications.error.generic'),
    icon: 'report_problem'
  })
}

export const Notifications = {
  notifyError
}
