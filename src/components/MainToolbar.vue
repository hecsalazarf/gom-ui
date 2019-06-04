<template>
  <q-toolbar>
    <q-icon name="graphic_eq" class="text-white text-h4"/>
    <q-toolbar-title>GOM</q-toolbar-title>
    <q-btn flat round>
      <q-menu>
        <q-list dense>
          <q-item clickable v-close-popup @click="logout()">
            <q-item-section>Salir</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
      <q-avatar color="accent" text-color="white" icon="person"/>
    </q-btn>
  </q-toolbar>
</template>

<script>
import { Session } from 'src/helpers'
export default {
  name: 'HMainToolbar',
  data () {
    return {}
  },
  methods: {
    logout () {
      this.$q.dialog({
        title: 'Cerrar sesión',
        message: '¿Continuar?',
        position: 'bottom',
        persistent: true,
        cancel: {
          label: 'No',
          color: 'primary',
          flat: true
        },
        ok: {
          label: 'Sí',
          color: 'primary',
          flat: true
        },
        stackButtons: false,
        color: 'primary'
      }).onOk(() => {
        Session.logout.call(this)
      })
    }
  }
}
</script>

<style>
</style>
