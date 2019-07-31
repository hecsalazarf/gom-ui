export const LoginMixin = {
  methods: {
    async login (credentials) {
      this.loading = true
      try {
        if (!this.$q.cookies.has('csrf-token')) {
          await this.$axios.get('auth/ping')
        }
        await this.$axios.post('auth/login', credentials, { headers: { 'X-Csrf-Token': this.$q.cookies.get('csrf-token') } })
        this.$ability.update(this.$user.createAbility().rules) // update CASL ability
        this.loading = false
        this.$router.replace({ name: 'home' })
      } catch (e) {
        this.loading = false
        if (e.response.data.error === 'invalid_grant') {
          this.$q.notify({ color: 'negative', message: this.$t('notifications.error.wrong_credentials'), icon: 'report_problem' })
        } else {
          this.$q.notify({ color: 'negative', message: this.$t('notifications.error.signin_failed'), icon: 'report_problem' })
          console.error(e.response.data)
        }
      }
    }
  }
}
