<template>
  <q-page
    padding
    class="h-login-background"
  >
    <!-- content -->
    <div class="row justify-center items-center h-login">
      <div class="col-xs-10 col-sm-6 col-md-5 col-lg-5 col-lx-5">
        <div
          v-if="isBrowserCompatible()"
          class="column items-center q-gutter-y-md"
        >
          <div class="col-3 q-mb-md">
            <q-icon
              name="img:statics/icons/icon-192x192.png"
              size="9em"
              :alt="$t('app.label')"
            />
          </div>
          <!-- <div class="col-1">
            <h5>{{ $t('app.label') }}</h5>
          </div> -->
          <div class="col-4 full-width">
            <transition
              mode="out-in"
              enter-active-class="animated slideInUp"
              leave-active-class="animated fadeOut"
            >
              <component
                :is="form"
                v-bind="props"
                style="animation-duration: 500ms;"
                @change="change"
              />
            </transition>
          </div>
          <!-- <router-link tag="a" to="/login" style="text-decoration: none">
            <p class="text-center text-white q-mt-lg">&#191;Olvidaste tu contrase&#241;a&#63;</p>
          </router-link> -->
        </div>
        <div
          v-else
          class="col-xs-10 col-sm-6 col-md-5 col-lg-5 col-lx-5"
        >
          <h-incompatible-browser />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Session, Agent } from 'src/helpers'
import { Profile } from 'src/constants/app'
const { unsubscribeToPush, clearState } = Session
const { isBrowserCompatible } = Agent

export default {
  name: 'GomLoginPage',
  components: {
    'h-simple-login': () => import('components/login/SimpleLogin.vue'),
    'h-customer-login': () => import('components/login/CustomerLogin.vue'),
    'h-shareid-input': () => import('components/login/ShareIdInput.vue'),
    'h-incompatible-browser': () => import('components/misc/IncompatibleBrowser.vue')
  },
  data () {
    return {
      loading: false,
      props: {},
      form: ''
    }
  },
  mounted () {
    unsubscribeToPush.call(this) // unsubscribe if there is any subscription
    clearState.call(this) // clear store at log in (Fix #29)
    this.$q.cookies.remove(process.env.CSRF_TOKEN_COOKIE, { path: '/' }) // clear csrf token to login with a new one (#63)
    this.renderComponent() // render the commponent depending on the route query
  },
  methods: {
    isBrowserCompatible,
    renderComponent () {
      this.$idb.profile.get(Profile.SHARE_ID)
        .then(shareID => {
          if (this.$route.query.ref) { // if there is a reference, special login as customer
            this.props = {
              shareId: this.$route.query.ref,
              saveMode: shareID ? 'update' : 'add'
            }
            this.form = 'h-customer-login'
          } else if (shareID) {
            this.props = {
              shareId: shareID
            }
            this.form = 'h-customer-login'
          } else {
            this.props = {}
            this.form = 'h-simple-login' // otherwise, just simple login
          }
        })
        .catch(error => console.error(error))
    },
    change (event) {
      this.props = event.props
      this.form = event.component
    }
  }
}
</script>

<style lang="stylus">

// Center form
@media (min-width: $sizes.xs) and (max-width: $breakpoint-xs)
  .h-login
    min-height: 80vh

@media (min-width: $sizes.sm)
  .h-login
    min-height: 100vh

</style>
