<template>
  <q-field
    :value="dateTime | emptyDate"
    :dense="dense"
    :readonly="readonly"
    :hide-bottom-space="hideBottomSpace"
    :borderless="borderless"
    :standout="standout"
    :label="label"
    :rules="rules"
    :stack-label="stackLabel"
  >
    <template v-slot:control>
      <div :class="inputClass">
        {{ displayedDate }}
      </div>
    </template>
    <template v-slot:append>
      <q-icon
        name="event"
        class="cursor-pointer"
        :color="iconColor"
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
            :options="dateOptions"
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
            :options="timeOptions"
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
  filters: {
    emptyDate (value) {
      // Quasar date utils transforms '' to a 31/12/1899 date. In order to avoid
      // stacking the field label when the date is empty, we validate it
      return date.isSameDate(value, new Date(1899, 11, 31)) ? '' : value
    }
  },
  props: {
    dense: Boolean,
    readonly: Boolean,
    hideBottomSpace: Boolean,
    borderless: Boolean,
    stackLabel: Boolean,
    raw: Boolean,
    value: {
      type: [String, Date],
      default: ''
    },
    standout: {
      type: String,
      default: undefined
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
    },
    iconColor: {
      type: String,
      default: 'primary'
    },
    timeOptions: {
      type: Function,
      default: undefined
    },
    dateOptions: {
      type: Function,
      default: undefined
    }
  },
  data () {
    return {
      panel: 'date',
      proxyDate: ''
    }
  },
  computed: {
    displayedDate () {
      return this.value === '' ? this.value : date.formatDate(this.dateTime, this.mask)
    },
    dateTime () {
      return this.raw ? this.value : date.extractDate(this.value, this.mask)
    }
  },
  methods: {
    beforeHide () {
      this.panel = 'date'
      this.proxyDate = this.displayedDate
    },
    pickTime: debounce(function () {
      this.panel = 'time'
    }, 200),
    save: debounce(function () {
      this.$emit('input', this.raw ? date.extractDate(this.proxyDate, this.mask) : this.proxyDate)
      this.$refs.popup.hide()
    }, 200)
  }
}
</script>
