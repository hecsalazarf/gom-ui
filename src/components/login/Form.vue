<template>
    <q-form class="q-gutter-y-md" @submit="$emit('submit', {user, password})">
      <q-input
        color="primary"
        bg-color="white"
        rounded
        outlined
        clearable
        items-aligned
        type="email"
        v-model="user"
        label="Usuario"
        error-message=""
        :error="errorOnAuth"
        lazy-rules=""
        :rules="[val => !!val || 'Campo requerido']"
      >
        <template v-slot:prepend>
          <q-icon name="account_circle" color="primary"/>
        </template>
      </q-input>
      <q-input
        color="primary"
        bg-color="white"
        rounded
        outlined
        borderless
        items-aligned
        :type="isPwd ? 'password' : 'text'"
        v-model="password"
        label="Contraseña"
        error-message=""
        :error="errorOnAuth"
        lazy-rules
        :rules="[val => !!val || 'Campo requerido']"
      >
        <template v-slot:prepend>
          <q-icon name="fingerprint" color="primary"/>
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
        label="Iniciar sesión"
        type="submit"
        color="primary"
        :loading="loading"
      >
      <template v-slot:loading>
        <q-spinner-bars />
      </template>
      </q-btn>
    </q-form>
</template>

<script>
export default {
  // name: 'ComponentName',
  data () {
    return {
      password: '',
      user: '',
      isPwd: true,
      errorOnAuth: false,
      loading: false
    }
  },
  watch: {
    password (oldVal, newVal) {
      this.errorOnAuth = false
    },
    user (oldVal, newVal) {
      this.errorOnAuth = false
    }
  },
  methods: {
    setOnError () {
      this.errorOnAuth = true
    },
    startLoading () {
      this.loading = true
    },
    stopLoading () {
      this.loading = false
    }
  }
}
</script>

<style>
</style>
