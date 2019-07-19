<template>
  <q-layout view="lhh lpr lFf">
    <q-header
      reveal
      :reveal-offset="100"
      elevated
      class="bg-white"
    >
      <transition
        mode="out-in"
        leave-active-class="animated fadeOut"
      >
        <component :is="activeToolbar" />
      </transition>
    </q-header>
    <q-footer
      v-show="$route.name === 'orders' || $route.name === 'customers'"
      elevated
    >
      <!-- click.native scrolls to top -->
      <q-tabs
        v-model="tab"
        dense
        no-caps
        @click.native="setScrollPosition(getScrollTarget($el), 0, 200)"
      >
        <q-route-tab
          name="orders"
          :to="{ name: 'orders' }"
          :label="$tc('order.label', 2)"
          icon="shopping_cart"
          class="orders-tab"
        />
        <q-route-tab
          name="customers"
          :to="{ name: 'customers' }"
          :label="$tc('customer.label', 2)"
          icon="contacts"
          class="customers-tab"
        />
      </q-tabs>
    </q-footer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { QSpinnerBars, scroll } from 'quasar'
const { setScrollPosition, getScrollTarget } = scroll
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'GomLayout',
  components: {
    'h-main-toolbar': () => import('components/MainToolbar.vue'),
    'h-selection-toolbar': () =>
      import('components/order/SelectionToolbar.vue'),
    'h-order-toolbar': () => import('components/order/DetailsToolbar.vue'),
    'h-customer-toolbar': () => import('components/customer/DetailsToolbar.vue')
  },
  data () {
    return {
      tab: 'orders'
    }
  },
  computed: {
    ...mapGetters(['activeToolbar'])
  },
  created () {
    this.changeActiveToolbar('h-main-toolbar')
    this.$q.loading.setDefaults({
      spinner: QSpinnerBars // default spinner
    })
  },
  methods: {
    getScrollTarget,
    setScrollPosition,
    ...mapActions(['changeActiveToolbar'])
  }
}
</script>

<style lang="stylus" scoped>
/deep/ .orders-tab .q-tab__icon, /deep/ .orders-tab .q-tab__label
  color: $green-12
/deep/ .customers-tab .q-tab__icon, /deep/ .customers-tab .q-tab__label
  color: $customers
</style>
