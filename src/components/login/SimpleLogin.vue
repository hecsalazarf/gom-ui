<template>
  <q-form
    class="q-gutter-y-md q-mt-md"
    @submit="submit()"
  >
    <q-input
      v-model="username"
      color="primary"
      bg-color="white"
      rounded
      outlined
      clearable
      items-aligned
      type="email"
      :label="$t('app.user_name')"
      :disable="loading"
      lazy-rules
      :rules="[val => !!val || $t('app.rules.required')]"
    >
      <template v-slot:prepend>
        <q-icon
          name="account_circle"
          color="primary"
        />
      </template>
    </q-input>
    <q-input
      v-model="password"
      color="primary"
      bg-color="white"
      rounded
      outlined
      borderless
      items-aligned
      :type="isPwd ? 'password' : 'text'"
      :label="$t('app.password')"
      :disable="loading"
      lazy-rules
      :rules="[val => !!val || $t('app.rules.required')]"
    >
      <template v-slot:prepend>
        <q-icon
          name="fingerprint"
          color="primary"
        />
      </template>
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <q-btn
      rounded
      class="full-width q-mt-lg"
      :label="$t('app.sign_in')"
      type="submit"
      color="primary"
      :loading="loading"
      :disable="loading"
    >
      <template v-slot:loading>
        <q-spinner-bars />
      </template>
    </q-btn>
  </q-form>
</template>

<script>
import { LoginMixin } from './common'

export default {
  name: 'HSimpleLogin',
  mixins: [ LoginMixin ],
  data () {
    return {
      loading: false,
      password: '',
      username: '',
      isPwd: true
    }
  },
  methods: {
    submit () {
      this.login({
        grantType: 'password',
        username: this.username,
        password: this.password
      })
    }
  }
}
</script>

<style>
</style>
