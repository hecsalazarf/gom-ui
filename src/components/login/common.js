import { Session, Notifications } from 'src/helpers'
import { Profile, RouteNames } from 'src/constants/app'
const { requestNotificationPermission } = Session
const { notifyError } = Notifications
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
        // log in given user credentials
        await this.$axios.post('auth/login', credentials, { headers: { 'X-Csrf-Token': this.$q.cookies.get(process.env.CSRF_TOKEN_COOKIE) } })
        // update CASL ability
        this.$ability.update(this.$user.createAbility().rules)
        // set user ID with gtag.js
        this.$ga.config({ user_id: this.$user.id })
        this.$ga.event('login', { method: 'Auth0' })
        // request notification permission after 4 seconds of being logged id
        setTimeout(() => requestNotificationPermission.call(this), 4000) // TODO implement a better approach
        this.loading = false
        this.$router.replace({ name: RouteNames.HOME }) // once logged in, go to home
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
          // any other error, display a generic error
          this.$q.notify({ color: 'negative', message: this.$t('notifications.error.signin_failed'), icon: 'report_problem' })
          console.error(error)
        }
      }
    },
    requestInfo () {
      this.$q.loading.show()
      const promise = this.$axios.get('auth/bp', {
        params: {
          code: this.shareId
        }
      })
      promise.catch(error => {
        if (error.response && error.response.status === 400) {
          this.$q.notify({ // notify invalid reference
            color: 'negative',
            message: this.$t('app.invalid_reference'),
            icon: 'report_problem'
          })
        } else {
          notifyError.call(this) // any other error notify with generic error
        }
        /// this.$emit('change', { component: 'h-simple-login' }) // emit change an render user-password login
      }).finally(() => this.$q.loading.hide())
      return promise
    },
    saveShareId (mode) {
      switch (mode) {
        case 'add':
          return this.$idb.profile.add(this.shareId, Profile.SHARE_ID)
        case 'update':
          return this.$idb.profile.put(this.shareId, Profile.SHARE_ID)
      }
    }
  }
}
