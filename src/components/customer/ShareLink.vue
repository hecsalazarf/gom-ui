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
        <template v-slot:control>
          <div class="text-body1">
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
            @click="showHelp = !showHelp"
          />
          <q-btn
            icon="share"
            round
            dense
            flat
            color="accent"
            @click="show()"
          />
        </template>
      </q-field>
    </q-card-section>
  </q-card>
</template>

<script>
import { openURL } from 'quasar'
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
    show () {
      this.$q.bottomSheet({
        message: this.$t('app.share'),
        grid: true,
        actions: [
          {
            label: 'Whatsapp',
            icon: 'img:assets/whatsapp-brands.svg',
            id: 'wa'
          },
          {
            label: this.$t('app.copy_link'),
            icon: 'img:assets/paperclip-solid.svg',
            id: 'copy'
          }
        ]
      }).onOk(action => {
        switch (action.id) { // choose action
          case 'copy':
            this.copyLink()
            break
          case 'wa':
            this.shareWA()
            break
        }
      })
    },
    copyLink () {
      navigator.clipboard.writeText(this.value)
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
        })
    },
    shareWA () {
      const uri = encodeURI('https://sony.com')
      // openURL('https://wa.me/?text=' + uri) // send to specific number
      openURL('whatsapp://send?text=' + uri) // send only prefilled message
    }
  }
}
</script>

<style>
</style>
