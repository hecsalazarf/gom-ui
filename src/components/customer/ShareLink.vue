<template>
  <q-card class="no-shadow bg-secondary h-rounded-borders-20">
    <q-card-section>
      <div class="text-subtitle2">
        {{ $t('customer.extuid_code') }}
      </div>
    </q-card-section>
    <q-card-section>
      <q-field
        dense
        outlined
        readonly
      >
        <!-- Hidden element that contains the full shareable url -->
        <!-- ONLY FOR COMPATIBILITY PURPOSES -->
        <div
          id="customer-shareable-code"
          style="position: absolute; opacity: 0"
        >
          {{ generateUri() }}
        </div>
        <template v-slot:control>
          <div
            class="text-body1"
          >
            {{ value }}
            <q-tooltip v-model="showHelp">
              {{ $t('customer.share_link_help') }}
            </q-tooltip>
          </div>
        </template>
        <template v-slot:after>
          <q-btn
            icon="help"
            color="blue"
            flat
            dense
            round
            :aria-label="$t('customer.share_link_help')"
            @click="showHelp = !showHelp"
          />
          <q-btn
            icon="share"
            round
            dense
            flat
            color="accent"
            :aria-label="$t('app.share')"
            @click="show()"
          >
            <q-tooltip>
              {{ $t('app.share') }}
            </q-tooltip>
          </q-btn>
        </template>
      </q-field>
    </q-card-section>
  </q-card>
</template>

<script>
import { openURL } from 'quasar'
import { copyToClipboard } from 'src/helpers/agent'
import { RouteNames } from 'src/constants/app'

export default {
  name: 'HShareLink',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showHelp: false
    }
  },
  methods: {
    copyToClipboard,
    show () {
      this.$q.bottomSheet({
        message: this.$t('app.share'),
        grid: true,
        actions: [
          {
            label: 'WhatsApp',
            icon: 'fab fa-whatsapp-square',
            classes: 'text-green-13',
            id: 'wa'
          },
          {
            label: this.$t('app.copy_link'),
            icon: 'file_copy',
            classes: 'text-light-blue-13',
            id: 'copy'
          }
        ]
      }).onOk(action => {
        switch (action.id) { // choose action
          case 'copy':
            this.copyLink()
            break
          case 'wa':
            openURL('whatsapp://send?text=' + this.generateUri()) // send only prefilled message
            break
        }
      })
    },
    copyLink () {
      // The Clipboard API is a recent addition to the specification, and may not be fully implemented
      // to the specification in all browsers. It is commented out for reference
      /* if (!navigator || !navigator.clipboard) {
        return
      }
      navigator.clipboard.writeText(this.generateUri())
        .then(() => {
          this.$q.notify({ // notify that link has been copied to clipboard
            message: this.$t('app.copied_link'),
            position: 'bottom',
            color: 'primary',
            classes: 'text-body2'
          })
        })
        .catch(err => {
          // This can happen if the user denies clipboard permissions:
          console.error(err)
        }) */
      try {
        this.copyToClipboard('customer-shareable-code')
        this.$q.notify({ // notify that link has been copied to clipboard
          message: this.$t('app.copied_to_clipboard'),
          position: 'bottom',
          color: 'primary',
          classes: 'text-body2'
        })
      } catch (e) {
        console.error(e)
      }
    },
    generateUri () {
      let origin
      if (window) { // if on browser
        origin = window.location.origin
      } else { // SSR mode
        // TODO
        origin = undefined
      }
      /* Extract login path and reference query from router */
      const { path, meta: { refQuery } } = this.$router.options.routes.find(el => el.meta ? el.meta.name === RouteNames.LOGIN_ROOT : false)
      if (!path || !refQuery || !origin) {
        /* if some of the variables is undefined, throw an error */
        console.error('Cannot generate shareable link')
        return
      }

      return encodeURI(`${origin}${path}/?${refQuery}=${this.value}`)
    }
  }
}
</script>

<style>
</style>
