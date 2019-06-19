<template>
  <q-page padding class="h-login-background">
    <!-- content -->
    <div class="row justify-center items-center h-login">
      <div class="col-xs-10 col-sm-8 col-md-5 col-lg-5 col-lx-5">
        <div class="column items-center">
          <div class="col-3">
            <q-avatar size="100px" color="primary" text-color="white" icon="graphic_eq"></q-avatar>
          </div>
          <div class="col-1">
            <h5>GOM</h5>
          </div>
          <div class="col-4 full-width">
            <h-login-form @submit="onSubmit($event)" ref="login-form"/>
          </div>
          <router-link tag="a" to="/login" style="text-decoration: none">
            <p class="text-center text-white q-mt-lg">&#191;Olvidaste tu contrase&#241;a&#63;</p>
          </router-link>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  components: {
    'h-login-form': () => import('components/login/Form.vue')
  },
  data () {
    return {
      errorOnAuth: false
    }
  },
  methods: {
    async onSubmit (credentials) {
      this.$refs['login-form'].startLoading()
      try {
        if (!this.$q.cookies.has('csrf-token')) {
          await this.$axios.get('auth/ping')
        }
        await this.$axios.post('auth/login', credentials, { headers: { 'X-Csrf-Token': this.$q.cookies.get('csrf-token') } })
        await this.$apollo.getClient().clearStore() // ensure a clear cache
        this.$refs['login-form'].stopLoading()
        this.$router.replace({ name: 'home' })
      } catch (e) {
        this.$refs['login-form'].stopLoading()
        if (e.response.data.code === 'invalid_grant') {
          // this.$refs['login-form'].setOnError()
          this.$q.notify({ color: 'negative', message: 'Usuario o contraseña incorrectos', icon: 'report_problem' })
        } else {
          this.$q.notify({ color: 'negative', message: 'No pudimos iniciar sesión. Inténtalo más tarde', icon: 'report_problem' })
          console.error(e.response.data)
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next()
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
  background: linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB);
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
    min-height: 70vh

@media (min-width: $sizes.sm)
  .h-login
    min-height: 90vh

</style>
