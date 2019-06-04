import { QSpinnerBars } from 'quasar'

class SessionHelper {
  logout () {
    this.$q.loading.show({ spinner: QSpinnerBars })
    this.$axios.get('auth/logout').then(res => {
      this.$q.loading.hide()
      this.$router.replace({ name: 'login' })
    })
  }
}

export default SessionHelper
