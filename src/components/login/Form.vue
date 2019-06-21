<template>
    <q-form class="q-gutter-y-md" @submit="$emit('submit', {username, password})">
      <q-input
        color="primary"
        bg-color="white"
        rounded
        outlined
        clearable
        items-aligned
        type="email"
        v-model="username"
        label="Usuario"
        :disable="loading"
        lazy-rules
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
        :disable="loading"
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
        :disable="loading"
      >
      <template v-slot:loading>
        <q-spinner-bars />
      </template>
      </q-btn>
    </q-form>
</template>

<script>
export default {
  name: 'HLoginForm',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      password: '',
      username: '',
      isPwd: true
    }
  }
}
</script>

<style>
</style>
