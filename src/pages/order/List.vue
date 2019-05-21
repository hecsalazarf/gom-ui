<template>
  <q-page class="flex">
    <q-pull-to-refresh @refresh="refresh" class="full-width">
      <q-bar class="q-pa-lg bg-white">
        <h-filter-input @filter="filter($event)" :disable="selectionMode"/>
      </q-bar>
      <q-list>
        <h-order-item
          ref="item"
          v-for="(order, index) in orders"
          :key="order.id"
          v-model="order.data"
          :separator="index < ordersMaxIndex"
          :selected="selected"
          @selected="selected = $event"
          :selection="selectionMode"
          @selection="activateSel()"
        />
      </q-list>
    </q-pull-to-refresh>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round color="accent" icon="add_shopping_cart"/>
    </q-page-sticky>
  </q-page>
</template>

<style>
</style>

<script>
// only for testing purpouses
import ApiData from 'assets/orders'

export default {
  props: {
    tk: {
      type: String,
      default: ''
    }
  },
  components: {
    'h-order-item': () => import('components/order/Item.vue'),
    'h-filter-input': () => import('components/order/FilterInput.vue')
  },
  name: 'PageOrders',
  data () {
    return {
      allOrders: ApiData,
      orders: ApiData,
      selected: [],
      selectionMode: false
    }
  },
  mounted () {},
  methods: {
    refresh (done) {
      setTimeout(() => {
        // Not for production. REMOVE !!!
        this.orders.unshift({
          data: {
            id: '4',
            customer: 'Juanita',
            item: 'Soda',
            createdAt: '2019-05-17T23:51:39.887Z',
            stage: 'OPEN'
          }
        })
        done()
      }, 1000)
    },
    filter (params) {
      this.orders = this.allOrders.filter(order => {
        if (
          params.has('status') &&
          !params.get('status').includes(order.data.stage)
        ) {
          return false
        }
        if (
          params.has('term') &&
          !order.data.item.toLowerCase().includes(params.get('term'))
        ) {
          return false
        }
        return true
      })
    },
    activateSel () {
      this.selectionMode = true
      this.$emit('toolbar', true)
    },
    selectAll () {
      this.selected = this.orders.map(order => {
        return order.data.id
      })
    },
    unselectAll () {
      this.selected = []
    }
  },
  computed: {
    ordersMaxIndex () {
      return this.orders.length - 1
    }
  },
  watch: {
    selected (value) {
      if (value.length === 0) {
        this.selectionMode = false
        this.$emit('toolbar', false)
      } else {
        this.$emit('selected', {
          max: this.ordersMaxIndex + 1,
          count: value.length
        })
      }
    }
  }
}
</script>
