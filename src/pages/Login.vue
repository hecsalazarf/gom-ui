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

<style>
</style>
