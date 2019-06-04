import { QSpinnerBars } from 'quasar'

class SessionHelper {
  async logout () {
    this.$q.loading.show({ spinner: QSpinnerBars })
    await this.$apollo.getClient().clearStore()
    await this.$axios.get('auth/logout')
    this.$q.loading.hide()
    this.$router.replace({ name: 'login' })
  }
}

export default SessionHelper
