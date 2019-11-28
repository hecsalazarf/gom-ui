<template>
  <q-toolbar class="bg-white">
    <q-icon
      name="img:statics/icons/icon-192x192.png"
      size="2.6em"
      :aria-label="$t('app.label')"
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
      :aria-label="$t('app.options_menu')"
    >
      <q-menu>
        <q-list>
          <can
            do="role"
            on="customer"
          >
            <q-item
              v-ripple
              clickable
              @click="copyShareId"
            >
              <q-item-section>
                <q-item-label
                  class="text-body2 text-weight-medium"
                >
                  ID: <span id="mtoolbar-share-id"> {{ $user.shareId }} </span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </can>
          <q-item
            v-close-popup
            clickable
            @click="logout"
          >
            <q-item-section class="text-body2">
              {{ $t('app.sign_out') }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-toolbar>
</template>

<script>
import { throttle } from 'quasar'
import { Session } from 'src/helpers'
import { copyToClipboard } from 'src/helpers/agent'
const { logout } = Session

export default {
  name: 'HMainToolbar',
  data () {
    return {}
  },
  methods: {
    copyToClipboard,
    copyShareId: throttle(function (event) {
      try {
        this.copyToClipboard('mtoolbar-share-id')
        this.$q.notify({ // notify that link has been copied to clipboard
          message: this.$t('app.copied_to_clipboard'),
          position: 'bottom',
          color: 'primary',
          classes: 'text-body2'
        })
      } catch (e) {
        console.error(e)
      }
    }, 3500),
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
