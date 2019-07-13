<template>
  <q-toolbar class="bg-white">
    <q-icon
      name="graphic_eq"
      class="text-blue-grey-9 text-h4"
    />
    <q-toolbar-title class="text-blue-grey-9">
      GOM
    </q-toolbar-title>
    <q-btn
      flat
      round
      dense
      icon="more_vert"
      color="primary"
    >
      <q-menu>
        <q-list>
          <q-item
            v-close-popup
            clickable
            @click="logout()"
          >
            <q-item-section class="text-body2">
              Salir
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-toolbar>
</template>

<script>
import { Session } from 'src/helpers'
const { logout } = Session

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
        logout.call(this)
      })
    }
  }
}
</script>

<style>
</style>
