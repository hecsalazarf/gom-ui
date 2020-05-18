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
      v-show="isFooterShown"
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
          :name="$options.routes.orders"
          :to="{ name: $options.routes.orders }"
          :label="$tc('order.label', 2)"
          icon="shopping_cart"
          class="orders-tab"
        />
        <!-- Display if user has the CASL permissions -->
        <can
          do="read"
          on="bps"
        >
          <q-route-tab
            :name="$options.routes.customers"
            :to="{ name: $options.routes.customers }"
            :label="$tc('customer.label', 2)"
            icon="contacts"
            class="customers-tab"
          />
        </can>
        <can
          do="read"
          on="promotions"
        >
          <q-route-tab
            :name="$options.routes.promos"
            :to="{ name: $options.routes.promos }"
            :label="$tc('promo.label', 2)"
            icon="stars"
            class="promos-tab"
          />
        </can>
      </q-tabs>
    </q-footer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { scroll } from 'quasar'
import { createNamespacedHelpers } from 'vuex'
import { RouteNames } from 'src/constants/app'
const { setScrollPosition, getScrollTarget } = scroll
const { mapGetters, mapActions } = createNamespacedHelpers('GomState')

export default {
  name: 'GomLayout',
  components: {
    'h-main-toolbar': () => import('components/MainToolbar.vue'),
    // 'h-selection-toolbar': () =>
    //   import('components/order/SelectionToolbar.vue'), // selection DISABLED (#28)
    'h-order-toolbar': () => import('components/order/DetailsToolbar.vue'),
    'h-customer-toolbar': () => import('components/customer/DetailsToolbar.vue'),
    'h-promo-toolbar': () => import('components/promo/DetailsToolbar.vue')
  },
  data () {
    return {
      tab: RouteNames.ORDER_LIST
    }
  },
  computed: {
    ...mapGetters(['activeToolbar']),
    isFooterShown () {
      return this.$options.tabs.includes(this.$route.name)
    }
  },
  created () {
    this.changeActiveToolbar('h-main-toolbar')
  },
  methods: {
    getScrollTarget,
    setScrollPosition,
    ...mapActions(['changeActiveToolbar'])
  },
  tabs: [
    RouteNames.ORDER_LIST,
    RouteNames.CUSTOMER_LIST,
    RouteNames.PROMO_LIST
  ],
  routes: {
    orders: RouteNames.ORDER_LIST,
    customers: RouteNames.CUSTOMER_LIST,
    promos: RouteNames.PROMO_LIST
  }
}
</script>

<style lang="stylus" scoped>
/deep/ .orders-tab .q-tab__icon, /deep/ .orders-tab .q-tab__label
  color: $green-13
/deep/ .customers-tab .q-tab__icon, /deep/ .customers-tab .q-tab__label
  color: $cyan-13
/deep/ .promos-tab .q-tab__icon, /deep/ .promos-tab .q-tab__label
  color: $pink-12
</style>
