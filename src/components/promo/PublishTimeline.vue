<template>
  <q-timeline-entry
    :icon="meta.icon"
  >
    <template v-slot:subtitle>
      <div class="text-capitalize opacity-seventy">
        {{ createdAt }}
      </div>
    </template>
    <div class="text-caption">
      {{ meta.message }}
    </div>
  </q-timeline-entry>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'PromoPublishingTimeline',
  props: {
    value: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data () {
    return {}
  },
  computed: {
    delay () {
      const remaining = (new Date(this.value.createdAt).valueOf() + this.value.delay) - Date.now()
      if (remaining < 3600000) {
        return `${Math.round(remaining / 60000)} minutos`
      } else if (remaining > 3600000 && this.value.delay <= 86400000) {
        return `${Math.round(remaining / 60000 / 60)} horas`
      } else if (remaining > 86400000) {
        return `${Math.round(remaining / 60000 / 60 / 24)} días`
      } else {
        return ''
      }
    },
    createdAt () {
      return date.formatDate(this.value.createdAt, 'DD/MM/YYYY HH:mm:ss')
    },
    meta () {
      switch (this.value.status) {
        case 'DELIVERED':
          return {
            icon: 'check_circle',
            message: 'Ejecutado el'
          }
        case 'WAITING':
          return {
            icon: 'schedule',
            message: `Comienza en ${this.delay}`
          }
        case 'FAILED':
          return {
            icon: 'error',
            message: 'Error en la ejecución'
          }
        default:
          return 'done'
      }
    }
  },
  methods: {
    convertTime (ms) {
      switch (ms) {
        case ms < 60000:
          return Math.round(ms / 1000)
        case ms > 60000 && ms < 1440000:
          return Math.round(ms / 1000 / 24)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
/deep/ .q-timeline__content
  padding-bottom: 1px

.q-timeline__entry--icon /deep/ .q-timeline__dot:before
    height: 20px
    width: 20px

/deep/ .q-timeline__dot:before
  top: 9px
  left: 5px

.q-timeline__entry--icon /deep/ .q-timeline__dot:after
  top: 32px
  left: 14px
  bottom: -6px
</style>
