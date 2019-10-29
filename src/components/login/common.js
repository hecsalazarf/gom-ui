import { Session } from 'src/helpers'
const { requestNotificationPermission } = Session

export const LoginMixin = {
  methods: {
    async login (credentials) {
      this.loading = true
      try {
        if (!this.$q.cookies.has(process.env.CSRF_TOKEN_COOKIE)) {
          // if there is no csrf-token, request it; otherwise any post
          // method will return a Forbidden error
          await this.$axios.get('auth/ping')
        }
        // log in givern user credentials
        await this.$axios.post('auth/login', credentials, { headers: { 'X-Csrf-Token': this.$q.cookies.get(process.env.CSRF_TOKEN_COOKIE) } })
        // update CASL ability
        this.$ability.update(this.$user.createAbility().rules)
        // set user ID with gtag.js
        this.$ga.config({ user_id: this.$user.id })
        this.$ga.event('login', { method: 'Auth0' })
        // request notification permission after 4 seconds of being logged id
        setTimeout(() => requestNotificationPermission.call(this), 4000) // TODO implement a better approach
        this.loading = false
        this.$router.replace({ name: 'home' }) // once logged in, go to home
      } catch (error) {
        this.loading = false
        if (error.response && error.response.data.error === 'invalid_grant') {
          // notify wrong crendentials
          this.$q.notify({ color: 'negative', message: this.$t('notifications.error.wrong_credentials'), icon: 'report_problem' })
        } else if (error.response && error.response.status === 429) {
          // Too many requests handler
          let retryAfter = error.response.headers['retry-after'] // get retry-after header
          retryAfter = retryAfter ? Math.ceil(parseFloat(retryAfter) / 60) : 0 // transform to seconds
          // display notification
          this.$q.notify({
            color: 'negative',
            message: `${this.$t('notifications.error.too_many_requests')} ${this.$tc('app.minute', retryAfter, { n: retryAfter })}`,
            icon: 'report_problem' })
        } else {
          // any other erriror, display a generic error
          this.$q.notify({ color: 'negative', message: this.$t('notifications.error.signin_failed'), icon: 'report_problem' })
          console.error(error)
        }
      }
    }
  }
}
