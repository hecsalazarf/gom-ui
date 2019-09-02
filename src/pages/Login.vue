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
            <q-avatar
              size="100px"
              color="primary"
              text-color="white"
              icon="graphic_eq"
            />
          </div>
          <!-- <div class="col-1">
            <h5>{{ $t('app.label') }}</h5>
          </div> -->
          <div class="col-4 full-width">
            <transition
              mode="out-in"
              enter-active-class="animated fadeIn"
            >
              <component
                :is="form"
                v-bind="props"
                style="animation-duration: 500ms;"
                @error="form = 'h-simple-login'"
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
const { unsubscribeToPush, clearState } = Session
const { isBrowserCompatible } = Agent

export default {
  name: 'GomLoginPage',
  components: {
    'h-simple-login': () => import('components/login/SimpleLogin.vue'),
    'h-customer-login': () => import('components/login/CustomerLogin.vue'),
    'h-incompatible-browser': () => import('components/misc/IncompatibleBrowser.vue')
  },
  data () {
    return {
      loading: false,
      props: {},
      form: ''
    }
  },
  created () {
    unsubscribeToPush.call(this) // unsubscribe if there is any subscription
    clearState.call(this) // clear store at log in (Fix #29)
    this.$q.cookies.remove('csrf-token', { path: '/' }) // clear csrf token to login with a new one (#63)
    this.renderComponent() // render the commponent depending on the route query
  },
  methods: {
    isBrowserCompatible,
    renderComponent () {
      if (this.$route.query.ref) { // if there is a reference, special login as customer
        this.props = {
          reference: this.$route.query.ref
        }
        this.form = 'h-customer-login'
      } else {
        this.props = {}
        this.form = 'h-simple-login' // otherwise, just simple login
      }
    }
  }
}
</script>

<style lang="stylus">
/*
* Gradient-animated background
* Taken from a pen by Manuel Pinto https://codepen.io/P1N2O/pen/pyBNzX
*/
.h-login-background
  width: 100%;
  height: 100%;
  color: #fff;
  background: linear-gradient(135deg, rgba(55,71,79,1) 20%, rgba(29,233,182,1) 40%, rgba(0,229,255,1) 60%, rgba(228,116,22,0.9522226201663228) 80%);
  background-size: 400% 400%;
  -webkit-animation: Gradient 7s ease infinite;
  -moz-animation: Gradient 7s ease infinite;
  animation: Gradient 7s ease infinite;

@keyframes Gradient
  0%
    background-position: 0% 50%
  50%
    background-position: 100% 50%
  100%
    background-position: 0% 50%

  /* Center form  */
@media (min-width: $sizes.xs) and (max-width: $breakpoint-xs)
  .h-login
    min-height: 80vh

@media (min-width: $sizes.sm)
  .h-login
    min-height: 100vh

</style>
