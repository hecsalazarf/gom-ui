<template>
  <q-toolbar class="bg-white">
    <q-icon
      name="img:statics/icons/icon-192x192.png"
      size="2.6em"
    />
    <q-toolbar-title class="text-blue-grey-9">
      {{ this.$t('app.label') }}
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
              {{ this.$t('app.sign_out') }}
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
        title: this.$t('app.sign_out'),
        message: this.$t('app.continue_question'),
        position: 'bottom',
        persistent: true,
        cancel: {
          label: this.$t('app.no'),
          color: 'primary',
          flat: true
        },
        ok: {
          label: this.$t('app.yes'),
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
