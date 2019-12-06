<template>
  <q-field
    :dense="dense"
    :readonly="readonly"
    :hide-bottom-space="hideBottomSpace"
    :borderless="borderless"
    :standout="standout"
    :label="label"
    :rules="rules"
    stack-label
  >
    <template v-slot:control>
      <div :class="inputClass">
        {{ value }}
      </div>
    </template>
    <template v-slot:append>
      <q-icon
        name="event"
        class="cursor-pointer"
        color="accent"
      >
        <q-popup-proxy
          ref="popup"
          transition-show="scale"
          transition-hide="scale"
          @hide="beforeHide"
        >
          <q-date
            v-if="panel === 'date'"
            v-model="proxyDate"
            :mask="mask"
          >
            <div class="row justify-end q-gutter-x-md">
              <q-btn
                icon="clear"
                color="red"
                dense
                flat
                round
                :aria-label="$t('app.abort')"
                @click="$refs.popup.hide()"
              />
              <q-btn
                icon="done"
                color="teal"
                dense
                flat
                round
                :aria-label="$t('app.save')"
                @click="pickTime"
              />
            </div>
          </q-date>
          <q-time
            v-if="panel === 'time'"
            v-model="proxyDate"
            :mask="mask"
          >
            <div class="row justify-end q-gutter-x-md">
              <q-btn
                icon="clear"
                color="red"
                dense
                flat
                round
                :aria-label="$t('app.abort')"
                @click="panel = 'date'"
              />
              <q-btn
                icon="done"
                color="teal"
                dense
                flat
                round
                :aria-label="$t('app.save')"
                @click="save"
              />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-field>
</template>

<script>
import { date, debounce } from 'quasar'

export default {
  name: 'DateTimePicker',
  props: {
    dense: Boolean,
    readonly: Boolean,
    hideBottomSpace: Boolean,
    borderless: Boolean,
    value: {
      type: String,
      default: ''
    },
    standout: {
      type: String,
      default: ''
    },
    inputClass: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
    },
    mask: {
      type: String,
      default: 'YYYY/MM/DD HH:mm'
    }
  },
  data () {
    return {
      proxyDate: this.value !== '' ? this.value : date.formatDate(Date.now(), this.mask),
      panel: 'date'
    }
  },
  methods: {
    beforeHide () {
      this.panel = 'date'
      this.proxyDate = this.value !== '' ? this.value : date.formatDate(Date.now(), this.mask)
    },
    pickTime: debounce(function () {
      this.panel = 'time'
    }, 200),
    save: debounce(function () {
      this.$emit('input', this.proxyDate)
      this.$refs.popup.hide()
    }, 200)
  }
}
</script>