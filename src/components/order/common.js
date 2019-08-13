import { OrderStatus } from 'src/constants/order'

export const OrderComponentMixin = {
  data () {
    return {
      statusOptions: new Map([
        [OrderStatus.WON, {
          label: this.$t('order.status.options.WON.label'),
          icon: 'order-won',
          color: 'positive',
          value: OrderStatus.WON
        }],
        [OrderStatus.OPEN, {
          label: this.$t('order.status.options.OPEN.label'),
          icon: 'order-open',
          color: 'cyan-5',
          value: OrderStatus.OPEN
        }],
        [OrderStatus.CLOSED, {
          label: this.$t('order.status.options.CLOSED.label'),
          icon: 'order-closed',
          color: 'negative',
          value: OrderStatus.CLOSED
        }],
        [OrderStatus.IN_PROCESS, {
          label: this.$t('order.status.options.IN_PROCESS.label'),
          icon: 'order-inprocess',
          color: 'amber-5',
          value: OrderStatus.IN_PROCESS
        }]
      ])
    }
  },
  methods: {
    getStatusProps (status) {
      if (this.statusOptions.has(status)) {
        return this.statusOptions.get(status)
      }
      return { label: '', icon: '', color: '', value: '' } // fallback
    }
  }
}
